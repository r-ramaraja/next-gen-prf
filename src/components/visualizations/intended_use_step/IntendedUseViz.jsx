import React, { useState, useEffect } from "react";
import IntendedUseBar from "./IntendedUseBar";
import axios from "axios";
import { baseURL } from "../../../constants";
import { Box, Grid, Skeleton } from "@mui/material";
import CountyBaseTable from "../overview/CountyBaseTable";

export default function IntendedUseViz({ marker, isOverviewView }) {
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
        const response = await axios.post(`${baseURL}/viz/usage`, requestBody);
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
        <Grid container>
          <Grid item xs={12}>
            <CountyBaseTable marker={marker} />
          </Grid>
          <Grid item xs={12}>
            <IntendedUseBar
              visualizationData={visualizationData}
              isOverviewView={isOverviewView}
              state={state}
              county={county}
            />
          </Grid>
        </Grid>
      ) : (
        !loading && <Box sx={{ margin: "5rem" }}>Data not available yet.</Box>
      )}
    </Box>
  );
}
