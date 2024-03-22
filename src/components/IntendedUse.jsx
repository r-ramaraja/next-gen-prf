import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";

export default function IntendedUse({ tabState, setTabState, id }) {
  const { intendedUse, irrigationPractice, organicPractice } = tabState;
  return (
    <Grid container item spacing={2}>
      <Grid item>
        <FormControl sx={{ width: "150px" }}>
          <InputLabel>Intended Use</InputLabel>
          <Select
            value={intendedUse}
            label="Intended Use"
            onChange={(event) =>
              setTabState(
                {
                  ...tabState,
                  intendedUse: event.target.value,
                },
                id
              )
            }
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
              onChange={(event) =>
                setTabState(
                  {
                    ...tabState,
                    irrigationPractice: event.target.value,
                  },
                  id
                )
              }
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
              onChange={(event) =>
                setTabState(
                  {
                    ...tabState,
                    organicPractice: event.target.value,
                  },
                  id
                )
              }
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
