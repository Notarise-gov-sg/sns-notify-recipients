import Intl from "intl";
import { config } from "../config";

/**
 * Converts a Date object to a formatted date string (in SGT).
 * @example
 * dateToStr(new Date("2021-03-31T16:01:00.000Z")); // "1 April 2021"
 * @returns {string} Returns date format in d MMMM yyy.
 */
const dateToStr = (date: Date): string => {
  const dateFormatter = new Intl.DateTimeFormat("en-SG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return dateFormatter.format(date);
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

  const newDate = new Date(startDate);
  newDate.setDate(newDate.getDate() + validityInDays);

  return newDate;
};

export { dateToStr, calcExpiry };
