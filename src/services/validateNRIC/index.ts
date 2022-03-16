import NRIC from "nric";

import { getLogger } from "../../util/logger";

const { error } = getLogger("src/notifyRecipient/nricValidation");

export const isNRICValid = (nric: string | null | undefined): boolean => {
  if (nric == null) {
    error("cert doesnt contain an NRIC");
    return false;
  }
  // nric must start with  S/T/F/G/M
  // the nric lib is less restrictive
  const regex = /[STFGM]\w+/;
  if (regex.test(nric) === false) {
    error("NRIC does not start with  S/T/F/G/M");
    return false;
  }

  // checksum
  if (NRIC.validate(nric) === false) {
    error("checksum failed");
    return false;
  }
  return true;
};
