import React, { useState } from "react";
import { Slider, Typography, Box } from "@mui/material";

export default function ProductivityFactor({ tabState, setTabState, id, isGuided }) {
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
        sx={{ marginLeft: "1rem", marginRight: "1rem", width: isGuided ? "40%" : "70%" }}
        value={localProductivityFactor}
        onChange={handleSliderChange}
        onChangeCommitted={handleCommitChange}
        step={1}
        min={60}
        max={150}
      />
      {isGuided && (
        <Box>
          <p>
            <strong>What is productivity factor?</strong>
          </p>
          <p>
            <em>Productivity factor</em>, expressed as a percentage, represents the relative
            productivity of the insured&apos;s acreage in comparison to the county average. The main
            purpose of the <em>productivity factor</em> is to align the insurance coverage more
            closely with the actual productivity and value of the insured&apos;s acreage. This is
            particularly useful in diverse regions where productivity can vary significantly within
            the same county or area.
            <br />
            Policyholders can typically choose a <em>productivity factor</em> between 60% to 150% in
            increments of 1%. If a policyholder selects a <em>productivity factor</em> greater than
            100%, they are indicating that their land is more productive than the average in their
            county. Conversely, selecting a factor less than 100% suggests lower productivity.
          </p>
          <p>
            <strong>How does it impact the policy?</strong>
          </p>
          <p>
            The choice of <em>productivity factor</em> directly influences the{" "}
            <em>dollar amount protection</em> value (
            <em>County Base Value * Coverage Level * Productivity Factor</em>).
            <em> Dollar amount protection</em> represents the monetary value of coverage that the
            insurance policy provides per acre. This value serves as the foundation for determining
            potential premium rates and indemnity payments.
            <br />
            Hence, the choice of<em> productivity factor</em> further influences the premiums rates
            and the indemnity payments.
          </p>
        </Box>
      )}
    </React.Fragment>
  );
}
