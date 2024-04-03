import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import CountyBaseTable from "../components/visualizations/overview/CountyBaseTable";
import CountyMap from "../components/visualizations/overview/CountyMap";

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
          <CountyBaseTable marker={marker} />
        </Grid>
      </Grid>
    </Box>
  );
}
