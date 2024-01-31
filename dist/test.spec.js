"use strict";

const constants = require('./constants.js');
const easyYopmail = ({
  getInbox,
  getMailDetail,
  deleteMail,
  deleteInbox
} = require('./index.js'));
const assert = require('assert');
let mails = [];
let inbox = undefined;
let mailDetail = undefined;
let firstMail = undefined;
let secondMail = undefined;
describe('🧪 TESTING GENERATE E-MAILS', () => {
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
describe('🧪 TESTING INBOX', () => {
  before(async () => {
    inbox = await easyYopmail.getInbox(constants.TEST_MAIL);
  });
  it('should, inbox has properties', () => {
    console.log(inbox);
    assert.ok(inbox.hasOwnProperty('settings'));
    assert.ok(inbox.hasOwnProperty('search'));
    assert.ok(inbox.hasOwnProperty('totalInbox'));
    assert.ok(inbox.hasOwnProperty('totalPages'));
    assert.ok(inbox.hasOwnProperty('mailFromPage'));
    assert.ok(inbox.hasOwnProperty('totalGetMails'));
    assert.ok(inbox.hasOwnProperty('inbox'));
  });

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
  it('should, Send email', async () => {
    let a = new Date().getTime();
    let b = 'sender01';
    let c = 'receiver01';
    let d = 'testing_' + a;
    let e = 'This a test that function writeMessage works! DEMO N°: ' + a;
    let f = await easyYopmail.writeMessage(b, c, d, e);
    console.log(f);
    assert.strictEqual(f, 'OK|mobback|Your message has been sent');
  });
});