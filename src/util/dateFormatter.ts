import { utcToZonedTime, format } from "date-fns-tz";

const pattern = "d MMM yyyy";
const timeZone = "Asia/Singapore";

/**
 * Converts a Date object to a formatted date string (in SGT).
 * @example
 * dateToStr(new Date("2021-03-31T16:01:00.000Z")); // "1 Apr 2021"
 * @returns {string} Returns date format in d MMM yyy.
 */
const dateToStr = (date: Date): string => {
  const zonedDate = utcToZonedTime(date, timeZone);
  return format(zonedDate, pattern);
};

export { dateToStr };
