# 📮 Easy-YOPMail v5.0

<p align="center">
    <a href="#">
        <img alt="easy-yopmail" src="https://jasp402.github.io/Easy-YOPmail/images/Easy-YOPmail_title.png" width="auto">
    </a>
</p>

<p align="center">
    <a href="https://github.com/jasp402/Easy-YOPmail/actions/workflows/npm-publish.yml">
        <img alt="npm" src="https://github.com/jasp402/Easy-YOPmail/actions/workflows/npm-publish.yml/badge.svg">
    </a>
    <a href="https://github.com/jasp402/Easy-YOPmail/actions/workflows/main.yml">
        <img alt="Documentation" src="https://github.com/jasp402/Easy-YOPmail/actions/workflows/main.yml/badge.svg?branch=main">
    </a>    
    <img alt="NPM Unpacked Size" src="https://img.shields.io/npm/unpacked-size/easy-yopmail">
   <br/>
    <a href="https://sonarcloud.io/summary/new_code?id=jasp402_Easy-YOPmail">
        <img alt="SonarCloud" src="https://sonarcloud.io/images/project_badges/sonarcloud-white.svg">
    </a>
</p>
---

## 💌 Introducing Easy-YOPmail v5.0: Effortless Temporary Email Management for Node.js
Easy-YOPmail is a powerful Node.js library designed to simplify the way you interact with temporary email addresses from the YOPmail service. This version brings enhanced functionality, improved performance, and an even more intuitive developer experience.

**Easy-YOPmail v5.0 empowers you to:**

- **Generate Random Emails:** Create unique and disposable email addresses instantly.
- **Manage Inboxes:**  Access, read, and delete emails from any YOPmail inbox.
- **Target Specific Content:** Extract data from emails using CSS selectors and attributes.
- **Automate Workflows:**  Effortlessly integrate temporary email management into your scripts and applications.

**Why Choose Easy-YOPmail?**

- **Simplicity:**  Intuitive API for seamless integration into your Node.js projects.
- **Efficiency:** Asynchronous operations for fast and responsive email handling.
- **Flexibility:** Customize email retrieval and content extraction with powerful options.
- **Reliability:** Built on the robust YOPmail platform, ensuring consistent performance.

## 🚀 Getting Started

1. **Install Easy-YOPmail:**

   ```bash
   npm i easy-yopmail
   ```

2. **Import the library:**

   ```javascript
   const easyYopmail = require('easy-yopmail');
   ```

3. **Explore the examples below and the [full documentation](https://jasp402.github.io/Easy-YOPmail/starter-topic.html)** to harness the power of Easy-YOPmail!

## 💡 Common Use Cases

- **Automated Testing:** Create temporary email addresses for testing user registration, password resets, and other email-dependent features.
- **Web Scraping:**  Bypass email verification requirements on websites and collect data efficiently.
- **Anonymous Sign-Ups:** Sign up for services without revealing your primary email address.
- **Notification Systems:**  Send automated notifications or alerts using disposable YOPmail addresses.

## ✉️ Example: Generating a Temporary Email

```javascript
easyYopmail.getMail().then(email => {
    console.log(email); 
    // Output: [randomly generated name]@yopmail.com 
});
```

## 🗃️ Example: Reading the inbox of an email
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
## 📑 Example: *Read a message*
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

## 💖 Supporting Easy-YOPMail

We deeply appreciate your interest in supporting Easy-YOPmail! Your sponsorship helps us maintain and enhance the library, bringing valuable features and improvements to the community.

Here are a few ways you can contribute:

**1. Financial Support:**

- **Patreon:** Join our community on Patreon and get exclusive benefits! [https://www.patreon.com/patreon.com/jasp402](https://www.patreon.com/patreon.com/jasp402)
- **Buy Me a Coffee:** Fuel our coding sessions with a quick coffee! [https://buymeacoffee.com/wjton2s](https://buymeacoffee.com/wjton2s)
- **Ko-fi:** Show your support with a one-time donation. [https://ko-fi.com/jasp402](https://ko-fi.com/jasp402)

**2. Show Your Love on GitHub:**

- **Star the Repository:**  Give us a star on GitHub to show your appreciation and help increase visibility. [Link to your GitHub repository](link-to-your-GitHub-repository)
- **GitHub Sponsors:**  Become a sponsor through GitHub Sponsors and directly contribute to the project's development. [Link to your GitHub Sponsors profile](link-to-your-GitHub-Sponsors-profile)

Every contribution, big or small, helps us immensely. We are incredibly grateful for your support!
