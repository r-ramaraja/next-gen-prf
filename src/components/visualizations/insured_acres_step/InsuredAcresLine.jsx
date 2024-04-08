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

export default function InsuredAcresLine({ visualizationData }) {
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
    <Box>
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
                <YAxis label={{ value: "Acres", position: "insideLeft", offset: -40 }} />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Line type="monotone" dataKey="acres" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Brush dataKey="year" height={30} x={90} y={365} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
