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
import { Typography } from "@mui/material";
import { monthRanges, coverageLevelValues } from "../../../constants";

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

export default function InvocationsLine({ visualizationData, isOverviewView }) {
  const { invocations } = visualizationData;

  const [coverageLevels, setCoverageLevels] = useState(coverageLevelValues);

  const data = [];
  for (const interval of monthRanges) {
    const intervalData = { interval };
    for (const coverageLevel of Object.keys(invocations).sort()) {
      const coverageLevelData = invocations[coverageLevel];
      intervalData[`coverageLevel`] = coverageLevel;
      intervalData[`${coverageLevel}-invocations`] = coverageLevelData[interval] || 0;
    }
    data.push(intervalData);
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
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ marginLeft: "1.5rem", marginTop: "2rem" }} align="center">
            {isOverviewView && "Intervals - "} Total Triggers (2007 - {new Date().getFullYear() - 1}
            )
          </Typography>
        </Grid>
        <Grid item sx={{ marginLeft: "1.5rem", marginTop: "1rem" }}>
          <FormControl fullWidth size="small">
            <InputLabel>Coverage</InputLabel>
            <Select
              value={coverageLevels}
              label="Coverage"
              onChange={handleCoverageLevelChange}
              multiple
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={`${value * 100}%`} />
                  ))}
                </Box>
              )}
              input={<OutlinedInput label="Coverage" />}
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
                  left: 85,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="interval"
                  interval={0}
                  angle={14}
                  label={{ value: "Intervals", position: "insideBottom", offset: -15 }}
                />
                <YAxis
                  label={{
                    value: "Trigger Count",
                    position: "insideLeft",
                    offset: -70,
                  }}
                />
                <Tooltip />
                <Legend verticalAlign="top" />
                {coverageLevels.map((coverageLevel, index) => (
                  <Line
                    key={`${coverageLevel}-${index}`}
                    dataKey={`${coverageLevel}-invocations`}
                    activeDot={{ r: 8 }}
                    stroke={colours[index]}
                    name={`${coverageLevel * 100}%`}
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
