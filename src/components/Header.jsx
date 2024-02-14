import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import { Person, Settings, Info } from "@mui/icons-material";
import { Close } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function Header() {
  const [showDrawer, setShowDrawer] = React.useState(false);

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleDrawer}
        >
          <MenuIcon />
          <Drawer open={showDrawer}>
            <Box role="presentation">
              <List sx={{ mx: 1 }}>
                <ListItem disablePadding>
                  <ListItemButton onClick={toggleDrawer}>
                    <ListItemIcon>
                      <Close />
                    </ListItemIcon>
                    <ListItemText primary={"Close"} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/profile">
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary={"Profile"} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                    <ListItemText primary={"Settings"} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/about">
                    <ListItemIcon>
                      <Info />
                    </ListItemIcon>
                    <ListItemText primary={"About"} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding></ListItem>
              </List>
            </Box>
          </Drawer>
        </IconButton>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none" }}
          color="white"
        >
          Next-Gen PRF Tool
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
