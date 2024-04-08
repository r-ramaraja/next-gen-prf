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
  ReferenceLine,
} from "recharts";
import { Box, Grid } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";
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

export default function IntervalDistributionLine({ visualizationData, isOverviewView }) {
  const { metrics } = visualizationData;
  const [metric, setMetric] = useState("index");
  const [intervals, setIntervals] = useState([monthRanges[0]]);

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
  const years = Object.keys(metrics);

  for (const year of years) {
    let yearData = { year };
    for (const month of monthRanges) {
      const intervalCode = intervalMap[month];
      yearData = { ...yearData, month, intervalCode };
      yearData[`${intervalCode}-index`] = Math.round(metrics[year][month].index * 100) / 100;
      yearData[`${intervalCode}-totalRainfall`] = Math.round(metrics[year][month].total_rainfall);
    }
    data.push(yearData);
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setIntervals(typeof value === "string" ? value.split(",") : value);
  };

  const labels = {
    index: "Rainfall Index",
    totalRainfall: "Total Rainfall",
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ marginLeft: "1.5rem", marginTop: "2rem" }} align="center">
            {isOverviewView && "Intervals - "} {labels[metric]} Over Time
          </Typography>
        </Grid>
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
          <Box sx={{ height: 400, marginTop: "1rem" }}>
            <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 40,
                  left: 85,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{ value: "Years", position: "insideBottom", offset: -15 }}
                />
                <YAxis
                  label={{
                    value: labels[metric],
                    position: "insideLeft",
                    offset: -85,
                  }}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    return props.dataKey.split("-")[1] === "totalRainfall" ? `${value} mm` : value;
                  }}
                />
                <Legend verticalAlign="top" />
                <Brush dataKey="year" height={30} x={130} y={365} />
                {metric === "index" && (
                  <ReferenceLine
                    y={0.9}
                    label={{
                      value: "0.90",
                      position: "right",
                    }}
                    stroke="black"
                    strokeWidth={2}
                    isFront={true}
                  />
                )}
                {metric === "index" && (
                  <ReferenceLine
                    y={0.7}
                    label={{
                      value: "0.70",
                      position: "right",
                    }}
                    stroke="black"
                    strokeWidth={2}
                    isFront={true}
                  />
                )}
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
