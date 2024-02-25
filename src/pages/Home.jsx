/* eslint-disable no-inner-declarations */

import React, { useRef, useEffect } from "react";
import "leaflet-control-geocoder";
import MarkerSidebar from "../components/MarkerList.jsx";
import MarkerDetail from "../components/MarkerDetail.jsx";
import { Tabs, Tab, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GridLocator from "../components/GridLocator.jsx";
import Header from "../components/Header";

function Map() {
  const mapInstance = useRef(null); // Holds the Leaflet map instance
  const [markers, setMarkers] = React.useState([]);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [tabs, setTabs] = React.useState([
    {
      label: "Grid Locator",
      content: <GridLocator setMarkers={setMarkers} markers={markers} mapInstance={mapInstance} />,
    },
  ]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const addTab = (marker, index, id) => {
    for (const tab of tabs) {
      if (tab.marker) {
        if (marker.lat === tab.marker.lat && marker.lng === tab.marker.lng) {
          setSelectedTab(tabs.indexOf(tab));
          return;
        }
      }
    }

    const newTabIndex = tabs.length;
    const newTab = {
      label: `Marker ${id + 1}`,
      id: id,
      marker,
    };
    setTabs([...tabs, newTab]);
    setSelectedTab(newTabIndex);
  };

  const deleteTab = (id) => {
    const tabIndex = tabs.findIndex((tab) => tab.id === id);
    const newTabs = tabs.filter((_, index) => index !== tabIndex);
    setTabs(newTabs);

    // Adjust the selected tab if necessary
    if (selectedTab >= tabIndex) {
      setSelectedTab((prev) => Math.max(prev - 1, 0));
    }
  };

  const deleteMarker = (markerToDelete, id) => {
    markerToDelete.marker.remove(); // Remove from Leaflet map
    deleteTab(id);
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker) => marker.marker !== markerToDelete.marker)
    );
  };

  const focusOnMarker = (lat, lng) => {
    if (mapInstance.current) {
      mapInstance.current.setView([lat, lng], 10); // 13 is the zoom level, adjust as needed
    }
  };

  useEffect(() => {
    // Invalidate the map size when switching back to the "Grid Locator" tab
    if (selectedTab === 0) {
      setTimeout(() => {
        mapInstance.current?.invalidateSize();
      }, 0);
    }
  }, [selectedTab]);

  const renderSelectedTab = (selectedTab) => {
    if (selectedTab === 0) {
      return <GridLocator setMarkers={setMarkers} markers={markers} mapInstance={mapInstance} />;
    } else {
      return <MarkerDetail marker={tabs[selectedTab].marker} />;
    }
  };

  return (
    <Box>
      <Header />
      <Box sx={{ display: "flex", height: "70vh" }}>
        <Box
          sx={{
            width: "300px",
            maxHeight: "70vh",
            overflowY: "auto",
            flexShrink: 0,
            marginRight: "10px",
          }}
        >
          <MarkerSidebar
            markers={markers}
            deleteMarker={deleteMarker}
            onMarkerSelect={focusOnMarker}
            onAddTab={addTab}
          />
        </Box>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {tab.label}
                    {index != 0 && (
                      <IconButton
                        size="small"
                        onClick={(event) => {
                          event.stopPropagation(); // Prevent tab selection
                          deleteTab(index);
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
          <Box sx={{ flexGrow: 1 }}>{renderSelectedTab(selectedTab)}</Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Map;
