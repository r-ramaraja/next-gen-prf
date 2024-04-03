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
} from "recharts";
import { Box, Grid } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { currencyFormatter } from "../../../constants";

export default function IndemnitiesBar({ visualizationData }) {
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

  const yearSet = new Set([...Object.keys(haying), ...Object.keys(grazing)]);

  for (const year of yearSet) {
    data.push({
      year,
      grazing_indemnity: grazing[year] ? grazing[year]["sum_indemnity"] : 0,
      grazing_actual_premium: grazing[year] ? grazing[year]["sum_actual_premium"] : 0,
      grazing_acres: grazing[year] ? grazing[year]["acres"] : 0,
      haying_indemnity: haying[year] ? haying[year]["sum_indemnity"] : 0,
      haying_actual_premium: haying[year] ? haying[year]["sum_actual_premium"] : 0,
      haying_acres: haying[year] ? haying[year]["acres"] : 0,
    });
  }

  return (
    <Box>
      <Grid container>
        <Grid item sx={{ marginLeft: "1.5rem", marginTop: "2rem" }}>
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
          <Box sx={{ height: 300, width: "70rem", marginTop: "1rem" }}>
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
                <Tooltip
                  formatter={(value, name, props) => {
                    return props.dataKey === "grazing_acres" || props.dataKey === "haying_acres"
                      ? value
                      : currencyFormatter(value);
                  }}
                />
                <Legend />
                <Bar dataKey={grazingKey} stackId="a" fill="#8884d8" name="Grazing" />
                <Bar dataKey={hayingKey} stackId="a" fill="#82ca9d" name="Haying" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
