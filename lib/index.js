const fetch = require('node-fetch');
const cheerio = require('cheerio');
const jsPackTools = require('js-packtools')();
const fs = require('fs');

const YP   = 'KZGH0AwL1ZmRkZmR3ZQp1AQZ';
const YJ   = 'TZGZmZmp3ZQx1ZwR1ZGpkZmR';
const SPAM = 'true';
const V    = '3.1';

const contains = (a, b) => {
    return a.toLowerCase().indexOf(b.toLowerCase()) >= 0;
};
const searchToObject = url => {
    var paramsString = url.split('?')[1];
    var searchParams = new URLSearchParams(paramsString);
    let array = [];
    for (let p of searchParams) {
        array.push(p);
    }
    const entries = new Map(array);
    return Object.fromEntries(entries);
};

/* Create a random mail */
const createMail = async () => {
    try {
        const response = await fetch(`http://www.yopmail.com/es/email-generator.php`);

        //save current cookies
        jsPackTools.validateDir('./temp');
        const cookies = response.headers.get('set-cookie');
        fs.writeFileSync('./temp/cookies.tmp', cookies, 'utf-8');

        const body     = await response.text();
        const $        = cheerio.load(body);
        return await $('#login').val();
    } catch(err) {
        alert(err); // Failed to fetch
    }
};

/* Get inbox mail */
const inbox = async (id, phrase, p = 1) => {
    let mails = [];
    let found = false;

    const response = await fetch(`http://m.yopmail.com/en/inbox.php?login=${id}&p=${p}&d=&ctrl=&scrl=&spam=${SPAM}&yf=005&yp=${YP}&yj=${YJ}&v=${V}&r_c=&id=`);

    //save or update current cookies
    jsPackTools.validateDir('./temp');
    const cookies = response.headers.get('set-cookie');
    fs.writeFileSync('./temp/cookies.tmp', cookies, 'utf-8');

    const body     = await response.text();
    const $        = cheerio.load(body);

    $('.lm_m').each((index, element) => {
        const el   = $(element);
        const mail = ({
            index,
            when   : el.find('.lmh').text(),
            from   : el.find('.lmf').text(),
            subject: el.find('.lms_m').text(),
            id     : el.attr('href').split('id=')[1],
            href   : 'http://m.yopmail.com/en/' + el.attr('href'),
            html   : el.html()
        });

        if (phrase && !found) {
            found = contains(mail.from, phrase) ||
                contains(mail.subject, phrase);
        }
        mails.push(mail);
    });
    return {found, mails};
};

/* Read mail by url */
const readMail = async (url) => {
    let params = searchToObject(url);
    let rawCookies = fs.readFileSync('./temp/cookies.tmp', "utf-8");
    let setCookies = rawCookies.split(',').map(x => x.split(';')).flat();
    let cookies = setCookies.filter(x => x.indexOf('ys') > -1 || x.indexOf('yc') > -1).join(';');

    let opts = {headers: {
        'Content-Type': 'application/json',
        'Cookie'      : `compte=${params.b}; ${cookies}`
    }};
    const response = await fetch(url, opts);
    const body     = await response.text();
    const $        = cheerio.load(body);
    let t          = $('#mailmillieu *').contents().map(function () {
        return (this.type === 'text') ? $(this).text().trim() : '';
    }).get().filter(Boolean);
    return t.join('\n');
};

module.exports = {
    inbox     : inbox,
    readMail  : readMail,
    createMail: createMail
};
