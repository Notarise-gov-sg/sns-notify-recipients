import { getSpmTemplateV4 } from "./vaccine";
import { Vaccination } from "../../types";

const mockVaccination: Vaccination = {
  vaccineName: "vaccineName",
};

describe("notifyVaccine", () => {
  it("should create the right template message for SAFETRAVEL-QR-NTF-04", async () => {
    expect(
      getSpmTemplateV4(
        "Person",
        "somestring",
        "E7831177G",
        [mockVaccination],
        "2021-03-31T16:01:00.000Z",
        "2021-03-31T16:01:00.000Z"
      )
    ).toStrictEqual({
      template_id: "SAFETRAVEL-QR-NTF-04",
      template_input: {
        qrissuedts: "1 April 2021",
        qrexpiryts: "Not Applicable",
        name: "Person",
        travelpassport: "E7831177G",
        vaccname: mockVaccination.vaccineName,
        vaccdate: "1 April 2021",
        qrcode: "somestring",
      },
    });
  });
});
