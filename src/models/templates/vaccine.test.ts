import { getSpmTemplateV4 } from "./vaccine";
import { Vaccination } from "../../types";

const mockVaccination: Vaccination = {
  vaccineCode: "vaccineCode",
  vaccineName: "vaccineName",
  vaccineLot: "vaccineLot",
  vaccinationDateTime: "2020-11-16T06:26:19.160Z",
  vaccinationLocationCode: "vaccinationLocationCode",
  vaccinationCountry: "Singapore",
};

describe("notifyVaccine", () => {
  it("should create the right template message for SAFETRAVEL-QR-NTF-04", async () => {
    expect(
      getSpmTemplateV4("Person", "somestring", "E7831177G", [mockVaccination], "2021-04-01T00:00:00.000Z")
    ).toStrictEqual({
      template_id: "SAFETRAVEL-QR-NTF-04",
      template_input: {
        qrissuedts: "2021-04-01T00:00:00.000Z",
        qrexpiryts: "2021-04-15T00:00:00.000Z",
        name: "Person",
        travelpassport: "E7831177G",
        vaccname: mockVaccination.vaccineName,
        vaccdate: mockVaccination.vaccinationDateTime,
        qrcode: "somestring",
      },
    });
  });
});
