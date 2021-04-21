/* eslint-disable camelcase */
/* copied from https://github.com/Notarise-gov-sg/api-notify/blob/master/src/model/notification/index.ts */
import { Static, String, Literal, Array, Record, Union } from "runtypes";
import { Vaccination } from "../../types";
import { config } from "../../config";
import { dateFormatter } from "../../util/dateFormatter";

const channel_mode = Union(Literal("SPM"), Literal("SPMORSMS"));
const delivery = Union(Literal("IMMEDIATE"), Literal("SCHEDULE"));

const templateInputV4 = Record({
  qrissuedts: String,
  qrexpiryts: String,
  name: String,
  travelpassport: String,
  vaccname: String,
  vaccdate: String,
  qrcode: String, // base64 qrcode content
});

const templateV4 = Record({
  template_id: Literal("SAFETRAVEL-QR-NTF-04"),
  template_input: templateInputV4,
});
const template_layout = Array(Union(templateV4));

const cta = Record({
  action_name: String,
  action_url: String,
  action_type: String,
});
const title = String;
const sender_name = String;
const sender_logo_small = String; // URL of logo
const category = Literal("MESSAGES");
const priority = Literal("HIGH");
const uin = String; // NRIC or FIN
const notification_req = Record({
  uin,
  channel_mode,
  delivery,
  template_layout,
  cta: Array(cta),
  title,
  sender_name,
  sender_logo_small,
  category,
  priority,
});

const spmPayloadDef = Record({
  notification_req,
});

export type SpmPayload = Static<typeof spmPayloadDef>;

type SpmTemplate = Static<typeof templateV4>;

export const getSpmTemplateV4 = (
  name: string,
  qrCode: string,
  passportNumber: string,
  vaccinations: Vaccination[],
  validFrom: string,
  vaccinationEffectiveDate: string
): SpmTemplate => {
  const { validityInDays } = config.vaccination;

  const issuedts = new Date(validFrom);
  const expiryts = new Date(validFrom);
  expiryts.setDate(expiryts.getDate() + validityInDays);

  const vaccdate = new Date(vaccinationEffectiveDate);

  return {
    template_id: "SAFETRAVEL-QR-NTF-04",
    template_input: {
      qrissuedts: dateFormatter.format(issuedts),
      qrexpiryts: dateFormatter.format(expiryts),
      name,
      travelpassport: passportNumber,
      vaccname: vaccinations[0].vaccineName,
      vaccdate: dateFormatter.format(vaccdate),
      qrcode: qrCode,
    },
  };
};
