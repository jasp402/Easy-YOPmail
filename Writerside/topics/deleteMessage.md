# 🗑️ deleteMessage()

The `deleteMessage()` function within the Easy-YOPMail library empowers developers to selectively remove individual emails from a YOPmail inbox. This function is valuable when you need to remove specific messages while retaining others, offering a more granular level of control over inbox management.

## Input Parameters

| Parameter | Type | Description | Optional |
|---|---|---|---|
| `mail` | String | The YOPmail email address (without the @yopmail.com domain). | No |
| `id` | String | The unique ID of the email to delete. | No |

## Purpose

The primary purpose of `deleteMessage()` is to provide a method for deleting specific emails from a YOPmail inbox based on their unique identifier. This is particularly useful for:

- **Targeted Cleanup:** Removing individual emails that are no longer needed or relevant, such as expired verification codes or unwanted notifications.
- **Data Management:** Selectively deleting messages to maintain a clean and organized inbox, focusing on retaining important emails while discarding others.
- **Privacy Enhancement:** Removing sensitive or confidential emails from the inbox to minimize potential privacy risks.

## Functionality

The `deleteMessage()` function operates through the following steps:

1. **Message Verification:** It begins by verifying whether the specified email exists within the target YOPmail inbox. This check prevents unnecessary processing if the message is not found.
2. **Deletion Request Preparation:**  If the email is present, the function constructs a specific HTTP GET request designed to delete that individual message. This request includes crucial parameters like the email address, the unique identifier of the target message, security tokens, and a specific flag signaling the deletion of a single message.
3. **Execute Deletion:**  The formulated request is then transmitted to the YOPmail server. Upon successful processing, the server permanently removes the targeted email from the inbox.
4. **Confirmation Return:**  After the deletion attempt, the function returns a notification message:
    - If the email was successfully deleted, it provides a success message confirming the removal.
    - If the email was not found, it returns a message stating that the email was not located and no deletion occurred.
    - In case of errors during the process, it returns an error message indicating the failure to delete the message.

## Implementation

Integrating `deleteMessage()` into your project is simple. Here's an example demonstrating its usage:

```javascript
const easyYopmail = require('easy-yopmail');

async function removeSpecificEmail() {
  try {
    const messageId = 'your-email-id'; // Replace with the actual email ID
    const result = await easyYopmail.deleteMessage('your-yopmail-address', messageId);
    console.log(result); 
    // Output: Success, email not found, or error message based on the result

  } catch (error) {
    console.error("Error:", error);
  }
}

removeSpecificEmail();
```

## Important Notes

- **Message ID:** Ensure you provide the correct unique identifier of the email you intend to delete. You can obtain this ID using the `getInbox()` function, which lists all emails and their corresponding identifiers.
- **Error Handling:** Implement appropriate error handling mechanisms to address potential issues during the deletion process. The function will throw an error if it encounters problems, allowing you to handle such situations gracefully in your code.

## Conclusion

The `deleteMessage()` function enhances the flexibility of YOPmail inbox management by enabling the selective removal of individual emails. This functionality is highly beneficial for maintaining a clean, organized, and privacy-conscious usage of temporary email addresses in your projects. By incorporating `deleteMessage()` into your workflows, you gain more granular control over your YOPmail interactions. 
