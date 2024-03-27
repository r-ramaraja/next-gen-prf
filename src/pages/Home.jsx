import React, { useRef, useEffect, useState } from "react";
import "leaflet-control-geocoder";
import MarkerSidebar from "../components/MarkerList.jsx";
import MarkerDetail from "./MarkerDetail.jsx";
import { Tabs, Tab, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GridLocator from "../components/GridLocator.jsx";
import Header from "../components/Header";
import { counties } from "../counties.js";
import { states } from "../states.js";
import { grids } from "../grids.js";
import dayjs from "dayjs";

function Map() {
  const mapInstance = useRef(null); // Holds the Leaflet map instance
  const [tabStates, setTabStates] = useState({});
  const [markers, setMarkers] = React.useState([]);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [view, setView] = React.useState({
    center: [39.8333, -94.5833],
    zoom: 4,
  });
  const [tabs, setTabs] = React.useState([
    {
      label: "Grid Locator",
    },
  ]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const addTab = (marker, id) => {
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

    const values = Array(11).fill("");
    values[0] = 50;
    values[2] = 50;
    setTabs([...tabs, newTab]);
    setSelectedTab(newTabIndex);
    setTabStates({
      ...tabStates,
      [id]: {
        markerDetailTabId: 0,
        activeStep: 0,
        intendedUse: "grazing",
        irrigationPractice: "irrigated",
        organicPractice: "non-organic",
        coverageLevel: 90,
        productivityFactor: 100,
        acres: 100,
        acresError: { hasError: false, message: "" },
        interest: 100,
        interestError: { hasError: false, message: "" },
        year: dayjs().subtract(1, "year"),
        monthlyValues: values,
        monthlyErrors: Array(11).fill({ hasError: false, errorMessage: "" }),
        isGuided: false,
      },
    });
  };

  const deleteTab = (id) => {
    const tabIndex = tabs.findIndex((tab) => tab.id === id);
    const newTabs = tabs.filter((_, index) => index !== tabIndex);
    setTabs(newTabs);
    setTabStates((prev) => {
      const newState = { ...prev };
      delete newState[tabIndex];
      return newState;
    });

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
      mapInstance.current.setView([lat, lng], 10);
    }
    setSelectedTab(0);
    setView({ center: [lat, lng], zoom: 10 });
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
      return (
        <GridLocator
          setMarkers={setMarkers}
          markers={markers}
          mapInstance={mapInstance}
          counties={counties}
          grids={grids}
          states={states}
          view={view}
        />
      );
    } else {
      return (
        <MarkerDetail
          marker={tabs[selectedTab].marker}
          tabState={tabStates[tabs[selectedTab].id]}
          setTabState={(newState, id) => setTabStates({ ...tabStates, [id]: newState })}
        />
      );
    }
  };

  return (
    <Box sx={{ display: "flex", flexFlow: "column", height: "100vh" }}>
      <Header />
      <Box
        sx={{
          flex: "1",
          display: "flex",
          flexFlow: "row wrap",
          gap: "1rem",
          margin: "0 1rem 1rem 1rem",
        }}
      >
        <Box
          id="sidebar"
          sx={{
            maxHeight: "90vh",
            overflowY: "auto",
            minWidth: "275px",
          }}
        >
          <MarkerSidebar
            markers={markers}
            deleteMarker={deleteMarker}
            onMarkerSelect={focusOnMarker}
            onAddTab={addTab}
          />
        </Box>
        <Box
          sx={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
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
                          deleteTab(tab.id);
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
