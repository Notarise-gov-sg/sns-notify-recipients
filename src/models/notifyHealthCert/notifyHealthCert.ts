import { publish } from "../../services/sns";
import { getLogger } from "../../util/logger";

const { trace } = getLogger("src/models/notifyHealthCert");

interface NotifyHealthCertProps {
  url: string;
  expiry?: number;
}

export const notifyHealthCert = async ({ url, expiry }: NotifyHealthCertProps) => {
  const { MessageId } = await publish({
    notification_req: {
      url,
      expiry,
    },
  });
  trace(`Notification queued ${MessageId}`);
};
