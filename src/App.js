import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tool from "./pages/Tool";
import Home from "./pages/Home";
import Tutorial from "./pages/Tutorial";
import Box from "@mui/material/Box";
import "./App.css";

function App() {
  return (
    <Box sx={{ margin: 0 }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tool" element={<Tool />} />
          <Route path="/guide" element={<Tutorial />} />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
