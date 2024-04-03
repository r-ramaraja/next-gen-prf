import React, { useState, useEffect } from "react";
import IntervalDistributionLine from "./IntervalDistributionLine";
import axios from "axios";
import { baseURL } from "../../../constants";

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

  return <IntervalDistributionLine visualizationData={visualizationData} />;
}
