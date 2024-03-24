import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IntendedUse from "./IntendedUse";
import CoverageLevel from "./CoverageLevel";
import ProductivityFactor from "./ProductivityFactor";
import InsuredAcres from "./InsuredAcres";
import InsurableInterest from "./InsurableInterest";
import InsuranceYear from "./InsuranceYear";
import IntervalDistribution from "./IntervalDistribution";
import CalculateIcon from "@mui/icons-material/Calculate";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function DecisionSupport({
  guided,
  handleReset,
  GuidedModeSwitch,
  tabState,
  setTabState,
  id,
  coverageLevel,
  setCoverageLevel,
  productivityFactor,
  setProductivityFactor,
  monthlyValues,
  setMonthlyValues,
  monthlyErrors,
  setMonthlyErrors,
}) {
  const boxCSS = { p: 1 };
  if (guided) {
    boxCSS.marginTop = "1rem";
  }

  const { isGuided, acres, acresError, interest, interestError } = tabState;

  function shouldDisableCalculateButton() {
    return !(
      parseInt(acres) &&
      acresError.hasError === false &&
      parseInt(interest) &&
      interestError.hasError === false &&
      monthlyValues.reduce(
        (sum, value) => sum + (Number.isNaN(parseInt(value)) ? 0 : parseInt(value)),
        0
      ) === 100 &&
      monthlyErrors.every((error) => !error.hasError)
    );
  }

  return (
    <Box sx={boxCSS}>
      {!guided && (
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Box sx={{ flex: "1 1 auto" }} />
          <FormControlLabel
            sx={{ marginRight: 0 }}
            control={
              <GuidedModeSwitch
                checked={isGuided}
                onChange={(event) => {
                  handleReset();
                  setTabState(
                    {
                      ...tabState,
                      isGuided: event.target.checked,
                    },
                    id
                  );
                }}
              />
            }
            label="Guided"
            labelPlacement="end"
          />
        </Box>
      )}

      <Grid container>
        <Grid item container direction="column" spacing={2} xl={6}>
          <IntendedUse tabState={tabState} setTabState={setTabState} id={id} />

          <Grid item>
            <CoverageLevel tabState={tabState} setTabState={setTabState} id={id} />
          </Grid>
          <Grid item>
            <ProductivityFactor tabState={tabState} setTabState={setTabState} id={id} />
          </Grid>

          <Grid container gap={2} sx={{ margin: "1rem" }}>
            <Grid item>
              <InsuredAcres tabState={tabState} setTabState={setTabState} id={id} />
            </Grid>
            <Grid item>
              <InsurableInterest tabState={tabState} setTabState={setTabState} id={id} />
            </Grid>
            <Grid item>
              <InsuranceYear tabState={tabState} setTabState={setTabState} id={id} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xl={6}>
          <IntervalDistribution tabState={tabState} setTabState={setTabState} id={id} />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CalculateIcon />}
          disabled={shouldDisableCalculateButton()}
        >
          Calculate
        </Button>
      </Box>
    </Box>
  );
}
