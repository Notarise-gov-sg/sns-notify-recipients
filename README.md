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
import { notifyPdt, notifyVaccine } from "@notarise-gov-sg/sns-notify-recipients";

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

  /* Notify recipient of Health cert for new SPM wallet */
  interface NotifyHealthCertProps {
    version: string; // should be "1.0", "2.0"
    type: string; // should be "VAC", "ART", "PCR"
    url: string;
    expiry: number;// Epoch time
    uin: string;
    relationship?: string;// (Optional) should be "self", "child"
  }
  await notifyHealthCert(notifyHealthCertProps);

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
HEALTH_CERT_NOTIFICATION_TOPIC_ARN=arn:aws:sns:ap-southeast-1:000000000000:PLACEHOLDER_SNS_TOPIC
```

## Developers/Contributors

1. Develop on a separate branch.

2. Raise a PR.

3. Upon approval, "squash and merge" PR into `master` branch.

4. A new release will be automatically published by the workflow in GitHub Actions.
