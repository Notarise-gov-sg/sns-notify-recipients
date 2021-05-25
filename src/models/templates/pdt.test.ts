import { getSpmTemplateV2V3 } from "./pdt";
import { TestData } from "../../types";

const mockTestData: TestData = {
  patientName: "Person",
  swabCollectionDate: "testdatetime1",
  testType: "test1",
  testResult: "Negative",
};

describe("notifyPdt", () => {
  it("should create the right template message for SAFETRAVEL-QR-NTF-02 (if there is 1 test)", async () => {
    expect(getSpmTemplateV2V3("somestring", "E7831177G", [mockTestData], "2020-11-16T06:26:19.160Z")).toStrictEqual({
      template_id: "SAFETRAVEL-QR-NTF-02",
      template_input: {
        date: "2020-11-16T06:26:19.160Z",
        name: "Person",
        passport: "E7831177G",
        qrcode: "somestring",
        testdatetime: "testdatetime1",
        testresult: "Negative",
        testtype: "test1",
        title: "COVID-19 HEALTHCERT",
      },
    });
  });

  it("should create the right template message for SAFETRAVEL-QR-NTF-03 (if there are 2 tests)", async () => {
    expect(
      getSpmTemplateV2V3(
        "somestring",
        "E7831177G",
        [
          {
            ...mockTestData,
            testType: "Reverse transcription polymerase chain reaction (rRT-PCR) test",
            testResult: "Negative",
          },
          {
            ...mockTestData,
            swabCollectionDate: "testdatetime2",
            testType: "Reverse transcription polymerase chain reaction (rRT-PCR) test 2",
            testResult: "Negative",
          },
        ],
        "2020-11-16T06:26:19.160Z"
      )
    ).toStrictEqual({
      template_id: "SAFETRAVEL-QR-NTF-03",
      template_input: {
        date: "2020-11-16T06:26:19.160Z",
        passport: "E7831177G",
        qrcode: "somestring",
        name: "Person",
        testdatetime: "testdatetime1",
        testresult: "Negative",
        testtype: "Reverse transcription polymerase chain reaction (rRT-PCR) test",
        testdatetime2: "testdatetime2",
        testresult2: "Negative",
        testtype2: "Reverse transcription polymerase chain reaction (rRT-PCR) test 2",
        title: "COVID-19 HEALTHCERT",
      },
    });
  });
});
