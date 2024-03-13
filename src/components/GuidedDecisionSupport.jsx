import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { StepLabel } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IntendedUse from "./IntendedUse";
import CoverageLevel from "./CoverageLevel";
import ProductivityFactor from "./ProductivityFactor";
import InsuredAcres from "./InsuredAcres";
import InsurableInterest from "./InsurableInterest";
import InsuranceYear from "./InsuranceYear";
import IntervalDistribution from "./IntervalDistribution";
import dayjs from "dayjs";
import CalculateIcon from "@mui/icons-material/Calculate";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";

const steps = [
  "Intended Use",
  "Coverage Level",
  "Productivity Factor",
  "Insured Acres",
  "Insurable Interest",
  "Sample Year",
  "Interval Distribution",
];

const GuidedModeSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function GuidedDecision({ marker }) {
  const [activeStep, setActiveStep] = useState(0);
  const [intendedUse, setIntendedUse] = useState("grazing");
  const [irrigationPractice, setIrrigationPractice] = useState("irrigated");
  const [organicPractice, setOrganicPractice] = useState("non-organic");
  const [coverageLevel, setCoverageLevel] = useState(90);
  const [productivityFactor, setProductivityFactor] = useState(100);
  const [acres, setAcres] = useState(100);
  const [acresError, setAcresError] = useState({ hasError: false, errorMessage: "" });
  const [interest, setInterest] = useState(100);
  const [interestError, setInterestError] = useState({ hasError: false, errorMessage: "" });
  const [year, setYear] = useState(dayjs().subtract(1, "year"));
  const [monthlyValues, setMonthlyValues] = useState(Array(11).fill(""));
  const [monthlyErrors, setMonthlyErrors] = useState(
    Array(11).fill({ hasError: false, errorMessage: "" })
  );
  const [isGuided, setIsGuided] = useState(true);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setIntendedUse("grazing");
    setIrrigationPractice("irrigated");
    setOrganicPractice("non-organic");
    setCoverageLevel(90);
    setProductivityFactor(100);
    setAcres(100);
    setAcresError({ hasError: false, errorMessage: "" });
    setInterest(100);
    setInterestError({ hasError: false, errorMessage: "" });
    setYear(dayjs().subtract(1, "year"));
    setMonthlyValues(Array(11).fill(""));
    setMonthlyErrors(Array(11).fill({ hasError: false, errorMessage: "" }));
  };

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

  const isStepFailed = (index, button) => {
    if (index === 3) {
      return acresError.hasError;
    }
    if (index === 4) {
      return interestError.hasError;
    }
    if (index === 6) {
      if (button) {
        return (
          monthlyValues.reduce(
            (sum, value) => sum + (Number.isNaN(parseInt(value)) ? 0 : parseInt(value)),
            0
          ) !== 100
        );
      }
      return monthlyErrors.some((error) => error.hasError);
    }
  };

  const DecisionSupport = ({ guided }) => {
    console.log(guided);
    const boxCSS = { p: 1 };
    if (guided) {
      boxCSS.marginTop = "15px";
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
  };

  function renderStepComponent(index) {
    const description = `<Explain about "${steps[index]}" along with examples.>`;
    let component = <p></p>;

    switch (index) {
      case 0:
        component = (
          <IntendedUse
            intendedUse={intendedUse}
            setIntendedUse={setIntendedUse}
            irrigationPractice={irrigationPractice}
            setIrrigationPractice={setIrrigationPractice}
            organicPractice={organicPractice}
            setOrganicPractice={setOrganicPractice}
          />
        );
        break;
      case 1:
        component = (
          <CoverageLevel coverageLevel={coverageLevel} setCoverageLevel={setCoverageLevel} />
        );
        break;
      case 2:
        component = (
          <ProductivityFactor
            productivityFactor={productivityFactor}
            setProductivityFactor={setProductivityFactor}
          />
        );
        break;
      case 3:
        component = (
          <InsuredAcres
            acres={acres}
            setAcres={setAcres}
            acresError={acresError}
            setAcresError={setAcresError}
          />
        );
        break;
      case 4:
        component = (
          <InsurableInterest
            interest={interest}
            setInterest={setInterest}
            interestError={interestError}
            setInterestError={setInterestError}
          />
        );
        break;
      case 5:
        component = <InsuranceYear year={year} setYear={setYear} />;
        break;
      case 6:
        component = (
          <IntervalDistribution
            monthlyValues={monthlyValues}
            setMonthlyValues={setMonthlyValues}
            monthlyErrors={monthlyErrors}
            setMonthlyErrors={setMonthlyErrors}
            standalone
          />
        );
        break;
    }

    return (
      <React.Fragment>
        <Typography sx={{ mt: 2, mb: 1, margin: "20px" }}>{description}</Typography>
        {component}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {isGuided ? (
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};

              if (isStepFailed(index)) {
                labelProps.error = true;
              }

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
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
                <Button variant="contained" color="primary" onClick={handleReset}>
                  Reset
                </Button>
              </Box>
              <DecisionSupport guided />
            </React.Fragment>
          ) : (
            <React.Fragment>
              {renderStepComponent(activeStep)}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
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
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isStepFailed(activeStep, true)}
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
      ) : (
        <DecisionSupport />
      )}
    </React.Fragment>
  );
}
