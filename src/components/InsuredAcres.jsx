import React, { useState, useEffect } from "react";
import { TextField, Box } from "@mui/material";

export default function InsuredAcres({ id, tabState, setTabState, isGuided }) {
  const [localAcres, setLocalAcres] = useState(tabState.acres);
  const [localAcresError, setLocalAcresError] = useState(tabState.acresError);

  useEffect(() => {
    setLocalAcres(tabState.acres);
    setLocalAcresError(tabState.acresError);
  }, [tabState.acres, tabState.acresError]);

  function isInvalidNumber(value, max) {
    if (value && value.includes(".")) {
      return { hasError: true, errorMessage: "No Decimals" };
    }

    if (value && parseInt(value, 10) > max) {
      return { hasError: true, errorMessage: `Max 200,000` };
    }

    if (!value) {
      return { hasError: true, errorMessage: "Required" };
    }

    return { hasError: false, errorMessage: "" };
  }

  const handleAcresChange = (event) => {
    setLocalAcres(event.target.value);
    setLocalAcresError(isInvalidNumber(event.target.value, 200000));
  };

  const handleBlur = () => {
    if (localAcres !== tabState.acres) {
      setTabState(
        {
          ...tabState,
          acres: localAcres,
          acresError: localAcresError,
        },
        id
      );
    }
  };

  return (
    <Box>
      <TextField
        label="Acres"
        value={localAcres}
        onChange={handleAcresChange}
        onBlur={handleBlur}
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
        style={{ width: "150px" }}
        error={localAcresError.hasError}
        helperText={localAcresError.errorMessage}
      />
      {isGuided && (
        <Box>
          <p>
            <strong>What are insured acres?</strong>
          </p>
          <p>
            <em>Insured acres</em> denote the total acreage of the policyholder&apos;s land covered
            under the insurance policy. It represents the land area against which protection is
            provided. Depending on their coverage needs and risk management strategy, the
            policyholder can include all or a portion of the land they own or manage.
            <br />
            Accurate reporting of <em>insured acres</em> is crucial for effective risk management
            and adequate coverage. Underreporting can lead to insufficient coverage, while
            overreporting can increase costs without corresponding benefits.
          </p>
          <p>
            <strong>How does it impact the policy?</strong>
          </p>
          <p>
            The number of <em>insured acres</em> directly impacts the total premium cost, as
            premiums are typically calculated per acre. It also affects the potential indemnity
            payments, as these payments are generally based on the extent of loss multiplied by the
            number of
            <em>insured acres</em>.
          </p>
        </Box>
      )}
    </Box>
  );
}
