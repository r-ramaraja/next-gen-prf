import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { Box } from "@mui/material";
import Download from "../../Download";
import { currencyFormatter } from "../../../constants";

export default function CashFlow({ visualizationData }) {
  console.log("🚀 ~ CashFlow ~ visualizationData:", visualizationData);
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
    <Box sx={{ height: 300, marginTop: "8rem" }}>
      <Download />
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
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={currencyFormatter} />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
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
