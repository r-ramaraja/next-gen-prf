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
} from "recharts";
import { Box, Grid, Typography } from "@mui/material";

export default function InsuredAcresLine({ visualizationData }) {
  const data = [];
  for (const [year, acres] of Object.entries(visualizationData)) {
    data.push({ year, acres });
  }

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            Insured Acres Over Time
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: 300, marginTop: "1rem" }}>
            <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="acres" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
