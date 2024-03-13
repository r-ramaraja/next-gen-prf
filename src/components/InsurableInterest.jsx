import React, { useState } from "react";
import { Box, TextField, Grid, InputAdornment } from "@mui/material";

export default function InsurableInterest({
  interest,
  setInterest,
  interestError,
  setInterestError,
}) {
  function isInvalidNumber(value, max, symbol = "%") {
    if (value.includes(".")) {
      return { hasError: true, errorMessage: "No Decimals" };
    }

    if (parseInt(value, 10) > max) {
      return { hasError: true, errorMessage: `Max ${max}${symbol}` };
    }

    return { hasError: false, errorMessage: "" };
  }

  const handleInterestChange = (event) => {
    setInterest(event.target.value, 100);
    setInterestError(isInvalidNumber(event.target.value, 100));
  };

  return (
    <TextField
      label="Insurable Interest"
      value={interest}
      onChange={handleInterestChange}
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
        inputProps: {
          min: 0,
          max: 100,
          onKeyDown: (event) => {
            if (event.key === "-") {
              event.preventDefault();
            }
          },
        },
      }}
      type="number"
      InputLabelProps={{
        shrink: true,
      }}
      style={{ width: "150px", margin: "10px" }}
      error={interestError.hasError}
      helperText={interestError.errorMessage}
    />
  );
}
