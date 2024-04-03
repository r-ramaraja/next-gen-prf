import React, { useState, useEffect } from "react";
import axios from "axios";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { geoAlbers } from "d3-geo";
import { baseURL } from "../constants";
import { Box, Skeleton } from "@mui/material";

export default function CountyMap({ marker }) {
  const [geoJSON, setGeoJSON] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const requestBody = {
        state: marker.state,
      };
      try {
        const response = await axios.post(`${baseURL}/geojson`, requestBody);
        setGeoJSON(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [marker]);

  const { county } = marker;
  const projection = geoAlbers().scale(6000).center([0, 38]).rotate([78, 0, 0]);
  return (
    <Box>
      {error && !loading && <Box sx={{ margin: "5rem" }}>Error loading data.</Box>}
      {loading && <Skeleton variant="rectangular" width="60%" height={"15rem"} />}
      {geoJSON && (
        <ComposableMap
          projection={projection}
          projectionConfig={{ rotate: [-105, 0, 0] }}
          style={{ width: "50%", height: "auto" }}
        >
          <Geographies geography={geoJSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isMarkerCounty = geo.properties.name === county;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isMarkerCounty ? "red" : "#DDD"}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      )}
    </Box>
  );
}
