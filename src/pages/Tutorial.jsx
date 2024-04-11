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
import Header from "../components/Header.jsx";

const drawerWidth = 240;

export default function Tutorial() {
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
            Coming soon ...
          </Typography>
          <Typography paragraph id="marker-list-actions">
            <Typography variant="h6">2. Marker List Actions</Typography>
            Coming soon ...
          </Typography>
          <Typography paragraph id="marker-info">
            <Typography variant="h6">3. Marker Info</Typography>
            Coming soon ...
          </Typography>
          <Typography paragraph id="marker-overview" sx={{ pl: 4 }}>
            <Typography variant="h6">3.1. Overview</Typography>
            Coming soon ...
          </Typography>
          <Typography paragraph id="decision-support" sx={{ pl: 4 }}>
            <Typography variant="h6">3.2. Decision Support</Typography>
            Coming soon ...
          </Typography>
          <Typography paragraph id="guided-mode" sx={{ pl: 8 }}>
            <Typography variant="h6">3.2.1. Guided Mode</Typography>
            Coming soon ...
          </Typography>
          <Typography paragraph id="regular-mode" sx={{ pl: 8 }}>
            <Typography variant="h6">3.2.2. Regular Mode</Typography>
            Coming soon ...
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
