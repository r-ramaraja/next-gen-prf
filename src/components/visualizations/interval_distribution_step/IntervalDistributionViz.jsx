import React, { useState, useEffect } from "react";
import IntervalDistributionLine from "./IntervalDistributionLine";
import axios from "axios";
import { baseURL } from "../../../constants";
import { Box, Skeleton } from "@mui/material";

export default function IntervalDistributionViz({ marker }) {
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
        const response = await axios.post(`${baseURL}/viz/interval`, requestBody);
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

  return (
    <Box>
      {error && <p>Error loading data</p>}
      {loading && <Skeleton variant="rectangular" width={"80%"} height="20rem" />}
      {visualizationData && <IntervalDistributionLine visualizationData={visualizationData} />}
    </Box>
  );
}
