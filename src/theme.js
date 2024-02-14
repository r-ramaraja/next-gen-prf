import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#861F41",
    },
    secondary: {
      main: "#E87722",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
