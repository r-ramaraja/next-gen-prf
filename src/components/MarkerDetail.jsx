/* eslint-disable react/prop-types */
import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function MarkerDetail({ marker }) {
  return (
    <Box padding={2}>
      <Typography variant="h6">Marker Details</Typography>
      <Typography variant="body1">Latitude: {marker.lat.toFixed(3)}</Typography>
      <Typography variant="body1">Longitude: {marker.lng.toFixed(3)}</Typography>
      {marker.gridcode && <Typography variant="body1">Grid ID: {marker.gridcode}</Typography>}
      {marker.state && <Typography variant="body1">State: {marker.state}</Typography>}
      {marker.county && <Typography variant="body1">County: {marker.county}</Typography>}
      {/* Add more details as needed */}
    </Box>
  );
}

export default MarkerDetail;
