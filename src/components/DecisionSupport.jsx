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
  setIsGuided,
  isGuided,
  GuidedModeSwitch,
  intendedUse,
  setIntendedUse,
  irrigationPractice,
  setIrrigationPractice,
  organicPractice,
  setOrganicPractice,
  coverageLevel,
  setCoverageLevel,
  productivityFactor,
  setProductivityFactor,
  acres,
  setAcres,
  acresError,
  setAcresError,
  interest,
  setInterest,
  interestError,
  setInterestError,
  year,
  setYear,
  monthlyValues,
  setMonthlyValues,
  monthlyErrors,
  setMonthlyErrors,
}) {
  const boxCSS = { p: 1 };
  if (guided) {
    boxCSS.marginTop = "15px";
  }

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
            control={
              <GuidedModeSwitch
                checked={isGuided}
                onChange={(event) => {
                  handleReset();
                  setIsGuided(event.target.checked);
                }}
              />
            }
            label="Guided"
            labelPlacement="end"
          />
        </Box>
      )}

      <Grid container>
        <Grid item container direction="column" spacing={2} xs={12} md={6}>
          <IntendedUse
            intendedUse={intendedUse}
            setIntendedUse={setIntendedUse}
            irrigationPractice={irrigationPractice}
            setIrrigationPractice={setIrrigationPractice}
            organicPractice={organicPractice}
            setOrganicPractice={setOrganicPractice}
          />

          <CoverageLevel coverageLevel={coverageLevel} setCoverageLevel={setCoverageLevel} />

          <ProductivityFactor
            productivityFactor={productivityFactor}
            setProductivityFactor={setProductivityFactor}
          />

          <Grid container spacing={2} sx={{ marginTop: "10px", marginLeft: "0px" }}>
            <InsuredAcres
              acres={acres}
              setAcres={setAcres}
              acresError={acresError}
              setAcresError={setAcresError}
            />
            <InsurableInterest
              interest={interest}
              setInterest={setInterest}
              interestError={interestError}
              setInterestError={setInterestError}
            />

            <InsuranceYear year={year} setYear={setYear} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <IntervalDistribution
            monthlyValues={monthlyValues}
            setMonthlyValues={setMonthlyValues}
            monthlyErrors={monthlyErrors}
            setMonthlyErrors={setMonthlyErrors}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
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
