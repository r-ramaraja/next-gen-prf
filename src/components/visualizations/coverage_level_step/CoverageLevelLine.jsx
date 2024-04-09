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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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

export default function CoverageLevelLine({ visualizationData, isOverviewView, state, county }) {
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
    for (const coverageLevel of coverageLevelValues) {
      const coverageLevelData = visualizationData[coverageLevel]
        ? visualizationData[coverageLevel][year] ?? {}
        : {};

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
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ marginLeft: "1.5rem", marginTop: "2rem" }} align="center">
          {isOverviewView && "Coverage Level - "} {"Total " + labels[metric]} Over Time
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
                    : value.toLocaleString("en-US");
                }}
              />
              <Tooltip
                formatter={(value, name, props) => {
                  return props.dataKey.split("-")[1] === "indemnity" ||
                    props.dataKey.split("-")[1] === "premium"
                    ? currencyFormatter(value)
                    : value.toLocaleString("en-US");
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
      <Grid item xs={12}>
        {metric === "indemnity" && (
          <Typography variant="subtitle" sx={{ marginTop: "2rem" }}>
            <p>
              The above graph visualizes the total indemnity payments received for each coverage
              level from 2007 to {new Date().getFullYear() - 1} in {county}, {state}.
            </p>
            <p>
              The data is categorized into five coverage level categories: 70%, 75%, 80%, 85%, 90%.
            </p>
            <p>
              The X-axis represents the timeline from the year 2007 to{" "}
              {new Date().getFullYear() - 1}. The Y-axis represents the total indemnity amount in
              U.S. dollars.
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
            <p>
              The points on each line correspond to the amount of total indemnity received in that
              year.
            </p>
            <p>
              The brush tool at the bottom of the graph can be used to zoom in on a specific range
              of years.
            </p>
            <p>The summary for the years 2007 - {new Date().getFullYear() - 1} is as follows:</p>
            <Grid container>
              <Grid item xs={10}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Metrics</TableCell>
                        <TableCell align="right">70% coverage level</TableCell>
                        <TableCell align="right">75% coverage level</TableCell>
                        <TableCell align="right">80% coverage level</TableCell>
                        <TableCell align="right">85% coverage level</TableCell>
                        <TableCell align="right">90% coverage level</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          header: "Sum",
                          70: visualizationData[0.7]
                            ? currencyFormatter(visualizationData["0.7_total_indemnity"])
                            : "No data available",
                          75: visualizationData[0.75]
                            ? currencyFormatter(visualizationData["0.75_total_indemnity"])
                            : "No data available",
                          80: visualizationData[0.8]
                            ? currencyFormatter(visualizationData["0.8_total_indemnity"])
                            : "No data available",
                          85: visualizationData[0.85]
                            ? currencyFormatter(visualizationData["0.85_total_indemnity"])
                            : "No data available",
                          90: visualizationData[0.9]
                            ? currencyFormatter(visualizationData["0.9_total_indemnity"])
                            : "No data available",
                        },
                        {
                          header: "Average",
                          70: visualizationData[0.7]
                            ? currencyFormatter(visualizationData["0.7_avg_indemnity"])
                            : "No data available",
                          75: visualizationData[0.75]
                            ? currencyFormatter(visualizationData["0.75_avg_indemnity"])
                            : "No data available",
                          80: visualizationData[0.8]
                            ? currencyFormatter(visualizationData["0.8_avg_indemnity"])
                            : "No data available",
                          85: visualizationData[0.85]
                            ? currencyFormatter(visualizationData["0.85_avg_indemnity"])
                            : "No data available",
                          90: visualizationData[0.9]
                            ? currencyFormatter(visualizationData["0.9_avg_indemnity"])
                            : "No data available",
                        },
                        {
                          header: "Max",
                          70: visualizationData[0.7]
                            ? `${currencyFormatter(visualizationData["0.7_max_indemnity"].value)}
                            ${
                              visualizationData["0.7_max_indemnity"].year &&
                              ` in ${visualizationData["0.7_max_indemnity"].year}`
                            }`
                            : "No data available",
                          75: visualizationData[0.75]
                            ? `${currencyFormatter(visualizationData["0.75_max_indemnity"].value)}
                          ${
                            visualizationData["0.75_max_indemnity"].year &&
                            ` in ${visualizationData["0.75_max_indemnity"].year}`
                          }`
                            : "No data available",
                          80: visualizationData[0.8]
                            ? `${currencyFormatter(visualizationData["0.8_max_indemnity"].value)}
                          ${
                            visualizationData["0.8_max_indemnity"].year &&
                            ` in ${visualizationData["0.8_max_indemnity"].year}`
                          }`
                            : "No data available",
                          85: visualizationData[0.85]
                            ? `${currencyFormatter(visualizationData["0.85_max_indemnity"].value)}
                          ${
                            visualizationData["0.85_max_indemnity"].year &&
                            ` in ${visualizationData["0.85_max_indemnity"].year}`
                          }`
                            : "No data available",
                          90: visualizationData[0.9]
                            ? `${currencyFormatter(visualizationData["0.9_max_indemnity"].value)}
                          ${
                            visualizationData["0.9_max_indemnity"].year &&
                            ` in ${visualizationData["0.9_max_indemnity"].year}`
                          }`
                            : "No data available",
                        },
                        {
                          header: "Min (non-zero)",
                          70: visualizationData[0.7]
                            ? `${currencyFormatter(visualizationData["0.7_min_indemnity"].value)}
                          ${
                            visualizationData["0.7_min_indemnity"].year &&
                            ` in ${visualizationData["0.7_min_indemnity"].year}`
                          }`
                            : "No data available",
                          75: visualizationData[0.75]
                            ? `${currencyFormatter(visualizationData["0.75_min_indemnity"].value)}
                          ${
                            visualizationData["0.75_min_indemnity"].year &&
                            ` in ${visualizationData["0.75_min_indemnity"].year}`
                          }`
                            : "No data available",
                          80: visualizationData[0.8]
                            ? `${currencyFormatter(visualizationData["0.8_min_indemnity"].value)}
                          ${
                            visualizationData["0.8_min_indemnity"].year &&
                            ` in ${visualizationData["0.8_min_indemnity"].year}`
                          }`
                            : "No data available",
                          85: visualizationData[0.85]
                            ? `${currencyFormatter(visualizationData["0.85_min_indemnity"].value)}
                          ${
                            visualizationData["0.85_min_indemnity"].year &&
                            ` in ${visualizationData["0.85_min_indemnity"].year}`
                          }`
                            : "No data available",
                          90: visualizationData[0.9]
                            ? `${currencyFormatter(visualizationData["0.9_min_indemnity"].value)}
                          ${
                            visualizationData["0.9_min_indemnity"].year &&
                            ` in ${visualizationData["0.9_min_indemnity"].year}`
                          }`
                            : "No data available",
                        },
                      ].map((row) => (
                        <TableRow key={row.header}>
                          <TableCell component="th" scope="row">
                            <strong> {row.header}</strong>
                          </TableCell>
                          <TableCell align="right">{row[70]}</TableCell>
                          <TableCell align="right">{row[75]}</TableCell>
                          <TableCell align="right">{row[80]}</TableCell>
                          <TableCell align="right">{row[85]}</TableCell>
                          <TableCell align="right">{row[90]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Typography>
        )}
        {metric === "premium" && (
          <Typography variant="subtitle" sx={{ marginTop: "2rem" }}>
            <p>
              The above graph visualizes the total premium for each coverage level from 2007 to{" "}
              {new Date().getFullYear() - 1} in {county}, {state}.
            </p>
            <p>
              The data is categorized into five coverage level categories: 70%, 75%, 80%, 85%, 90%.
            </p>
            <p>
              The X-axis represents the timeline from the year 2007 to{" "}
              {new Date().getFullYear() - 1}. The Y-axis represents the total premium amount in U.S.
              dollars.
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
            <p>The points on each line correspond to the amount of total premium in that year.</p>
            <p>
              The brush tool at the bottom of the graph can be used to zoom in on a specific range
              of years.
            </p>
            <p>The summary for the years 2007 - {new Date().getFullYear() - 1} is as follows:</p>
            <Grid container>
              <Grid item xs={10}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Metrics</TableCell>
                        <TableCell align="right">70% coverage level</TableCell>
                        <TableCell align="right">75% coverage level</TableCell>
                        <TableCell align="right">80% coverage level</TableCell>
                        <TableCell align="right">85% coverage level</TableCell>
                        <TableCell align="right">90% coverage level</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          header: "Sum",
                          70: visualizationData[0.7]
                            ? currencyFormatter(visualizationData["0.7_total_premium"])
                            : "No data available",
                          75: visualizationData[0.75]
                            ? currencyFormatter(visualizationData["0.75_total_premium"])
                            : "No data available",
                          80: visualizationData[0.8]
                            ? currencyFormatter(visualizationData["0.8_total_premium"])
                            : "No data available",
                          85: visualizationData[0.85]
                            ? currencyFormatter(visualizationData["0.85_total_premium"])
                            : "No data available",
                          90: visualizationData[0.9]
                            ? currencyFormatter(visualizationData["0.9_total_premium"])
                            : "No data available",
                        },
                        {
                          header: "Average",
                          70: visualizationData[0.7]
                            ? currencyFormatter(visualizationData["0.7_avg_premium"])
                            : "No data available",
                          75: visualizationData[0.75]
                            ? currencyFormatter(visualizationData["0.75_avg_premium"])
                            : "No data available",
                          80: visualizationData[0.8]
                            ? currencyFormatter(visualizationData["0.8_avg_premium"])
                            : "No data available",
                          85: visualizationData[0.85]
                            ? currencyFormatter(visualizationData["0.85_avg_premium"])
                            : "No data available",
                          90: visualizationData[0.9]
                            ? currencyFormatter(visualizationData["0.9_avg_premium"])
                            : "No data available",
                        },
                        {
                          header: "Max",
                          70: visualizationData[0.7]
                            ? `${currencyFormatter(visualizationData["0.7_max_premium"].value)}
                            ${
                              visualizationData["0.7_max_premium"].year &&
                              ` in ${visualizationData["0.7_max_premium"].year}`
                            }`
                            : "No data available",
                          75: visualizationData[0.75]
                            ? `${currencyFormatter(visualizationData["0.75_max_premium"].value)}
                          ${
                            visualizationData["0.75_max_premium"].year &&
                            ` in ${visualizationData["0.75_max_premium"].year}`
                          }`
                            : "No data available",
                          80: visualizationData[0.8]
                            ? `${currencyFormatter(visualizationData["0.8_max_premium"].value)}
                          ${
                            visualizationData["0.8_max_premium"].year &&
                            ` in ${visualizationData["0.8_max_premium"].year}`
                          }`
                            : "No data available",
                          85: visualizationData[0.85]
                            ? `${currencyFormatter(visualizationData["0.85_max_premium"].value)}
                          ${
                            visualizationData["0.85_max_premium"].year &&
                            ` in ${visualizationData["0.85_max_premium"].year}`
                          }`
                            : "No data available",
                          90: visualizationData[0.9]
                            ? `${currencyFormatter(visualizationData["0.9_max_premium"].value)}
                          ${
                            visualizationData["0.9_max_premium"].year &&
                            ` in ${visualizationData["0.9_max_premium"].year}`
                          }`
                            : "No data available",
                        },
                        {
                          header: "Min (non-zero)",
                          70: visualizationData[0.7]
                            ? `${currencyFormatter(visualizationData["0.7_min_premium"].value)}
                          ${
                            visualizationData["0.7_min_premium"].year &&
                            ` in ${visualizationData["0.7_min_premium"].year}`
                          }`
                            : "No data available",
                          75: visualizationData[0.75]
                            ? `${currencyFormatter(visualizationData["0.75_min_premium"].value)}
                          ${
                            visualizationData["0.75_min_premium"].year &&
                            ` in ${visualizationData["0.75_min_premium"].year}`
                          }`
                            : "No data available",
                          80: visualizationData[0.8]
                            ? `${currencyFormatter(visualizationData["0.8_min_premium"].value)}
                          ${
                            visualizationData["0.8_min_premium"].year &&
                            ` in ${visualizationData["0.8_min_premium"].year}`
                          }`
                            : "No data available",
                          85: visualizationData[0.85]
                            ? `${currencyFormatter(visualizationData["0.85_min_premium"].value)}
                          ${
                            visualizationData["0.85_min_premium"].year &&
                            ` in ${visualizationData["0.85_min_premium"].year}`
                          }`
                            : "No data available",
                          90: visualizationData[0.9]
                            ? `${currencyFormatter(visualizationData["0.9_min_premium"].value)}
                          ${
                            visualizationData["0.9_min_premium"].year &&
                            ` in ${visualizationData["0.9_min_premium"].year}`
                          }`
                            : "No data available",
                        },
                      ].map((row) => (
                        <TableRow key={row.header}>
                          <TableCell component="th" scope="row">
                            <strong> {row.header}</strong>
                          </TableCell>
                          <TableCell align="right">{row[70]}</TableCell>
                          <TableCell align="right">{row[75]}</TableCell>
                          <TableCell align="right">{row[80]}</TableCell>
                          <TableCell align="right">{row[85]}</TableCell>
                          <TableCell align="right">{row[90]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Typography>
        )}
        {metric === "acres" && (
          <Typography variant="subtitle" sx={{ marginTop: "2rem" }}>
            <p>
              The above graph visualizes the total acres insured for each coverage level from 2007
              to {new Date().getFullYear() - 1} in {county}, {state}.
            </p>
            <p>
              The data is categorized into five coverage level categories: 70%, 75%, 80%, 85%, 90%.
            </p>
            <p>
              The X-axis represents the timeline from the year 2007 to{" "}
              {new Date().getFullYear() - 1}. The Y-axis represents the total acres insured.
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
            <p>
              The points on each line correspond to the amount of total acres insured in that year.
            </p>
            <p>
              The brush tool at the bottom of the graph can be used to zoom in on a specific range
              of years.
            </p>
            <p>The summary for the years 2007 - {new Date().getFullYear() - 1} is as follows:</p>
            <Grid container>
              <Grid item xs={10}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Metrics</TableCell>
                        <TableCell align="right">70% coverage level</TableCell>
                        <TableCell align="right">75% coverage level</TableCell>
                        <TableCell align="right">80% coverage level</TableCell>
                        <TableCell align="right">85% coverage level</TableCell>
                        <TableCell align="right">90% coverage level</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          header: "Sum",
                          70: visualizationData[0.7]
                            ? visualizationData["0.7_total_acres"].toLocaleString("en-US")
                            : "No data available",
                          75: visualizationData[0.75]
                            ? visualizationData["0.75_total_acres"].toLocaleString("en-US")
                            : "No data available",
                          80: visualizationData[0.8]
                            ? visualizationData["0.8_total_acres"].toLocaleString("en-US")
                            : "No data available",
                          85: visualizationData[0.85]
                            ? visualizationData["0.85_total_acres"].toLocaleString("en-US")
                            : "No data available",
                          90: visualizationData[0.9]
                            ? visualizationData["0.9_total_acres"].toLocaleString("en-US")
                            : "No data available",
                        },
                        {
                          header: "Average",
                          70: visualizationData[0.7]
                            ? visualizationData["0.7_avg_acres"].toLocaleString("en-US")
                            : "No data available",
                          75: visualizationData[0.75]
                            ? visualizationData["0.75_avg_acres"].toLocaleString("en-US")
                            : "No data available",
                          80: visualizationData[0.8]
                            ? visualizationData["0.8_avg_acres"].toLocaleString("en-US")
                            : "No data available",
                          85: visualizationData[0.85]
                            ? visualizationData["0.85_avg_acres"].toLocaleString("en-US")
                            : "No data available",
                          90: visualizationData[0.9]
                            ? visualizationData["0.9_avg_acres"].toLocaleString("en-US")
                            : "No data available",
                        },
                        {
                          header: "Max",
                          70: visualizationData[0.7]
                            ? `${visualizationData["0.7_max_acres"].value.toLocaleString("en-US")}
                            ${
                              visualizationData["0.7_max_acres"].year &&
                              ` in ${visualizationData["0.7_max_acres"].year}`
                            }`
                            : "No data available",
                          75: visualizationData[0.75]
                            ? `${visualizationData["0.75_max_acres"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.75_max_acres"].year &&
                            ` in ${visualizationData["0.75_max_acres"].year}`
                          }`
                            : "No data available",
                          80: visualizationData[0.8]
                            ? `${visualizationData["0.8_max_acres"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.8_max_acres"].year &&
                            ` in ${visualizationData["0.8_max_acres"].year}`
                          }`
                            : "No data available",
                          85: visualizationData[0.85]
                            ? `${visualizationData["0.85_max_acres"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.85_max_acres"].year &&
                            ` in ${visualizationData["0.85_max_acres"].year}`
                          }`
                            : "No data available",
                          90: visualizationData[0.9]
                            ? `${visualizationData["0.9_max_acres"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.9_max_acres"].year &&
                            ` in ${visualizationData["0.9_max_acres"].year}`
                          }`
                            : "No data available",
                        },
                        {
                          header: "Min (non-zero)",
                          70: visualizationData[0.7]
                            ? `${visualizationData["0.7_min_acres"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.7_min_acres"].year &&
                            ` in ${visualizationData["0.7_min_acres"].year}`
                          }`
                            : "No data available",
                          75: visualizationData[0.75]
                            ? `${visualizationData["0.75_min_acres"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.75_min_acres"].year &&
                            ` in ${visualizationData["0.75_min_acres"].year}`
                          }`
                            : "No data available",
                          80: visualizationData[0.8]
                            ? `${visualizationData["0.8_min_acres"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.8_min_acres"].year &&
                            ` in ${visualizationData["0.8_min_acres"].year}`
                          }`
                            : "No data available",
                          85: visualizationData[0.85]
                            ? `${visualizationData["0.85_min_acres"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.85_min_acres"].year &&
                            ` in ${visualizationData["0.85_min_acres"].year}`
                          }`
                            : "No data available",
                          90: visualizationData[0.9]
                            ? `${visualizationData["0.9_min_acres"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.9_min_acres"].year &&
                            ` in ${visualizationData["0.9_min_acres"].year}`
                          }`
                            : "No data available",
                        },
                      ].map((row) => (
                        <TableRow key={row.header}>
                          <TableCell component="th" scope="row">
                            <strong> {row.header}</strong>
                          </TableCell>
                          <TableCell align="right">{row[70]}</TableCell>
                          <TableCell align="right">{row[75]}</TableCell>
                          <TableCell align="right">{row[80]}</TableCell>
                          <TableCell align="right">{row[85]}</TableCell>
                          <TableCell align="right">{row[90]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Typography>
        )}
        {metric === "policies_sold" && (
          <Typography variant="subtitle" sx={{ marginTop: "2rem" }}>
            <p>
              The above graph visualizes the total policies sold for each coverage level from 2007
              to {new Date().getFullYear() - 1} in {county}, {state}.
            </p>
            <p>
              The data is categorized into five coverage level categories: 70%, 75%, 80%, 85%, 90%.
            </p>
            <p>
              The X-axis represents the timeline from the year 2007 to{" "}
              {new Date().getFullYear() - 1}. The Y-axis represents the total policies sold.
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
            <p>
              The points on each line correspond to the amount of total policies sold in that year.
            </p>
            <p>
              The brush tool at the bottom of the graph can be used to zoom in on a specific range
              of years.
            </p>
            <p>The summary for the years 2007 - {new Date().getFullYear() - 1} is as follows:</p>
            <Grid container>
              <Grid item xs={10}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Metrics</TableCell>
                        <TableCell align="right">70% coverage level</TableCell>
                        <TableCell align="right">75% coverage level</TableCell>
                        <TableCell align="right">80% coverage level</TableCell>
                        <TableCell align="right">85% coverage level</TableCell>
                        <TableCell align="right">90% coverage level</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          header: "Sum",
                          70: visualizationData[0.7]
                            ? visualizationData["0.7_total_sold"].toLocaleString("en-US")
                            : "No data available",
                          75: visualizationData[0.75]
                            ? visualizationData["0.75_total_sold"].toLocaleString("en-US")
                            : "No data available",
                          80: visualizationData[0.8]
                            ? visualizationData["0.8_total_sold"].toLocaleString("en-US")
                            : "No data available",
                          85: visualizationData[0.85]
                            ? visualizationData["0.85_total_sold"].toLocaleString("en-US")
                            : "No data available",
                          90: visualizationData[0.9]
                            ? visualizationData["0.9_total_sold"].toLocaleString("en-US")
                            : "No data available",
                        },
                        {
                          header: "Average",
                          70: visualizationData[0.7]
                            ? visualizationData["0.7_avg_sold"].toLocaleString("en-US")
                            : "No data available",
                          75: visualizationData[0.75]
                            ? visualizationData["0.75_avg_sold"].toLocaleString("en-US")
                            : "No data available",
                          80: visualizationData[0.8]
                            ? visualizationData["0.8_avg_sold"].toLocaleString("en-US")
                            : "No data available",
                          85: visualizationData[0.85]
                            ? visualizationData["0.85_avg_sold"].toLocaleString("en-US")
                            : "No data available",
                          90: visualizationData[0.9]
                            ? visualizationData["0.9_avg_sold"].toLocaleString("en-US")
                            : "No data available",
                        },
                        {
                          header: "Max",
                          70: visualizationData[0.7]
                            ? `${visualizationData["0.7_max_sold"].value.toLocaleString("en-US")}
                            ${
                              visualizationData["0.7_max_sold"].year &&
                              ` in ${visualizationData["0.7_max_sold"].year}`
                            }`
                            : "No data available",
                          75: visualizationData[0.75]
                            ? `${visualizationData["0.75_max_sold"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.75_max_sold"].year &&
                            ` in ${visualizationData["0.75_max_sold"].year}`
                          }`
                            : "No data available",
                          80: visualizationData[0.8]
                            ? `${visualizationData["0.8_max_sold"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.8_max_sold"].year &&
                            ` in ${visualizationData["0.8_max_sold"].year}`
                          }`
                            : "No data available",
                          85: visualizationData[0.85]
                            ? `${visualizationData["0.85_max_sold"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.85_max_sold"].year &&
                            ` in ${visualizationData["0.85_max_sold"].year}`
                          }`
                            : "No data available",
                          90: visualizationData[0.9]
                            ? `${visualizationData["0.9_max_sold"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.9_max_sold"].year &&
                            ` in ${visualizationData["0.9_max_sold"].year}`
                          }`
                            : "No data available",
                        },
                        {
                          header: "Min (non-zero)",
                          70: visualizationData[0.7]
                            ? `${visualizationData["0.7_min_sold"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.7_min_sold"].year &&
                            ` in ${visualizationData["0.7_min_sold"].year}`
                          }`
                            : "No data available",
                          75: visualizationData[0.75]
                            ? `${visualizationData["0.75_min_sold"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.75_min_sold"].year &&
                            ` in ${visualizationData["0.75_min_sold"].year}`
                          }`
                            : "No data available",
                          80: visualizationData[0.8]
                            ? `${visualizationData["0.8_min_sold"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.8_min_sold"].year &&
                            ` in ${visualizationData["0.8_min_sold"].year}`
                          }`
                            : "No data available",
                          85: visualizationData[0.85]
                            ? `${visualizationData["0.85_min_sold"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.85_min_sold"].year &&
                            ` in ${visualizationData["0.85_min_sold"].year}`
                          }`
                            : "No data available",
                          90: visualizationData[0.9]
                            ? `${visualizationData["0.9_min_sold"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.9_min_sold"].year &&
                            ` in ${visualizationData["0.9_min_sold"].year}`
                          }`
                            : "No data available",
                        },
                      ].map((row) => (
                        <TableRow key={row.header}>
                          <TableCell component="th" scope="row">
                            <strong> {row.header}</strong>
                          </TableCell>
                          <TableCell align="right">{row[70]}</TableCell>
                          <TableCell align="right">{row[75]}</TableCell>
                          <TableCell align="right">{row[80]}</TableCell>
                          <TableCell align="right">{row[85]}</TableCell>
                          <TableCell align="right">{row[90]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Typography>
        )}
        {metric === "policies_indemnified" && (
          <Typography variant="subtitle" sx={{ marginTop: "2rem" }}>
            <p>
              The above graph visualizes the total policies indemnified for each coverage level from
              2007 to {new Date().getFullYear() - 1} in {county}, {state}.
            </p>
            <p>
              The data is categorized into five coverage level categories: 70%, 75%, 80%, 85%, 90%.
            </p>
            <p>
              The X-axis represents the timeline from the year 2007 to{" "}
              {new Date().getFullYear() - 1}. The Y-axis represents the total policies indemnified.
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
            <p>
              The points on each line correspond to the amount of total policies indemnified in that
              year.
            </p>
            <p>
              The brush tool at the bottom of the graph can be used to zoom in on a specific range
              of years.
            </p>
            <p>The summary for the years 2007 - {new Date().getFullYear() - 1} is as follows:</p>
            <Grid container>
              <Grid item xs={10}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Metrics</TableCell>
                        <TableCell align="right">70% coverage level</TableCell>
                        <TableCell align="right">75% coverage level</TableCell>
                        <TableCell align="right">80% coverage level</TableCell>
                        <TableCell align="right">85% coverage level</TableCell>
                        <TableCell align="right">90% coverage level</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          header: "Sum",
                          70: visualizationData[0.7]
                            ? visualizationData["0.7_total_indemnified"].toLocaleString("en-US")
                            : "No data available",
                          75: visualizationData[0.75]
                            ? visualizationData["0.75_total_indemnified"].toLocaleString("en-US")
                            : "No data available",
                          80: visualizationData[0.8]
                            ? visualizationData["0.8_total_indemnified"].toLocaleString("en-US")
                            : "No data available",
                          85: visualizationData[0.85]
                            ? visualizationData["0.85_total_indemnified"].toLocaleString("en-US")
                            : "No data available",
                          90: visualizationData[0.9]
                            ? visualizationData["0.9_total_indemnified"].toLocaleString("en-US")
                            : "No data available",
                        },
                        {
                          header: "Average",
                          70: visualizationData[0.7]
                            ? visualizationData["0.7_avg_indemnified"].toLocaleString("en-US")
                            : "No data available",
                          75: visualizationData[0.75]
                            ? visualizationData["0.75_avg_indemnified"].toLocaleString("en-US")
                            : "No data available",
                          80: visualizationData[0.8]
                            ? visualizationData["0.8_avg_indemnified"].toLocaleString("en-US")
                            : "No data available",
                          85: visualizationData[0.85]
                            ? visualizationData["0.85_avg_indemnified"].toLocaleString("en-US")
                            : "No data available",
                          90: visualizationData[0.9]
                            ? visualizationData["0.9_avg_indemnified"].toLocaleString("en-US")
                            : "No data available",
                        },
                        {
                          header: "Max",
                          70: visualizationData[0.7]
                            ? `${visualizationData["0.7_max_indemnified"].value.toLocaleString("en-US")}
                            ${
                              visualizationData["0.7_max_indemnified"].year &&
                              ` in ${visualizationData["0.7_max_indemnified"].year}`
                            }`
                            : "No data available",
                          75: visualizationData[0.75]
                            ? `${visualizationData["0.75_max_indemnified"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.75_max_indemnified"].year &&
                            ` in ${visualizationData["0.75_max_indemnified"].year}`
                          }`
                            : "No data available",
                          80: visualizationData[0.8]
                            ? `${visualizationData["0.8_max_indemnified"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.8_max_indemnified"].year &&
                            ` in ${visualizationData["0.8_max_indemnified"].year}`
                          }`
                            : "No data available",
                          85: visualizationData[0.85]
                            ? `${visualizationData["0.85_max_indemnified"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.85_max_indemnified"].year &&
                            ` in ${visualizationData["0.85_max_indemnified"].year}`
                          }`
                            : "No data available",
                          90: visualizationData[0.9]
                            ? `${visualizationData["0.9_max_indemnified"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.9_max_indemnified"].year &&
                            ` in ${visualizationData["0.9_max_indemnified"].year}`
                          }`
                            : "No data available",
                        },
                        {
                          header: "Min (non-zero)",
                          70: visualizationData[0.7]
                            ? `${visualizationData["0.7_min_indemnified"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.7_min_indemnified"].year &&
                            ` in ${visualizationData["0.7_min_indemnified"].year}`
                          }`
                            : "No data available",
                          75: visualizationData[0.75]
                            ? `${visualizationData["0.75_min_indemnified"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.75_min_indemnified"].year &&
                            ` in ${visualizationData["0.75_min_indemnified"].year}`
                          }`
                            : "No data available",
                          80: visualizationData[0.8]
                            ? `${visualizationData["0.8_min_indemnified"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.8_min_indemnified"].year &&
                            ` in ${visualizationData["0.8_min_indemnified"].year}`
                          }`
                            : "No data available",
                          85: visualizationData[0.85]
                            ? `${visualizationData["0.85_min_indemnified"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.85_min_indemnified"].year &&
                            ` in ${visualizationData["0.85_min_indemnified"].year}`
                          }`
                            : "No data available",
                          90: visualizationData[0.9]
                            ? `${visualizationData["0.9_min_indemnified"].value.toLocaleString("en-US")}
                          ${
                            visualizationData["0.9_min_indemnified"].year &&
                            ` in ${visualizationData["0.9_min_indemnified"].year}`
                          }`
                            : "No data available",
                        },
                      ].map((row) => (
                        <TableRow key={row.header}>
                          <TableCell component="th" scope="row">
                            <strong> {row.header}</strong>
                          </TableCell>
                          <TableCell align="right">{row[70]}</TableCell>
                          <TableCell align="right">{row[75]}</TableCell>
                          <TableCell align="right">{row[80]}</TableCell>
                          <TableCell align="right">{row[85]}</TableCell>
                          <TableCell align="right">{row[90]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
