import QrCode from "qrcode";
import { publish } from "../../services/sns";
import { getSpmTemplateV2V3, SpmPayload } from "../templates/pdt";
import { config } from "../../config";
import { getLogger } from "../../util/logger";
import { TestData } from "../../types";
import { isNRICValid } from "../../services/validateNRIC";

const { trace } = getLogger("src/models/notifyPdt");

interface NotifyPdtProps {
  url: string;
  nric?: string;
  passportNumber: string;
  testData: TestData[];
  validFrom: string;
}

export const notifyPdt = async ({ url, nric, passportNumber, testData, validFrom }: NotifyPdtProps) => {
  if (!isNRICValid(nric)) {
    trace("Skipping SPM notification");
    throw new Error("Skipped SPM notification for reasons mentioned above in isNRICValid()");
  }
  const qrCode = await QrCode.toBuffer(url);
  const qrCodeStr = `data:image/png;base64, ${qrCode.toString("base64")}`;
  const template = getSpmTemplateV2V3(qrCodeStr, passportNumber, testData, validFrom);
  const notification: SpmPayload = {
    notification_req: {
      uin: nric as string,
      channel_mode: "SPM",
      delivery: "IMMEDIATE",
      template_layout: [template],
      title: "Your notarised HealthCert is ready",
      sender_name: config.notification.senderName,
      sender_logo_small: config.notification.senderLogo,
      category: "MESSAGES",
      priority: "HIGH",
      cta: [
        {
          action_name: "View full cert",
          action_url: url,
          action_type: "HYPERLINK",
        },
      ],
    },
  };
  const { MessageId } = await publish(notification);
  trace(`Notification queued ${MessageId}`);
};
