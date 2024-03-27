import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Overview({ marker }) {
  return (
    <Box p={1}>
      <Typography component={"span"}>
        <div>
          <span style={{ fontWeight: "bold" }}>Latitude:</span> {marker.lat.toFixed(3)}
        </div>
        <div>
          <span style={{ fontWeight: "bold" }}>Longitude:</span> {marker.lng.toFixed(3)}
        </div>
        {marker.gridcode && (
          <div>
            <span style={{ fontWeight: "bold" }}>Grid ID:</span> {marker.gridcode}
          </div>
        )}
        {marker.state && (
          <div>
            <span style={{ fontWeight: "bold" }}>State:</span> {marker.state}
          </div>
        )}
        {marker.county && (
          <div>
            <span style={{ fontWeight: "bold" }}>County:</span> {marker.county}
          </div>
        )}
      </Typography>
    </Box>
  );
}
