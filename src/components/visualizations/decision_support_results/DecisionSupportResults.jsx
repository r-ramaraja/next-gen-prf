import React from "react";
import { Grid, Box, Typography, Divider } from "@mui/material";
import DecisionSupportTableViz from "./DecisionSupportTableViz";
import DecisionResultsBarViz from "./DecisionResultsBarViz";
import DecisionSupportPieViz from "./DecisionSupportPieViz";
import HistoricalTrend from "./HistoricalTrend";
import CashFlow from "./CashFlow";
import CashFlowTrend from "./CashFlowTrend";
import PolicyProtectionPie from "./PolicyProtectionPie";

export default function DecisionSupportResults({ visualizationData, year }) {
  const yearString = year.format("YYYY");
  const currentYearData = visualizationData[yearString];
  return (
    <React.Fragment>
      <Divider aria-hidden="true" sx={{ margin: "0.5rem" }} />
      <Box sx={{ marginTop: "0.5rem" }}>
        <Grid container spacing={2}>
          <Grid item>
            <Typography>
              <span style={{ fontWeight: "bold" }}>County Base Value:</span>{" "}
              {currentYearData.county_base.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
            <Typography>
              <span style={{ fontWeight: "bold" }}>Subsidy Level:</span>{" "}
              {`${currentYearData.subsidy}%`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <DecisionSupportTableViz visualizationData={currentYearData} />
          </Grid>
          <Grid item xs={12}>
            <HistoricalTrend visualizationData={visualizationData} />
          </Grid>
          <Grid item xs={12}>
            <CashFlowTrend visualizationData={visualizationData} />
          </Grid>
          <Grid item xs={6}>
            <CashFlow visualizationData={currentYearData} />
          </Grid>
          <Grid item xs={6}>
            <DecisionResultsBarViz visualizationData={currentYearData} />
          </Grid>
          <Grid item xs={6}>
            <DecisionSupportPieViz visualizationData={currentYearData} />
          </Grid>
          <Grid item xs={6}>
            <PolicyProtectionPie visualizationData={currentYearData} />
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
}
