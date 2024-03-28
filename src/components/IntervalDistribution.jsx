import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Typography,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";

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
  const [localIntervalDistributionMode, setLocalIntervalDistributionMode] = useState(
    tabState.intervalDistributionMode
  );

  useEffect(() => {
    setLocalMonthlyValues(tabState.monthlyValues);
    setLocalMonthlyErrors(tabState.monthlyErrors);
    setLocalIntervalDistributionMode(tabState.intervalDistributionMode);
  }, [tabState.monthlyValues, tabState.monthlyErrors, tabState.intervalDistributionMode]);

  function isInvalidNumber(newValues, value, max) {
    if (!value) {
      return { hasError: false, errorMessage: "" };
    }

    if (value.includes(".")) {
      return { hasError: true, errorMessage: "No Decimals" };
    }

    if (parseInt(value, 10) > max) {
      return { hasError: true, errorMessage: `Max ${max}%` };
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

    const value = event.target.value;

    newValues[index] = value;
    const newErrors = newValues.map((elem) => isInvalidNumber(newValues, elem.toString(), 60));
    setLocalMonthlyValues(newValues);
    setLocalMonthlyErrors(newErrors);
  };

  const syncParentState = () => {
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

  const handleModeBlur = () => {
    setTabState(
      {
        ...tabState,
        monthlyValues: localMonthlyValues,
        monthlyErrors: localMonthlyErrors,
        intervalDistributionMode: localIntervalDistributionMode,
      },
      id
    );
  };

  const handleModeChange = (event) => {
    if (event.target.value === "spring") {
      setLocalMonthlyValues([0, 0, 0, 50, 0, 50, 0, 0, 0, 0, 0]);
      setLocalMonthlyErrors(Array(11).fill({ hasError: false, errorMessage: "" }));
      setLocalIntervalDistributionMode(event.target.value);
    }

    if (event.target.value === "fall") {
      setLocalMonthlyValues([0, 0, 0, 0, 0, 0, 0, 50, 0, 50, 0]);
      setLocalMonthlyErrors(Array(11).fill({ hasError: false, errorMessage: "" }));
      setLocalIntervalDistributionMode(event.target.value);
    }

    if (event.target.value === "custom") {
      setLocalMonthlyValues([50, 0, 50, 0, "", "", "", "", "", "", ""]);
      setLocalMonthlyErrors(Array(11).fill({ hasError: false, errorMessage: "" }));
      setLocalIntervalDistributionMode(event.target.value);
    }
  };

  const getIntervalDistributionValue = (index) => {
    if (localIntervalDistributionMode !== "custom") {
      return localMonthlyValues[index];
    }

    if (checkIfIntervalDistributionIsDisabled(index)) {
      return 0;
    } else {
      return localMonthlyValues[index];
    }
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item>
          <Typography gutterBottom sx={{ marginBottom: "1rem" }}>
            Interval Distribution (max per interval 60%)
          </Typography>
        </Grid>
        <Grid item>
          <FormControl sx={{ marginBottom: "1rem", marginLeft: "0.5rem" }} size="small">
            <InputLabel id="demo-simple-select-label">Mode</InputLabel>
            <Select
              value={localIntervalDistributionMode}
              label="Mode"
              onChange={handleModeChange}
              onBlur={handleModeBlur}
            >
              <MenuItem value={"custom"}>Custom</MenuItem>
              <MenuItem value={"spring"}>Spring</MenuItem>
              <MenuItem value={"fall"}>Fall</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {monthRanges.map((label, index) => (
          <Grid item key={label}>
            <TextField
              key={`intervalDistribution${label}${index}`}
              label={label}
              value={getIntervalDistributionValue(index)}
              disabled={
                localIntervalDistributionMode === "custom"
                  ? !!checkIfIntervalDistributionIsDisabled(index)
                  : true
              }
              style={{ width: "150px" }}
              onChange={(e) => handleMonthlyValueChange(index, e)}
              onBlur={syncParentState}
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
