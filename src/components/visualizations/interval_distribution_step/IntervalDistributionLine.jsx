import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { Box, Grid } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { monthRanges, intervalMap } from "../../../constants";
import Chip from "@mui/material/Chip";

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

export default function IntervalDistributionLine({ visualizationData }) {
  const [metric, setMetric] = useState("index");
  const [intervals, setIntervals] = useState(monthRanges);

  const colours = [
    "#1F77B4",
    "#FF7F0E",
    "#2CA02C",
    "#D62728",
    "#9467BD",
    "#8C564B",
    "#E377C2",
    "#7F7F7F",
    "#17BECF",
    "#BCBD22",
    "#393B79",
  ];

  const data = [];
  const years = Object.keys(visualizationData);

  for (const year of years) {
    let yearData = { year };
    for (const month of monthRanges) {
      const intervalCode = intervalMap[month];
      yearData = { ...yearData, month, intervalCode };
      yearData[`${intervalCode}-index`] =
        Math.round(visualizationData[year][month].index * 100) / 100;
      yearData[`${intervalCode}-totalRainfall`] = Math.round(
        visualizationData[year][month].total_rainfall
      );
    }
    data.push(yearData);
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setIntervals(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Box>
      <Grid container>
        <Grid item sx={{ marginLeft: "1.5rem", marginTop: "1rem" }}>
          <FormControl fullWidth size="small">
            <InputLabel>Metric</InputLabel>
            <Select value={metric} label="metric" onChange={(e) => setMetric(e.target.value)}>
              <MenuItem value={"index"}>Index</MenuItem>
              <MenuItem value={"totalRainfall"}>Total Rainfall</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sx={{ marginLeft: "1.5rem", marginTop: "1rem" }}>
          <FormControl fullWidth size="small">
            <InputLabel>Interval</InputLabel>
            <Select
              value={intervals}
              label="Interval"
              onChange={handleChange}
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
              {monthRanges.map((intervalOption) => (
                <MenuItem key={intervalOption} value={intervalOption}>
                  <Checkbox checked={intervals.indexOf(intervalOption) > -1} />
                  <ListItemText primary={intervalOption} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: 300, width: "70rem", marginTop: "1rem" }}>
            <ResponsiveContainer>
              <LineChart
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
                <Tooltip />
                <Legend />
                <Brush dataKey="year" height={30} x={70} />
                {intervals.map((interval, index) => (
                  <Line
                    key={`${intervalMap[interval]}-${metric}-${index}`}
                    type="monotone"
                    dataKey={`${intervalMap[interval]}-${metric}`}
                    stroke={colours[index]}
                    activeDot={{ r: 8 }}
                    name={monthRanges[index]}
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
