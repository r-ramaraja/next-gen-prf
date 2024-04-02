// eslint-disable-next-line no-undef
export const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:5001/api/v1";

export const intervalCodes = [625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635];

export const currencyFormatter = (value) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
