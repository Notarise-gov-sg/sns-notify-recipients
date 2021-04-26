# sns-notify-recipients

Send SNS notifications with templates.

## Installation

To install with npm, run this in your service directory:

```bash
npm install @notarise-gov-sg/sns-notify-recipients
```

## Usage

Import package where required:

```javascript
import { notifyPdt, notifyVaccine } from "sns-notifiy-recipients";

try {
  /* Notify recipient of PDT */
  interface NotifyPdtProps {
    url: string;
    nric?: string;
    passportNumber: string;
    testData: TestData[];
    validFrom: string; // ISO String
  }
  await notifyPdt(notifyPdtProps);

  /* Notify recipient of Vaccination */
  interface NotifyVaccineProps {
    name: string;
    url: string;
    nric?: string;
    passportNumber: string;
    vaccinations: Vaccination[];
    validFrom: string; // ISO String
    vaccinationEffectiveDate: string; // ISO String
  }
  await notifyVaccine(notifyVaccineProps);
} catch (e) {
  errorWithRef(`Notification error: ${e.message}`);
}
```

## Environment Variables

Remember to set the following environment variables:

```text
NOTIFICATION_TOPIC_ARN=arn:aws:sns:ap-southeast-1:000000000000:PLACEHOLDER_SNS_TOPIC
NOTIFICATION_SENDER_NAME=MOH
NOTIFICATION_SENDER_LOGO=""
NOTIFICATION_TEMPLATE_ID=000
```

## Developers/Contributors

1. Develop on a separate branch.

2. Raise a PR.

3. Upon approval, merge PR into `master` branch.

4. GitHub Actions will automatically bump version in `package.json` and tag.

5. After version bump, publish package to NPM by manually running `CI - Publish` workflow in GitHub Actions.
