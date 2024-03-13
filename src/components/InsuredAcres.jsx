import React, { useState } from "react";
import { Box, TextField, Grid } from "@mui/material";

export default function InsuredAcres({ acres, setAcres, acresError, setAcresError }) {
  function isInvalidNumber(value, max, symbol = "%") {
    if (value.includes(".")) {
      return { hasError: true, errorMessage: "No Decimals" };
    }

    if (parseInt(value, 10) > max) {
      return { hasError: true, errorMessage: `Max ${max}${symbol}` };
    }

    return { hasError: false, errorMessage: "" };
  }

  const handleAcresChange = (event) => {
    setAcres(event.target.value);
    setAcresError(isInvalidNumber(event.target.value, 200000, ""));
  };

  return (
    <TextField
      label="Acres"
      value={acres}
      onChange={handleAcresChange}
      margin="normal"
      InputProps={{
        inputProps: {
          min: 0,
          max: 200000,
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
      error={acresError.hasError}
      helperText={acresError.errorMessage}
    />
  );
}
