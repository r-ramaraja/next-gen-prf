/* eslint-disable react/prop-types */
import React from "react";
import Typography from "@mui/material/Typography";
import { Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import GuidedDecisionSupport from "../components/GuidedDecisionSupport";
import Overview from "../components/Overview";

function MarkerDetail({ marker }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        sx={{ width: "100%" }}
        {...other}
      >
        {value === index && <React.Fragment>{children}</React.Fragment>}
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", marginTop: "10px" }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: "divider", width: "10%" }}
      >
        <Tab label="Overview" />
        <Tab label="Decision Support" />
        <Tab label="Precipitation" />
        <Tab label="Summary of Business" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Overview marker={marker} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box sx={{ p: 1 }}>
          <GuidedDecisionSupport marker={marker} />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box sx={{ p: 1 }}>
          <Typography>Coming soon...</Typography>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Box sx={{ p: 1 }}>
          <Typography>Coming soon...</Typography>
        </Box>
      </TabPanel>
    </Box>
  );
}

export default MarkerDetail;
