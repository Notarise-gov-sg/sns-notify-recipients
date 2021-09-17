import { publish } from "../../services/sns";
import { getLogger } from "../../util/logger";

const { trace } = getLogger("src/models/notifyHealthCert");

interface NotifyHealthCertProps {
  version: string;
  type: string;
  url: string;
  expiry: number;
}

export const notifyHealthCert = async ({ version, type, url, expiry }: NotifyHealthCertProps) => {
  const { MessageId } = await publish({
    notification_req: {
      version,
      type,
      url,
      expiry,
    },
  });
  trace(`Notification queued ${MessageId}`);
};
