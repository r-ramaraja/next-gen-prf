import React, { useState } from "react";
import { Box, Slider, Typography, Grid } from "@mui/material";

export default function CoverageLevel({ coverageLevel, setCoverageLevel }) {
  return (
    <React.Fragment>
      <Typography gutterBottom sx={{ margin: "10px" }}>
        Coverage Level
      </Typography>
      <Slider
        sx={{ width: "50vh", marginLeft: "25px" }}
        value={coverageLevel}
        step={5}
        onChange={(event, newValue) => setCoverageLevel(newValue)}
        min={70}
        max={90}
        marks={[
          {
            value: 70,
            label: "70%",
          },
          {
            value: 75,
            label: "75%",
          },
          {
            value: 80,
            label: "80%",
          },
          {
            value: 85,
            label: "85%",
          },
          {
            value: 90,
            label: "90%",
          },
        ]}
      />
    </React.Fragment>
  );
}
