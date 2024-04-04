import React from "react";
import { TextField, Popper, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

export default function InsuranceYear({ id, tabState, setTabState, isGuided }) {
  const { year } = tabState;

  const handleYearChange = (event) => {
    if (event && event.$y) {
      setTabState(
        {
          ...tabState,
          year: dayjs().year(event.$y),
        },
        id
      );
    } else {
      setTabState(
        {
          ...tabState,
          year: event,
        },
        id
      );
    }
  };
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          key={"insuranceYear" + id}
          label={"Year"}
          views={["year"]}
          minDate={dayjs().year("2007")}
          maxDate={dayjs().subtract(1, "year")}
          value={year}
          onChange={handleYearChange}
          slots={{
            textField: (params) => (
              <TextField
                {...params}
                margin="normal"
                style={{ width: "150px" }}
                InputProps={{ ...params.InputProps, readOnly: true }}
              />
            ),
            popper: ({ style, ...popperProps }) => (
              <Popper {...popperProps} style={{ ...style, position: "fixed" }} />
            ),
          }}
          sx={{ width: "150px" }}
        />
      </LocalizationProvider>
      {isGuided && (
        <Box>
          <p>
            <span style={{ textDecoration: "underline" }}>
              <strong>Definition</strong>
            </span>
          </p>
          <p>
            A <em>sample year</em> is the specific year selected as a representative point of
            reference for evaluating the insurance outcome.
            <br />
            Policyholders can use data from <em>sample years</em> to make informed decisions about
            the level of coverage they need based on past trends and patterns.
          </p>
          <p>
            <span style={{ textDecoration: "underline" }}>
              <strong>Impact</strong>
            </span>
          </p>
          When a policyholder selects a <em>sample year</em>, they choose a reference point
          representing a specific year&apos;s rainfall pattern.
          <br />
          The rainfall index from the selected <em>sample year</em> is used to estimate indemnities.
          If the actual rainfall index falls below the<em> coverage level</em> in the{" "}
          <em>sample year</em>, it will trigger an indemnity.
        </Box>
      )}
    </Box>
  );
}
