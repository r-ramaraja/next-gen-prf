import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Download from "./Download";

const StyledTableHeader = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

export default function DecisionSupportTableViz({ visualizationData }) {
  const rows = [];
  for (const interval in visualizationData.intervals) {
    rows.push({
      interval: visualizationData.intervals[interval].interval_name,
      percent_value: `${visualizationData.intervals[interval].percent_value * 100}%`,
      policy_protection: visualizationData.intervals[interval].policy_protection.toLocaleString(
        "en-US",
        { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }
      ),
      premium_rate: visualizationData.intervals[interval].premium_rate.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
      actual_premium: visualizationData.intervals[interval].actual_premium.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      index: visualizationData.intervals[interval].index,
      indemnity: visualizationData.intervals[interval].indemnity.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      indemnity_color: visualizationData.intervals[interval].indemnity > 0 ? "#03fcba" : "#ffffff",
    });
  }

  return (
    visualizationData && (
      <React.Fragment>
        <Download />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableHeader>Interval</StyledTableHeader>
                <StyledTableHeader padding="none">Percent of Value</StyledTableHeader>
                <StyledTableHeader padding="none">Policy Protection/Unit</StyledTableHeader>
                <StyledTableHeader padding="none">Premium Rate</StyledTableHeader>
                <StyledTableHeader padding="none">Subsidized Premium</StyledTableHeader>
                <StyledTableHeader padding="none">Index</StyledTableHeader>
                <StyledTableHeader padding="none">Estimated Indemnity</StyledTableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={row.interval}
                  sx={{
                    borderBottom: index === rows.length - 1 ? "2px solid" : "",
                  }}
                >
                  <TableCell>{row.interval}</TableCell>
                  <TableCell>{row.percent_value}</TableCell>
                  <TableCell>{row.policy_protection}</TableCell>
                  <TableCell>{row.premium_rate}</TableCell>
                  <TableCell>{row.actual_premium}</TableCell>
                  <TableCell>{row.index}</TableCell>
                  <TableCell sx={{ backgroundColor: row.indemnity_color }}>
                    {row.indemnity}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell>Per Acre</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  {(
                    visualizationData.sum_actual_premium / visualizationData.total_acres
                  ).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  {(visualizationData.sum_indemnity > 0
                    ? visualizationData.sum_indemnity / visualizationData.total_acres
                    : 0
                  ).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>{visualizationData.sum_percent_value}</TableCell>
                <TableCell>
                  {visualizationData.sum_policy_protection.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  {visualizationData.sum_actual_premium.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  {visualizationData.sum_indemnity.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
    )
  );
}
