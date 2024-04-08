import React, { useState, useCallback } from "react";
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
  Brush,
} from "recharts";
import { Box, Typography, Grid } from "@mui/material";
import Download from "../../Download";
import _ from "lodash";
import { currencyFormatter } from "../../../constants";

export default function CashFlow({ visualizationData }) {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(Object.keys(visualizationData).length - 1);

  const data = [];
  for (const [year, value] of Object.entries(visualizationData)) {
    data.push({ year, cashflow: value.sum_indemnity - value.sum_actual_premium });
  }

  const handleBrushChange = useCallback(
    _.debounce((e) => {
      const { startIndex, endIndex } = e;
      setStart(startIndex);
      setEnd(endIndex);
    }, 1000),
    []
  );

  const calculateTotalCashFlow = (start, end) => {
    let totalCashFlow = 0;
    for (let i = start; i <= end; i++) {
      totalCashFlow += data[i].cashflow;
    }
    return totalCashFlow;
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ marginLeft: "1.5rem", marginTop: "8rem" }} align="center">
          Cashflow Over Time
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ height: 400 }}>
          <Download />
          <Typography sx={{ marginLeft: "2rem" }}>
            <span style={{ fontWeight: "bold" }}>
              Total Cashflow ({data[start].year} - {data[end].year}):
            </span>{" "}
            {calculateTotalCashFlow(start, end).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Typography>
          <ResponsiveContainer>
            <BarChart
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
                  value: "Cashflow",
                  position: "insideLeft",
                  offset: -75,
                }}
                tickFormatter={currencyFormatter}
              />
              <Tooltip formatter={currencyFormatter} />
              <Legend verticalAlign="top" />
              <ReferenceLine y={0} stroke="#000" />
              <Brush
                dataKey="year"
                height={30}
                x={120}
                y={365}
                onChange={handleBrushChange}
                startIndex={start}
                endIndex={end}
              />
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
