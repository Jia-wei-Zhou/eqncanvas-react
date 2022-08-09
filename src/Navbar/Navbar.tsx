import React from "react";
import { AppBar, Toolbar, Button, IconButton } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import DeleteIcon from "@mui/icons-material/Delete";
import CutIcon from "@mui/icons-material/ContentCut";

export interface NavbarProps {
  onUndoClick: () => void;
  onRedoClick: () => void;
  onDeleteClick: () => void;
  onCutClick: () => void;
  isDrawing: boolean;
}

export const Navbar = (props: NavbarProps) => {
  const { onUndoClick, onRedoClick, onDeleteClick, onCutClick, isDrawing } =
    props;

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <IconButton aria-label="undo" onClick={onUndoClick}>
          <UndoIcon />
        </IconButton>
        <IconButton aria-label="redo" onClick={onRedoClick}>
          <RedoIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={onDeleteClick}>
          <DeleteIcon />
        </IconButton>
        <IconButton
          aria-label="cut"
          onClick={onCutClick}
          style={{
            backgroundColor: isDrawing ? "" : "salmon",
            color: isDrawing ? "" : "white",
          }}
        >
          <CutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
