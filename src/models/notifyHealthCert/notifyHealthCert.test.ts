import { notifyHealthCert } from "./notifyHealthCert";
import { publish } from "../../services/sns";

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

const mockPublish = publish as jest.Mock;

describe("notifyPdt", () => {
  beforeEach(() => {
    mockPublish.mockReset();
  });
  it("should send the right SPM notification if healthcert contains an NRIC", async () => {
    mockPublish.mockResolvedValue({ MessageId: "foobar" });
    await notifyHealthCert({
      url: "https://foo.bar/uuid",
      expiry: 1631605597,
    });
    expect(mockPublish.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "notification_req": Object {
            "expiry": 1631605597,
            "url": "https://foo.bar/uuid",
          },
        },
      ]
    `);
  });
});
