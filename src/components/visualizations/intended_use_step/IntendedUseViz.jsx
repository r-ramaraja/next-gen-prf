import React, { useState, useEffect } from "react";
import IndemnitiesBar from "./IndemnitiesBar";
import axios from "axios";
import { baseURL } from "../../../constants";
import { Box, Grid } from "@mui/material";
import CountyBaseTable from "../../CountyBaseTable";

export default function IntendedUseViz({ marker }) {
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
      <Grid container>
        <Grid item xs={12}>
          <CountyBaseTable marker={marker} />
        </Grid>
        <Grid item xs={12}>
          <IndemnitiesBar visualizationData={visualizationData} />
        </Grid>
      </Grid>
    </Box>
  );
}
