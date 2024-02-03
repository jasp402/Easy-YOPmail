const constants = require("./constants");
const cheerio   = require("cheerio");
const fs        = require("fs");
const https     = require('https');
const zlib      = require('zlib');


function request(method, url, options = {}, data=null) {
    const parsedUrl = new URL(url);
    const settings  = {
        hostname: parsedUrl.hostname,   // Extrae solo el nombre de dominio
        port    : 443,                  // Puerto por defecto para HTTPS
        path    : `${parsedUrl.pathname}${parsedUrl.search}`,   // Usa la ruta extraída de la URL
        method  : method.toUpperCase(), // Método HTTP en mayúsculas
        ...options
    };
    return new Promise((resolve, reject) => {
        const req = https.request(settings, (res) => {
            let chunks     = [];
            const encoding = res.headers['content-encoding'];
            let stream     = res;

            if (encoding === 'gzip') {
                stream = res.pipe(zlib.createGunzip());
            } else if (encoding === 'deflate') {
                stream = res.pipe(zlib.createInflate());
            }

            stream.on('data', (chunk) => {
                chunks.push(chunk);
            });

            stream.on('end', () => {
                const body = Buffer.concat(chunks).toString();
                resolve({statusCode: res.statusCode, headers: res.headers, body});
            });
        });

        req.on('error', (e) => {
            console.log('Error:', e.message);
            reject(e);
        });

        if (settings.body) {
            req.write(settings.body);
        }
        if(method==='POST' && data){
            req.write(data);
        }
        req.end();
    });
}

async function getVersion() {
    const response = await request('GET', constants.BASE_URL);
    if (response.statusCode === 200) {
        try {
            return response.body.match(/\/ver\/(\d+\.\d+)\//)[1];
        } catch (error) {
            console.error(constants.ERROR_GET_VERSION, error.message);
        }
    } else {
        console.error(constants.ERROR_GET_VERSION);
    }
}

async function getCookiesAndYP() {
    const response = await request('GET', constants.BASE_URL)
    if (response.statusCode === 200) {
        try {
            const $        = cheerio.load(response.body);
            const yp       = $(constants.INPUT_YP).val();
            const cookie   = response.headers['set-cookie'].map(x => x.split(';')[0]).join('; ');
            const location = response.body.match(constants.REGEX_LOCATION)[1];
            const ver      = response.body.match(/\/ver\/(\d+\.\d+)\//)[1]
            setLocation(location);
            return {cookie, yp, ver};
        } catch (error) {
            console.error(error.message);
        }
    } else {
        console.error(constants.ERROR_GET_COOKIES);
        return {cookie: null, yp: null};
    }
}

function setLocation(location) {
    if (!location || typeof location !== 'string') return false;
    fs.mkdirSync('../.cache', {recursive: true});
    fs.writeFileSync('../.cache/location', location);
}

function simplifyEmail(email) {
    if (email.indexOf('@') > -1) {
        return (email.split('@')[0] || '').toLowerCase()
    } else {
        return email.toLowerCase();
    }
}

async function validateSearch(search) {
    const result = constants.possibleKeys.some(
        (key) => Object.keys(search).includes(key) || null
    );
    if (!result) {
        console.error(constants.ERROR_PARAMETERS_INVALID);
        return {};
    }
    return Object.keys(search).reduce((acc, key) => {
        if (constants.possibleKeys.includes(key)) {
            acc[key] = search[key];
        }
        return acc;
    }, {});
}

async function getYJ(cookie, ver) {
    const response = await request('GET', constants.WEBMAIL_JS_URL(ver), {headers: {Cookie: cookie}});
    if (response.statusCode === 200) {
        const match = response.body.match(constants.REGEX_YJ);
        return match ? match[1] : null;
    } else {
        console.error(constants.ERROR_GET_YJ);
    }
}

async function getTotalMails(html) {
    const match    = html.match(constants.REGEX_TOTAL_MAILS);
    let totalMails = 0;
    if (match) {
        totalMails = match[1].split(',')[0];
    } else {
        console.log(constants.ERROR_GET_TOTAL_MAILS);
    }
    return Number(totalMails);
}

function shouldIncludeEmail(email, filteredSearch) {
    return Object.entries(filteredSearch).every(([key, value]) => {
        switch (key) {
            case 'id':
                return email.id === value;
            case 'from':
                return email.from === value;
            case 'subject':
                return email.subject === value;
            case 'timestamp':
                return email.timestamp === value;
            default:
                return false;
        }
    });
}

function parseEmail(element) {
    const $         = cheerio.load(element);
    const id        = $(element).attr('id');
    const timestamp = $(element).find('.lmh').text();
    const from      = $(element).find('.lmf').text();
    const subject   = $(element).find('.lms').text();

    return {id, from, subject, timestamp};
}

function getDetailInboxFromPage(html, filteredSearch) {
    const $        = cheerio.load(html);
    const elements = $('.m');
    return elements
        .map((index, element) => parseEmail(element))
        .toArray()
        .filter((email) => shouldIncludeEmail(email, filteredSearch));
}

async function fetchInboxPage(mail, yp, yj, ver, pageNumber, cookie) {
    let url     = constants.INBOX_URL(mail, yp, yj, ver, pageNumber);
    let headers = constants.INBOX_HTTP_CONFIG(cookie, mail);
    return await request('GET', url, headers);
}

async function detailInbox(mail, yp, yj, ver, cookie, search = {}, settings = {}) {
    const pageNumber = 1;
    const response   = await fetchInboxPage(mail, yp, yj, ver, pageNumber, cookie);

    if (response.statusCode !== 200) {
        console.error(constants.ERROR_LOAD_PAGE);
        return null;
    }
    const inboxHtml  = response.body;
    const totalMails = await getTotalMails(inboxHtml);
    let filteredSearch = {};
    if (search && Object.keys(search).length > 0) {
        filteredSearch = await validateSearch(search);
    }

    let currentPage    = 1;
    let hasNextPage    = true;
    let mailFromPage   = {};
    const mailsPerPage = 15;
    const emails       = [];

    while (hasNextPage && (settings.GET_ALL_MAILS === true || currentPage === 1)) {
        const currentPageHtml = currentPage === 1 ? inboxHtml : (await fetchInboxPage(mail, yp, yj, currentPage, cookie)).data;

        const currentPageEmails = getDetailInboxFromPage(currentPageHtml, filteredSearch);

        mailFromPage[`page_${currentPage}`] = currentPageEmails.length;
        emails.push(...currentPageEmails);

        if (currentPage * mailsPerPage >= totalMails) {
            hasNextPage = false;
        } else {
            currentPage += 1;
        }
    }

    return {
        settings,
        search       : filteredSearch,
        totalInbox   : totalMails,
        totalPages   : Math.ceil(totalMails / mailsPerPage),
        mailFromPage,
        totalGetMails: emails.length,
        inbox        : emails,
    };
}

module.exports = {
    getCookiesAndYP,
    getYJ,
    detailInbox,
    simplifyEmail,
    request
};
