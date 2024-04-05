import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Skeleton } from "@mui/material";
import { baseURL } from "../../../constants";
import IntervalDistributionLine from "./IntervalDistributionLine";
import InvocationsLine from "./InvocationsLine";

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
      {error && !loading && <Box sx={{ margin: "5rem" }}>Error loading data.</Box>}
      {loading && <Skeleton variant="rectangular" width={"80%"} height="20rem" />}
      {visualizationData && Object.keys(visualizationData).length > 0 ? (
        <IntervalDistributionLine visualizationData={visualizationData} />
      ) : (
        !loading && <Box sx={{ margin: "5rem" }}>Data not available yet.</Box>
      )}
      {visualizationData && Object.keys(visualizationData).length > 0 ? (
        <InvocationsLine visualizationData={visualizationData} />
      ) : (
        !loading && <Box sx={{ margin: "5rem" }}>Data not available yet.</Box>
      )}
    </Box>
  );
}
