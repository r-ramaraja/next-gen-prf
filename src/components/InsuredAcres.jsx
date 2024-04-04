import React, { useState, useEffect } from "react";
import { TextField, Box } from "@mui/material";
import InsuredAcresViz from "./visualizations/insured_acres_step/InsuredAcresViz";

export default function InsuredAcres({ marker, tabState, setTabState, isGuided }) {
  const [localAcres, setLocalAcres] = useState(tabState.acres);
  const [localAcresError, setLocalAcresError] = useState(tabState.acresError);
  const { id } = marker;
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
            <span style={{ textDecoration: "underline" }}>
              <strong>Definition</strong>
            </span>
          </p>
          <p>
            <em>Insured acres</em> denote the total acreage of the policyholder&apos;s land covered
            under the insurance policy. The policyholder can include all or a portion of the land
            they own or manage.
          </p>
          <p>
            Accurate reporting of <em>insured acres</em> is crucial as underreporting can lead to
            insufficient coverage, while overreporting can increase costs without corresponding
            benefits.
          </p>
          <p>
            <span style={{ textDecoration: "underline" }}>
              <strong>Impact</strong>
            </span>
          </p>
          <p>
            The number of <em>insured acres</em> directly impacts the premium cost, as premiums are
            typically calculated per acre.
          </p>
          <p>
            It also affects potential indemnity payouts, which are generally based on the extent of
            loss multiplied by the number of <em>insured acres</em>.
          </p>
        </Box>
      )}
      {isGuided && <InsuredAcresViz marker={marker} />}
    </Box>
  );
}
