import React, { useState } from "react";
import { Slider, Typography } from "@mui/material";

export default function CoverageLevel({ tabState, setTabState, id }) {
  const [localCoverageLevel, setLocalCoverageLevel] = useState(tabState.coverageLevel);

  const handleSliderChange = (event, newValue) => {
    setLocalCoverageLevel(newValue);
  };

  const handleCommitChange = (event, newValue) => {
    setTabState({ ...tabState, coverageLevel: newValue }, id);
  };

  return (
    <React.Fragment>
      <Typography gutterBottom>Coverage Level</Typography>
      <Slider
        sx={{ marginLeft: "1rem", marginRight: "1rem", width: "80%" }}
        value={localCoverageLevel}
        onChange={handleSliderChange}
        onChangeCommitted={handleCommitChange}
        step={5}
        min={70}
        max={90}
        marks={[
          {
            value: 70,
            label: "70%",
          },
          {
            value: 75,
            label: "75%",
          },
          {
            value: 80,
            label: "80%",
          },
          {
            value: 85,
            label: "85%",
          },
          {
            value: 90,
            label: "90%",
          },
        ]}
      />
    </React.Fragment>
  );
}
