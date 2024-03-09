/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  Button,
  Popper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import CalculateIcon from "@mui/icons-material/Calculate";

function MarkerDetail() {
  const [intendedUse, setIntendedUse] = useState("grazing");
  const [irrigationPractice, setIrrigationPractice] = useState("irrigated");
  const [organicPractice, setOrganicPractice] = useState("non-organic");
  const [coverageLevel, setCoverageLevel] = useState(90);
  const [productivityFactor, setProductivityFactor] = useState(100);
  const [acres, setAcres] = useState(100);
  const [year, setYear] = useState(dayjs().year(new Date().getFullYear() - 1));
  const [interest, setInterest] = useState(100);
  const [monthlyValues, setMonthlyValues] = useState(Array(11).fill(""));
  const monthRanges = [
    "Jan-Feb",
    "Feb-Mar",
    "Mar-Apr",
    "Apr-May",
    "May-Jun",
    "Jun-Jul",
    "Jul-Aug",
    "Aug-Sep",
    "Sep-Oct",
    "Oct-Nov",
    "Nov-Dec",
  ];

  const handleMonthlyValueChange = (index, event) => {
    const value = event.target.value;

    // if (/^\d+$/.test(value) && parseInt(value, 10) <= 100) {
    const newValues = [...monthlyValues];
    newValues[index] = value;
    setMonthlyValues(newValues);
    // }
  };

  const handleIntendedUseChange = (event) => {
    setIntendedUse(event.target.value);
  };

  const handleIrrigationPracticeChange = (event) => {
    setIrrigationPractice(event.target.value);
  };

  const handleOrganicPracticeChange = (event) => {
    setOrganicPractice(event.target.value);
  };

  const handleCoverageLevelChange = (newValue) => {
    setCoverageLevel(newValue);
  };

  const handleProductivityFactorChange = (newValue) => {
    setProductivityFactor(newValue);
  };

  const handleAcresChange = (event) => {
    setAcres(event.target.value);
  };

  const handleYearChange = (event) => {
    console.log("🚀 ~ handleYearChange ~ event:", event);
    if (event && event.$y) {
      setYear(dayjs().year(event.$y));
    } else {
      setYear(event);
    }
  };

  const handleInterestChange = (event) => {
    setInterest(event.target.value);
  };

  function getPercentText(value) {
    return `${value}%`;
  }

  function checkIfIntervalDistributionIsDisabled(index) {
    if (index === 0) {
      return monthlyValues[index + 1] && monthlyValues[index + 1] != 0;
    }

    if (index === 10) {
      return monthlyValues[index - 1] && monthlyValues[index - 1] != 0;
    }

    return (
      (monthlyValues[index + 1] && monthlyValues[index + 1] != 0) ||
      (monthlyValues[index - 1] && monthlyValues[index - 1] != 0)
    );
  }

  function shouldDisableCalculateButton() {
    return !(
      parseInt(acres) &&
      parseInt(interest) &&
      monthlyValues.reduce(
        (sum, value) => sum + (Number.isNaN(parseInt(value)) ? 0 : parseInt(value)),
        0
      ) === 100
    );
  }

  return (
    <Box p={2} sx={{ marginTop: "15px" }}>
      <Grid container spacing={2}>
        <Grid item container direction="column" spacing={2} xs={12} md={6}>
          <Grid container item spacing={2}>
            <Grid item>
              <FormControl sx={{ width: "150px" }}>
                <InputLabel>Intended Use</InputLabel>
                <Select value={intendedUse} label="Intended Use" onChange={handleIntendedUseChange}>
                  <MenuItem value="grazing">Grazing</MenuItem>
                  <MenuItem value="haying">Haying</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {intendedUse === "haying" && (
              <Grid item>
                <FormControl sx={{ width: "150px" }}>
                  <InputLabel>Irrigation Practice</InputLabel>
                  <Select
                    value={irrigationPractice}
                    label="Irrigation Practice"
                    onChange={handleIrrigationPracticeChange}
                  >
                    <MenuItem value="irrigated">Irrigated</MenuItem>
                    <MenuItem value="non-irrigated">Non-Irrigated</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {intendedUse === "haying" && irrigationPractice === "non-irrigated" && (
              <Grid item>
                <FormControl sx={{ width: "150px" }}>
                  <InputLabel>Organic Practice</InputLabel>
                  <Select
                    value={organicPractice}
                    label="Organic Practice"
                    onChange={handleOrganicPracticeChange}
                  >
                    <MenuItem value="non-organic">Not Organic</MenuItem>
                    <MenuItem value="certified">Certified</MenuItem>
                    <MenuItem value="transitional">Transitional</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>

          <Typography gutterBottom sx={{ margin: "10px" }}>
            Coverage Level
          </Typography>
          <Slider
            sx={{ width: "50vh", marginLeft: "25px" }}
            aria-label="Always visible"
            getAriaValueText={getPercentText}
            value={coverageLevel}
            step={5}
            onChange={(event, newValue) => handleCoverageLevelChange(newValue)}
            min={70}
            max={90}
            marks={[
              {
                value: 70,
                label: "70%",
              },
              {
                value: 75,
                label: "75%",
              },
              {
                value: 80,
                label: "80%",
              },
              {
                value: 85,
                label: "85%",
              },
              {
                value: 90,
                label: "90%",
              },
            ]}
          />

          <Typography gutterBottom sx={{ margin: "10px" }}>
            Productivity Factor: {productivityFactor}%
          </Typography>
          <Slider
            sx={{ width: "50vh", marginLeft: "10px" }}
            getAriaValueText={getPercentText}
            value={productivityFactor}
            onChange={(event, newValue) => handleProductivityFactorChange(newValue)}
            step={1}
            min={60}
            max={150}
          />
          <Grid container spacing={2} sx={{ marginTop: "10px", marginLeft: "0px" }}>
            <TextField
              label="Acres"
              value={acres}
              onChange={handleAcresChange}
              margin="normal"
              InputProps={{
                inputProps: {
                  min: 0,
                  max: 200000,
                  onKeyDown: (event) => {
                    if (event.key === "-") {
                      event.preventDefault();
                    }
                  },
                },
              }}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              style={{ width: "150px", margin: "10px" }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={"Year"}
                views={["year"]}
                minDate={dayjs().year("2007")}
                maxDate={dayjs().subtract(1, "year")}
                value={year}
                onChange={handleYearChange}
                slots={{
                  textField: (params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      style={{ width: "150px" }}
                      InputProps={{ ...params.InputProps, readOnly: true }}
                    />
                  ),
                  popper: ({ style, ...popperProps }) => (
                    <Popper {...popperProps} style={{ ...style, position: "fixed" }} />
                  ),
                }}
                sx={{ margin: "10px", width: "150px" }}
              />
            </LocalizationProvider>

            <TextField
              label="Insurable Interest"
              value={interest}
              onChange={handleInterestChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                inputProps: {
                  min: 0,
                  max: 100,
                  onKeyDown: (event) => {
                    if (event.key === "-") {
                      event.preventDefault();
                    }
                  },
                },
              }}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              style={{ width: "150px", margin: "10px" }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography gutterBottom sx={{ marginBottom: "15px" }}>
            Interval Distribution (max per interval 60%)
          </Typography>
          <Grid container spacing={2}>
            {monthRanges.map((label, index) => (
              <Grid item key={label}>
                <TextField
                  label={label}
                  value={monthlyValues[index]}
                  disabled={checkIfIntervalDistributionIsDisabled(index)}
                  style={{ width: "150px" }}
                  onChange={(e) => handleMonthlyValueChange(index, e)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    inputProps: {
                      min: 0,
                      max: 100,
                      onKeyDown: (event) => {
                        if (event.key === "-") {
                          event.preventDefault();
                        }
                      },
                    },
                  }}
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CalculateIcon />}
          disabled={shouldDisableCalculateButton()}
        >
          Calculate
        </Button>
      </Box>
    </Box>
  );
}

export default MarkerDetail;
