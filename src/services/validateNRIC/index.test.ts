import { isNRICValid } from ".";

describe("test isNRICValid()", () => {
  it("isNRICValid() should return false if nric is null", () => {
    const nric: string | null = null;
    expect(isNRICValid(nric)).toBe(false);
  });

  it("isNRICValid() should return false if nric does not start with  S/T/F/G/M", () => {
    const nric: string | null = "A9377138I";
    expect(isNRICValid(nric)).toBe(false);
  });

  it("isNRICValid() should return false if checksum fails", () => {
    const nric: string | null = "T1234567A";
    expect(isNRICValid(nric)).toBe(false);
  });
});
