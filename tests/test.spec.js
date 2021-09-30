const constants   = require('../constants/constants.app');
const easyYopmail = require('../app');
const assert      = require('assert');
const fs          = require('fs');

let mailDetail = undefined;
let firstMail = undefined;
let secondMail = undefined;
let rss = undefined;

describe('🧪 TESTING GENERATE E-MAILS', () => {
	it('should, generate email dynamically', async () => {
		firstMail = await easyYopmail.getMail();
		assert.ok(firstMail);
		console.log(firstMail);
	});
	it('should, generate new email and be differents', async () => {
		secondMail = await easyYopmail.getMail();
		assert.notStrictEqual(firstMail, secondMail);
		console.log(secondMail);
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

describe('🧪 TESTING INBOX', () => {
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