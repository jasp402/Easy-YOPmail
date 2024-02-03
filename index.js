const cheerio     = require('cheerio');
const querystring = require('querystring');
const constants   = require('./src/constants.js');
const utils       = require('./src/utils.js');

class EasyYopmail {
    async getMail() {
        try {
            const response = await utils.request('GET', constants.GENERATOR_URL);
            if (response.statusCode !== 200) {
                console.error(constants.ERROR_LOAD_PAGE);
                return null;
            }
            const $        = cheerio.load(response.body);
            const genEmail = $(constants.S_INPUT_MAIL_GENERATE).text();
            return genEmail.split(";")[1] || genEmail;
        } catch (error) {
            console.error(constants.ERROR_LOAD_PAGE);
            console.error(error.message);
            throw new Error(error);
        }
    }

    async getInbox(mailAddress, search = {}, settings = {}) {
        try {
            const mail              = utils.simplifyEmail(mailAddress);
            const {cookie, yp, ver} = await utils.getCookiesAndYP();
            const yj                = await utils.getYJ(cookie, ver);
            return await utils.detailInbox(mail, yp, yj, ver, cookie, search, settings);
        } catch (error) {
            console.error(constants.ERROR_GET_INBOX);
            console.error(error.message);
            throw new Error(error);
        }

    }

    async readMessage(mail, id, format, selector = '') {
        try {
            const {cookie} = await utils.getCookiesAndYP();
            const response = await utils.request('GET', constants.READ_MAIL_URL(mail, id), constants.INBOX_HTTP_CONFIG(cookie, mail));

            if (response.statusCode !== 200) {
                console.log(constants.ERROR_LOAD_PAGE);
            }

            const $            = cheerio.load(response.body);
            const submit       = $(constants.SELECTOR_SUBMIT).text();
            const fromSelector = $(constants.SELECTOR_FROM);
            const dateSelector = $(constants.SELECTOR_DATE);

            const from = fromSelector.length ? fromSelector.text() : $(constants.SELECTOR_FROM_ALT).text();
            const date = dateSelector.length ? dateSelector.text().replace(from, '') : $(constants.SELECTOR_DATE_ALT).text();

            let message;
            if (selector) {
                selector = `${constants.SELECTOR_MAIL} ${selector}`
                message  = (format.toLowerCase() === 'html') ? $(selector).html() : $(selector).text().trim();
            } else {
                selector = '#mail';
                message  = (format.toLowerCase() === 'html') ? $(selector).html() : $(selector).text().trim();
            }

            return {
                id,
                submit,
                from,
                date,
                selector,
                format,
                data: message,
            }
        } catch (error) {
            console.error(constants.ERROR_READ_MESSAGE);
            console.error(error.message);
            throw new Error(error);
        }
    }

    async deleteMessage(mail, id) {
        try {
            const {cookie, yp, ver} = await utils.getCookiesAndYP();
            const yj                = await utils.getYJ(cookie, ver);
            const {inbox}           = await this.getInbox(mail, {id: id});
            if (inbox.length > 0) {
                const url      = constants.DELETE_MESSAGE_URL(mail, id, yp, yj, ver);
                const response = await utils.request('GET', url, constants.INBOX_HTTP_CONFIG(cookie, mail));
                return Boolean(200 === response.statusCode);
            } else {
                return false;
            }
        } catch (error) {
            console.error(constants.ERROR_DELETE_MESSAGE);
            console.error(error.message);
            throw new Error(error);
        }
    }

    async writeMessage(mail, to, subject, body) {
        try {
            if (!mail || !to || !subject || !body) {
                console.error(constants.ERROR_MISSING_PARAMETERS);
            }
            const {cookie} = await utils.getCookiesAndYP();
            const response = await utils.request('GET', constants.WRITE_MAIL_URL(mail), constants.INBOX_HTTP_CONFIG(cookie, mail));
            if (response.statusCode === 200) {
                const data       = {
                    msgfrom   : `${mail}@yopmail.com`,
                    msgto     : to,
                    msgsubject: subject,
                    msgbody   : body
                };
                const dataCadena = querystring.stringify(data);

                let header                       = constants.WRITE_MESSAGE_HTTP_CONFIG(cookie, mail);
                header.headers['Content-Type']   = 'application/x-www-form-urlencoded';
                header.headers['Content-Length'] = Buffer.byteLength(dataCadena)
                const sendMessage                = await utils.request('POST', constants.SEND_MESSAGE_URL, header, dataCadena);
                if (sendMessage.statusCode !== 200) {
                    console.error(constants.ERROR_WRITE_MESSAGE);
                }
                return String(sendMessage.body).split('|')[2];
            }
            return response.data;
        } catch (error) {
            console.error(constants.ERROR_WRITE_MESSAGE);
            console.error(error.message);
            throw new Error(error);
        }
    }

    async deleteInbox(mail) {
        try {
            const {cookie, yp, ver} = await utils.getCookiesAndYP();
            const yj                = await utils.getYJ(cookie, ver);
            const {inbox}           = await this.getInbox(mail);
            if (inbox.length > 0) {
                const id       = inbox[0].id;
                const url      = constants.DELETE_INBOX_URL(mail, id, yp, yj, ver);
                const response = await utils.request('GET', url, constants.INBOX_HTTP_CONFIG(cookie, mail));
                console.log(response);
                return Boolean(200 === response.statusCode);
            } else {
                return false;
            }

        } catch (error) {
            console.error(constants.ERROR_DELETE_INBOX);
            console.error(error.message);
            throw new Error(error);
        }
    }
}

module.exports = () => new EasyYopmail();