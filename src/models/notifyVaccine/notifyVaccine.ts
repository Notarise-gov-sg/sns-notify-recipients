import QrCode from "qrcode";
import { publish } from "../../services/sns";
import { getSpmTemplateV4, SpmPayload } from "../templates/vaccine";
import { config } from "../../config";
import { getLogger } from "../../util/logger";
import { Vaccination } from "../../types";

const { trace } = getLogger("src/models/notifyRecipient");

interface NotifyVaccineProps {
  name: string;
  url: string;
  nric?: string;
  passportNumber: string;
  vaccinations: Vaccination[];
  validFrom: string;
  vaccinationEffectiveDate: string;
}

export const notifyVaccine = async ({
  name,
  url,
  nric,
  passportNumber,
  vaccinations,
  validFrom,
  vaccinationEffectiveDate,
}: NotifyVaccineProps) => {
  if (!nric) {
    trace("Skipping SPM notification as the cert doesnt contain an NRIC");
    return;
  }
  const qrCode = await QrCode.toBuffer(url);
  const qrCodeStr = `data:image/png;base64, ${qrCode.toString("base64")}`;
  const template = getSpmTemplateV4(name, qrCodeStr, passportNumber, vaccinations, validFrom, vaccinationEffectiveDate);
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
