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

export default function IntervalDistributionLine({ visualizationData, isOverviewView, gridcode }) {
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
      <Grid item xs={12}>
        <Typography variant="subtitle" sx={{ marginTop: "2rem" }}>
          <p>
            The above graph visualizes the {labels[metric].toLowerCase()} from 2007 to{" "}
            {new Date().getFullYear() - 1} in CPC Grid Code {gridcode}.
            <br />
            The data is categorized into five interval categories: Jan-Feb, Feb-Mar, Mar-Apr,
            Apr-May, May-Jun, Jun-Jul, Jul-Aug, Aug-Sep, Sep-Oct, Oct-Nov, Nov-Dec.
          </p>
          <p>
            The X-axis represents the timeline from the year 2007 to {new Date().getFullYear() - 1}.
            The Y-axis represents the
            {labels[metric].toLowerCase()}.
          </p>
          <p>There are eleven lines for each interval, each in a different color:</p>
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
              represents the Jan-Feb interval.
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
              represents the Feb-Mar interval.
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
              represents the Mar-Apr interval.
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
              represents the Apr-May interval.
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
              represents the May-Jun interval.
            </li>
            <li>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "3px",
                  backgroundColor: colours[5],
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              represents the Jun-Jul interval.
            </li>
            <li>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "3px",
                  backgroundColor: colours[6],
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              represents the Jul-Aug interval.
            </li>
            <li>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "3px",
                  backgroundColor: colours[7],
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              represents the Aug-Sep interval.
            </li>
            <li>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "3px",
                  backgroundColor: colours[8],
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              represents the Sep-Oct interval.
            </li>
            <li>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "3px",
                  backgroundColor: colours[9],
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              represents the Oct-Nov interval.
            </li>
            <li>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "3px",
                  backgroundColor: colours[10],
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
              ></span>{" "}
              represents the Nov-Dec interval.
            </li>
          </ol>
          <p>
            The points on each line correspond to the {labels[metric].toLowerCase()} in that year.
          </p>
          <p>
            The brush tool at the bottom of the graph can be used to zoom in on a specific range of
            years.
          </p>
          <p>The summary for the years 2007 - {new Date().getFullYear() - 1} is as follows:</p>

          {metric === "index" && (
            <Grid container>
              <Grid item xs={3}>
                <p>
                  <strong>For Jan-Feb interval:</strong>
                  <br />
                  <ul>
                    <li>Average: {visualizationData["Jan-Feb_average_index"]}</li>
                    <li>Min: {visualizationData["Jan-Feb_max_index"].value}</li>
                    <li>Max: {visualizationData["Jan-Feb_min_index"].value}</li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={3}>
                <p>
                  <strong>For Feb-Mar interval:</strong>
                  <br />
                  <ul>
                    <li>Average: {visualizationData["Feb-Mar_average_index"]}</li>
                    <li>Min: {visualizationData["Feb-Mar_max_index"].value}</li>
                    <li>Max: {visualizationData["Feb-Mar_min_index"].value}</li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={3}>
                <p>
                  <strong>For Mar-Apr interval:</strong>
                  <br />
                  <ul>
                    <li>Average: {visualizationData["Mar-Apr_average_index"]}</li>
                    <li>Min: {visualizationData["Mar-Apr_max_index"].value}</li>
                    <li>Max: {visualizationData["Mar-Apr_min_index"].value}</li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={3}>
                <p>
                  <strong>For Apr-May interval:</strong>
                  <br />
                  <ul>
                    <li>Average: {visualizationData["Apr-May_average_index"]}</li>
                    <li>Min: {visualizationData["Apr-May_max_index"].value}</li>
                    <li>Max: {visualizationData["Apr-May_min_index"].value}</li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={3}>
                <p>
                  <strong>For May-Jun interval:</strong>
                  <br />
                  <ul>
                    <li>Average: {visualizationData["May-Jun_average_index"]}</li>
                    <li>Min: {visualizationData["May-Jun_max_index"].value}</li>
                    <li>Max: {visualizationData["May-Jun_min_index"].value}</li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={3}>
                <p>
                  <strong>For Jun-Jul interval:</strong>
                  <br />
                  <ul>
                    <li>Average: {visualizationData["Jun-Jul_average_index"]}</li>
                    <li>Min: {visualizationData["Jun-Jul_max_index"].value}</li>
                    <li>Max: {visualizationData["Jun-Jul_min_index"].value}</li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={3}>
                <p>
                  <strong>For Jul-Aug interval:</strong>
                  <br />
                  <ul>
                    <li>Average: {visualizationData["Jul-Aug_average_index"]}</li>
                    <li>Min: {visualizationData["Jul-Aug_max_index"].value}</li>
                    <li>Max: {visualizationData["Jul-Aug_min_index"].value}</li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={3}>
                <p>
                  <strong>For Aug-Sep interval:</strong>
                  <br />
                  <ul>
                    <li>Average: {visualizationData["Aug-Sep_average_index"]}</li>
                    <li>Min: {visualizationData["Aug-Sep_max_index"].value}</li>
                    <li>Max: {visualizationData["Aug-Sep_min_index"].value}</li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={3}>
                <p>
                  <strong>For Sep-Oct interval:</strong>
                  <br />
                  <ul>
                    <li>Average: {visualizationData["Sep-Oct_average_index"]}</li>
                    <li>Min: {visualizationData["Sep-Oct_max_index"].value}</li>
                    <li>Max: {visualizationData["Sep-Oct_min_index"].value}</li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={3}>
                <p>
                  <strong>For Oct-Nov interval:</strong>
                  <br />
                  <ul>
                    <li>Average: {visualizationData["Oct-Nov_average_index"]}</li>
                    <li>Min: {visualizationData["Oct-Nov_max_index"].value}</li>
                    <li>Max: {visualizationData["Oct-Nov_min_index"].value}</li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={3}>
                <p>
                  <strong>For Nov-Dec interval:</strong>
                  <br />
                  <ul>
                    <li>Average: {visualizationData["Nov-Dec_average_index"]}</li>
                    <li>Min: {visualizationData["Nov-Dec_max_index"].value}</li>
                    <li>Max: {visualizationData["Nov-Dec_min_index"].value}</li>
                  </ul>
                </p>
              </Grid>
            </Grid>
          )}

          {metric === "totalRainfall" && (
            <Grid container>
              <Grid item xs={4}>
                <p>
                  <strong>For Jan-Feb interval:</strong>
                  <br />
                  <ul>
                    <li>
                      Sum:{" "}
                      {visualizationData["Jan-Feb_total_rainfall"].toLocaleString("en-us") + " mm"}
                    </li>
                    <li>
                      Average:{" "}
                      {visualizationData["Jan-Feb_average_rainfall"].toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Min:{" "}
                      {visualizationData["Jan-Feb_max_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Max:{" "}
                      {visualizationData["Jan-Feb_min_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={4}>
                <p>
                  <strong>For Feb-Mar interval:</strong>
                  <br />
                  <ul>
                    <li>
                      Sum:{" "}
                      {visualizationData["Feb-Mar_total_rainfall"].toLocaleString("en-us") + " mm"}
                    </li>
                    <li>
                      Average:{" "}
                      {visualizationData["Feb-Mar_average_rainfall"].toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Min:{" "}
                      {visualizationData["Feb-Mar_max_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Max:{" "}
                      {visualizationData["Feb-Mar_min_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={4}>
                <p>
                  <strong>For Mar-Apr interval:</strong>
                  <br />
                  <ul>
                    <li>
                      Sum:{" "}
                      {visualizationData["Mar-Apr_total_rainfall"].toLocaleString("en-us") + " mm"}
                    </li>
                    <li>
                      Average:{" "}
                      {visualizationData["Mar-Apr_average_rainfall"].toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Min:{" "}
                      {visualizationData["Mar-Apr_max_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Max:{" "}
                      {visualizationData["Mar-Apr_min_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={4}>
                <p>
                  <strong>For Apr-May interval:</strong>
                  <br />
                  <ul>
                    <li>
                      Sum:{" "}
                      {visualizationData["Apr-May_total_rainfall"].toLocaleString("en-us") + " mm"}
                    </li>
                    <li>
                      Average:{" "}
                      {visualizationData["Apr-May_average_rainfall"].toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Min:{" "}
                      {visualizationData["Apr-May_max_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Max:{" "}
                      {visualizationData["Apr-May_min_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={4}>
                <p>
                  <strong>For May-Jun interval:</strong>
                  <br />
                  <ul>
                    <li>
                      Sum:{" "}
                      {visualizationData["May-Jun_total_rainfall"].toLocaleString("en-us") + " mm"}
                    </li>
                    <li>
                      Average:{" "}
                      {visualizationData["May-Jun_average_rainfall"].toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Min:{" "}
                      {visualizationData["May-Jun_max_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Max:{" "}
                      {visualizationData["May-Jun_min_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={4}>
                <p>
                  <strong>For Jun-Jul interval:</strong>
                  <br />
                  <ul>
                    <li>
                      Sum:{" "}
                      {visualizationData["Jun-Jul_total_rainfall"].toLocaleString("en-us") + " mm"}
                    </li>
                    <li>
                      Average:{" "}
                      {visualizationData["Jun-Jul_average_rainfall"].toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Min:{" "}
                      {visualizationData["Jun-Jul_max_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Max:{" "}
                      {visualizationData["Jun-Jul_min_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={4}>
                <p>
                  <strong>For Jul-Aug interval:</strong>
                  <br />
                  <ul>
                    <li>
                      Sum:{" "}
                      {visualizationData["Jul-Aug_total_rainfall"].toLocaleString("en-us") + " mm"}
                    </li>
                    <li>
                      Average:{" "}
                      {visualizationData["Jul-Aug_average_rainfall"].toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Min:{" "}
                      {visualizationData["Jul-Aug_max_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Max:{" "}
                      {visualizationData["Jul-Aug_min_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={4}>
                <p>
                  <strong>For Aug-Sep interval:</strong>
                  <br />
                  <ul>
                    <li>
                      Sum:{" "}
                      {visualizationData["Aug-Sep_total_rainfall"].toLocaleString("en-us") + " mm"}
                    </li>
                    <li>
                      Average:{" "}
                      {visualizationData["Aug-Sep_average_rainfall"].toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Min:{" "}
                      {visualizationData["Aug-Sep_max_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Max:{" "}
                      {visualizationData["Aug-Sep_min_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={4}>
                <p>
                  <strong>For Sep-Oct interval:</strong>
                  <br />
                  <ul>
                    <li>
                      Sum:{" "}
                      {visualizationData["Sep-Oct_total_rainfall"].toLocaleString("en-us") + " mm"}
                    </li>
                    <li>
                      Average:{" "}
                      {visualizationData["Sep-Oct_average_rainfall"].toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Min:{" "}
                      {visualizationData["Sep-Oct_max_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Max:{" "}
                      {visualizationData["Sep-Oct_min_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={4}>
                <p>
                  <strong>For Oct-Nov interval:</strong>
                  <br />
                  <ul>
                    <li>
                      Sum:{" "}
                      {visualizationData["Oct-Nov_total_rainfall"].toLocaleString("en-us") + " mm"}{" "}
                    </li>
                    <li>
                      Average:{" "}
                      {visualizationData["Oct-Nov_average_rainfall"].toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Min:{" "}
                      {visualizationData["Oct-Nov_max_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Max:{" "}
                      {visualizationData["Oct-Nov_min_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                  </ul>
                </p>
              </Grid>
              <Grid item xs={4}>
                <p>
                  <strong>For Nov-Dec interval:</strong>
                  <br />
                  <ul>
                    <li>
                      Sum:{" "}
                      {visualizationData["Nov-Dec_total_rainfall"].toLocaleString("en-us") + " mm"}
                    </li>
                    <li>
                      Average:{" "}
                      {visualizationData["Nov-Dec_average_rainfall"].toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Min:{" "}
                      {visualizationData["Nov-Dec_max_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                    <li>
                      Max:{" "}
                      {visualizationData["Nov-Dec_min_rainfall"].value.toLocaleString("en-us") +
                        " mm"}
                    </li>
                  </ul>
                </p>
              </Grid>
            </Grid>
          )}
        </Typography>
      </Grid>
    </Grid>
  );
}
