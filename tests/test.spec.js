const constants   = require('../constants/constants.app');
const easyYopmail = require('../app');
const assert      = require('assert');
const fs          = require('fs');

let mailDetail = undefined;

describe('TEST: Create email', () => {
	it('should, generate email dynamically', async () => {
		let mail = easyYopmail.createMail();
		assert.ok(mail);
	});
});

describe('TEST: get Inbox', () => {
	it('should, read the inbox and use an email', async () => {
		let inbox = await easyYopmail.inbox(constants.TEST_MAIL);
		assert.ok(Array.isArray(inbox));
		fs.writeFileSync(constants.INBOX_FILE, JSON.stringify(inbox[0]), 'utf-8');
	}).timeout(30000);
});

describe('TEST: Read mail by first inbox', () => {
	beforeEach(() => {
		mailDetail = JSON.parse(fs.readFileSync(constants.INBOX_FILE, 'utf-8'));
	});
	it('should, Get data to inbox and search mail by ID', async () => {
		let HTML = await easyYopmail.readMail(constants.TEST_MAIL, {id: mailDetail.id});
		fs.writeFileSync(constants.HTML_ID, HTML, 'utf-8');
	}).timeout(30000);
	it('should, Get data to inbox and search mail by Subject', async () => {
		let HTML = await easyYopmail.readMail(constants.TEST_MAIL, {subject: mailDetail.subject});
		fs.writeFileSync(constants.HTML_SUBJECT, HTML, 'utf-8');
	}).timeout(30000);
	it('should, Get data to inbox and search mail by Content', async () => {
		let HTML = await easyYopmail.readMail(constants.TEST_MAIL, {content: mailDetail.content});
		fs.writeFileSync(constants.HTML_CONTENT, HTML, 'utf-8');
	}).timeout(30000);
});