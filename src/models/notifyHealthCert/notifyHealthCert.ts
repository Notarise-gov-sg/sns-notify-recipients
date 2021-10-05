import { publishHealthCert } from "../../services/sns";
import { getLogger } from "../../util/logger";

const { trace } = getLogger("src/models/notifyHealthCert");

interface NotifyHealthCertProps {
  uin: string;
  version: string;
  type: string;
  url: string;
  expiry: number;
  relationship?: string;
}

export const notifyHealthCert = async ({ uin, version, type, url, expiry, relationship }: NotifyHealthCertProps) => {
  const { MessageId } = await publishHealthCert({
    notification_req: {
      uin,
      version,
      type,
      url,
      expiry,
      relationship
    },
  });
  trace(`Notification queued ${MessageId}`);
};
