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
  const { trend } = visualizationData;
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(Object.keys(trend).length - 1);

  const data = [];
  for (const [year, value] of Object.entries(trend)) {
    data.push({ year, cashflow: value.sum_indemnity - value.sum_actual_premium });
  }

  let sumCashflow = 0;
  let maxCashflow = { value: -Infinity, year: null };
  let minCashflow = { value: Infinity, year: null };

  data.forEach((item) => {
    sumCashflow += item.cashflow;
    if (item.cashflow > maxCashflow.value) maxCashflow = { value: item.cashflow, year: item.year };
    if (item.cashflow < minCashflow.value) minCashflow = { value: item.cashflow, year: item.year };
  });

  const avgCashflow = sumCashflow / data.length;

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
        <Typography variant="h6" sx={{ marginLeft: "1.5rem", marginTop: "2rem" }} align="center">
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
      <Grid item xs={12} sx={{ marginTop: "3.5rem" }}>
        <Typography variant="subtitle">
          <p>
            The above graph visualizes the total cashflow, based on the current policy, from 2007 to{" "}
            {new Date().getFullYear() - 1}.
            <br />
            Cashflow is defined as the difference between the total indemnity and the total actual
            premium.
          </p>
          <p>
            The X-axis represents the timeline from the year 2007 to {new Date().getFullYear() - 1}.
            The Y-axis represents represents the total cashflow.
          </p>
          <p>
            The line represents the trend of total cashflow over the years. The dots on the line
            represent the total cashflow in that year.
          </p>

          <p>
            The slider at the bottom of the graph can be used to zoom in on a specific range of
            years.
          </p>
          <p>The summary for the years 2007 - {new Date().getFullYear() - 1} is as follows:</p>

          <p>
            <ul>
              <li>
                <strong>Sum:</strong> {currencyFormatter(sumCashflow)}
              </li>
              <li>
                <strong>Average:</strong> {currencyFormatter(avgCashflow)}
              </li>
              <li>
                <strong>Max:</strong> {currencyFormatter(maxCashflow.value)}
                {maxCashflow.year &&
                  ` in
                      ${maxCashflow.year}`}
              </li>
              <li>
                <strong>Min:</strong> {currencyFormatter(minCashflow.value)}
                {minCashflow.year &&
                  ` in
                      ${minCashflow.year}`}
              </li>
            </ul>
          </p>
        </Typography>
      </Grid>
    </Grid>
  );
}
