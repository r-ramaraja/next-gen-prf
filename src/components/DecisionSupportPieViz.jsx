import React, { useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
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

const COLORS = ["#0088FE", "#00C49F"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      alignmentBaseline="middle"
    >
      {currencyFormatter(value)}
    </text>
  );
};

export default function DecisionSupportPieViz({ visualizationData }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    const dy = payload.parent === "Producer Premium" ? -11 : 16;

    return (
      <g>
        <text x={cx} y={cy} dy={dy} textAnchor="middle" fill="white" fontSize={12}>
          {payload.parent}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${payload.name}: ${currencyFormatter(value)}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const data01 = [];
  data01.push({
    name: "Total Subsidized Premium",
    value: visualizationData.sum_actual_premium,
  });
  data01.push({
    name: "Total Premium Subsidy",
    value: visualizationData.sum_premium_subsidy,
  });

  const data02 = [];
  for (const interval in visualizationData.intervals) {
    data02.push({
      name: visualizationData.intervals[interval].interval_name,
      value: visualizationData.intervals[interval].actual_premium,
      parent: "Producer Premium",
    });
  }

  for (const interval in visualizationData.intervals) {
    data02.push({
      name: visualizationData.intervals[interval].interval_name,
      value: visualizationData.intervals[interval].premium_subsidy,
      parent: "Premium Subsidy",
    });
  }

  return (
    <Box style={{ height: 300, marginTop: "4rem" }}>
      <Download />
      <ResponsiveContainer>
        <PieChart width={500} height={500}>
          <Pie
            data={data01}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#8884d8"
            labelLine={false}
            label={(props) => renderCustomizedLabel({ ...props, index: props.index })}
          >
            {data01.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data02}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            fill="#82ca9d"
            onMouseEnter={onPieEnter}
          >
            {data02.map((entry) => {
              const index = entry.parent === "Producer Premium" ? 0 : 1;
              return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
