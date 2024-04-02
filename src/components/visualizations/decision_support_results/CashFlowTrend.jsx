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
import { Box, Typography } from "@mui/material";
import Download from "../../Download";
import _ from "lodash";

function currencyFormatter(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

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
    <Box sx={{ height: 300, marginTop: "8rem" }}>
      <Download />
      <Typography sx={{ marginLeft: "2rem" }}>
        <span style={{ fontWeight: "bold" }}>Total Cashflow:</span>{" "}
        {calculateTotalCashFlow(start, end).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </Typography>
      <ResponsiveContainer>
        <BarChart
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
          <Tooltip formatter={currencyFormatter} />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Brush
            dataKey="year"
            height={30}
            x={70}
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
  );
}
