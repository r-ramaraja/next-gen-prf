// eslint-disable-next-line no-undef
export const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:5001/api/v1";

export const intervalCodes = [625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635];

export const coverageLevelValues = [0.7, 0.75, 0.8, 0.85, 0.9];

export const monthRanges = [
  "Jan-Feb",
  "Feb-Mar",
  "Mar-Apr",
  "Apr-May",
  "May-Jun",
  "Jun-Jul",
  "Jul-Aug",
  "Aug-Sep",
  "Sep-Oct",
  "Oct-Nov",
  "Nov-Dec",
];

export const intervalMap = {
  "Jan-Feb": 625,
  "Feb-Mar": 626,
  "Mar-Apr": 627,
  "Apr-May": 628,
  "May-Jun": 629,
  "Jun-Jul": 630,
  "Jul-Aug": 631,
  "Aug-Sep": 632,
  "Sep-Oct": 633,
  "Oct-Nov": 634,
  "Nov-Dec": 635,
};

export const currencyFormatter = (value) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
