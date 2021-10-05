import { notifyHealthCert } from "./notifyHealthCert";
import { publishHealthCert } from "../../services/sns";

jest.mock("../../services/sns");
jest.mock("../../config", () => ({
  config: {
    documentName: "HealthCert",
    notification: {
      enabled: true,
      senderName: "NOTARISE",
      senderLogo: "",
      templateID: "000",
      sns: {
        region: "ap-southeast-1",
        endpoint: {
          protocol: "http:",
          host: "localhost:4566",
          port: 4566,
          hostname: "localhost",
          pathname: "/",
          path: "/",
          href: "http://localhost:4566/",
        },
      },
      topicArn: "arn:aws:sns:ap-southeast-1:000000000000:PLACEHOLDER_SNS_TOPIC",
    },
  },
}));

const mockPublishHealthCert = publishHealthCert as jest.Mock;

describe("notifyPdt", () => {
  beforeEach(() => {
    mockPublishHealthCert.mockReset();
  });
  it("should send the right SPM notification if healthcert contains an NRIC", async () => {
    mockPublishHealthCert.mockResolvedValue({ MessageId: "foobar" });
    await notifyHealthCert({
      version: "1.0",
      type: "VAC",
      url: "https://foo.bar/uuid",
      expiry: 1631605597,
      uin: "S3100052A"
    });
    expect(mockPublishHealthCert.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "notification_req": Object {
            "expiry": 1631605597,
            "relationship": undefined,
            "type": "VAC",
            "uin": "S3100052A",
            "url": "https://foo.bar/uuid",
            "version": "1.0",
          },
        },
      ]
    `);
  });
});
