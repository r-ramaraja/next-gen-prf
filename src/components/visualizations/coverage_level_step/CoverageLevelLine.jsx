import React, { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  LineChart,
  Brush,
} from "recharts";
import { Box, Grid } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";
import { currencyFormatter, coverageLevelValues } from "../../../constants";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const colours = ["#FF6B6B", "#F0C808", "#4CAF50", "#4DCBFF", "#AD51F6", "#FF926B"];

export default function CoverageLevelLine({ visualizationData, isOverviewView }) {
  const [metric, setMetric] = useState("indemnity");
  const [coverageLevels, setCoverageLevels] = useState(coverageLevelValues);

  const handleChange = (event) => {
    setMetric(event.target.value);
  };

  const data = [];

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2007; year < currentYear; year++) {
    years.push(year);
  }

  for (const year of years) {
    const yearData = { year };
    for (const coverageLevel of Object.keys(visualizationData).sort()) {
      const coverageLevelData = visualizationData[coverageLevel][year] || {};

      yearData[`${coverageLevel}-indemnity`] = coverageLevelData.sum_indemnity ?? 0;
      yearData[`${coverageLevel}-premium`] = coverageLevelData.sum_actual_premium ?? 0;
      yearData[`${coverageLevel}-acres`] = coverageLevelData.acres ?? 0;
      yearData[`${coverageLevel}-policies_sold`] = coverageLevelData.sum_policy_sold ?? 0;
      yearData[`${coverageLevel}-policies_indemnified`] =
        coverageLevelData.sum_policy_indemnified ?? 0;
    }
    data.push(yearData);
  }

  const handleCoverageLevelChange = (event) => {
    const {
      target: { value },
    } = event;
    setCoverageLevels(typeof value === "string" ? value.split(",") : value);
  };

  const labels = {
    indemnity: "Indemnity",
    premium: "Premium",
    acres: "Acres",
    policies_sold: "Policies Sold",
    policies_indemnified: "Policies Indemnified",
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ marginLeft: "1.5rem", marginTop: "2rem" }} align="center">
            {isOverviewView && "Coverage Level - "} {labels[metric]} Over Time
          </Typography>
        </Grid>
        <Grid item sx={{ marginLeft: "1.5rem", marginTop: "1rem" }}>
          <FormControl fullWidth size="small">
            <InputLabel>Metric</InputLabel>
            <Select value={metric} label="metric" onChange={handleChange}>
              <MenuItem value={"indemnity"}>Indemnity</MenuItem>
              <MenuItem value={"premium"}>Premium</MenuItem>
              <MenuItem value={"acres"}>Acres</MenuItem>
              <MenuItem value={"policies_sold"}>Policies Sold</MenuItem>
              <MenuItem value={"policies_indemnified"}>Policies Indemnified</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sx={{ marginLeft: "1.5rem", marginTop: "1rem" }}>
          <FormControl fullWidth size="small">
            <InputLabel>Coverage</InputLabel>
            <Select
              value={coverageLevels}
              label="Coverage Level"
              onChange={handleCoverageLevelChange}
              multiple
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={`${value * 100}%`} />
                  ))}
                </Box>
              )}
              input={<OutlinedInput label="Interval" />}
              MenuProps={MenuProps}
            >
              {coverageLevelValues.map((coverageLevelOption) => (
                <MenuItem key={coverageLevelOption} value={coverageLevelOption}>
                  <Checkbox checked={coverageLevels.indexOf(coverageLevelOption) > -1} />
                  <ListItemText primary={coverageLevelOption} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: 400, marginTop: "1rem" }}>
            <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 120,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{ value: "Years", position: "insideBottom", offset: -15 }}
                  interval={0}
                />
                <YAxis
                  label={{
                    value: labels[metric],
                    position: "insideLeft",
                    offset: (() => {
                      if (metric === "acres") {
                        return -40;
                      }
                      if (metric === "policies_indemnified") {
                        return -120;
                      }

                      return -85;
                    })(),
                  }}
                  tickFormatter={(value) => {
                    return metric === "indemnity" || metric === "premium"
                      ? currencyFormatter(value)
                      : value;
                  }}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    return props.dataKey.split("-")[1] === "indemnity" ||
                      props.dataKey.split("-")[1] === "premium"
                      ? currencyFormatter(value)
                      : value;
                  }}
                />
                <Legend verticalAlign="top" />
                {coverageLevels.map((coverageLevel, index) => (
                  <Line
                    key={`${coverageLevel}-${metric}-${index}`}
                    dataKey={`${coverageLevel}-${metric}`}
                    activeDot={{ r: 8 }}
                    stroke={colours[index]}
                    name={`${coverageLevel * 100}%`}
                  />
                ))}
                <Brush dataKey="year" height={30} x={170} y={365} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
