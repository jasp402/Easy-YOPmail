# 📮 Easy-YOPMail v4
<p align="center">
    <a href="#">
        <img alt="easy-yopmail" src="https://culqi-images-storage.s3.us-east-2.amazonaws.com/images/v4_EN_us.png" width="auto">
    </a>
</p>
<p align="center">
    <a href="https://www.npmjs.com/package/easy-yopmail">
        <img alt="npm" src="https://img.shields.io/npm/v/easy-yopmail.svg?logo=npm">
    </a>
    <a href="https://app.travis-ci.com/github/jasp402/Easy-YOPmail">
        <img alt="Travis (.org)" src="https://api.travis-ci.com/jasp402/Easy-YOPmail.svg">
    </a>
</p>


---
## 💌 What is Easy-YOPmail?
a powerful NPM library designed for NodeJS. This tool was born from the need to simplify the generation of random emails, the management of inboxes and the reading of received messages, all without the need to manually interact with any web interface.

Easy-Yopmail is based on the YOPmail platform and operates completely asynchronously. Its intuitive design and efficiency make it an indispensable tool for scraping, automated testing, and any process that requires efficient email management.
With Easy-Yopmail, you can focus on what really matters: developing your application. Let our bookstore take care of the email for you.

Join the community of developers who are already taking advantage of Easy-Yopmail. Install it today from NPM and see how it can simplify your workflow!

<hr>

#### The main features of Easy-Yopmail include:

- **Random Email Generation:** Create unique and random email addresses with a single command.

- **Inbox Management:** Access and list the inbox of any Yopmail email address.

- **Reading Emails:** Read received emails without having to interact with any web interface.

- **Asynchronous Operation:** All Easy-Yopmail functions run asynchronously, allowing for a seamless workflow.

- **Easy Integration with NodeJS:** As an NPM library, Easy-Yopmail integrates seamlessly with any NodeJS project.

- **Based on YOPmail**: Easy-Yopmail uses the YOPmail platform, which guarantees the reliability and efficiency of its functions.

## 📦 Install
You can install the library using [NPM](https://www.npmjs.com/) or [Yarm](https://yarnpkg.com/)
```
npm i easy-yopmail
```
```
yarn add easy-yopmail
```
https://github.com/jasp402/Easy-YOPmail/assets/8978470/775b0b6d-2c83-4bc5-856b-cfb4b58ed247

## 🔧 How to use

``` js
//Declare module
const easyYOPmail = require('easy-yopmail');
```

#### ✉️ *Receive a new email dynamically*
``` js
easyYOPmail.getMail().then(mail => {
    console.log(mail); 
    //Output:
    //jemuzivutro-3233@yopmail.com
});
```

#### 🗃️ *Read inbox of an email*
``` js
easyYOPmail.getInbox('testing_01').then(inbox => {
    console.log(inbox);
    //Output:
    //{
    //  settings: {},
    //  search: {},
    //  totalInbox: 271,
    //  totalPages: 19,
    //  mailFromPage: { page_1: 15 },
    //  totalGetMails: 15,
    //  inbox: [
    //       {
    //         id: 'e_ZwZjAGVlZGHlZQR1ZQNjAwZ5AQp4ZD==',
    //         from: 'Ola no-reply',
    //         subject: 'this is example message...',
    //         timestamp: '10:20'
    //       }
    //  ]
    //}
});
```
#### 📑 *Read message*
``` js
easyYOPmail.readMessage('testing_01', 'e_ZwZjAGVlZGHlZQR1ZQNjAwZ5AQp4ZD==', 'TXT').then(message => {
    console.log(message);
    //Output:
    //{
    //  id: 'e_ZwZjAGVlZGHlZQR1ZQNjAwZ5AQp4ZD==',
    //  submit: 'ITechnoLabs Notification - Event from Hanwha  XNV-6012',
    //  from: 'ITechnoLabs Notification Service <notifications@mycamcloud.com>',
    //  date: 'Monday, May 22, 2023 10:23:26 PM',
    //  selector: '#mail',
    //  format: 'txt',
    //  data: 'Hanwha  XNV-6012\n ...'
    //}
});
```

> ⚠️ **NOTE:** For more details visit the full documentation at: https://jasp402.gitbook.io/easy-yopmail-v4