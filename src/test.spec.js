"use strict";

const {
  test,
  describe,
  before
} = require('node:test');
const assert = require('node:assert/strict');
const constants = require('./constants.js');
const easyYopmail = require('../index.js');
let mails = [];
let inbox;
describe('🧪 TESTING GENERATE E-MAILS', () => {
  test('should generate email dynamically', async () => {
    mails.push(await easyYopmail.getMail());
    assert.match(mails[0], /yopmail/g);
    assert.ok(mails[0]);
  });
  test('should generate new email and be differents', async () => {
    mails.push(await easyYopmail.getMail());
    assert.match(mails[1], /yopmail/g);
    assert.notStrictEqual(mails[0], mails[1]);
  });
  test('should generate new email and be diferent to before', async () => {
    mails.push(await easyYopmail.getMail());
    assert.match(mails[2], /yopmail/g);
    assert.notStrictEqual(mails[1], mails[2]);
  });
});
describe('🧪 TESTING INBOX', () => {
  before(async () => {
    inbox = await easyYopmail.getInbox(constants.TEST_MAIL);
  });
  test('should, inbox has properties', () => {
    assert.ok(inbox.hasOwnProperty('settings'));
    assert.ok(inbox.hasOwnProperty('search'));
    assert.ok(inbox.hasOwnProperty('totalInbox'));
    assert.ok(inbox.hasOwnProperty('totalPages'));
    assert.ok(inbox.hasOwnProperty('mailFromPage'));
    assert.ok(inbox.hasOwnProperty('totalGetMails'));
    assert.ok(inbox.hasOwnProperty('inbox'));
  });

  //TODO: convert to test old testcase
  // it('should, inbox has property maxPage', () => {
  //
  // 	});
  //
  // it('should, default number page getting is 1', () => {
  // 	assert.strictEqual(inbox.maxPage, 1);
  // 	});
  //
  // it('should, inbox has property pages ', () => {
  // 	assert.ok(inbox.hasOwnProperty('pages'));
  // });
  //
  // it('should, property page is array', () => {
  // 	assert.ok(Array.isArray(inbox.pages));
  // 	});
  //
  // it('should, pages to equal 1', () => {
  // 	assert.strictEqual(inbox.pages.length, 1);
  // });
});
describe('🧪 TESTING WRITE EMAIL', () => {
  test('should, Send email', async () => {
    let time = new Date().getTime();
    let mail = 'sender01';
    let to = 'receiver01';
    let subject = 'testing_' + time;
    let body = 'This a test that function writeMessage works! DEMO N°: ' + time;
    let email = await easyYopmail.writeMessage(mail, to, subject, body);
    assert.strictEqual(email, 'Your message has been sent');
  });
});