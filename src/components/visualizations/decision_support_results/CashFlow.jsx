import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { Box, Grid, Typography } from "@mui/material";
import Download from "../../Download";
import { currencyFormatter } from "../../../constants";

export default function CashFlow({ visualizationData }) {
  const data = [];
  for (const interval in visualizationData.intervals) {
    data.push({
      name: visualizationData.intervals[interval].interval_name,
      cashflow:
        visualizationData.intervals[interval].indemnity -
        visualizationData.intervals[interval].actual_premium,
    });
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ marginLeft: "3rem" }} align="center">
          Cashflow for Current Policy
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 75,
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
                  value: "Cashflow",
                  position: "insideLeft",
                  offset: -75,
                }}
                tickFormatter={currencyFormatter}
              />
              <Tooltip formatter={currencyFormatter} />
              <Legend verticalAlign="top" />
              <ReferenceLine y={0} stroke="#000" />
              <Bar
                dataKey="cashflow"
                fill="#4d85bd"
                activeBar={<Rectangle fill="#7aaed6" stroke="#2c5d8f" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
    </Grid>
  );
}
