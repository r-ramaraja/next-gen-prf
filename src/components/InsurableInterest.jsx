import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, Box } from "@mui/material";

export default function InsurableInterest({ id, tabState, setTabState, isGuided }) {
  const [localInterest, setLocalInterest] = useState(tabState.interest);
  const [localInterestError, setLocalInterestError] = useState(tabState.interestError);

  useEffect(() => {
    setLocalInterest(tabState.interest);
    setLocalInterestError(tabState.interestError);
  }, [tabState.interest, tabState.interestError]);

  function isInvalidNumber(value, max, symbol = "%") {
    if (value.includes(".")) {
      return { hasError: true, errorMessage: "No Decimals" };
    }

    if (parseInt(value, 10) > max) {
      return { hasError: true, errorMessage: `Max ${max}${symbol}` };
    }

    if (!value) {
      return { hasError: true, errorMessage: "Required" };
    }

    return { hasError: false, errorMessage: "" };
  }

  const handleBlur = () => {
    if (localInterest !== tabState.interest) {
      setTabState(
        {
          ...tabState,
          interest: localInterest,
          interestError: localInterestError,
        },
        id
      );
    }
  };

  const handleInterestChange = (event) => {
    setLocalInterest(event.target.value);
    setLocalInterestError(isInvalidNumber(event.target.value, 100));
  };

  return (
    <Box>
      <TextField
        label="Insurable Interest"
        value={localInterest}
        onChange={handleInterestChange}
        onBlur={handleBlur}
        margin="normal"
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
        style={{ width: "150px" }}
        error={localInterestError.hasError}
        helperText={localInterestError.errorMessage}
      />
      {isGuided && (
        <Box>
          <p>
            <strong>What is insurable interest?</strong>
          </p>
          <p>
            <em>Insurable interest</em>, expressed as a percentage, represents the
            policyholder&rsquo;s share or stake in the insured land. It reflects the portion of the
            crop or land value that the policyholder is responsible for or stands to lose
            financially in case of loss.
            <br />
            The percentage is determined based on the policyholder&apos;s financial involvement in
            the crop or land. For instance, if a farmer owns 100% of the land or crop, the
            <em> insurable interest</em> is 100%. In cases of shared ownership, partnerships, or
            leasing arrangements, the percentage would represent the policyholder&apos;s portion of
            the risk. For example, if a farmer owns 50% of a crop, as is common with share and cash
            grazing leases, their <em>insurable interest</em> would be 50%.
            <br />
            Accurately determining and reporting<em> insurable interest</em> is crucial as it
            ensures that the farmer pays a fair premium based on their actual stake in the crop or
            land and receives appropriate compensation in proportion to their loss.
          </p>
          <p>
            <strong>How does it impact the policy?</strong>
          </p>
          <p>
            <em>Insurable interest</em> directly influences the calculation of premiums and
            potential indemnity payments. For example, if a farmer has a 50%{" "}
            <em>insurable interest</em> in a parcel of land, their premiums and subsequent claim
            payments would be based on that 50% share.
          </p>
        </Box>
      )}
    </Box>
  );
}
