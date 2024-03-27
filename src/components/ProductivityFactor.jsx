import React, { useState } from "react";
import { Slider, Typography } from "@mui/material";

export default function ProductivityFactor({ tabState, setTabState, id }) {
  const [localProductivityFactor, setLocalProductivityFactor] = useState(
    tabState.productivityFactor
  );

  const handleSliderChange = (event, newValue) => {
    setLocalProductivityFactor(newValue);
  };

  const handleCommitChange = (event, newValue) => {
    setTabState({ ...tabState, productivityFactor: newValue }, id);
  };

  return (
    <React.Fragment>
      <Typography gutterBottom>Productivity Factor: {localProductivityFactor}%</Typography>
      <Slider
        sx={{ marginLeft: "1rem", marginRight: "1rem", width: "80%" }}
        value={localProductivityFactor}
        onChange={handleSliderChange}
        onChangeCommitted={handleCommitChange}
        step={1}
        min={60}
        max={150}
      />
    </React.Fragment>
  );
}
