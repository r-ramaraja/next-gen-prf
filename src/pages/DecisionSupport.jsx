import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import axios from "axios";
import IntendedUse from "../components/IntendedUse";
import CoverageLevel from "../components/CoverageLevel";
import ProductivityFactor from "../components/ProductivityFactor";
import InsuredAcres from "../components/InsuredAcres";
import InsurableInterest from "../components/InsurableInterest";
import InsuranceYear from "../components/InsuranceYear";
import IntervalDistribution from "../components/IntervalDistribution";
import CalculateIcon from "@mui/icons-material/Calculate";
import FormControlLabel from "@mui/material/FormControlLabel";
// import DecisionSupportViz from "../components/DecisionSupportViz";
import DecisionSupportTableViz from "../components/DecisionSupportTableViz";
import { baseURL, intervalCodes } from "../constants";

export default function DecisionSupport({
  guided,
  handleReset,
  GuidedModeSwitch,
  tabState,
  setTabState,
  marker,
  monthlyValues,
  monthlyErrors,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visualizationData, setVisualizationData] = useState(null);
  const { id, state, county, gridcode } = marker;

  const handleCalculateClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const requestBody = {
        state,
        county,
        grid_id: gridcode,
        intended_use: tabState.intendedUse,
        coverage_level: tabState.coverageLevel,
        productivity_factor: tabState.productivityFactor / 100,
        insured_acres: tabState.acres,
        insurable_interest: tabState.interest / 100,
        year: tabState.year.format("YYYY"),
        interval_distribution: tabState.monthlyValues.reduce((acc, curr, index) => {
          if (parseInt(curr) > 0) {
            acc[intervalCodes[index]] = parseInt(curr) / 100;
          }
          return acc;
        }, {}),
      };

      const response = await axios.post(`${baseURL}/calculate`, requestBody);
      setVisualizationData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setError(error);
      setLoading(false);
    }
  };

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
    <Box>
      {!guided && (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
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
      {!visualizationData && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CalculateIcon />}
            disabled={shouldDisableCalculateButton()}
            onClick={handleCalculateClick}
          >
            Calculate
          </Button>

          {loading && <p>Loading...</p>}
          {error && <p>Error loading data</p>}
        </Box>
      )}
      {/* <DecisionSupportViz visualizationData={visualizationData} /> */}
      {visualizationData && <DecisionSupportTableViz visualizationData={visualizationData} />}
    </Box>
  );
}
