import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Download from "../../Download";
import { currencyFormatter } from "../../../constants";

const StyledTableHeader = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

export default function DecisionSupportTableViz({ visualizationData, tabState }) {
  const { coverageLevel, productivityFactor, interest, acres, monthlyValues } = tabState;
  const countyBaseValue = visualizationData.county_base;
  const subsidyValue = visualizationData.subsidy;
  const dollarAmountProtection = parseFloat(
    (countyBaseValue * (coverageLevel / 100) * (productivityFactor / 100)).toFixed(2)
  );

  const rows = [];
  for (const interval in visualizationData.intervals) {
    rows.push({
      interval: visualizationData.intervals[interval].interval_name,
      percent_value: `${visualizationData.intervals[interval].percent_value * 100}%`,
      policy_protection: visualizationData.intervals[interval].policy_protection,
      premium_rate: visualizationData.intervals[interval].premium_rate,
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

  function Row({ rows, index }) {
    const row = rows[index];
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.interval}
          </TableCell>
          <TableCell>{row.percent_value}</TableCell>
          <TableCell>
            {row.policy_protection.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </TableCell>
          <TableCell>
            {row.premium_rate.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </TableCell>
          <TableCell>{row.actual_premium}</TableCell>
          <TableCell>{row.index}</TableCell>
          <TableCell sx={{ backgroundColor: row.indemnity_color }}>{row.indemnity}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Grid container direction="column" sx={{ margin: "1rem" }}>
                <Grid item>
                  <Typography variant="h6">Calculation:</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle">
                    <strong>Dollar Amount Protection</strong> = County Base Value * Coverage Level *
                    Productivity Factor = {countyBaseValue} * {coverageLevel / 100} *{" "}
                    {productivityFactor / 100} ={" "}
                    {dollarAmountProtection.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle">
                    <strong>Policy Protection Per Unit</strong> = Dollar amount Protection * Insured
                    Acres * Interval Distribution Share * Insurable Interest ={" "}
                    {dollarAmountProtection} * {acres} *{parseInt(row.percent_value) / 100} *
                    {interest / 100} ={" "}
                    {row.policy_protection.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle">
                    <strong>Premium</strong> = Dollar amount Protection * Premium Rate * Insured
                    Acres * Interval Distribution Share * Insurable Interest ={" "}
                    {dollarAmountProtection} * {row.premium_rate} * {acres} *{" "}
                    {parseInt(row.percent_value) / 100} * {interest / 100} ={" "}
                    {(
                      parseFloat(dollarAmountProtection) *
                      parseFloat(row.premium_rate) *
                      parseInt(acres) *
                      (parseInt(row.percent_value) / 100) *
                      (parseInt(interest) / 100)
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </Typography>
                  <Grid item>
                    <Typography variant="subtitle">
                      <strong> Producer Premium</strong> = Premium - (Premium * Subsidy Level) ={" "}
                      {Math.round(
                        parseFloat(dollarAmountProtection) *
                          parseFloat(row.premium_rate) *
                          parseInt(acres) *
                          (parseInt(row.percent_value) / 100) *
                          (parseInt(interest) / 100)
                      )}{" "}
                      - (
                      {Math.round(
                        parseFloat(dollarAmountProtection) *
                          parseFloat(row.premium_rate) *
                          parseInt(acres) *
                          (parseInt(row.percent_value) / 100) *
                          (parseInt(interest) / 100)
                      )}{" "}
                      * {subsidyValue / 100}) ={" "}
                      {Math.round(
                        parseFloat(dollarAmountProtection) *
                          parseFloat(row.premium_rate) *
                          parseInt(acres) *
                          (parseInt(row.percent_value) / 100) *
                          (parseInt(interest) / 100)
                      )}{" "}
                      -
                      {Math.round(
                        parseFloat(
                          parseFloat(dollarAmountProtection) *
                            parseFloat(row.premium_rate) *
                            parseInt(acres) *
                            (parseInt(row.percent_value) / 100) *
                            (parseInt(interest) / 100)
                        ) *
                          (subsidyValue / 100)
                      ).toFixed(2)}{" "}
                      ={" "}
                      {(
                        Math.round(
                          parseFloat(dollarAmountProtection) *
                            parseFloat(row.premium_rate) *
                            parseInt(acres) *
                            (parseInt(row.percent_value) / 100) *
                            (parseInt(interest) / 100)
                        ) -
                        Math.round(
                          parseFloat(
                            parseFloat(dollarAmountProtection) *
                              parseFloat(row.premium_rate) *
                              parseInt(acres) *
                              (parseInt(row.percent_value) / 100) *
                              (parseInt(interest) / 100)
                          ) *
                            (subsidyValue / 100)
                        ).toFixed(2)
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </Typography>
                  </Grid>
                  {row.index < coverageLevel / 100 ? (
                    <React.Fragment>
                      <Grid item>
                        <Typography variant="subtitle">
                          <strong>Payment Calculation Factor</strong> = (Coverage Level - Index) /
                          Coverage Level = ({coverageLevel / 100} - {row.index}) /{" "}
                          {coverageLevel / 100} ={" "}
                          {((coverageLevel / 100 - row.index) / (coverageLevel / 100)).toFixed(3)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle">
                          <strong>Indemnity</strong> = Payment Calculation Factor * Policy
                          Protection Per Unit = ({coverageLevel / 100} - {row.index} /{" "}
                          {coverageLevel / 100}) * {row.policy_protection} ={" "}
                          {((coverageLevel / 100 - row.index) / (coverageLevel / 100)).toFixed(3)} *{" "}
                          {row.policy_protection} ={" "}
                          {currencyFormatter(
                            ((coverageLevel / 100 - row.index) / (coverageLevel / 100)).toFixed(3) *
                              row.policy_protection
                          )}
                        </Typography>
                      </Grid>
                    </React.Fragment>
                  ) : (
                    <Grid item>
                      <Typography variant="subtitle">
                        {`No Indemnity as index is greater than coverage level (${row.index} > ${coverageLevel / 100})`}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    visualizationData && (
      <React.Fragment>
        <Download />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableHeader />
                <StyledTableHeader>Interval</StyledTableHeader>
                <StyledTableHeader padding="none">Percent of Value</StyledTableHeader>
                <StyledTableHeader padding="none">Policy Protection/Unit</StyledTableHeader>
                <StyledTableHeader padding="none">Premium Rate</StyledTableHeader>
                <StyledTableHeader padding="none">Producer Premium</StyledTableHeader>
                <StyledTableHeader padding="none">Index</StyledTableHeader>
                <StyledTableHeader padding="none">Estimated Indemnity</StyledTableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <Row key={row.interval} rows={rows} index={index} />
              ))}
              <TableRow>
                <TableCell>
                  <strong>Per Acre</strong>
                </TableCell>
                <TableCell>-</TableCell>
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
                <TableCell>
                  <strong>Total</strong>
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>{Math.round(visualizationData.sum_percent_value)}</TableCell>
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
