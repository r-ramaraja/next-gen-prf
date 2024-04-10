import React, { useState, useCallback } from "react";
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
import { Box, Typography, Grid } from "@mui/material";
import Download from "../../Download";
import _ from "lodash";
import { currencyFormatter } from "../../../constants";

export default function HistoricalTrend({ visualizationData }) {
  const { trend } = visualizationData;
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(Object.keys(trend).length - 1);
  const sum_actual_premium = Object.values(trend)[0].sum_actual_premium;
  const data = [];
  for (const [year, value] of Object.entries(trend)) {
    data.push({ year, indemnity: value.sum_indemnity });
  }

  const handleBrushChange = useCallback(
    _.debounce((e) => {
      const { startIndex, endIndex } = e;
      setStart(startIndex);
      setEnd(endIndex);
    }, 1000),
    []
  );

  const calculateIndemnity = (start, end) => {
    let totalIndemnity = 0;
    for (let i = start; i <= end; i++) {
      totalIndemnity += data[i].indemnity;
    }
    return totalIndemnity;
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ marginLeft: "1.5rem", marginTop: "4rem" }} align="center">
          Indemnity Over Time
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ height: 400 }}>
          <Download />
          <Typography sx={{ marginLeft: "2rem" }}>
            <span style={{ fontWeight: "bold" }}>
              Total Premium ({data[start].year} - {data[end].year}):
            </span>{" "}
            {(sum_actual_premium * (end - start + 1)).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Typography>
          <Typography sx={{ marginLeft: "2rem" }}>
            <span style={{ fontWeight: "bold" }}>
              Total Indemnity ({data[start].year} - {data[end].year}):
            </span>{" "}
            {calculateIndemnity(start, end).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Typography>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 75,
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
                  value: "Indemnity",
                  position: "insideLeft",
                  offset: -75,
                }}
                tickFormatter={currencyFormatter}
              />
              <Tooltip formatter={currencyFormatter} />
              <Legend verticalAlign="top" />
              <Line type="monotone" dataKey="indemnity" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Brush
                dataKey="year"
                height={30}
                x={120}
                y={365}
                onChange={handleBrushChange}
                startIndex={start}
                endIndex={end}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: "3.5rem" }}>
        <Typography variant="subtitle">
          <p>
            The above graph visualizes the total indemnity, based on the current policy, from 2007
            to {new Date().getFullYear() - 1}.
          </p>
          <p>
            The X-axis represents the timeline from the year 2007 to {new Date().getFullYear() - 1}.
            The Y-axis represents represents the total indemnity.
          </p>
          <p>
            The line represents the trend of total indemnity over the years. The dots on the line
            represent the total indemnity in that year.
          </p>

          <p>
            The slider at the bottom of the graph can be used to zoom in on a specific range of
            years.
          </p>
          <p>The summary for the years 2007 - {new Date().getFullYear() - 1} is as follows:</p>

          <p>
            <ul>
              <li>
                <strong>Sum:</strong> {currencyFormatter(visualizationData["total_indemnity"])}
              </li>
              <li>
                <strong>Average:</strong> {currencyFormatter(visualizationData["avg_indemnity"])}
              </li>
              <li>
                <strong>Max:</strong> {currencyFormatter(visualizationData["max_indemnity"].value)}
                {visualizationData["max_indemnity"].year &&
                  ` in
                      ${visualizationData["max_indemnity"].year}`}
              </li>
              <li>
                <strong>Min:</strong> {currencyFormatter(visualizationData["min_indemnity"].value)}
                {visualizationData["min_indemnity"].year &&
                  ` in
                      ${visualizationData["min_indemnity"].year}`}
              </li>
            </ul>
          </p>
        </Typography>
      </Grid>
    </Grid>
  );
}
