# sns-notify-recipients

Send SNS notifications with templates

## Installation

To install with npm, run this in your service directory:

```sh
npm install git+ssh://git@github.com:Notarise-gov-sg/sns-notify-recipients.git
```

## Usage

Import package where required:

```javascript
import { notifyRecipients } from "sns-notifiy-recipients";

// ...

try {
  /* Notify recipient */
  await notifyRecipient(payload);
} catch (e) {
  errorWithRef(`Notification error: ${e.message}`);
}
```

## Environment Variables

Remember to set the following environment variables:

```text
NOTIFICATION_ENABLED=true
NOTIFICATION_TOPIC_ARN=arn:aws:sns:ap-southeast-1:000000000000:PLACEHOLDER_SNS_TOPIC
NOTIFICATION_SENDER_NAME=MOH
NOTIFICATION_SENDER_LOGO=""
NOTIFICATION_TEMPLATE_ID=000
```
