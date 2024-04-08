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
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(Object.keys(visualizationData).length - 1);
  const sum_actual_premium = Object.values(visualizationData)[0].sum_actual_premium;
  const data = [];
  for (const [year, value] of Object.entries(visualizationData)) {
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
    </Grid>
  );
}
