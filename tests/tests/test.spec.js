const constants   = require('../constants');
const easyYopmail = require('../app');
const assert      = require('assert');
const fs          = require('fs');

let mails = [];
let mailDetail = undefined;
let firstMail = undefined;
let secondMail = undefined;
let rss = undefined;

describe.only('🧪 TESTING GENERATE E-MAILS', () => {
	it('should, generate email dynamically', async () => {
		mails.push(await easyYopmail.getMail());
		console.log(mails[0]);
		assert.match(mails[0], /yopmail/g);
		assert.ok(mails[0]);
	});
	it('should, generate new email and be differents', async () => {
		mails.push(await easyYopmail.getMail());
		console.log(mails[1]);
		assert.match(mails[1], /yopmail/g);
		assert.notStrictEqual(mails[0], mails[1]);
	});

	it('should, generate new email and be diferent to before', async () => {
		mails.push(await easyYopmail.getMail());
		console.log(mails[2]);
		assert.match(mails[2], /yopmail/g);
		assert.notStrictEqual(mails[1], mails[2]);
	});
});

describe('🧪 TESTING RSS', () => {
	before(async () => {
		rss = await easyYopmail.getRSS(constants.TEST_MAIL);
		console.log(JSON.stringify(rss))
	});
	it('should, get RSS url ', () => {
		assert.ok(rss);
	});
});

describe('TESTING INBOX', () => {
	let inbox = undefined;
	before(async () => {
		inbox = await easyYopmail.getInbox(constants.TEST_MAIL, {}, {MAX_PAGE:1});
	});

	it('should, inbox has property totalEmail', () => {
		assert.ok(inbox.hasOwnProperty('totalEmail'));
	});
	
	it('should, inbox has property maxPage', () => {
		assert.ok(inbox.hasOwnProperty('maxPage'));
	});
	
	it('should, default number page getting is 1', () => {
		assert.strictEqual(inbox.maxPage, 1);
	});
	
	it('should, inbox has property pages ', () => {
		assert.ok(inbox.hasOwnProperty('pages'));
	});
	
	it('should, property page is array', () => {
		assert.ok(Array.isArray(inbox.pages));
	});
	
	it('should, pages to equal 1', () => {
		assert.strictEqual(inbox.pages.length, 1);
	});
	
});