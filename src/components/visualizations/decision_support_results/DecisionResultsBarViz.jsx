import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Grid, Typography } from "@mui/material";
import Download from "../../Download";
import { currencyFormatter } from "../../../constants";

export default function DecisionResultsBarViz({ visualizationData }) {
  const data = [];
  for (const interval in visualizationData.intervals) {
    data.push({
      name: visualizationData.intervals[interval].interval_name,
      protection: visualizationData.intervals[interval].policy_protection,
      indemnity: visualizationData.intervals[interval].indemnity,
      premium: visualizationData.intervals[interval].actual_premium,
    });
  }
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ marginLeft: "3rem", marginTop: "8rem" }} align="center">
          Premium-Indemnity for Current Policy
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ height: 300 }}>
          <Download />
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 35,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                label={{ value: "Intervals", position: "insideBottom", offset: -10 }}
              />
              <YAxis
                label={{
                  value: "Value",
                  position: "insideLeft",
                  offset: -35,
                }}
                tickFormatter={currencyFormatter}
              />
              <Tooltip formatter={currencyFormatter} />
              <Legend verticalAlign="top" />
              <Bar
                dataKey="premium"
                fill="#4d85bd"
                activeBar={<Rectangle fill="#7aaed6" stroke="#2c5d8f" />}
              />
              <Bar
                dataKey="indemnity"
                fill="#e57373"
                activeBar={<Rectangle fill="#ef9a9a" stroke="#af4448" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
    </Grid>
  );
}
