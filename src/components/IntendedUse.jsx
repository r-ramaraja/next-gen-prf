import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";

export default function IntendedUse({
  intendedUse,
  setIntendedUse,
  irrigationPractice,
  setIrrigationPractice,
  organicPractice,
  setOrganicPractice,
}) {
  return (
    <Grid container item spacing={2}>
      <Grid item>
        <FormControl sx={{ width: "150px" }}>
          <InputLabel>Intended Use</InputLabel>
          <Select
            value={intendedUse}
            label="Intended Use"
            onChange={(event) => setIntendedUse(event.target.value)}
          >
            <MenuItem value="grazing">Grazing</MenuItem>
            <MenuItem value="haying">Haying</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {intendedUse === "haying" && (
        <Grid item>
          <FormControl sx={{ width: "150px" }}>
            <InputLabel>Irrigation Practice</InputLabel>
            <Select
              value={irrigationPractice}
              label="Irrigation Practice"
              onChange={(event) => setIrrigationPractice(event.target.value)}
            >
              <MenuItem value="irrigated">Irrigated</MenuItem>
              <MenuItem value="non-irrigated">Non-Irrigated</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}

      {intendedUse === "haying" && irrigationPractice === "non-irrigated" && (
        <Grid item>
          <FormControl sx={{ width: "150px" }}>
            <InputLabel>Organic Practice</InputLabel>
            <Select
              value={organicPractice}
              label="Organic Practice"
              onChange={(event) => setOrganicPractice(event.target.value)}
            >
              <MenuItem value="non-organic">Not Organic</MenuItem>
              <MenuItem value="certified">Certified</MenuItem>
              <MenuItem value="transitional">Transitional</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
}
