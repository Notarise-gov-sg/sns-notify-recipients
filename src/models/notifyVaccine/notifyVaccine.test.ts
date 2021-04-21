import { notifyVaccine } from "./notifyVaccine";
import { publish } from "../../services/sns";
import { Vaccination } from "../../types";

jest.mock("../../services/sns");
jest.mock("../../config", () => ({
  config: {
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
    vaccination: {
      validityInDays: 14,
    },
  },
}));

const mockPublish = publish as jest.Mock;
const mockVaccination: Vaccination = {
  vaccineCode: "vaccineCode",
  vaccineName: "vaccineName",
  vaccineLot: "vaccineLot",
  vaccinationDateTime: "2020-11-16T06:26:19.160Z",
  vaccinationLocationCode: "vaccinationLocationCode",
  vaccinationCountry: "Singapore",
};

describe("notifyVaccine", () => {
  beforeEach(() => {
    mockPublish.mockReset();
  });
  it("should send the right SPM notification if healthcert contains an NRIC", async () => {
    mockPublish.mockResolvedValue({ MessageId: "foobar" });
    await notifyVaccine({
      name: "Person",
      validFrom: "2021-04-01T00:00:00.000Z",
      url: "https://foo.bar/uuid",
      nric: "S9098989Z",
      passportNumber: "E7831177G",
      vaccinations: [mockVaccination],
      vaccinationEffectiveDate: "2021-04-01T08:00:00.000Z",
    });
    expect(mockPublish.mock.calls[0]).toMatchInlineSnapshot(
      `
      Array [
        Object {
          "notification_req": Object {
            "category": "MESSAGES",
            "channel_mode": "SPM",
            "cta": Array [
              Object {
                "action_name": "View full cert",
                "action_type": "HYPERLINK",
                "action_url": "https://foo.bar/uuid",
              },
            ],
            "delivery": "IMMEDIATE",
            "priority": "HIGH",
            "sender_logo_small": "",
            "sender_name": "NOTARISE",
            "template_layout": Array [
              Object {
                "template_id": "SAFETRAVEL-QR-NTF-04",
                "template_input": Object {
                  "name": "Person",
                  "qrcode": "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAN2SURBVO3BQa7cVgADweaD7n/ljhdZcCVAGP2x47Aq/sLMvw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPl4kNJ+CaVO0loKneS0FRaEppKS0JTaUn4JpVPHGbKYaYcZsrFy1TelIQnVFoS7qg8kYRPqLwpCW86zJTDTDnMlIsfloQnVJ5Iwh2VloSWhKbyTUl4QuUnHWbKYaYcZsrFXy4JTyTh/+wwUw4z5TBTLv4yKk8k4Y7KnST8TQ4z5TBTDjPl4oepfFMSmsoTKneS8CaVP8lhphxmymGmXLwsCb+TSktCU3kiCU2lJeGJJPzJDjPlMFMOM+XiQyr/ZSo/SeW/5DBTDjPlMFMuPpSEptKS8CaVptKS0FSeSMITKneS8CaVn3SYKYeZcpgpFx9SaUloKi0JT6i8KQl3VN6k0pLQVJ5IQlN502GmHGbKYabEX/hAEprKm5LQVL4pCXdUWhKayp0k3FFpSbij8onDTDnMlMNMufhhSXhCpancSUJTaUloKk+ovCkJTeUJlZaENx1mymGmHGbKxQ9TaUloKi0Jd1R+pyQ8kYSm0pLQVFoSvukwUw4z5TBTLl6WhKbyCZWWhDtJaCp3knBHpam0JDSVO0loKi0JTaUloam86TBTDjPlMFPiL3wgCU2lJeGbVD6RhDeptCQ8odKScEflE4eZcpgph5ly8cNUnkhCU/lEEppKS8IdlZaEptKS8AmVOyotCW86zJTDTDnMlIsvS8ITSWgqLQlN5RMqLQl3knAnCZ9IQlNpKm86zJTDTDnMlIsPqTyh8idRuaPSknBH5YkktCQ0lW86zJTDTDnMlIsPJeGbVJrKE0m4o3JHpSXhThKayh2VloQnVD5xmCmHmXKYKRcvU3lTEu4koak8oXInCU3lCZUnktBU7iThTYeZcpgph5ly8cOS8ITKm1RaEp5QaUm4k4RPqLQkfNNhphxmymGmXPzPqLQkvEmlJaGptCS0JPxOh5lymCmHmXLxP6fSkvCEyh2VOyotCXdUWhLedJgph5lymCkXP0zlJ6l8Igl3VFoSWhLuqLQkPKHyTYeZcpgph5ly8bIkfFMS7qg8odKS0FS+KQnfdJgph5lymCnxF2b+dZgph5lymCmHmXKYKYeZcpgph5lymCmHmXKYKYeZcpgph5lymCn/AGM6fxRnfplxAAAAAElFTkSuQmCC",
                  "qrexpiryts": "2021-04-15T00:00:00.000Z",
                  "qrissuedts": "2021-04-01T00:00:00.000Z",
                  "travelpassport": "E7831177G",
                  "vaccdate": "2021-04-01T08:00:00.000Z",
                  "vaccname": "vaccineName",
                },
              },
            ],
            "title": "Your notarised HealthCert is ready",
            "uin": "S9098989Z",
          },
        },
      ]
    `
    );
  });

  it("should skip sending an SPM notification if healthcert does not contain an NRIC", async () => {
    await notifyVaccine({
      name: "Person",
      validFrom: "2021-04-01T00:00:00.000Z",
      url: "https://foo.bar/uuid",
      passportNumber: "E7831177G",
      vaccinations: [mockVaccination],
    });
    expect(mockPublish).not.toHaveBeenCalled();
  });
});
