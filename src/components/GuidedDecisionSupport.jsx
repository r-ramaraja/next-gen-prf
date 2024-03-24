import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { StepLabel } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IntendedUse from "./IntendedUse";
import CoverageLevel from "./CoverageLevel";
import ProductivityFactor from "./ProductivityFactor";
import InsuredAcres from "./InsuredAcres";
import InsurableInterest from "./InsurableInterest";
import InsuranceYear from "./InsuranceYear";
import IntervalDistribution from "./IntervalDistribution";
import dayjs from "dayjs";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import DecisionSupport from "./DecisionSupport";

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

export default function GuidedDecision({ marker, tabState, setTabState }) {
  const [coverageLevel, setCoverageLevel] = useState(90);
  const [productivityFactor, setProductivityFactor] = useState(100);
  const values = Array(11).fill("");
  values[0] = 50;
  values[5] = 50;
  const [monthlyValues, setMonthlyValues] = useState(values);
  const [monthlyErrors, setMonthlyErrors] = useState(
    Array(11).fill({ hasError: false, errorMessage: "" })
  );

  const { activeStep, isGuided } = tabState;

  const handleNext = () => {
    setTabState(
      {
        ...tabState,
        activeStep: activeStep + 1,
      },
      marker.id
    );
  };

  const handleBack = () => {
    setTabState(
      {
        ...tabState,
        activeStep: activeStep - 1,
      },
      marker.id
    );
  };

  const handleReset = () => {
    setTabState(
      {
        ...tabState,
        activeStep: 0,
        intendedUse: "grazing",
        irrigationPractice: "irrigated",
        organicPractice: "non-organic",
        coverageLevel: 90,
        productivityFactor: 100,
        acres: 100,
        acresError: { hasError: false, message: "" },
        interest: 100,
        interestError: { hasError: false, message: "" },
        year: dayjs().subtract(1, "year"),
        monthlyValues: values,
        monthlyErrors: Array(11).fill({ hasError: false, errorMessage: "" }),
      },
      marker.id
    );
  };

  const isStepFailed = (index, button) => {
    if (index === 3) {
      return tabState.acresError.hasError;
    }
    if (index === 4) {
      return tabState.interestError.hasError;
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

  function renderStepComponent(index) {
    const description = `<Explain about "${steps[index]}" along with examples.>`;
    let component = <p></p>;

    switch (index) {
      case 0:
        component = <IntendedUse tabState={tabState} setTabState={setTabState} id={marker.id} />;
        break;
      case 1:
        component = <CoverageLevel tabState={tabState} setTabState={setTabState} id={marker.id} />;
        break;
      case 2:
        component = (
          <ProductivityFactor tabState={tabState} setTabState={setTabState} id={marker.id} />
        );
        break;
      case 3:
        component = <InsuredAcres tabState={tabState} setTabState={setTabState} id={marker.id} />;
        break;
      case 4:
        component = (
          <InsurableInterest tabState={tabState} setTabState={setTabState} id={marker.id} />
        );
        break;
      case 5:
        component = <InsuranceYear tabState={tabState} setTabState={setTabState} id={marker.id} />;
        break;
      case 6:
        component = (
          <IntervalDistribution tabState={tabState} setTabState={setTabState} id={marker.id} />
        );
        break;
    }

    return (
      <React.Fragment>
        <Typography sx={{ mt: 2, mb: 1, margin: "1rem" }}>{description}</Typography>
        <div style={{ margin: "1rem" }}>{component}</div>
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
                        setTabState(
                          {
                            ...tabState,
                            isGuided: event.target.checked,
                          },
                          marker.id
                        );
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
              <DecisionSupport
                guided
                handleReset={handleReset}
                GuidedModeSwitch={GuidedModeSwitch}
                tabState={tabState}
                setTabState={setTabState}
                id={marker.id}
                coverageLevel={coverageLevel}
                setCoverageLevel={setCoverageLevel}
                productivityFactor={productivityFactor}
                setProductivityFactor={setProductivityFactor}
                monthlyValues={monthlyValues}
                setMonthlyValues={setMonthlyValues}
                monthlyErrors={monthlyErrors}
                setMonthlyErrors={setMonthlyErrors}
              />
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
                        setTabState(
                          {
                            ...tabState,
                            isGuided: event.target.checked,
                          },
                          marker.id
                        );
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
        <DecisionSupport
          handleReset={handleReset}
          GuidedModeSwitch={GuidedModeSwitch}
          tabState={tabState}
          setTabState={setTabState}
          id={marker.id}
          coverageLevel={coverageLevel}
          setCoverageLevel={setCoverageLevel}
          productivityFactor={productivityFactor}
          setProductivityFactor={setProductivityFactor}
          monthlyValues={monthlyValues}
          setMonthlyValues={setMonthlyValues}
          monthlyErrors={monthlyErrors}
          setMonthlyErrors={setMonthlyErrors}
        />
      )}
    </React.Fragment>
  );
}
