import React, { useEffect, useState } from "react";
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
      <Typography gutterBottom sx={{ margin: "10px" }}>
        Productivity Factor: {localProductivityFactor}%
      </Typography>
      <Slider
        sx={{ width: "50vh", marginLeft: "10px" }}
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
