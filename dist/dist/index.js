"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteInbox = deleteInbox;
exports.deleteMessage = deleteMessage;
exports.getInbox = getInbox;
exports.getMail = getMail;
exports.readMessage = readMessage;
exports.writeMessage = writeMessage;
var _axios = _interopRequireDefault(require("axios"));
var cheerio = _interopRequireWildcard(require("cheerio"));
var constants = _interopRequireWildcard(require("./constants.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
  const response = await _axios.default.get(constants.BASE_URL);
  if (response.status === 200) {
    const $ = cheerio.load(response.data);
    const yp = $(constants.INPUT_YP).val();
    const cookie = response.headers['set-cookie'].map(x => x.split(';')[0]).join('; ');
    return {
      cookie,
      yp
    };
  } else {
    console.error(constants.ERROR_GET_COOKIES);
    return {
      cookie: null,
      yp: null
    };
  }
}
async function getYJ(cookie) {
  const response = await _axios.default.get(constants.WEBMAIL_JS_URL, {
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
  return {
    id,
    from,
    subject,
    timestamp
  };
}
function getDetailInboxFromPage(html, filteredSearch) {
  const $ = cheerio.load(html);
  const elements = $('.m');
  return elements.map((index, element) => parseEmail(element)).toArray().filter(email => shouldIncludeEmail(email, filteredSearch));
}
async function fetchInboxPage(mail, yp, yj, pageNumber, cookie) {
  return await _axios.default.get(constants.INBOX_URL(mail, yp, yj, pageNumber), constants.INBOX_HTTP_CONFIG(cookie, mail));
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
async function getMail() {
  try {
    const response = await _axios.default.get(constants.GENERATOR_URL);
    if (response.status !== 200) {
      console.error(constants.ERROR_LOAD_PAGE);
      return null;
    }
    const $ = cheerio.load(response.data);
    const genEmail = $(constants.S_INPUT_MAIL_GENERATE).text();
    return genEmail.split(';')[1];
  } catch (error) {
    console.error(constants.ERROR_LOAD_PAGE, error.message);
    return null;
  }
}
async function getInbox(mailAddress, search = {}, settings = {}) {
  try {
    settings = settings || {};
    const mail = mailAddress.split('@')[0]?.toLowerCase() || mailAddress;
    const {
      cookie,
      yp
    } = await getCookiesAndYP();
    const yj = await getYJ(cookie);
    return await detailInbox(mail, yp, yj, cookie, search, settings);
  } catch (error) {
    throw new Error(error);
  }
}
async function readMessage(mail, id, format, selector = '') {
  const {
    cookie
  } = await getCookiesAndYP();
  const response = await _axios.default.get(constants.READ_MAIL_URL(mail, id), constants.INBOX_HTTP_CONFIG(cookie, mail));
  const $ = cheerio.load(response.data);
  const submit = $(constants.SELECTOR_SUBMIT).text();
  const fromSelector = $(constants.SELECTOR_FROM);
  const dateSelector = $(constants.SELECTOR_DATE);
  const from = fromSelector.length ? fromSelector.text() : $(constants.SELECTOR_FROM_ALT).text();
  const date = dateSelector.length ? dateSelector.text().replace(from, '') : $(constants.SELECTOR_DATE_ALT).text();
  let message;
  if (selector) {
    selector = `${constants.SELECTOR_MAIL} ${selector}`;
    message = format.toLowerCase() === 'html' ? $(selector).html() : $(selector).text().trim();
  } else {
    selector = '#mail';
    message = format.toLowerCase() === 'html' ? $(selector).html() : $(selector).text().trim();
  }
  return {
    submit,
    from,
    date,
    selector,
    format,
    data: message
  };
}
async function deleteInbox(mail) {
  try {
    const {
      cookie,
      yp
    } = await getCookiesAndYP();
    const yj = await getYJ(cookie);
    const {
      inbox
    } = await getInbox(mail);
    if (inbox.length > 0) {
      const id = inbox[0].id;
      const url = `https://yopmail.com/es/inbox?login=${mail}&p=1&d=all&ctrl=${id}&yp=${yp}&yj=${yj}&v=8.4&r_c=&id=`;
      const response = await _axios.default.get(url, constants.INBOX_HTTP_CONFIG(cookie, mail));
      return Boolean(200 === response.status);
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
}
async function deleteMessage(mail, id) {
  try {
    const {
      cookie,
      yp
    } = await getCookiesAndYP();
    const yj = await getYJ(cookie);
    const {
      inbox
    } = await getInbox(mail, {
      id: id
    });
    if (inbox.length > 0) {
      const url = `https://yopmail.com/es/inbox?login=${mail}&p=1&d=${id}&ctrl=&yp=${yp}&yj=${yj}&v=8.4&r_c=&id=`;
      const response = await _axios.default.get(url, constants.INBOX_HTTP_CONFIG(cookie, mail));
      return Boolean(200 === response.status);
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
}
async function writeMessage(mail, to, subject, body, attachment = null) {
  try {
    if (!mail || !to || !subject || !body) {
      console.error(constants.ERROR_MISSING_PARAMETERS);
    }
    const {
      cookie
    } = await getCookiesAndYP();
    const response = await _axios.default.get(constants.WRITE_MAIL_URL(mail), constants.INBOX_HTTP_CONFIG(cookie, mail));
    if (response.status === 200) {
      const data = {
        msgfrom: `${mail}@yopmail.com`,
        msgto: to,
        msgsubject: subject,
        msgbody: body
      };
      const sendMessage = await _axios.default.post(constants.SEND_MESSAGE_URL, data, constants.WRITE_MESSAGE_HTTP_CONFIG(cookie, mail));
      return sendMessage.data;
    }
    return response.data;
  } catch (e) {
    console.error(e);
  }
}