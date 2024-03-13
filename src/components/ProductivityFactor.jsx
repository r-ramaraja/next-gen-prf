import React from "react";
import { Slider, Typography } from "@mui/material";

export default function ProductivityFactor({ productivityFactor, setProductivityFactor }) {
  return (
    <React.Fragment>
      <Typography gutterBottom sx={{ margin: "10px" }}>
        Productivity Factor: {productivityFactor}%
      </Typography>
      <Slider
        sx={{ width: "50vh", marginLeft: "10px" }}
        value={productivityFactor}
        onChange={(event, newValue) => setProductivityFactor(newValue)}
        step={1}
        min={60}
        max={150}
      />
    </React.Fragment>
  );
}
