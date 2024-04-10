import React from "react";
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
import { Box, Grid, Typography } from "@mui/material";

export default function InsuredAcresLine({ visualizationData, state, county }) {
  const data = [];

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2007; year < currentYear; year++) {
    years.push(year);
  }

  for (const year of years) {
    data.push({
      year,
      acres: visualizationData[year] ?? 0,
    });
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" align="center" sx={{ marginTop: "2rem" }}>
          Insured Acres Over Time
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ height: 400, marginTop: "1rem" }}>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 40,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{ value: "Years", position: "insideBottom", offset: -15 }}
              />
              <YAxis
                label={{ value: "Acres", position: "insideLeft", offset: -40 }}
                tickFormatter={(value) => {
                  return value.toLocaleString("en-US");
                }}
              />
              <Tooltip
                formatter={(value) => {
                  return value.toLocaleString("en-US");
                }}
              />
              <Legend verticalAlign="top" />
              <Line type="monotone" dataKey="acres" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Brush dataKey="year" height={30} x={90} y={365} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle" sx={{ marginTop: "2rem" }}>
          <p>
            The above graph visualizes the total insured acres from 2007 to{" "}
            {new Date().getFullYear() - 1} in {county}, {state}.
          </p>
          <p>
            The X-axis represents the timeline from the year 2007 to {new Date().getFullYear() - 1}.
            The Y-axis represents represents the total insured acres.
          </p>
          <p>
            The line represents the trend of total insured acres over the years. The dots on the
            line represent the total insured acres in that year.
          </p>

          <p>
            The slider at the bottom of the graph can be used to zoom in on a specific range of
            years.
          </p>
          <p>The summary for the years 2007 - {new Date().getFullYear() - 1} is as follows:</p>

          <p>
            <ul>
              <li>
                <strong>Sum:</strong> {visualizationData["total_acres"].toLocaleString("en-US")}
              </li>
              <li>
                <strong>Average:</strong> {visualizationData["avg_acres"].toLocaleString("en-US")}
              </li>
              <li>
                <strong>Max:</strong> {visualizationData["max_acres"].value.toLocaleString("en-US")}
                {visualizationData["max_acres"].year &&
                  ` in
                      ${visualizationData["max_acres"].year}`}
              </li>
              <li>
                <strong>Min:</strong> {visualizationData["min_acres"].value.toLocaleString("en-US")}
                {visualizationData["min_acres"].year &&
                  ` in
                      ${visualizationData["min_acres"].year}`}
              </li>
            </ul>
          </p>
        </Typography>
      </Grid>
    </Grid>
  );
}
