import NRIC from "nric";
import healthcertWithNric from "../../../test/fixtures/example_notarized_healthcert_with_nric_wrapped.json";
import { notifyPdt } from "./notifyPdt";
import { publish } from "../../services/sns";
import { TestData } from "../../types";

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

const nric = NRIC.generateNRIC();

const mockPublish = publish as jest.Mock;
const mockTestData: TestData = {
  patientName: "Person",
  swabCollectionDate: "testdatetime1",
  testType: "test1",
  testResult: "Negative",
};

describe("notifyPdt", () => {
  beforeEach(() => {
    mockPublish.mockReset();
  });
  it("should send the right SPM notification if healthcert contains an NRIC", async () => {
    mockPublish.mockResolvedValue({ MessageId: "foobar" });
    await notifyPdt({
      validFrom: "2020-11-16T06:26:19.160Z",
      url: "https://foo.bar/uuid",
      nric,
      passportNumber: "E7831177G",
      testData: [mockTestData],
    });
    expect(mockPublish.mock.calls[0]).toMatchInlineSnapshot(`
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
                "template_id": "SAFETRAVEL-QR-NTF-02",
                "template_input": Object {
                  "date": "2020-11-16T06:26:19.160Z",
                  "name": "Person",
                  "passport": "E7831177G",
                  "qrcode": "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAN2SURBVO3BQa7cVgADweaD7n/ljhdZcCVAGP2x47Aq/sLMvw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPl4kNJ+CaVO0loKneS0FRaEppKS0JTaUn4JpVPHGbKYaYcZsrFy1TelIQnVFoS7qg8kYRPqLwpCW86zJTDTDnMlIsfloQnVJ5Iwh2VloSWhKbyTUl4QuUnHWbKYaYcZsrFXy4JTyTh/+wwUw4z5TBTLv4yKk8k4Y7KnST8TQ4z5TBTDjPl4oepfFMSmsoTKneS8CaVP8lhphxmymGmXLwsCb+TSktCU3kiCU2lJeGJJPzJDjPlMFMOM+XiQyr/ZSo/SeW/5DBTDjPlMFMuPpSEptKS8CaVptKS0FSeSMITKneS8CaVn3SYKYeZcpgpFx9SaUloKi0JT6i8KQl3VN6k0pLQVJ5IQlN502GmHGbKYabEX/hAEprKm5LQVL4pCXdUWhKayp0k3FFpSbij8onDTDnMlMNMufhhSXhCpancSUJTaUloKk+ovCkJTeUJlZaENx1mymGmHGbKxQ9TaUloKi0Jd1R+pyQ8kYSm0pLQVFoSvukwUw4z5TBTLl6WhKbyCZWWhDtJaCp3knBHpam0JDSVO0loKi0JTaUloam86TBTDjPlMFPiL3wgCU2lJeGbVD6RhDeptCQ8odKScEflE4eZcpgph5ly8cNUnkhCU/lEEppKS8IdlZaEptKS8AmVOyotCW86zJTDTDnMlIsvS8ITSWgqLQlN5RMqLQl3knAnCZ9IQlNpKm86zJTDTDnMlIsPqTyh8idRuaPSknBH5YkktCQ0lW86zJTDTDnMlIsPJeGbVJrKE0m4o3JHpSXhThKayh2VloQnVD5xmCmHmXKYKRcvU3lTEu4koak8oXInCU3lCZUnktBU7iThTYeZcpgph5ly8cOS8ITKm1RaEp5QaUm4k4RPqLQkfNNhphxmymGmXPzPqLQkvEmlJaGptCS0JPxOh5lymCmHmXLxP6fSkvCEyh2VOyotCXdUWhLedJgph5lymCkXP0zlJ6l8Igl3VFoSWhLuqLQkPKHyTYeZcpgph5ly8bIkfFMS7qg8odKS0FS+KQnfdJgph5lymCnxF2b+dZgph5lymCmHmXKYKYeZcpgph5lymCmHmXKYKYeZcpgph5lymCn/AGM6fxRnfplxAAAAAElFTkSuQmCC",
                  "testdatetime": "testdatetime1",
                  "testresult": "Negative",
                  "testtype": "test1",
                  "title": "COVID-19 HEALTHCERT",
                },
              },
            ],
            "title": "Your notarised HealthCert is ready",
            "uin": "${nric}",
          },
        },
      ]
    `);
  });
  it("should skip sending an SPM notification if healthcert does not contain an NRIC", async () => {
    const healthcertWithoutNric = {
      ...healthcertWithNric,
    } as any;
    const passportNumberIdentifier = healthcertWithoutNric.data.fhirBundle.entry[0].identifier[0];
    // remove nric identifier
    healthcertWithoutNric.data.fhirBundle.entry[0].identifier = [passportNumberIdentifier];

    await expect(
      notifyPdt({
        validFrom: "2020-11-16T06:26:19.160Z",
        url: "https://foo.bar/uuid",
        passportNumber: "E7831177G",
        testData: [
          mockTestData,
          {
            ...mockTestData,
            swabCollectionDate: "testdatetime2",
            testType: "test2",
          },
        ],
      })
    ).rejects.toThrow("Skipped SPM notification for reasons mentioned above in isNRICValid()");

    expect(mockPublish).not.toHaveBeenCalled();
  });

  it("should skip sending an SPM notification if nric fails checksum", async () => {
    mockPublish.mockResolvedValue({ MessageId: "foobar" });
    await expect(
      notifyPdt({
        validFrom: "2020-11-16T06:26:19.160Z",
        url: "https://foo.bar/uuid",
        nric: "T1234567A",
        passportNumber: "E7831177G",
        testData: [mockTestData],
      })
    ).rejects.toThrow("Skipped SPM notification for reasons mentioned above in isNRICValid()");
    expect(mockPublish).not.toHaveBeenCalled();
  });

  it("should create the right notification message if there are 2 tests", async () => {
    mockPublish.mockResolvedValue({ MessageId: "foobar" });
    await notifyPdt({
      validFrom: "2020-11-16T06:26:19.160Z",
      url: "https://foo.bar/uuid",
      nric,
      passportNumber: "E7831177G",
      testData: [
        mockTestData,
        {
          ...mockTestData,
          swabCollectionDate: "testdatetime2",
          testType: "test2",
        },
      ],
    });
    expect(mockPublish.mock.calls[0]).toMatchInlineSnapshot(`
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
                "template_id": "SAFETRAVEL-QR-NTF-03",
                "template_input": Object {
                  "date": "2020-11-16T06:26:19.160Z",
                  "name": "Person",
                  "passport": "E7831177G",
                  "qrcode": "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAN2SURBVO3BQa7cVgADweaD7n/ljhdZcCVAGP2x47Aq/sLMvw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPl4kNJ+CaVO0loKneS0FRaEppKS0JTaUn4JpVPHGbKYaYcZsrFy1TelIQnVFoS7qg8kYRPqLwpCW86zJTDTDnMlIsfloQnVJ5Iwh2VloSWhKbyTUl4QuUnHWbKYaYcZsrFXy4JTyTh/+wwUw4z5TBTLv4yKk8k4Y7KnST8TQ4z5TBTDjPl4oepfFMSmsoTKneS8CaVP8lhphxmymGmXLwsCb+TSktCU3kiCU2lJeGJJPzJDjPlMFMOM+XiQyr/ZSo/SeW/5DBTDjPlMFMuPpSEptKS8CaVptKS0FSeSMITKneS8CaVn3SYKYeZcpgpFx9SaUloKi0JT6i8KQl3VN6k0pLQVJ5IQlN502GmHGbKYabEX/hAEprKm5LQVL4pCXdUWhKayp0k3FFpSbij8onDTDnMlMNMufhhSXhCpancSUJTaUloKk+ovCkJTeUJlZaENx1mymGmHGbKxQ9TaUloKi0Jd1R+pyQ8kYSm0pLQVFoSvukwUw4z5TBTLl6WhKbyCZWWhDtJaCp3knBHpam0JDSVO0loKi0JTaUloam86TBTDjPlMFPiL3wgCU2lJeGbVD6RhDeptCQ8odKScEflE4eZcpgph5ly8cNUnkhCU/lEEppKS8IdlZaEptKS8AmVOyotCW86zJTDTDnMlIsvS8ITSWgqLQlN5RMqLQl3knAnCZ9IQlNpKm86zJTDTDnMlIsPqTyh8idRuaPSknBH5YkktCQ0lW86zJTDTDnMlIsPJeGbVJrKE0m4o3JHpSXhThKayh2VloQnVD5xmCmHmXKYKRcvU3lTEu4koak8oXInCU3lCZUnktBU7iThTYeZcpgph5ly8cOS8ITKm1RaEp5QaUm4k4RPqLQkfNNhphxmymGmXPzPqLQkvEmlJaGptCS0JPxOh5lymCmHmXLxP6fSkvCEyh2VOyotCXdUWhLedJgph5lymCkXP0zlJ6l8Igl3VFoSWhLuqLQkPKHyTYeZcpgph5ly8bIkfFMS7qg8odKS0FS+KQnfdJgph5lymCnxF2b+dZgph5lymCmHmXKYKYeZcpgph5lymCmHmXKYKYeZcpgph5lymCn/AGM6fxRnfplxAAAAAElFTkSuQmCC",
                  "testdatetime": "testdatetime1",
                  "testdatetime2": "testdatetime2",
                  "testresult": "Negative",
                  "testresult2": "Negative",
                  "testtype": "test1",
                  "testtype2": "test2",
                  "title": "COVID-19 HEALTHCERT",
                },
              },
            ],
            "title": "Your notarised HealthCert is ready",
            "uin": "${nric}",
          },
        },
      ]
    `);
  });
});
