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
  Brush,
} from "recharts";
import { Box, Grid } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { currencyFormatter } from "../../../constants";

export default function IntendedUseBar({ visualizationData, isOverviewView, state, county }) {
  const [metric, setMetric] = useState("indemnity");
  const [grazingKey, setGrazingKey] = useState("grazing_indemnity");
  const [hayingKey, setHayingKey] = useState("haying_indemnity");

  const handleChange = (event) => {
    setMetric(event.target.value);
    if (event.target.value === "indemnity") {
      setGrazingKey("grazing_indemnity");
      setHayingKey("haying_indemnity");
    } else if (event.target.value === "premium") {
      setGrazingKey("grazing_actual_premium");
      setHayingKey("haying_actual_premium");
    } else if (event.target.value === "acres") {
      setGrazingKey("grazing_acres");
      setHayingKey("haying_acres");
    }
  };

  const data = [];
  const grazing = visualizationData["grazing"] ?? {};

  const haying = visualizationData["haying"] ?? {};

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2007; year < currentYear; year++) {
    years.push(year);
  }

  for (const year of years) {
    const grazingData = grazing[year] ?? {};
    const hayingData = haying[year] ?? {};
    data.push({
      year,
      grazing_indemnity: grazingData.sum_indemnity ?? 0,
      grazing_actual_premium: grazingData.sum_actual_premium ?? 0,
      grazing_acres: grazingData.acres ?? 0,
      haying_indemnity: hayingData.sum_indemnity ?? 0,
      haying_actual_premium: hayingData.sum_actual_premium ?? 0,
      haying_acres: hayingData.acres ?? 0,
    });
  }

  const labels = {
    indemnity: "Indemnity",
    premium: "Premium",
    acres: "Acres",
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ marginLeft: "1.5rem", marginTop: "2rem" }} align="center">
          {isOverviewView && "Intended Use - "} {"Total " + labels[metric]} Over Time
        </Typography>
      </Grid>
      <Grid item sx={{ marginLeft: "1.5rem" }}>
        <FormControl fullWidth size="small">
          <InputLabel>Metric</InputLabel>
          <Select value={metric} label="metric" onChange={handleChange}>
            <MenuItem value={"indemnity"}>Indemnity</MenuItem>
            <MenuItem value={"premium"}>Premium</MenuItem>
            <MenuItem value={"acres"}>Acres</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ height: 400, marginTop: "1rem" }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 90,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                angle={14}
                label={{ value: "Years", position: "insideBottom", offset: -15 }}
              />
              <YAxis
                label={{
                  value: labels[metric],
                  position: "insideLeft",
                  offset: metric === "acres" ? -40 : -85,
                }}
                tickFormatter={(value) => {
                  return metric === "acres"
                    ? value.toLocaleString("en-US")
                    : currencyFormatter(value);
                }}
              />
              <Tooltip
                formatter={(value, name, props) => {
                  return props.dataKey === "grazing_acres" || props.dataKey === "haying_acres"
                    ? value.toLocaleString("en-US")
                    : currencyFormatter(value);
                }}
              />
              <Legend verticalAlign="top" />
              <Bar dataKey={grazingKey} fill="#8884d8" name="Grazing" />
              <Bar dataKey={hayingKey} fill="#82ca9d" name="Haying" />
              <Brush dataKey="year" height={30} x={140} y={365} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      <Grid item xs={12}>
        {metric === "indemnity" && (
          <Typography variant="subtitle" sx={{ marginTop: "2rem" }}>
            <p>
              The above graph visualizes the total indemnity payments received for each intended use
              from 2007 to {new Date().getFullYear() - 1} in {county}, {state}.
              <br />
              The data is categorized into two intended use categories: Grazing and Haying.
            </p>
            <p>
              The X-axis represents the timeline from 2007 to {new Date().getFullYear() - 1}. The
              Y-axis represents the total indemnity amount in U.S. dollars.
              <br />
              There are two bars for each year, each in a different color:
            </p>
            <ol>
              <li>
                <span
                  style={{
                    display: "inline-block",
                    width: "15px",
                    height: "15px",
                    backgroundColor: "#8884d8",
                    marginRight: "5px",
                  }}
                ></span>{" "}
                represents the {`"Grazing"`} intended use.
              </li>
              <li>
                <span
                  style={{
                    display: "inline-block",
                    width: "15px",
                    height: "15px",
                    backgroundColor: "#82ca9d",
                    marginRight: "5px",
                  }}
                ></span>{" "}
                represents the {`"Haying"`} intended use.
              </li>
            </ol>
            <p>
              The height of each bar corresponds to the amount of total indemnity received in that
              year.
            </p>

            <p>
              The brush tool at the bottom of the graph can be used to zoom in on a specific range
              of years.
            </p>
            <p>The summary for the years 2007 - {new Date().getFullYear() - 1} is as follows:</p>
            <Grid container>
              <Grid item xs={4}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Metrics</TableCell>
                        <TableCell align="right">Grazing</TableCell>
                        <TableCell align="right">Haying</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          header: "Sum",
                          grazing: visualizationData["grazing"]
                            ? currencyFormatter(visualizationData.grazing_total_indemnity)
                            : "No data avaialable",
                          haying: visualizationData["haying"]
                            ? currencyFormatter(visualizationData.haying_total_indemnity)
                            : "No data avaialable",
                        },
                        {
                          header: "Average",
                          grazing: visualizationData["grazing"]
                            ? currencyFormatter(visualizationData.grazing_avg_indemnity)
                            : "No data avaialable",
                          haying: visualizationData["haying"]
                            ? currencyFormatter(visualizationData.haying_avg_indemnity)
                            : "No data avaialable",
                        },
                        {
                          header: "Max",
                          grazing: visualizationData["grazing"]
                            ? `${currencyFormatter(visualizationData.grazing_max_indemnity.value)}
                        ${
                          visualizationData.grazing_max_indemnity.year &&
                          ` in ${visualizationData.grazing_max_indemnity.year}`
                        }`
                            : "No data avaialable",
                          haying: visualizationData["haying"]
                            ? `${currencyFormatter(visualizationData.haying_max_indemnity.value)}
                          ${
                            visualizationData.haying_max_indemnity.year &&
                            ` in ${visualizationData.haying_max_indemnity.year}`
                          }`
                            : "No data avaialable",
                        },
                        {
                          header: "Min (non-zero)",
                          grazing: visualizationData["grazing"]
                            ? `${currencyFormatter(visualizationData.grazing_min_indemnity.value)}
                        ${
                          visualizationData.grazing_min_indemnity.year &&
                          ` in ${visualizationData.grazing_min_indemnity.year}`
                        }`
                            : "No data avaialable",
                          haying: visualizationData["haying"]
                            ? `${currencyFormatter(visualizationData.haying_min_indemnity.value)}
                          ${
                            visualizationData.haying_min_indemnity.year &&
                            ` in ${visualizationData.haying_min_indemnity.year}`
                          }`
                            : "No data avaialable",
                        },
                      ].map((row) => (
                        <TableRow key={row.header}>
                          <TableCell>
                            <strong>{row.header}</strong>
                          </TableCell>
                          <TableCell align="right">{row.grazing}</TableCell>
                          <TableCell align="right">{row.haying}</TableCell>
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
              The above graph visualizes the total premium for each intended use from 2007 to{" "}
              {new Date().getFullYear() - 1} in {county}, {state}.
              <br />
              The data is categorized into two intended use categories: Grazing and Haying.
            </p>
            <p>
              The X-axis represents the timeline from 2007 to {new Date().getFullYear() - 1}. The
              Y-axis represents the total premium in U.S. dollars.
              <br />
              There are two bars for each year, each in a different color:
            </p>
            <ol>
              <li>
                <span
                  style={{
                    display: "inline-block",
                    width: "15px",
                    height: "15px",
                    backgroundColor: "#8884d8",
                    marginRight: "5px",
                  }}
                ></span>{" "}
                represents the {`"Grazing"`} intended use.
              </li>
              <li>
                <span
                  style={{
                    display: "inline-block",
                    width: "15px",
                    height: "15px",
                    backgroundColor: "#82ca9d",
                    marginRight: "5px",
                  }}
                ></span>{" "}
                represents the {`"Haying"`} intended use.
              </li>
            </ol>
            <p>The height of each bar corresponds to the amount of total premium for that year.</p>

            <p>
              The brush tool at the bottom of the graph can be used to zoom in on a specific range
              of years.
            </p>
            <p>The summary for the years 2007 - {new Date().getFullYear() - 1} is as follows:</p>
            <Grid container>
              <Grid item xs={4}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Metrics</TableCell>
                        <TableCell align="right">Grazing</TableCell>
                        <TableCell align="right">Haying</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          header: "Sum",
                          grazing: visualizationData["grazing"]
                            ? currencyFormatter(visualizationData.grazing_total_premium)
                            : "No data avaialable",
                          haying: visualizationData["haying"]
                            ? currencyFormatter(visualizationData.haying_total_premium)
                            : "No data avaialable",
                        },
                        {
                          header: "Average",
                          grazing: visualizationData["grazing"]
                            ? currencyFormatter(visualizationData.grazing_avg_premium)
                            : "No data avaialable",
                          haying: visualizationData["haying"]
                            ? currencyFormatter(visualizationData.haying_avg_premium)
                            : "No data avaialable",
                        },
                        {
                          header: "Max",
                          grazing: visualizationData["grazing"]
                            ? `${currencyFormatter(visualizationData.grazing_max_premium.value)}
                        ${
                          visualizationData.grazing_max_premium.year &&
                          ` in ${visualizationData.grazing_max_premium.year}`
                        }`
                            : "No data avaialable",
                          haying: visualizationData["haying"]
                            ? `${currencyFormatter(visualizationData.haying_max_premium.value)}
                          ${
                            visualizationData.haying_max_premium.year &&
                            ` in ${visualizationData.haying_max_premium.year}`
                          }`
                            : "No data avaialable",
                        },
                        {
                          header: "Min (non-zero)",
                          grazing: visualizationData["grazing"]
                            ? `${currencyFormatter(visualizationData.grazing_min_premium.value)}
                        ${
                          visualizationData.grazing_min_premium.year &&
                          ` in ${visualizationData.grazing_min_premium.year}`
                        }`
                            : "No data avaialable",
                          haying: visualizationData["haying"]
                            ? `${currencyFormatter(visualizationData.haying_min_premium.value)}
                          ${
                            visualizationData.haying_min_premium.year &&
                            ` in ${visualizationData.haying_min_premium.year}`
                          }`
                            : "No data avaialable",
                        },
                      ].map((row) => (
                        <TableRow key={row.header}>
                          <TableCell>
                            <strong>{row.header}</strong>
                          </TableCell>
                          <TableCell align="right">{row.grazing}</TableCell>
                          <TableCell align="right">{row.haying}</TableCell>
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
              The above graph visualizes the total acres insured for each intended use from 2007 to{" "}
              {new Date().getFullYear() - 1} in {county}, {state}.
              <br />
              The data is categorized into two intended use categories: Grazing and Haying.
            </p>
            <p>
              The X-axis represents the timeline from 2007 to {new Date().getFullYear() - 1}. The
              Y-axis represents the total acres insured.
              <br />
              There are two bars for each year, each in a different color:
            </p>
            <ol>
              <li>
                <span
                  style={{
                    display: "inline-block",
                    width: "15px",
                    height: "15px",
                    backgroundColor: "#8884d8",
                    marginRight: "5px",
                  }}
                ></span>{" "}
                represents the {`"Grazing"`} intended use.
              </li>
              <li>
                <span
                  style={{
                    display: "inline-block",
                    width: "15px",
                    height: "15px",
                    backgroundColor: "#82ca9d",
                    marginRight: "5px",
                  }}
                ></span>{" "}
                represents the {`"Haying"`} intended use.
              </li>
            </ol>
            <p>
              The height of each bar corresponds to the amount of total acres insured in that year.
            </p>
            <p>
              The brush tool at the bottom of the graph can be used to zoom in on a specific range
              of years.
            </p>
            <p>The summary for the years 2007 - {new Date().getFullYear() - 1} is as follows:</p>
            <Grid container>
              <Grid item xs={4}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Metrics</TableCell>
                        <TableCell align="right">Grazing</TableCell>
                        <TableCell align="right">Haying</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          header: "Sum",
                          grazing: visualizationData["grazing"]
                            ? visualizationData.grazing_total_acres.toLocaleString("en-US")
                            : "No data avaialable",
                          haying: visualizationData["haying"]
                            ? visualizationData.haying_total_acres.toLocaleString("en-US")
                            : "No data avaialable",
                        },
                        {
                          header: "Average",
                          grazing: visualizationData["grazing"]
                            ? visualizationData.grazing_avg_acres.toLocaleString("en-US")
                            : "No data avaialable",
                          haying: visualizationData["haying"]
                            ? visualizationData.haying_avg_acres.toLocaleString("en-US")
                            : "No data avaialable",
                        },
                        {
                          header: "Max",
                          grazing: visualizationData["grazing"]
                            ? `${visualizationData.grazing_max_acres.value.toLocaleString("en-US")}
                        ${
                          visualizationData.grazing_max_acres.year &&
                          ` in ${visualizationData.grazing_max_acres.year}`
                        }`
                            : "No data avaialable",
                          haying: visualizationData["haying"]
                            ? `${visualizationData.haying_max_acres.value.toLocaleString("en-US")}
                          ${
                            visualizationData.haying_max_acres.year &&
                            ` in ${visualizationData.haying_max_acres.year}`
                          }`
                            : "No data avaialable",
                        },
                        {
                          header: "Min (non-zero)",
                          grazing: visualizationData["grazing"]
                            ? `${visualizationData.grazing_min_acres.value.toLocaleString("en-US")}
                        ${
                          visualizationData.grazing_min_acres.year &&
                          ` in ${visualizationData.grazing_min_acres.year}`
                        }`
                            : "No data avaialable",
                          haying: visualizationData["haying"]
                            ? `${visualizationData.haying_min_acres.value.toLocaleString("en-US")}
                          ${
                            visualizationData.haying_min_acres.year &&
                            ` in ${visualizationData.haying_min_acres.year}`
                          }`
                            : "No data avaialable",
                        },
                      ].map((row) => (
                        <TableRow key={row.header}>
                          <TableCell>
                            <strong>{row.header}</strong>
                          </TableCell>
                          <TableCell align="right">{row.grazing}</TableCell>
                          <TableCell align="right">{row.haying}</TableCell>
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
