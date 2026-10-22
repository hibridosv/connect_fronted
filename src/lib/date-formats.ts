import { DateTime } from "luxon";

export const formatDate = (date: Date | string| null) =>
  !date ? "" : new Date(date).toLocaleDateString();

export const formatTime = (date: Date | string| null) =>
  !date ? "" : new Date(date).toLocaleTimeString();

export const getDateFromStringOrDate = (date: Date | string): Date => {
  if (typeof date === "string") {
    return new Date(date);
  }
  return date;
};

export const formatDateAsDMY = (date: Date | string): string => {
  date = getDateFromStringOrDate(date);
  return DateTime.fromJSDate(date).toFormat("dd-LL-yyyy");
};

export const formatDateAsDDMonthYY = (date: Date): string => {
  return DateTime.fromJSDate(date).toFormat("dd LLL yyyy");
};

export const formatHourAsHM = (date: Date | string): string => {
  date = getDateFromStringOrDate(date);
  return DateTime.fromJSDate(date).toFormat("HH:mm");
};

export const formatDateAsNumber = (date: Date | string): string => {
  date = getDateFromStringOrDate(date);
  return DateTime.fromJSDate(date).toFormat("yyyyLLddHH");
};
