const constants = require("./constants");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

function setLocation(location) {
    if (!location || typeof location !== 'string') return false;
    fs.mkdirSync('../.cache', { recursive: true });
    fs.writeFileSync('../.cache/location', location);
}

async function validateSearch(search) {
    const result = constants.possibleKeys.some(key => Object.keys(search).includes(key) || null);
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

async function getCookiesAndYP() {
    const response = await axios.get(constants.BASE_URL);
    if (response.status === 200) {
        try {
            const $ = cheerio.load(response.data);
            const yp = $(constants.INPUT_YP).val();
            const cookie = response.headers['set-cookie'].map(x => x.split(';')[0]).join('; ');
            const location = response.data.match(constants.REGEX_LOCATION)[1];
            setLocation(location);
            return { cookie, yp };
        } catch (error) {
            console.error(error.message);
        }
    } else {
        console.error(constants.ERROR_GET_COOKIES);
        return { cookie: null, yp: null };
    }
}

async function getYJ(cookie) {
    const response = await axios.get(constants.WEBMAIL_JS_URL, {
        headers: {
            Cookie: cookie
        }
    });
    const match = response.data.match(constants.REGEX_YJ);
    return match ? match[1] : null;
}

async function getTotalMails(html) {
    const match = html.match(constants.REGEX_TOTAL_MAILS);
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
    const $ = cheerio.load(element);
    const id = $(element).attr('id');
    const timestamp = $(element).find('.lmh').text();
    const from = $(element).find('.lmf').text();
    const subject = $(element).find('.lms').text();

    return { id, from, subject, timestamp };
}

function getDetailInboxFromPage(html, filteredSearch) {
    const $ = cheerio.load(html);
    const elements = $('.m');
    return elements.map((index, element) => parseEmail(element)).toArray().filter(email => shouldIncludeEmail(email, filteredSearch));
}

async function fetchInboxPage(mail, yp, yj, pageNumber, cookie) {
    return await axios.get(constants.INBOX_URL(mail, yp, yj, pageNumber), constants.INBOX_HTTP_CONFIG(cookie, mail));
}

async function detailInbox(mail, yp, yj, cookie, search = {}, settings = {}) {
    const pageNumber = 1;
    const response = await fetchInboxPage(mail, yp, yj, pageNumber, cookie);

    if (response.status !== 200) {
        console.error(constants.ERROR_LOAD_PAGE);
        return null;
    }

    const inboxHtml = response.data;
    const totalMails = await getTotalMails(inboxHtml);

    let filteredSearch = {};
    if (search && Object.keys(search).length > 0) {
        filteredSearch = await validateSearch(search);
    }

    let currentPage = 1;
    let hasNextPage = true;
    let mailFromPage = {};
    const mailsPerPage = 15;
    const emails = [];

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
        search: filteredSearch,
        totalInbox: totalMails,
        totalPages: Math.ceil(totalMails / mailsPerPage),
        mailFromPage,
        totalGetMails: emails.length,
        inbox: emails
    };
}

module.exports = {
    getCookiesAndYP,
    getYJ,
    detailInbox
};