import React, { useState, useEffect } from "react";
import { Box, TextField, Grid, Typography, InputAdornment } from "@mui/material";

export default function IntervalDistribution({ id, tabState, setTabState }) {
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

  const [localMonthlyValues, setLocalMonthlyValues] = useState(tabState.monthlyValues);
  const [localMonthlyErrors, setLocalMonthlyErrors] = useState(tabState.monthlyErrors);

  // Synchronize local state with global state when the component mounts or the global state changes
  useEffect(() => {
    setLocalMonthlyValues(tabState.monthlyValues);
    setLocalMonthlyErrors(tabState.monthlyErrors);
  }, [tabState.monthlyValues, tabState.monthlyErrors]);

  function isInvalidNumber(newValues, value, max, symbol = "%") {
    if (value.includes(".")) {
      return { hasError: true, errorMessage: "No Decimals" };
    }

    if (parseInt(value, 10) > max) {
      return { hasError: true, errorMessage: `Max ${max}${symbol}` };
    }

    if (
      newValues.reduce(
        (sum, value) => sum + (Number.isNaN(parseInt(value)) ? 0 : parseInt(value)),
        0
      ) > 100
    ) {
      return { hasError: true, errorMessage: "Total > 100%" };
    }

    return { hasError: false, errorMessage: "" };
  }

  const handleMonthlyValueChange = (index, event) => {
    const newValues = [...localMonthlyValues];
    const newErrors = [...localMonthlyErrors];

    const value = event.target.value;

    newValues[index] = value;
    newErrors[index] = isInvalidNumber(newValues, value, 60);
    setLocalMonthlyValues(newValues);
    setLocalMonthlyErrors(newErrors);
  };

  const handleBlur = () => {
    setTabState(
      {
        ...tabState,
        monthlyValues: localMonthlyValues,
        monthlyErrors: localMonthlyErrors,
      },
      id
    );
  };

  function checkIfIntervalDistributionIsDisabled(index) {
    if (index === 0) {
      return localMonthlyValues[index + 1] && localMonthlyValues[index + 1] != 0;
    }

    if (index === 10) {
      return localMonthlyValues[index - 1] && localMonthlyValues[index - 1] != 0;
    }

    return (
      (localMonthlyValues[index + 1] && localMonthlyValues[index + 1] != 0) ||
      (localMonthlyValues[index - 1] && localMonthlyValues[index - 1] != 0)
    );
  }

  return (
    <React.Fragment>
      <Typography gutterBottom sx={{ marginBottom: "1rem" }}>
        Interval Distribution (max per interval 60%)
      </Typography>
      <Grid container spacing={2}>
        {monthRanges.map((label, index) => (
          <Grid item key={label}>
            <TextField
              key={`intervalDistribution${label}${index}`}
              label={label}
              value={checkIfIntervalDistributionIsDisabled(index) ? 0 : localMonthlyValues[index]}
              disabled={checkIfIntervalDistributionIsDisabled(index)}
              style={{ width: "150px" }}
              onChange={(e) => handleMonthlyValueChange(index, e)}
              onBlur={handleBlur}
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
              error={localMonthlyErrors[index].hasError}
              helperText={localMonthlyErrors[index].errorMessage}
            />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}
