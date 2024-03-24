/* eslint-disable react/prop-types */
import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import InfoIcon from "@mui/icons-material/Info";

function MarkerList({ markers, deleteMarker, onMarkerSelect, onAddTab }) {
  return (
    <div>
      <Typography variant="h5" style={{ marginTop: "1rem" }}>
        Marker List
      </Typography>
      {markers.length > 0 ? (
        markers.map((marker, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography component={"span"}>
                <span style={{ fontWeight: "bold" }}>Marker {marker.id + 1}</span>
              </Typography>
              <IconButton
                onClick={() => deleteMarker(marker, marker.id)}
                aria-label="delete"
                size="small"
                style={{ marginLeft: "auto" }}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  onMarkerSelect(marker.lat, marker.lng);
                }}
                aria-label="zoom-in"
                size="small"
              >
                <ZoomInIcon />
              </IconButton>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  onAddTab(marker, marker.id);
                }}
                aria-label="zoom-in"
                size="small"
              >
                <InfoIcon />
              </IconButton>
            </AccordionSummary>
            <AccordionDetails>
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
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography style={{ marginTop: "1rem" }}>No markers selected.</Typography>
      )}
    </div>
  );
}

export default MarkerList;
