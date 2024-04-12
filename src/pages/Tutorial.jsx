import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Container,
  AppBar,
  Toolbar,
  CssBaseline,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CalculateIcon from "@mui/icons-material/Calculate";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Header from "../components/Header.jsx";

const GuidedModeSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const drawerWidth = 240;

export default function Tutorial() {
  const switchRef = React.useRef(null);

  const handleChange = () => {
    const current = switchRef.current;
    if (current) {
      current.checked = !current.checked;
    }
  };

  const appBarHeight = 64;

  const navigateToSection = (section) => {
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
      const sectionTop = sectionElement.getBoundingClientRect().top;
      window.scrollBy({
        top: sectionTop - appBarHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Header />
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Typography variant="h6" style={{ marginLeft: "1rem", marginTop: "1rem" }}>
          Contents
        </Typography>
        <List component="nav">
          <ListItemButton onClick={() => navigateToSection("grid-locator")}>
            <ListItemText primary="1. Grid Locator" />
          </ListItemButton>
          <ListItemButton onClick={() => navigateToSection("marker-list-actions")}>
            <ListItemText primary="2. Marker List Actions" />
          </ListItemButton>
          <ListItemButton onClick={() => navigateToSection("marker-info")}>
            <ListItemText primary="3. Marker Info" />
          </ListItemButton>

          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigateToSection("marker-overview")}>
              <ListItemText primary="3.1. Overview" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigateToSection("decision-support")}>
              <ListItemText primary="3.2. Decision Support" />
            </ListItemButton>

            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 8 }} onClick={() => navigateToSection("guided-mode")}>
                <ListItemText primary="3.2.1. Guided Mode" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 8 }} onClick={() => navigateToSection("regular-mode")}>
                <ListItemText primary="3.2.2. Regular Mode" />
              </ListItemButton>
            </List>
          </List>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="lg">
          <Typography paragraph id="grid-locator">
            <Typography variant="h6">1. Grid Locator</Typography>
            <ol>
              <li style={{ marginBottom: "1rem" }}>
                To identify the point of reference for your acreage, consult the{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.rma.usda.gov/-/media/RMA/Handbooks/Coverage-Plans---18000/Rainfall-and-Vegetation-Index---18150/2024-18150-1-Rainfall-Index-Handbook.ashx?la=en"
                >
                  Rainfall Index Insurance Standards Handbook
                </a>
                , specifically{" "}
                <strong>PART 4: Identifying acreage and grid ID—Sections 74-76</strong>.
              </li>
              <li style={{ marginBottom: "1rem" }}>
                Once you have identified the point of reference, you can place a marker on the map
                either manually by zooming and panning to it or by typing the location details into
                the search bar.
              </li>
              <li style={{ marginBottom: "1rem" }}>
                Based on your acreage, you may have more than one point of reference. If so, place
                multiple markers corresponding to each point.
              </li>
              <li style={{ marginBottom: "1rem" }}>
                Every marker that you place will appear on the left sidebar as a list.
              </li>
            </ol>
          </Typography>
          <Typography paragraph id="marker-list-actions">
            <Typography variant="h6">2. Marker List Actions</Typography>
            <ol>
              <li style={{ marginBottom: "1rem" }}>
                You can expand or collapse each marker list item in the left sidebar to view
                information such as latitude, longitude, grid ID, county, and state.
                {/* <div>
                  <img src="/collapse.gif" alt="Placing markers on map" width="60%" />
                </div> */}
              </li>
              <li>
                Each marker list item has three associated actions:
                <ol style={{ listStyleType: "lower-alpha" }}>
                  <li>
                    <span style={{ verticalAlign: "middle" }}>
                      <DeleteIcon />
                    </span>
                    The delete action removes the marker from the map and the list. It also removed
                    any associated tabs.
                  </li>
                  <li>
                    <span style={{ verticalAlign: "middle" }}>
                      <ZoomInIcon />
                    </span>{" "}
                    The zoom action zooms and centers on the marker location.
                  </li>
                  <li>
                    <span style={{ verticalAlign: "middle" }}>
                      <InfoIcon />
                    </span>{" "}
                    The info action opens up a new tab next to the “Grid Locator” tab with its
                    associated name.
                  </li>
                </ol>
              </li>
            </ol>
          </Typography>
          <Typography paragraph id="marker-info">
            <Typography variant="h6">3. Marker Info</Typography>
            <p>The marker info tab contains two sub-tabs:</p>
            <ol>
              <li>
                The overview tab contains insights into the historical trends of rainfall index and
                enrollment information of the county or grid ID in which the marker is located.
              </li>
              <li>
                The decision support tab allows you to learn more about each parameter selection in
                the program and make their selection based on the insights available. You can
                customize insurance scenarios by adjusting the parameters to explore different risk
                management strategies.
              </li>
            </ol>
          </Typography>
          <Typography paragraph id="marker-overview">
            <Typography variant="h6">3.1. Overview</Typography>
            <p>
              The overview section contains multiple visualizations that show insights into the
              historical trends of rainfall index and enrollment information of the county or grid
              ID in which the marker is located.
            </p>
            <p>
              Each visualization is accompanied by a description that explains its purpose and how
              it helps the user to make a decision, as well as a summary of the sum, average, max,
              and min (non-zero) values.
            </p>
            <p>
              Some visualizations also have dropdowns, filters, and time sliders at the bottom to
              focus on specific details such as a particular metric, timeframe, or criteria.
            </p>
          </Typography>
          <Typography paragraph id="decision-support">
            <Typography variant="h6">3.2. Decision Support</Typography>
            <p>
              The decision support tab enables users to customize insurance scenarios by adjusting
              the parameters to explore different risk management strategies. You have to make
              selections for the following parameters:
            </p>
            <ol>
              <li>
                Intended use
                <ol style={{ listStyleType: "none", paddingLeft: "20px" }}>
                  <li style={{ listStyleType: "none" }}>
                    <span style={{ marginRight: "5px" }}>1.1.</span> Irrigation practice (if
                    applicable)
                  </li>
                  <li style={{ listStyleType: "none" }}>
                    <span style={{ marginRight: "5px" }}>1.2.</span> Organic practice (if
                    applicable)
                  </li>
                </ol>
              </li>

              <li>Coverage level</li>
              <li>Productivity factor</li>
              <li>Insured acres</li>
              <li>Insurable interest</li>
              <li>Sample year</li>
              <li>Interval distribution</li>
            </ol>
            <p>
              There are two modes available: <strong>guided</strong> and <strong>regular</strong>.
              <br />
              The toggle button allows you to switch between the modes.{" "}
              <FormControlLabel
                control={
                  <GuidedModeSwitch ref={switchRef} defaultChecked={true} onChange={handleChange} />
                }
                label="Guided"
                labelPlacement="end"
              />
            </p>
          </Typography>
          <Typography paragraph id="guided-mode">
            <Typography variant="h6">3.2.1. Guided Mode</Typography>
            <p>
              The guided mode is intended for users who are not familiar with the program. It allows
              the user to learn about each parameter and make selections based on the insights
              provided.
            </p>
            <p>
              The user is guided step-by-step, where at each step, they are presented with the
              definition of the parameter, the impact the parameter would have on the policy,
              insights about the parameter for the county/grid ID in which the marker is located in
              the form of visualizations along with its associated description.
            </p>
            <p>
              Every parameter selection has its set of validations. If you enter incorrect details,
              an error message will appear, preventing you from proceeding to the next step until
              it’s fixed.
            </p>
            <p>
              After the user navigates through all seven parameter selections, they click on{" "}
              <span style={{ verticalAlign: "middle" }}>
                <Button variant="contained" color="primary" size="small">
                  Finish
                </Button>
              </span>{" "}
              and arrive at the final page, where they can make any last-minute revisions before
              pressing{" "}
              <span style={{ verticalAlign: "middle" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CalculateIcon />}
                  size="small"
                >
                  Calculate
                </Button>
              </span>
            </p>

            <p>
              After pressing the{" "}
              <span style={{ verticalAlign: "middle" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CalculateIcon />}
                  size="small"
                >
                  Calculate
                </Button>
              </span>{" "}
              the user will be presented with the results, which show details such as policy
              protection, premium payments, and estimated indemnities.
            </p>
          </Typography>
          <Typography paragraph id="regular-mode">
            <Typography variant="h6">3.2.2. Regular Mode</Typography>
            <p>
              The regular mode is intended for users already familiar with the program. Unlike the
              guided mode, it directly takes you to the page where you can view and edit all
              parameters.
              <br />
              Once you have made your parameter selections, click on the{" "}
              <span style={{ verticalAlign: "middle" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CalculateIcon />}
                  size="small"
                >
                  Calculate
                </Button>
              </span>{" "}
              to see the results.
            </p>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
