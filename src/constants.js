const path = require('path');
const fs   = require('fs');

function timeStampInSeconds() {
    return Math.floor(Date.now() / 1000);
}

function obtenerYTime(timestampEnSegundos) {
    const timestampEnMilisegundos = timestampEnSegundos * 1000;
    const fecha                   = new Date(timestampEnMilisegundos);
    const hora                    = fecha.getHours();
    const minutos                 = fecha.getMinutes();
    return `ytime=${hora}:${minutos};`;
}

let location     = 'es';
let pathLocation = path.join(__dirname, '../.cache/location');
if (fs.existsSync(pathLocation)) {
    location = fs.readFileSync(pathLocation, 'utf8');
}

module.exports = Object.freeze({
    BASE_URL                 : `https://yopmail.com/`,
    GENERATOR_URL            : `https://yopmail.com/${location}/email-generator`,
    READ_MAIL_URL            : (mail, id) => `https://yopmail.com/${location}/mail?b=${mail}&id=m${id}`,
    WRITE_MAIL_URL           : (mail) => `https://yopmail.com/${location}/write?b=${mail}&id=`,
    DELETE_INBOX_URL         : (mail, id, yp, yj, ver) => `https://yopmail.com/${location}/inbox?login=${mail}&p=1&d=all&ctrl=${id}&yp=${yp}&yj=${yj}&v=${ver}&r_c=&id=&ad=0`,
    DELETE_MESSAGE_URL       : (mail, id, yp, yj, ver) => `https://yopmail.com/${location}/inbox?login=${mail}&p=1&d=${id}&ctrl=&yp=${yp}&yj=${yj}&v=${ver}&r_c=&id=&ad=0`,
    SEND_MESSAGE_URL         : `https://yopmail.com/${location}/writepost`,
    INPUT_YP                 : 'input#yp',
    REGEX_LOCATION           : /lang=\"(.*?)\"/,
    REGEX_YJ                 : /&yj=([^&]+)&v=/,
    REGEX_TOTAL_MAILS        : /w\.finrmail\((.*?)\)/,
    INBOX_URL                : (mail, yp, yj, ver, page = 1) => `https://yopmail.com/${location}/inbox?login=${mail}&p=${page}&d=&ctrl=&yp=${yp}&yj=${yj}&v=${ver}&r_c=&id=&ad=0`,
    INBOX_HTTP_CONFIG        : (cookie, mail) => ({
        headers: {
            'accept'                   : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'cookie'                   : `${cookie}; compte=${mail}; ywm=${mail}; __gads=ID=9a0b3cce9ff31bac:T=${timeStampInSeconds()}:RT=${timeStampInSeconds()}:S=ALNI_MZ3k3gFQXDYCyC-n7CnlRltSEFoVQ; __gpi=UID=00000a0a4f90dd17:T=${timeStampInSeconds()}:RT=${timeStampInSeconds()}:S=ALNI_MbohrBpXt1O26O3LDmi-KRsCVPhcw; __eoi="ID=5cd00b43a530b6a4:T=${(timeStampInSeconds())}:RT=${(timeStampInSeconds())}:S=AA-Afjb4QKVvFIwSmOYMSnui2gGd"; FCNEC=%5B%5B%22AKsRol_M2LZFqBb7LSYXadLKqvJ5hTBhxAex9zsoE4N4YD_W5EKTjaIdnSjUL1onQWaOaUq-2HI8vZCE9bqnfMfFE9XOzzqfKK3c3UA5WvJQYW6YtylSfhXH3FZ4WTR9pzl8dTHsGaiJSwztPBvgXHwUPGcOlsELSQ%3D%3D%22%5D%5D;compte=${mail}; ywm=${mail}; ${obtenerYTime(timeStampInSeconds())}`,
            'accept-encoding'          : 'gzip, deflate, br',
            'accept-language'          : 'es-ES,es;q=0.9',
            'connection'               : 'keep-alive',
            'host'                     : 'yopmail.com',
            'referer'                  : `https://yopmail.com/${location}/wm`,
            'sec-ch-ua'                : '"Not_A Brand";v="99", "Chromium";v="121", "Google Chrome";v="121"',
            'sec-ch-ua-mobile'         : '?0',
            'sec-ch-ua-platform'       : 'Windows',
            'sec-fetch-dest'           : 'iframe',
            'sec-fetch-mode'           : 'navigate',
            'sec-fetch-site'           : 'same-origin',
            'sec-fetch-user'           : '?1',
            'upgrade-insecure-requests': '1',
            'user-agent'               : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
        }
    }),
    WRITE_MESSAGE_HTTP_CONFIG: (cookie, mail) => ({
        headers: {
            'accept'            : '*/*',
            'accept-encoding'   : 'gzip, deflate, br',
            'accept-language'   : 'es-ES,es;q=0.9',
            'connection'        : 'keep-alive',
            'content-type'      : 'application/x-www-form-urlencoded',
            'cookie'            : `${cookie}; compte=${mail}; ywm=${mail}; __gads=ID=9a0b3cce9ff31bac:T=${timeStampInSeconds()}:RT=${timeStampInSeconds()}:S=ALNI_MZ3k3gFQXDYCyC-n7CnlRltSEFoVQ; __gpi=UID=00000a0a4f90dd17:T=${timeStampInSeconds()}:RT=${timeStampInSeconds()}:S=ALNI_MbohrBpXt1O26O3LDmi-KRsCVPhcw; __eoi="ID=5cd00b43a530b6a4:T=${(timeStampInSeconds())}:RT=${(timeStampInSeconds())}:S=AA-Afjb4QKVvFIwSmOYMSnui2gGd"; FCNEC=%5B%5B%22AKsRol_M2LZFqBb7LSYXadLKqvJ5hTBhxAex9zsoE4N4YD_W5EKTjaIdnSjUL1onQWaOaUq-2HI8vZCE9bqnfMfFE9XOzzqfKK3c3UA5WvJQYW6YtylSfhXH3FZ4WTR9pzl8dTHsGaiJSwztPBvgXHwUPGcOlsELSQ%3D%3D%22%5D%5D;compte=${mail}; ywm=${mail}; ${obtenerYTime(timeStampInSeconds())}`,
            'host'              : 'yopmail.com',
            'origin'            : 'https://yopmail.com',
            'referer'           : `https://yopmail.com/${location}/wm`,
            'sec-ch-ua'         : '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
            'sec-ch-ua-mobile'  : '?0',
            'sec-ch-ua-platform': 'Windows',
            'sec-fetch-dest'    : 'empty',
            'sec-fetch-mode'    : 'cors',
            'sec-fetch-site'    : 'same-origin',
            'user-agent'        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
        }
    }),
    RSS_HTTP_CONFIG          : (cookie, mail) => ({
        'accept'                   : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'cookie'                   : `${cookie}; _ga=GA1.2.503151223.1683393694; _gid=GA1.2.1659462416.1683393694; __gads=ID=1aef015d5c605919-2289ab29f27f0062:T=1683393694:RT=1683393694:S=ALNI_MYhXB3g-Ape8Bl2op45lGwvANkLFg; __gpi=UID=000009f291461986:T=1683393694:RT=${(timeStampInSeconds())}:S=ALNI_MZM6T_Gt5i9mVk7fSPYTS_lNnT05A; compte=${mail}; ywm=${mail}; ${obtenerYTime(timeStampInSeconds())} _gat=1;`,
        'accept-encoding'          : 'gzip, deflate, br',
        'accept-language'          : 'es-ES,es;q=0.9',
        'connection'               : 'keep-alive',
        'host'                     : 'yopmail.com',
        'referer'                  : `https://yopmail.com/${location}/wm`,
        'sec-ch-ua'                : '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        'sec-ch-ua-mobile'         : '?0',
        'sec-ch-ua-platform'       : '"Windows"',
        'sec-fetch-dest'           : 'document',
        'sec-fetch-mode'           : 'navigate',
        'sec-fetch-site'           : 'none',
        'sec-fetch-user'           : '?1',
        'upgrade-insecure-requests': '1',
        'user-agent'               : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    }),
    WEBMAIL_JS_URL           : (ver) => `https://yopmail.com/ver/${ver}/webmail.js`,
    ERROR_MAIL_INVALID       : 'parameters \'mail\' is required',
    ERROR_SEARCH_INVALID     : 'parameters \'_search\' keys is invalid, try again with (subject ot content)',
    ERROR_LOAD_PAGE          : 'getMail(): Error getting YOPMail page',
    ERROR_GET_INBOX          : 'getInbox(): Error getting Inbox page',
    ERROR_DELETE_INBOX       : 'deleteInbox(): Error delete Inbox page',
    ERROR_READ_MESSAGE       : 'readMessage(): Error read message',
    ERROR_WRITE_MESSAGE      : 'writeMessage(): Error write message',
    ERROR_DELETE_MESSAGE     : 'deleteMessage(): Error delete message',
    ERROR_PARAMETERS_INVALID : 'No se encontró la función',
    ERROR_GET_COOKIES        : 'Error getting cookies',
    ERROR_GET_VERSION        : 'Error getting version. Error loading page',
    ERROR_MISSING_PARAMETERS : 'Missing parameters',
    ERROR_GET_TOTAL_MAILS    : 'Error getting total number of mails',
    ERROR_GET_YJ             : 'Error getting YJ',
    COOKIE                   : mail => {
        return {
            name    : 'ygen',
            value   : mail,
            domain  : '.yopmail.com',
            url     : 'https://yopmail.com/',
            path    : '/',
            httpOnly: false,
            secure  : false
        }
    },
    TEST_MAIL                : 'test@yopmail.com',
    INBOX_FILE               : path.resolve('tests', 'archives', 'inbox.json'),
    MAIL_CONTENT             : path.resolve('tests', 'archives', 'mailContent.json'),
    HTML_ID                  : path.resolve('tests', 'archives', 'mailHTML_id.html'),
    HTML_SUBJECT             : path.resolve('tests', 'archives', 'mailHTML_subject.html'),
    HTML_CONTENT             : path.resolve('tests', 'archives', 'mailHTML_content.html'),
    S_INPUT_MAIL_GENERATE    : '#geny',
    SELECTOR_SUBMIT          : 'div.fl > div.ellipsis.nw.b.f18',
    SELECTOR_FROM            : 'div.fl > div.md.text.zoom.nw.f24 > span.ellipsis.b',
    SELECTOR_DATE            : 'div.fl > div.md.text.zoom.nw.f24 > span.ellipsis:last-child',
    SELECTOR_FROM_ALT        : 'div.fl > div.md.text.zoom.nw.f18 > span.ellipsis.b',
    SELECTOR_DATE_ALT        : 'div.fl > div.md.text.zoom.nw.f18 > span.ellipsis:last-child',
    SELECTOR_MAIL            : '#mail',
    possibleKeys             : ['id', 'from', 'subject', 'timestamp'],
});

