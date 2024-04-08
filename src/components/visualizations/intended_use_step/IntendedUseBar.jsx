import React, { useState } from "react";
import {
  BarChart,
  Bar,
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
import { Typography } from "@mui/material";
import { currencyFormatter } from "../../../constants";

export default function IntendedUseBar({ visualizationData, isOverviewView }) {
  const [metric, setMetric] = useState("indemnity");
  const [grazingKey, setGrazingKey] = useState("grazing_indemnity");
  const [hayingKey, setHayingKey] = useState("haying_indemnity");

  const handleChange = (event) => {
    setMetric(event.target.value);
    if (event.target.value === "indemnity") {
      setGrazingKey("grazing_indemnity");
      setHayingKey("haying_indemnity");
    } else if (event.target.value === "premium") {
      setGrazingKey("grazing_actual_premium");
      setHayingKey("haying_actual_premium");
    } else if (event.target.value === "acres") {
      setGrazingKey("grazing_acres");
      setHayingKey("haying_acres");
    }
  };

  const data = [];
  const grazing = visualizationData["grazing"] ?? {};

  const haying = visualizationData["haying"] ?? {};

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2007; year < currentYear; year++) {
    years.push(year);
  }

  for (const year of years) {
    const grazingData = grazing[year] ?? {};
    const hayingData = haying[year] ?? {};
    data.push({
      year,
      grazing_indemnity: grazingData.sum_indemnity ?? 0,
      grazing_actual_premium: grazingData.sum_actual_premium ?? 0,
      grazing_acres: grazingData.acres ?? 0,
      haying_indemnity: hayingData.sum_indemnity ?? 0,
      haying_actual_premium: hayingData.sum_actual_premium ?? 0,
      haying_acres: hayingData.acres ?? 0,
    });
  }

  const labels = {
    indemnity: "Indemnity",
    premium: "Premium",
    acres: "Acres",
  };

  return (
    <Box>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ marginLeft: "1.5rem", marginTop: "2rem" }} align="center">
            {isOverviewView && "Intended Use - "} {labels[metric]} Over Time
          </Typography>
        </Grid>
        <Grid item sx={{ marginLeft: "1.5rem" }}>
          <FormControl fullWidth size="small">
            <InputLabel>Metric</InputLabel>
            <Select value={metric} label="metric" onChange={handleChange}>
              <MenuItem value={"indemnity"}>Indemnity</MenuItem>
              <MenuItem value={"premium"}>Premium</MenuItem>
              <MenuItem value={"acres"}>Acres</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: 400, marginTop: "1rem" }}>
            <ResponsiveContainer>
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 90,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  angle={14}
                  label={{ value: "Years", position: "insideBottom", offset: -15 }}
                />
                <YAxis
                  label={{
                    value: labels[metric],
                    position: "insideLeft",
                    offset: metric === "acres" ? -40 : -85,
                  }}
                  tickFormatter={(value) => {
                    return metric === "acres" ? value : currencyFormatter(value);
                  }}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    return props.dataKey === "grazing_acres" || props.dataKey === "haying_acres"
                      ? value
                      : currencyFormatter(value);
                  }}
                />
                <Legend verticalAlign="top" />
                <Bar dataKey={grazingKey} fill="#8884d8" name="Grazing" />
                <Bar dataKey={hayingKey} fill="#82ca9d" name="Haying" />
                <Brush dataKey="year" height={30} x={140} y={365} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
