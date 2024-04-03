import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Download from "../components/Download";
import { baseURL } from "../constants";
import Skeleton from "@mui/material/Skeleton";

const StyledTableHeader = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function CountyBaseTable({ marker }) {
  const [countyBaseData, setCountyBaseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const requestBody = {
        state: marker.state,
        county: marker.county,
      };
      try {
        const response = await axios.post(`${baseURL}/countybase`, requestBody);
        setCountyBaseData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [marker]);

  return (
    <Box>
      {error && !loading && <Box sx={{ margin: "5rem" }}>Error loading data.</Box>}
      {loading && <Skeleton variant="rectangular" width={"80%"} height="20rem" />}
      {countyBaseData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableHeader>Intended Use</StyledTableHeader>
                <StyledTableHeader>Irrigation Practice</StyledTableHeader>
                <StyledTableHeader>Organic Practice</StyledTableHeader>
                <StyledTableHeader>County Base Value</StyledTableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {countyBaseData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{capitalizeFirstLetter(row.intended_use)}</TableCell>
                  <TableCell>
                    {row.irrigation_practice ? capitalizeFirstLetter(row.irrigation_practice) : "-"}
                  </TableCell>
                  <TableCell>
                    {row.organic_practice ? capitalizeFirstLetter(row.organic_practice) : "-"}
                  </TableCell>
                  <TableCell>
                    {row.county_base_value.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ margin: "5rem" }}>Data not available yet.</Box>
      )}
    </Box>
  );
}
