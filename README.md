# sns-notify-recipients

Send SNS notifications with templates

## Installation

To install with npm, run this in your service directory:

```bash
npm install https://github.com/Notarise-gov-sg/sns-notify-recipients/tarball/release/v1.0.0
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

## Developers/Contributors

1. Develop on a separate branch.

2. Raise a PR.

3. Upon approval, merge PR into master branch.

4. Bump `package.json` version of master branch:

   ```bash
   npm version patch
   ```

5. Create a new release on GitHub:

   a. Go to `https://github.com/Notarise-gov-sg/sns-notify-recipients` and click on create new release.

   b. Enter release tag (v1.x.x), title and description.

   c. Publish release.

   d. GitHub Actions workflow will automatically commit to release branch.
