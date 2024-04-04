import React, { useState } from "react";
import { Slider, Typography, Box } from "@mui/material";
import CoverageLevelViz from "./visualizations/coverage_level_step/CoverageLevelViz";

export default function CoverageLevel({ tabState, setTabState, marker, isGuided }) {
  const [localCoverageLevel, setLocalCoverageLevel] = useState(tabState.coverageLevel);
  const { id } = marker;

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
        sx={{ marginLeft: "1rem", marginRight: "1rem", width: isGuided ? "40%" : "70%" }}
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

      {isGuided && (
        <Box>
          <p>
            <span style={{ textDecoration: "underline" }}>
              <strong>Definition</strong>
            </span>
          </p>
          <p>
            The <em>coverage level</em> is a percentage value that determines how much of the
            potential loss will be covered by the insurance policy. It essentially sets the
            threshold for when insurance payments will be triggered.
          </p>
          <p>
            The program offers <em>coverage levels</em> ranging from 70% to 90% in increments of 5%.
          </p>
          <p>
            <span style={{ textDecoration: "underline" }}>
              <strong>Impact</strong>
            </span>
          </p>
          <p>
            <em>Coverage level</em> selection influences the amount of premium paid and the
            indemnity (compensation) the insured might receive in case of a loss.
          </p>
          <p>
            Higher <em>coverage levels</em> usually result in higher premiums because they offer
            greater protection and, therefore, pose a higher risk to the insurer.
            <br />
            Conversely, lower <em>coverage levels</em> cost less but also provide less financial
            protection.
          </p>
          <p>
            Likewise, a higher <em>coverage level </em>means the insurance will start to pay out at
            a lower threshold of loss, and the potential maximum payment will be higher.
            <br />A lower <em>coverage level</em> means a higher threshold and a lower maximum
            payment.
          </p>
        </Box>
      )}
      {isGuided && <CoverageLevelViz marker={marker} />}
    </React.Fragment>
  );
}
