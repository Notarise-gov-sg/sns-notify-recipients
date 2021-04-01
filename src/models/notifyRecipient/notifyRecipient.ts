import QrCode from "qrcode";
import { publish } from "../../services/sns";
import { getSpmTemplateInput, SpmPayload } from "./notification";
import { config } from "../../config";
import { getLogger } from "../../util/logger";
import { TestData } from "../../types";

const { trace } = getLogger("src/models/notifyRecipient");

interface NotifyRecipientProps {
  url: string;
  nric?: string;
  passportNumber: string;
  testData: TestData[];
  validFrom: string;
}

export const notifyRecipient = async ({ url, nric, passportNumber, testData, validFrom }: NotifyRecipientProps) => {
  if (!nric) {
    trace("Skipping SPM notification as the cert doesnt contain an NRIC");
    return;
  }
  const qrCode = await QrCode.toBuffer(url);
  const qrCodeStr = `data:image/png;base64, ${qrCode.toString("base64")}`;
  const template = getSpmTemplateInput(qrCodeStr, passportNumber, testData, validFrom);
  const notification: SpmPayload = {
    notification_req: {
      uin: nric,
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
