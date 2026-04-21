'use strict';

const easyYopmail = require('./index.js');

async function main() {
    console.log('=== Easy-YOPmail Demo ===\n');

    // 1. Generate a random email address
    console.log('1. Generating a random email address...');
    const email = await easyYopmail.getMail();
    console.log('   Generated email:', email);

    // 2. Get inbox for the generated email
    console.log('\n2. Getting inbox for:', email);
    const inbox = await easyYopmail.getInbox(email);
    console.log('   Total emails:', inbox.totalEmails);
    console.log('   Page count:', inbox.pageCount);
    console.log('   Inbox:', inbox.inbox.length > 0 ? inbox.inbox : '(empty inbox)');

    console.log('\n=== Demo completed successfully ===');
}

main().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
