import React, { useState } from "react";
import { Box, TextField, Grid, Typography, InputAdornment } from "@mui/material";

export default function IntervalDistribution({
  monthlyValues,
  setMonthlyValues,
  monthlyErrors,
  setMonthlyErrors,
  standalone,
}) {
  const monthRanges = [
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

  function isInvalidNumber(value, max, symbol = "%") {
    if (value.includes(".")) {
      return { hasError: true, errorMessage: "No Decimals" };
    }

    if (parseInt(value, 10) > max) {
      return { hasError: true, errorMessage: `Max ${max}${symbol}` };
    }

    return { hasError: false, errorMessage: "" };
  }

  const handleMonthlyValueChange = (index, event) => {
    const newValues = [...monthlyValues];
    const newErrors = [...monthlyErrors];
    const value = event.target.value;

    newValues[index] = value;
    newErrors[index] = isInvalidNumber(value, 60);
    setMonthlyValues(newValues);
    setMonthlyErrors(newErrors);
  };

  function checkIfIntervalDistributionIsDisabled(index) {
    if (index === 0) {
      return monthlyValues[index + 1] && monthlyValues[index + 1] != 0;
    }

    if (index === 10) {
      return monthlyValues[index - 1] && monthlyValues[index - 1] != 0;
    }

    return (
      (monthlyValues[index + 1] && monthlyValues[index + 1] != 0) ||
      (monthlyValues[index - 1] && monthlyValues[index - 1] != 0)
    );
  }

  return (
    <Grid item container direction="column" spacing={2} xs={12} md={6}>
      <Grid item xs={12} md={6}>
        <Typography gutterBottom sx={{ marginBottom: "15px" }}>
          Interval Distribution (max per interval 60%)
        </Typography>
        <Grid container spacing={2}>
          {monthRanges.map((label, index) => (
            <Grid item sm={standalone ? 4 : 6} key={label}>
              <TextField
                label={label}
                value={checkIfIntervalDistributionIsDisabled(index) ? 0 : monthlyValues[index]}
                disabled={checkIfIntervalDistributionIsDisabled(index)}
                style={{ width: "150px" }}
                onChange={(e) => handleMonthlyValueChange(index, e)}
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
                error={monthlyErrors[index].hasError}
                helperText={monthlyErrors[index].errorMessage}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
