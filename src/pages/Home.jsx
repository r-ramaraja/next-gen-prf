import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import HelpIcon from "@mui/icons-material/Help";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      style={{
        backgroundImage: "url(/background.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Box
        sx={{
          padding: "2rem",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          textAlign: "center",
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Typography variant="body1" align="left" sx={{ marginTop: "1rem", color: "#FFF" }}>
              <p>
                Pasture, rangeland, and forage areas constitute over half of the total land area in
                the United States.
                <br />
                Since the USDA PRF-RI (Pasture, Rangeland, Forage Area - Rainfall Index) insurance
                program started in 2007, it has been a significant source of financial relief for
                agricultural producers against low rainfall conditions.
                <br />
                Our Next-Gen PRF Tool is a robust, user-centric platform designed to streamline
                decision-making when enrolling for the USDA PRF-RI insurance program.
              </p>
              <p>
                <strong>Effortless Navigation, Instant Insights:</strong>
                <br />
                Navigate the complexities of insurance with an easy-to-use tool. With just a few
                clicks, the intuitive interface provides access to detailed visualizations of
                pasture, rangeland, and forage areas.
              </p>
              <p>
                <strong>Data-Driven Decisions Made Simple:</strong>
                <br />
                Harness the power of advanced analytics without being a data scientist. The tool
                brings together various datasets, such as past rainfall indexes and enrollment
                trends, to provide precise insights. These insights help you understand historical
                trends with clear, concise, and relevant data that will help you be better informed
                when choosing enrollment parameters.
              </p>
              <p>
                <strong>Customized to Your Needs:</strong>
                <br />
                Every farm is unique, and so are your insurance needs. The tool offers customizable
                insurance scenarios that let you adjust the parameters and explore different risk
                management strategies. Experiment with{'"what-if"'} simulations to see how various
                coverage options could impact your indemnity, ensuring you make an informed choice
                tailored specifically to your operations.
              </p>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HelpIcon />}
                onClick={() => {
                  navigate("/guide");
                }}
              >
                User Guide
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RocketLaunchIcon />}
                sx={{ marginLeft: "1rem" }}
                onClick={() => {
                  navigate("/tool");
                }}
              >
                Launch Tool
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
