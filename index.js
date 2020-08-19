const request = require('request-promise');
const cheerio = require('cheerio');

const YP = 'KZGH0AwL1ZmRkZmR3ZQp1AQZ';
const YJ = 'TZGZmZmp3ZQx1ZwR1ZGpkZmR';
const YS = 'YZwH3BGL1BGD1AQRjZwR0AmH';
const YC = 'HAQZjZGN4AGVmAwN1AGH4Zwt';
const SPAM = 'true';
const V = '3.1';

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
const createMail = ()=>{
    return request.get(`http://www.yopmail.com/es/email-generator.php`)
        .then(result => {
            const $ = cheerio.load(result);
            return $('#login').val();

        });
}

/* Get inbox mail */
const inbox = (id, phrase, p = 1) => {
    return request.get(`http://m.yopmail.com/en/inbox.php?login=${id}&p=${p}&d=&ctrl=&scrl=&spam=${SPAM}&yf=005&yp=${YP}&yj=${YJ}&v=${V}&r_c=&id=`)
        .then((result) => {
            const $     = cheerio.load(result);
            const mails = [];
            let found   = false;

            $('.lm_m').each((index, element) => {
                const el   = $(element);
                const mail = ({
                    index,
                    when   : el.find('.lmh').text(),
                    from   : el.find('.lmf').text(),
                    subject: el.find('.lms_m').text(),
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
        });
};

/* Read mail by url */
const readMail = (url) => {
    let params = searchToObject(url);
    let headers = {
        'Content-Type': 'application/json',
        'Cookie'      : `compte=${params.b}; ys=${YS}; yc=${YC}`
    };
    return request.get(url, {'headers': headers})
        .then(result => {
            const $     = cheerio.load(result);
            var t = $('#mailmillieu *').contents().map(function() {
                return (this.type === 'text') ? $(this).text().trim()  : '';
            }).get().filter(Boolean);
            return t.join('\n');
        });
};

module.exports = {
    inbox     : inbox,
    readMail  : readMail,
    createMail: createMail
};