"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.possibleKeys = exports.WRITE_MESSAGE_HTTP_CONFIG = exports.WRITE_MAIL_URL = exports.WEBMAIL_JS_URL = exports.TEST_MAIL = exports.S_INPUT_MAIL_GENERATE = exports.SEND_MESSAGE_URL = exports.SELECTOR_SUBMIT = exports.SELECTOR_MAIL = exports.SELECTOR_FROM_ALT = exports.SELECTOR_FROM = exports.SELECTOR_DATE_ALT = exports.SELECTOR_DATE = exports.RSS_HTTP_CONFIG = exports.REGEX_YJ = exports.REGEX_TOTAL_MAILS = exports.READ_MAIL_URL = exports.MAIL_CONTENT = exports.INPUT_YP = exports.INBOX_URL = exports.INBOX_HTTP_CONFIG = exports.INBOX_FILE = exports.HTML_SUBJECT = exports.HTML_ID = exports.HTML_CONTENT = exports.GENERATOR_URL = exports.ERROR_SEARCH_INVALID = exports.ERROR_PARAMETERS_INVALID = exports.ERROR_MISSING_PARAMETERS = exports.ERROR_MAIL_INVALID = exports.ERROR_LOAD_PAGE = exports.ERROR_GET_TOTAL_MAILS = exports.ERROR_GET_COOKIES = exports.COOKIE = exports.BASE_URL = void 0;
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function timeStampInSeconds() {
  return Math.floor(Date.now() / 1000);
}
function obtenerYTime(timestampEnSegundos) {
  const timestampEnMilisegundos = timestampEnSegundos * 1000;
  const fecha = new Date(timestampEnMilisegundos);
  const hora = fecha.getHours();
  const minutos = fecha.getMinutes();
  return `ytime=${hora}:${minutos};`;
}
const BASE_URL = 'https://yopmail.com/es/';
exports.BASE_URL = BASE_URL;
const GENERATOR_URL = 'https://yopmail.com/es/email-generator';
exports.GENERATOR_URL = GENERATOR_URL;
const READ_MAIL_URL = (mail, id) => `https://yopmail.com/es/mail?b=${mail}&id=m${id}`;
exports.READ_MAIL_URL = READ_MAIL_URL;
const WRITE_MAIL_URL = mail => `https://yopmail.com/es/write?b=${mail}&id=`;
exports.WRITE_MAIL_URL = WRITE_MAIL_URL;
const SEND_MESSAGE_URL = 'https://yopmail.com/es/writepost';
exports.SEND_MESSAGE_URL = SEND_MESSAGE_URL;
const INPUT_YP = 'input#yp';
exports.INPUT_YP = INPUT_YP;
const REGEX_YJ = /&yj=([^&]+)&v=/;
exports.REGEX_YJ = REGEX_YJ;
const REGEX_TOTAL_MAILS = /w\.finrmail\((.*?)\)/;
exports.REGEX_TOTAL_MAILS = REGEX_TOTAL_MAILS;
const INBOX_URL = (mail, yp, yj, page = 1) => `https://yopmail.com/es/inbox?login=${mail}&p=${page}&d=&ctrl=&yp=${yp}&yj=${yj}&v=8.4&r_c=&id=`;
exports.INBOX_URL = INBOX_URL;
const INBOX_HTTP_CONFIG = (cookie, mail) => ({
  headers: {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'cookie': `${cookie}; compte=${mail}; ywm=${mail}; _ga=GA1.2.490358059.1683208319; _gid=GA1.2.1148489241.1683208319; __gads=ID=8e03875306c449c6-22790dab88df0074:T=1683208320:RT=1683208320:S=ALNI_MasidzVb7xQcb0qS7Hrb-gTpCYFkQ; __gpi=UID=0000057b04df1c7f:T=1683208320:RT=${timeStampInSeconds()}:S=ALNI_MYMeBMqh92Qfh-oIx02VDmWeqsdAA; compte=${mail}; ywm=${mail}; ${obtenerYTime(timeStampInSeconds())}`,
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'es-ES,es;q=0.9',
    'connection': 'keep-alive',
    'host': 'yopmail.com',
    'referer': 'https://yopmail.com/es/wm',
    'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': 'Windows',
    'sec-fetch-dest': 'iframe',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
  }
});
exports.INBOX_HTTP_CONFIG = INBOX_HTTP_CONFIG;
const WRITE_MESSAGE_HTTP_CONFIG = (cookie, mail) => ({
  headers: {
    'accept': '*/*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'es-ES,es;q=0.9',
    'connection': 'keep-alive',
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': `${cookie}; compte=${mail}; ywm=${mail}; _ga=GA1.2.490358059.1683208319; _gid=GA1.2.1148489241.1683208319; __gads=ID=8e03875306c449c6-22790dab88df0074:T=1683208320:RT=1683208320:S=ALNI_MasidzVb7xQcb0qS7Hrb-gTpCYFkQ; __gpi=UID=0000057b04df1c7f:T=1683208320:RT=${timeStampInSeconds()}:S=ALNI_MYMeBMqh92Qfh-oIx02VDmWeqsdAA; compte=${mail}; ywm=${mail}; ${obtenerYTime(timeStampInSeconds())}`,
    'host': 'yopmail.com',
    'origin': 'https://yopmail.com',
    'referer': 'https://yopmail.com/es/wm',
    'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': 'Windows',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
  }
});
exports.WRITE_MESSAGE_HTTP_CONFIG = WRITE_MESSAGE_HTTP_CONFIG;
const RSS_HTTP_CONFIG = (cookie, mail) => ({
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'cookie': `${cookie}; _ga=GA1.2.503151223.1683393694; _gid=GA1.2.1659462416.1683393694; __gads=ID=1aef015d5c605919-2289ab29f27f0062:T=1683393694:RT=1683393694:S=ALNI_MYhXB3g-Ape8Bl2op45lGwvANkLFg; __gpi=UID=000009f291461986:T=1683393694:RT=${timeStampInSeconds()}:S=ALNI_MZM6T_Gt5i9mVk7fSPYTS_lNnT05A; compte=${mail}; ywm=${mail}; ${obtenerYTime(timeStampInSeconds())} _gat=1;`,
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'es-ES,es;q=0.9',
  'connection': 'keep-alive',
  'host': 'yopmail.com',
  'referer': 'https://yopmail.com/es/wm',
  'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
});
exports.RSS_HTTP_CONFIG = RSS_HTTP_CONFIG;
const WEBMAIL_JS_URL = 'https://yopmail.com/ver/8.4/webmail.js';
exports.WEBMAIL_JS_URL = WEBMAIL_JS_URL;
const ERROR_MAIL_INVALID = 'parameters \'mail\' is required';
exports.ERROR_MAIL_INVALID = ERROR_MAIL_INVALID;
const ERROR_SEARCH_INVALID = 'parameters \'_search\' keys is invalid, try again with (subject ot content)';
exports.ERROR_SEARCH_INVALID = ERROR_SEARCH_INVALID;
const ERROR_LOAD_PAGE = 'Error getting YOPmail page';
exports.ERROR_LOAD_PAGE = ERROR_LOAD_PAGE;
const ERROR_PARAMETERS_INVALID = 'No se encontró la función';
exports.ERROR_PARAMETERS_INVALID = ERROR_PARAMETERS_INVALID;
const ERROR_GET_COOKIES = 'Error getting cookies';
exports.ERROR_GET_COOKIES = ERROR_GET_COOKIES;
const ERROR_MISSING_PARAMETERS = 'Missing parameters';
exports.ERROR_MISSING_PARAMETERS = ERROR_MISSING_PARAMETERS;
const ERROR_GET_TOTAL_MAILS = 'Error getting total number of mails';
exports.ERROR_GET_TOTAL_MAILS = ERROR_GET_TOTAL_MAILS;
const COOKIE = mail => {
  return {
    name: 'ygen',
    value: mail,
    domain: '.yopmail.com',
    url: 'https://yopmail.com/',
    path: '/',
    httpOnly: false,
    secure: false
  };
};
exports.COOKIE = COOKIE;
const TEST_MAIL = 'test@yopmail.com';
exports.TEST_MAIL = TEST_MAIL;
const INBOX_FILE = _path.default.resolve('tests', 'archives', 'inbox.json');
exports.INBOX_FILE = INBOX_FILE;
const MAIL_CONTENT = _path.default.resolve('tests', 'archives', 'mailContent.json');
exports.MAIL_CONTENT = MAIL_CONTENT;
const HTML_ID = _path.default.resolve('tests', 'archives', 'mailHTML_id.html');
exports.HTML_ID = HTML_ID;
const HTML_SUBJECT = _path.default.resolve('tests', 'archives', 'mailHTML_subject.html');
exports.HTML_SUBJECT = HTML_SUBJECT;
const HTML_CONTENT = _path.default.resolve('tests', 'archives', 'mailHTML_content.html');
exports.HTML_CONTENT = HTML_CONTENT;
const S_INPUT_MAIL_GENERATE = '#geny';
exports.S_INPUT_MAIL_GENERATE = S_INPUT_MAIL_GENERATE;
const SELECTOR_SUBMIT = 'div.fl > div.ellipsis.nw.b.f18';
exports.SELECTOR_SUBMIT = SELECTOR_SUBMIT;
const SELECTOR_FROM = 'div.fl > div.md.text.zoom.nw.f24 > span.ellipsis.b';
exports.SELECTOR_FROM = SELECTOR_FROM;
const SELECTOR_DATE = 'div.fl > div.md.text.zoom.nw.f24 > span.ellipsis:last-child';
exports.SELECTOR_DATE = SELECTOR_DATE;
const SELECTOR_FROM_ALT = 'div.fl > div.md.text.zoom.nw.f18 > span.ellipsis.b';
exports.SELECTOR_FROM_ALT = SELECTOR_FROM_ALT;
const SELECTOR_DATE_ALT = 'div.fl > div.md.text.zoom.nw.f18 > span.ellipsis:last-child';
exports.SELECTOR_DATE_ALT = SELECTOR_DATE_ALT;
const SELECTOR_MAIL = '#mail';
exports.SELECTOR_MAIL = SELECTOR_MAIL;
const possibleKeys = ['id', 'from', 'subject', 'timestamp'];
exports.possibleKeys = possibleKeys;