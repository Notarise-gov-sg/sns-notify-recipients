import QrCode from "qrcode";
import { publish } from "../../services/sns";
import { getSpmTemplateV4, SpmPayload } from "../templates/vaccine";
import { config } from "../../config";
import { getLogger } from "../../util/logger";
import { Vaccination } from "../../types";
import { isNRICValid } from "../../services/validateNRIC";

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
  if (!isNRICValid(nric)) {
    trace("Skipping SPM notification");
    throw new Error("NRIC is invalid");
  }

  const qrCode = await QrCode.toBuffer(url);
  const qrCodeStr = `data:image/png;base64, ${qrCode.toString("base64")}`;
  const template = getSpmTemplateV4(name, qrCodeStr, passportNumber, vaccinations, validFrom, vaccinationEffectiveDate);
  const notification: SpmPayload = {
    notification_req: {
      uin: nric as string,
      channel_mode: "SPM",
      delivery: "IMMEDIATE",
      template_layout: [template],
      title: "COVID-19 Vaccination (Verified copy)",
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
