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

export default function InvocationsLine({ visualizationData, isOverviewView, gridcode }) {
  console.log("🚀 ~ InvocationsLine ~ visualizationData:", visualizationData);
  const { invocations } = visualizationData;

  const [coverageLevels, setCoverageLevels] = useState(coverageLevelValues);
  console.log("🚀 ~ InvocationsLine ~ coverageLevels:", coverageLevels);

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
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ marginLeft: "1.5rem", marginTop: "2rem" }} align="center">
          {isOverviewView && "Intervals - "} Total Triggers (2007 - {new Date().getFullYear() - 1})
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
      <Grid item xs={12}>
        <Typography variant="subtitle" sx={{ marginTop: "2rem" }}>
          <p>
            The above graph visualizes the total triggers for each coverage level from 2007 to{" "}
            {new Date().getFullYear() - 1}
            in CPC Grid Code {gridcode}.
            <br />A trigger is when the rainfall index falls below the coverage level threshold. For
            example, if the rainfall index is 0.88, that will be counted as one trigger for the 90%
            coverage level.
          </p>
          <p>
            The data is categorized into five coverage level categories: 70%, 75%, 80%, 85%, 90%.
          </p>
          <p>
            The X-axis represents the timeline from the bi-monthly intervals from Jan-Feb to
            Nov-Dec. The Y-axis represents the total triggers.
          </p>
          <p>There are five lines for each coverage level, each in a different color:</p>
          <ol>
            <li>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "3px",
                  backgroundColor: colours[0],
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              represents the 70% coverage level.
            </li>
            <li>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "3px",
                  backgroundColor: colours[1],
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              represents the 75% coverage level.
            </li>
            <li>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "3px",
                  backgroundColor: colours[2],
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              represents the 80% coverage level.
            </li>
            <li>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "3px",
                  backgroundColor: colours[3],
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              represents the 85% coverage level.
            </li>
            <li>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "3px",
                  backgroundColor: colours[4],
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              represents the 90% coverage level.
            </li>
          </ol>
          <p>The points on each line correspond to the total triggers in that year.</p>
          <p>The summary for the years 2007 - {new Date().getFullYear() - 1} is as follows:</p>
          <Grid container>
            <Grid item xs={4}>
              <p>
                <strong>For 70% coverage level:</strong>
                <br />
                {coverageLevels.includes(0.7) && (
                  <ul>
                    <li>Sum: {visualizationData["0.7_total_triggers"].toLocaleString("en-US")}</li>
                    <li>
                      Max: {visualizationData["0.7_max_triggers"].value.toLocaleString("en-US")}
                      {visualizationData["0.7_max_triggers"].interval &&
                        ` in
                      ${visualizationData["0.7_max_triggers"].interval}.`}
                    </li>
                    <li>
                      Min: {visualizationData["0.7_min_triggers"].value.toLocaleString("en-US")}
                      {visualizationData["0.7_min_triggers"].interval &&
                        ` in
                      ${visualizationData["0.7_min_triggers"].interval}.`}
                    </li>
                  </ul>
                )}
              </p>
            </Grid>
            <Grid item xs={4}>
              <p>
                <strong>For 75% coverage level:</strong>
                <br />
                {coverageLevels.includes(0.75) && (
                  <ul>
                    <li>Sum: {visualizationData["0.75_total_triggers"].toLocaleString("en-US")}</li>
                    <li>
                      Max: {visualizationData["0.75_max_triggers"].value.toLocaleString("en-US")}
                      {visualizationData["0.75_max_triggers"].interval &&
                        ` in
                      ${visualizationData["0.75_max_triggers"].interval}.`}
                    </li>
                    <li>
                      Min: {visualizationData["0.75_min_triggers"].value.toLocaleString("en-US")}
                      {visualizationData["0.75_min_triggers"].interval &&
                        ` in
                      ${visualizationData["0.75_min_triggers"].interval}.`}
                    </li>
                  </ul>
                )}
              </p>
            </Grid>
            <Grid item xs={4}>
              <p>
                <strong>For 80% coverage level:</strong>
                <br />
                {coverageLevels.includes(0.8) && (
                  <ul>
                    <li>Sum: {visualizationData["0.8_total_triggers"].toLocaleString("en-US")}</li>
                    <li>
                      Max: {visualizationData["0.8_max_triggers"].value.toLocaleString("en-US")}
                      {visualizationData["0.8_max_triggers"].interval &&
                        ` in
                      ${visualizationData["0.8_max_triggers"].interval}.`}
                    </li>
                    <li>
                      Min: {visualizationData["0.8_min_triggers"].value.toLocaleString("en-US")}
                      {visualizationData["0.8_min_triggers"].interval &&
                        ` in
                      ${visualizationData["0.8_min_triggers"].interval}.`}
                    </li>
                  </ul>
                )}
              </p>
            </Grid>
            <Grid item xs={4}>
              <p>
                <strong>For 85% coverage level:</strong>
                <br />
                {coverageLevels.includes(0.85) && (
                  <ul>
                    <li>Sum: {visualizationData["0.85_total_triggers"].toLocaleString("en-US")}</li>
                    <li>
                      Max: {visualizationData["0.85_max_triggers"].value.toLocaleString("en-US")}
                      {visualizationData["0.85_max_triggers"].interval &&
                        ` in
                      ${visualizationData["0.85_max_triggers"].interval}.`}
                    </li>
                    <li>
                      Min: {visualizationData["0.85_min_triggers"].value.toLocaleString("en-US")}
                      {visualizationData["0.85_min_triggers"].interval &&
                        ` in
                      ${visualizationData["0.85_min_triggers"].interval}.`}
                    </li>
                  </ul>
                )}
              </p>
            </Grid>
            <Grid item xs={4}>
              <p>
                <strong>For 90% coverage level:</strong>
                <br />
                {coverageLevels.includes(0.9) && (
                  <ul>
                    <li>Sum: {visualizationData["0.9_total_triggers"].toLocaleString("en-US")}</li>
                    <li>
                      Max: {visualizationData["0.9_max_triggers"].value.toLocaleString("en-US")}
                      {visualizationData["0.9_max_triggers"].interval &&
                        ` in
                      ${visualizationData["0.9_max_triggers"].interval}.`}
                    </li>
                    <li>
                      Min: {visualizationData["0.9_min_triggers"].value.toLocaleString("en-US")}
                      {visualizationData["0.9_min_triggers"].interval &&
                        ` in
                      ${visualizationData["0.9_min_triggers"].interval}.`}
                    </li>
                  </ul>
                )}
              </p>
            </Grid>
          </Grid>
        </Typography>
      </Grid>
    </Grid>
  );
}
