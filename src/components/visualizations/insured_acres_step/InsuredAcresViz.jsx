import React, { useState, useEffect } from "react";
import InsuredAcresLine from "./InsuredAcresLine";
import axios from "axios";
import { baseURL } from "../../../constants";
import { Box, Skeleton } from "@mui/material";

export default function InsuredAcresViz({ marker }) {
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
        const response = await axios.post(`${baseURL}/viz/acres`, requestBody);
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
        <InsuredAcresLine visualizationData={visualizationData} state={state} county={county} />
      ) : (
        !loading && <Box sx={{ margin: "5rem" }}>Data not available yet.</Box>
      )}
    </Box>
  );
}
