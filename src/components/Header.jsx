import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none" }}
          color="white"
        >
          Next-Gen PRF Tool
        </Typography>
        <Tooltip title="Tool">
          <IconButton color="inherit" edge="end" onClick={() => navigate("/tool")} sx={{ mr: 1 }}>
            <RocketLaunchIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Help">
          <IconButton color="inherit" edge="end" onClick={() => navigate("/guide")}>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
