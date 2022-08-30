import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Close } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface FullScreenDialogProps {
  open: boolean;
  onClose: () => void;
  children: JSX.Element | JSX.Element[];
}

export const FullScreenDialog = (props: FullScreenDialogProps) => {
  const { open, onClose } = props;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Handwriting Input Canvas
          </Typography>
          <Button autoFocus color="inherit" onClick={onClose}>
            Submit
          </Button>
        </Toolbar>
      </AppBar>
      {props.children}
    </Dialog>
  );
};
