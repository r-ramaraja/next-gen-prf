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
import { currencyFormatter } from "../../../constants";

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

export default function CoverageLevelLine({ visualizationData }) {
  const colours = ["#FF6B6B", "#F0C808", "#4CAF50", "#4D96FF", "#9D7BFF", "#FF926B"];

  const [metric, setMetric] = useState("indemnity");
  const [coverageLevels, setCoverageLevels] = useState(Object.keys(visualizationData).sort());

  const handleChange = (event) => {
    setMetric(event.target.value);
  };

  const data = [];

  let yearSet = new Set();
  for (const coverageLevel of Object.keys(visualizationData).sort()) {
    const coverageLevelData = visualizationData[coverageLevel];
    yearSet = new Set([...yearSet, ...Object.keys(coverageLevelData)]);
  }

  for (const year of yearSet) {
    const yearData = { year };
    for (const coverageLevel of Object.keys(visualizationData).sort()) {
      const coverageLevelData = visualizationData[coverageLevel];
      yearData["coverageLevel"] = coverageLevel;
      yearData[`${coverageLevel}-indemnity`] = coverageLevelData[year]
        ? coverageLevelData[year]["sum_indemnity"]
        : 0;
      yearData[`${coverageLevel}-premium`] = coverageLevelData[year]
        ? coverageLevelData[year]["sum_actual_premium"]
        : 0;
      yearData[`${coverageLevel}-acres`] = coverageLevelData[year]
        ? coverageLevelData[year]["acres"]
        : 0;
      yearData[`${coverageLevel}-policies_sold`] = coverageLevelData[year]
        ? coverageLevelData[year]["sum_policy_sold"]
        : 0;
      yearData[`${coverageLevel}-policies_indemnified`] = coverageLevelData[year]
        ? coverageLevelData[year]["sum_policy_indemnified"]
        : 0;
    }
    data.push(yearData);
  }

  const handleCoverageLevelChange = (event) => {
    const {
      target: { value },
    } = event;
    setCoverageLevels(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Box>
      <Grid container>
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
            <InputLabel>Interval</InputLabel>
            <Select
              value={coverageLevels}
              label="Coverage Level"
              onChange={handleCoverageLevelChange}
              multiple
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              input={<OutlinedInput label="Interval" />}
              MenuProps={MenuProps}
            >
              {coverageLevels.map((coverageLevelOption) => (
                <MenuItem key={coverageLevelOption} value={coverageLevelOption}>
                  <Checkbox checked={coverageLevels.indexOf(coverageLevelOption) > -1} />
                  <ListItemText primary={coverageLevelOption} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: 300, marginTop: "1rem" }}>
            <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip
                  formatter={(value, name, props) => {
                    return props.dataKey.split("-")[1] === "indemnity" ||
                      props.dataKey.split("-")[1] === "premium"
                      ? currencyFormatter(value)
                      : value;
                  }}
                />
                <Legend />
                {coverageLevels.map((coverageLevel, index) => (
                  <Line
                    key={`${coverageLevel}-${metric}-${index}`}
                    dataKey={`${coverageLevel}-${metric}`}
                    activeDot={{ r: 8 }}
                    stroke={colours[index]}
                    name={coverageLevel}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
