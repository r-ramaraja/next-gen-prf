import React, { useState, useEffect } from "react";
import CoverageLevelBar from "./CoverageLevelBar";
import axios from "axios";
import { baseURL } from "../../../constants";
import { Box, Grid } from "@mui/material";

export default function CoverageLevelViz({ marker }) {
  const { county, state } = marker;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visualizationData, setVisualizationData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const requestBody = {
        state: state,
        county: county,
      };
      try {
        const response = await axios.post(`${baseURL}/viz/coverage`, requestBody);
        setVisualizationData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return <CoverageLevelBar visualizationData={visualizationData} />;
}
