import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import CountyMap from "../components/visualizations/overview/CountyMap";
import IntendedUseViz from "../components/visualizations/intended_use_step/IntendedUseViz";
import CoverageLevelViz from "../components/visualizations/coverage_level_step/CoverageLevelViz";
import InsuredAcresViz from "../components/visualizations/insured_acres_step/InsuredAcresViz";
import IntervalDistributionViz from "../components/visualizations/interval_distribution_step/IntervalDistributionViz";

export default function Overview({ marker }) {
  return (
    <Box p={1}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography component={"span"}>
            <div>
              <span style={{ fontWeight: "bold" }}>Latitude:</span> {marker.lat.toFixed(3)}
            </div>
            <div>
              <span style={{ fontWeight: "bold" }}>Longitude:</span> {marker.lng.toFixed(3)}
            </div>
            {marker.gridcode && (
              <div>
                <span style={{ fontWeight: "bold" }}>Grid ID:</span> {marker.gridcode}
              </div>
            )}
            {marker.state && (
              <div>
                <span style={{ fontWeight: "bold" }}>State:</span> {marker.state}
              </div>
            )}
            {marker.county && (
              <div>
                <span style={{ fontWeight: "bold" }}>County:</span> {marker.county}
              </div>
            )}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <CountyMap marker={marker} />
        </Grid>
        <Grid item xs={12}>
          <IntendedUseViz marker={marker} isOverviewView />
        </Grid>
        <Grid item xs={12}>
          <CoverageLevelViz marker={marker} isOverviewView />
        </Grid>
        <Grid item xs={12}>
          <InsuredAcresViz marker={marker} />
        </Grid>
        <Grid item xs={12}>
          <IntervalDistributionViz marker={marker} isOverviewView />
        </Grid>
      </Grid>
    </Box>
  );
}
