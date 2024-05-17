# 📬 getInbox()

The `getInbox()` function in the Easy-YOPMail library provides a streamlined way to access and retrieve the contents of a YOPmail inbox. This function is essential for managing temporary email addresses and interacting with received messages programmatically.

## Purpose

The `getInbox()` function serves the following purposes:

* **Inbox Retrieval:** It fetches the inbox contents of a specified YOPmail address, providing a list of emails received at that address.
* **Email Management:** By accessing the inbox, developers can programmatically manage emails, enabling actions like reading, deleting, or filtering messages based on various criteria.
* **Automation:** `getInbox()` facilitates the automation of tasks involving temporary email addresses, such as collecting verification codes, monitoring for specific emails, or scraping data from received messages.

## Functionality

The `getInbox()` function performs the following actions:

1. **Request Inbox Data:**  It sends an HTTP GET request to the YOPmail server, targeting the inbox of the provided email address. This request includes essential parameters like the email address and pagination details.
2. **Parse Inbox HTML:**  Upon receiving the server response, the function parses the HTML content of the inbox page. It extracts key information about each email, including the sender, subject, timestamp, and a unique identifier.
3. **Structure Inbox Data:** The extracted information is then organized into a structured JavaScript object. This object provides an overview of the inbox, including the total number of emails, pagination details, and an array of email objects, each representing a single email in the inbox.
4. **Apply Filtering (Optional):** The `getInbox()` function can optionally accept a `search` object as a parameter. This object allows developers to filter the retrieved emails based on criteria like sender, subject, or timestamp.
5. **Return Inbox Object:** Finally, the function returns the structured inbox object, containing all retrieved email information and relevant metadata.

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

## Optional Search Parameter

The `search` parameter allows filtering emails based on specific criteria. Here's an example demonstrating its usage:

```javascript
const searchCriteria = {
  from: 'noreply@example.com',
};

const inbox = await easyYopmail.getInbox('your-yopmail-address', searchCriteria);
// This will only return emails from 'noreply@example.com'
```

## Conclusion

The `getInbox()` function offers a versatile and efficient method to interact with YOPmail inboxes, empowering developers to automate tasks, manage temporary email addresses, and access received emails programmatically. By understanding its functionality and implementation, you can effectively leverage this tool in your Node.js projects.
