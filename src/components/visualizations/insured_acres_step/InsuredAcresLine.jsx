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
} from "recharts";
import { Box, Grid } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { currencyFormatter } from "../../../constants";

export default function InsuredAcresLine({ visualizationData }) {
  console.log("🚀 ~ InsuredAcresLine ~ visualizationData:", visualizationData);
  if (!visualizationData) return <></>;

  const data = [];
  for (const [year, acres] of Object.entries(visualizationData)) {
    data.push({ year, acres });
  }

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ height: 300, width: "70rem", marginTop: "1rem" }}>
            <ResponsiveContainer>
              <LineChart
                width={500}
                height={300}
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
