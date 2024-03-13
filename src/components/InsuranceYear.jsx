import React, { useState } from "react";
import { Box, TextField, Grid, Popper } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

export default function InsuranceYear({ year, setYear }) {
  const handleYearChange = (event) => {
    if (event && event.$y) {
      setYear(dayjs().year(event.$y));
    } else {
      setYear(event);
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
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
        sx={{ margin: "10px", width: "150px" }}
      />
    </LocalizationProvider>
  );
}
