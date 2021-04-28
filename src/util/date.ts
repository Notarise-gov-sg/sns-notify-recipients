import { add } from "date-fns";
import { utcToZonedTime, format } from "date-fns-tz";
import { config } from "../config";

const pattern = "d MMMM yyyy";
const timeZone = "Asia/Singapore";

/**
 * Converts a Date object to a formatted date string (in SGT).
 * @example
 * dateToStr(new Date("2021-03-31T16:01:00.000Z")); // "1 April 2021"
 * @returns {string} Returns date format in d MMMM yyy.
 */
const dateToStr = (date: Date): string => {
  const zonedDate = utcToZonedTime(date, timeZone);
  return format(zonedDate, pattern);
};

/**
 * Calculate expiry date from a given Date object.
 * Validity duration is obtained from config.vaccination.validityInDays.
 * @example
 * calcExpiry(new Date("2021-03-31T16:01:00.000Z"));
 * // 1 Apr 2021 + 14 days = 15 April 2021 (SGT)
 * @returns {Date} Returns the expiry date.
 */
const calcExpiry = (startDate: Date): Date => {
  const { validityInDays } = config.vaccination;

  return add(startDate, { days: validityInDays });
};

export { dateToStr, calcExpiry };
