import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function GuidedDecisionSupportIntro({ handleChecked }) {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h6">How to use the Decision Support Guide mode?</Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <DialogContent>
            <DialogContentText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
              elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Lorem ipsum dolor
              sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo
              vel. Risus at ultrices mi tempus imperdiet.
            </DialogContentText>
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox onChange={handleChecked} />}
              label="Don't show this again"
            />
          </FormGroup>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
