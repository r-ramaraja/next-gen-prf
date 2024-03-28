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
import { Box } from "@mui/material";
import Download from "./Download";

function currencyFormatter(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

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
    <Box sx={{ height: 300, marginTop: "4rem" }}>
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
          {/* <Bar
            dataKey="protection"
            fill="#4c9f70" // A shade of green
            activeBar={<Rectangle fill="#76c1a0" stroke="#2e6e47" />}
          /> */}
          <Bar
            dataKey="premium"
            fill="#4d85bd" // A shade of blue
            activeBar={<Rectangle fill="#7aaed6" stroke="#2c5d8f" />}
          />
          <Bar
            dataKey="indemnity"
            fill="#e57373" // A shade of red
            activeBar={<Rectangle fill="#ef9a9a" stroke="#af4448" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
