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
  Box,
} from "@mui/material";

export default function IntervalDistribution({ id, tabState, setTabState, isGuided }) {
  console.log("🚀 ~ IntervalDistribution ~ isGuided:", isGuided);
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
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <Typography gutterBottom sx={{ marginBottom: "1rem" }}>
            Interval Distribution (max per interval 60%)
          </Typography>
        </Grid>
        <Grid item>
          <FormControl sx={{ marginBottom: "1rem", marginLeft: "0.5rem" }} size="small">
            <InputLabel id="demo-simple-select-label">Season</InputLabel>
            <Select
              value={localIntervalDistributionMode}
              label="Season"
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
      {isGuided && (
        <Box>
          <p>
            <strong>What is interval distribution?</strong>
          </p>
          <p>
            <em>Interval distribution</em> refers to how coverage is allocated or distributed across
            bi-monthly intervals within the policy year. The purpose of this distribution is to more
            accurately reflect the risk of loss or damage across different parts of the growing
            season. For example, a farmer might allocate more coverage to traditionally drier months
            if drought is a concern or to periods crucial for crop development. The policyholder can
            assign a certain percentage of their total coverage to each interval based on their risk
            assessment during that time, as it allows for more nuanced protection, recognizing that
            risk levels can vary significantly throughout the policy period.
            <br />
            There are 11 intervals to choose from:
          </p>
          <ol>
            <li>January - February</li>
            <li>February - March</li>
            <li>March - April</li>
            <li>April - May</li>
            <li>May - June</li>
            <li>June - July</li>
            <li>July - August</li>
            <li>August - September</li>
            <li>September - October</li>
            <li>October - November</li>
            <li>November - December&nbsp;</li>
          </ol>
          <p>
            The policyholder{" "}
            <span style={{ textDecoration: "underline" }}>
              must select a minimum of 2 intervals
            </span>
            . The sum of all allocations should be 100, and the maximum value per interval is
            determined by the county/state.&nbsp;
          </p>
          <p>
            <strong>How does it impact the policy?</strong>
          </p>
          <p>
            <em>Interval distribution</em> affects how indemnity payments are calculated. If a loss
            occurs, the payment is based on the amount of coverage allocated to the interval in
            which the loss happened.
            <br />
            The way coverage is distributed among intervals can also impact the insurance premium.
            Intervals with higher allocated coverage might have higher associated premiums due to
            the increased risk of payout during those periods.
          </p>
        </Box>
      )}
    </Box>
  );
}
