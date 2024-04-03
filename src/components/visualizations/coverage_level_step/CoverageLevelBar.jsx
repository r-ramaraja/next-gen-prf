import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Grid } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { currencyFormatter } from "../../../constants";

export default function CoverageLevelBar({ visualizationData }) {
  const colours = ["#00BFFF", "#FF6347", "#3CB371", "#FFD700", "#7B68EE", "#FF7F50"];

  const [metric, setMetric] = useState("indemnity");

  const handleChange = (event) => {
    setMetric(event.target.value);
  };

  const data = [];
  const coverageLevels = Object.keys(visualizationData).sort();

  let yearSet = new Set();
  for (const coverageLevel of coverageLevels) {
    const coverageLevelData = visualizationData[coverageLevel];
    yearSet = new Set([...yearSet, ...Object.keys(coverageLevelData)]);
  }

  for (const year of yearSet) {
    const yearData = { year };
    for (const coverageLevel of coverageLevels) {
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
        <Grid item xs={12}>
          <Box sx={{ height: 300, width: "70rem", marginTop: "1rem" }}>
            <ResponsiveContainer>
              <BarChart
                width={500}
                height={300}
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
                    return props.dataKey === "indemnity" || props.dataKey === "premium"
                      ? currencyFormatter(value)
                      : value;
                  }}
                />
                <Legend />
                {coverageLevels.map((coverageLevel, index) => (
                  <Bar
                    key={`${coverageLevel}-${metric}-${index}`}
                    dataKey={`${coverageLevel}-${metric}`}
                    stackId="a"
                    fill={colours[index]}
                    name={coverageLevel}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
