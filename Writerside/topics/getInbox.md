# 📬 getInbox()

The `getInbox()` function in the Easy-YOPMail library provides a streamlined way to access and retrieve the contents of a YOPmail inbox. This function is essential for managing temporary email addresses and interacting with received messages programmatically.


## Input Parameters

| Parameter | Type | Description | Optional |
|---|---|---|---|
| `mail` | String | The YOPmail email address (without the @yopmail.com domain). | No |
| `search` | Object | An object containing search criteria to filter emails. Supports exact matching for `id`, `timestamp`, and `day`. For `from` and `subject`, it also supports partial matching using the `%` wildcard (e.g., `{ from: 'sender%' }`, `{ subject: '%keyword%' }`). | Yes |
| `settings` | Object | An object containing settings for inbox retrieval. <br/><ul><li>`LIMIT_PAGE`: (Number, default: 10) Specifies the maximum number of *pages* to explore. Each page typically contains 15 emails.</li><li>`LIMIT_MAIL`: (Number, default: 0) Specifies the maximum number of *emails* to fetch. If set to `0`, no mail limit is applied.</li><li>`ORDER`: (String, default: 'desc') Specifies the order of the returned emails. Can be `'desc'` (newest first) or `'asc'` (oldest first).</li></ul>`LIMIT_PAGE` takes precedence over `LIMIT_MAIL`. | Yes |


## Purpose

The `getInbox()` function serves the following purposes:

*   **Inbox Retrieval:** It fetches the inbox contents of a specified YOPmail address, providing a list of emails received at that address.
*   **Email Management:** By accessing the inbox, developers can programmatically manage emails, enabling actions like reading, deleting, or filtering messages based on various criteria.
*   **Automation:** `getInbox()` facilitates the automation of tasks involving temporary email addresses, such as collecting verification codes, monitoring for specific emails, or scraping data from received messages.

## Functionality

The `getInbox()` function performs the following actions:

1.  **Request Inbox Data:** It sends an HTTP GET request to the YOPmail server, targeting the inbox of the provided email address. This request includes essential parameters like the email address and pagination details.
2.  **Parse Inbox HTML:** Upon receiving the server response, the function parses the HTML content of the inbox page. It extracts key information about each email, including the sender, subject, timestamp, and a unique identifier.
3.  **Structure Inbox Data:** The extracted information is then organized into a structured JavaScript object. This object provides an overview of the inbox, including the total number of emails, pagination details, and an array of email objects, each representing a single email in the inbox.
4.  **Apply Filtering (Optional):** The `getInbox()` function can optionally accept a `search` object to filter retrieved emails. This filtering supports exact matches for `id`, `timestamp`, and `day`. For `from` and `subject` fields, it also provides a powerful partial matching capability using the `%` wildcard. This allows for flexible searches such as finding emails from a specific domain (`%@example.com`), emails with a subject containing a keyword (`%keyword%`), or emails starting with a certain phrase (`prefix%`).
5.  **Return Inbox Object:** Finally, the function returns the structured inbox object, containing all retrieved email information and relevant metadata.

## Implementation

Here's an example demonstrating how to use `getInbox()` in your Node.js project:

```javascript
const easyYopmail = require('easy-yopmail');

async function checkInbox() {
  try {
    const inbox = await easyYopmail.getInbox('your-yopmail-address');
    console.log(inbox); 
    // Output: A detailed inbox object containing email information 

  } catch (error) {
    console.error("Error:", error);
  }
}

checkInbox();
```

## Advanced Search with Wildcards

The `search` parameter offers powerful filtering capabilities, including the use of the `%` wildcard for partial matching in `from` and `subject` fields.

### Filtering by Sender (`from`) with Wildcard

```javascript
const searchCriteria = {
  from: 'noreply%', // Emails from senders starting with 'noreply'
};
const inbox = await easyYopmail.getInbox('your-yopmail-address', searchCriteria);
```

### Filtering by Subject (`subject`) with Wildcard

