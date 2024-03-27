import React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Image from "@mui/icons-material/Image";
import Dataset from "@mui/icons-material/Dataset";
import Box from "@mui/material/Box";
import DownloadIcon from "@mui/icons-material/Download";

const actions = [
  { icon: <Image />, name: "Download PNG" },
  { icon: <Dataset />, name: "Download CSV" },
];

export default function Download() {
  return (
    <Box sx={{ height: "0.2rem", transform: "translateZ(0px)", flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon openIcon={<DownloadIcon />} />}
      >
        {actions.map((action) => (
          <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
        ))}
      </SpeedDial>
    </Box>
  );
}
