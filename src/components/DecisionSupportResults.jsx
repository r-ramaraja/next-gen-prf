import React from "react";
import { Grid, Box, Typography, Divider } from "@mui/material";
import DecisionSupportTableViz from "./DecisionSupportTableViz";
import DecisionResultsBarViz from "./DecisionResultsBarViz";
import DecisionSupportPieViz from "./DecisionSupportPieViz";

export default function DecisionSupportResults({ visualizationData }) {
  return (
    <React.Fragment>
      <Divider aria-hidden="true" sx={{ margin: "0.5rem" }} />
      <Box sx={{ marginTop: "0.5rem" }}>
        <Grid container spacing={2}>
          <Grid item>
            <Typography>
              <span style={{ fontWeight: "bold" }}>County Base Value:</span>{" "}
              {visualizationData.county_base.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
            <Typography>
              <span style={{ fontWeight: "bold" }}>Subsidy Level:</span>{" "}
              {`${visualizationData.subsidy}%`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <DecisionSupportTableViz visualizationData={visualizationData} />
          </Grid>
          <Grid item xs={6}>
            <DecisionResultsBarViz visualizationData={visualizationData} />
          </Grid>
          <Grid item xs={6}>
            <DecisionSupportPieViz visualizationData={visualizationData} />
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
}