```javascript
const searchCriteria = {
  subject: '%verification code%', // Emails with 'verification code' anywhere in the subject
};
const inbox = await easyYopmail.getInbox('your-yopmail-address', searchCriteria);
```

### Filtering by Day (`day`)

```javascript
const searchCriteria = {
  day: 'Today', // Emails received today
};
const inbox = await easyYopmail.getInbox('your-yopmail-address', searchCriteria);
```

## Controlling Retrieval and Order

The `settings` parameter offers three properties to control the retrieval process: `LIMIT_PAGE`, `LIMIT_MAIL`, and `ORDER`.

*   `LIMIT_PAGE` determines the maximum number of pages the function will explore.
*   `LIMIT_MAIL` specifies the absolute maximum number of emails to return.
*   `ORDER` controls the final sort order of the returned emails.

### Using `LIMIT_PAGE` and `LIMIT_MAIL`

`LIMIT_PAGE` and `LIMIT_MAIL` work together to give you precise control. The function stops fetching when either limit is reached. `LIMIT_PAGE` takes precedence, setting a hard cap on the number of emails that can be fetched.

```javascript
// Scenario 1: Fetch up to 10 emails, exploring as many pages as needed (up to the default of 10)
const settings_mail_limit = {
  LIMIT_MAIL: 10,
};
const inbox_mail_limit = await easyYopmail.getInbox('your-yopmail-address', null, settings_mail_limit);
// inbox_mail_limit.fetchedEmailCount will be 10 or less

// Scenario 2: Explore up to 2 pages, fetching all emails found (up to 30)
const settings_page_limit = {
  LIMIT_PAGE: 2,
};
const inbox_page_limit = await easyYopmail.getInbox('your-yopmail-address', null, settings_page_limit);
// inbox_page_limit.fetchedEmailCount will be 30 or less

// Scenario 3: Request 50 emails, but LIMIT_PAGE restricts it to 30 (2 pages * 15 emails/page)
const settings_combined = {
  LIMIT_PAGE: 2, 
  LIMIT_MAIL: 50, 
};
const inbox_combined = await easyYopmail.getInbox('your-yopmail-address', null, settings_combined);
// inbox_combined.fetchedEmailCount will be 30 or less
```

### Ordering the Results with `ORDER`

By default, `getInbox()` returns emails in descending order (`'desc'`), from newest to oldest. You can change this by setting `ORDER` to `'asc'`.

The ordering is applied *after* emails are fetched. If you request the 10 most recent emails (`LIMIT_MAIL: 10`) and set `ORDER: 'asc'`, you will get those 10 emails sorted from the oldest among them to the newest.

```javascript
const settings = {
  LIMIT_MAIL: 5, // Fetch the 5 most recent emails
  ORDER: 'asc',  // Order them from oldest to newest
};
const inbox = await easyYopmail.getInbox('your-yopmail-address', null, settings);

// The inbox will contain the 5 most recent emails,
// with the oldest of the 5 appearing first in the array.
console.log(inbox.inbox);
```

## Combining Search and All Settings

You can combine all parameters for highly specific queries:

```javascript
const searchCriteria = {
  from: 'support%',
  subject: '%important%',
};
const settings = {
  LIMIT_PAGE: 2, 
  LIMIT_MAIL: 10, 
  ORDER: 'asc',
};
const inbox = await easyYopmail.getInbox('your-yopmail-address', searchCriteria, settings);

// This will:
// 1. Search for emails from 'support%' with 'important' in the subject.
// 2. Explore a maximum of 2 pages.
// 3. Stop after finding 10 matching emails.
// 4. Return those 10 emails sorted from oldest to newest.
console.log(inbox.inbox);
```

## Conclusion

The `getInbox()` function offers a versatile and efficient method to interact with YOPmail inboxes, empowering developers to automate tasks, manage temporary email addresses, and access received emails programmatically. By understanding its functionality and implementation, you can effectively leverage this tool in your Node.js projects.