import React, { useState } from "react";
import { Slider, Typography, Box } from "@mui/material";

export default function CoverageLevel({ tabState, setTabState, id, isGuided }) {
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
            <strong>What is coverage level?</strong>
          </p>
          <p>
            The <em>coverage level</em> is a selected percentage that determines how much of the
            potential loss will be covered by the insurance policy. It essentially sets the
            threshold for when insurance payments will be triggered. <em>Coverage levels</em> are
            typically offered in a range of percentages, allowing the policyholder to choose based
            on their risk tolerance and financial capacity. The program offers{" "}
            <em>coverage levels</em>
            ranging from 70% to 90% in increments of 5%.
            <br />
            Selecting the appropriate <em>coverage level</em> is a fundamental decision point for
            policyholders, significantly influencing both the cost of the insurance and the level of
            risk protection it provides. Policyholders must balance the cost of the premium against
            the potential financial protection the policy provides, considering factors like risk
            exposure, financial resilience, and overall risk management strategy.
          </p>
          <p>
            <strong>How does it impact the policy?</strong>
          </p>
          <p>
            <em>Coverage level</em> selection influences the amount of premium paid and the
            indemnity (compensation) the insured might receive in case of a loss.
            <br />
            Higher <em>coverage levels</em> usually result in higher premiums because they offer
            greater protection and, therefore, pose a higher risk to the insurer. Conversely, lower{" "}
            <em>coverage levels</em> cost less but also provide less financial protection.
            <br />
            Likewise, a higher <em>coverage level </em>means the insurance will start to pay out at
            a lower threshold of loss, and the potential maximum payment will be higher.
          </p>
        </Box>
      )}
    </React.Fragment>
  );
}
