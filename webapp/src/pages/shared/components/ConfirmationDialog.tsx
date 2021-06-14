import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider} from "@material-ui/core";
import React from "react";

interface Props {
  children: React.ReactNode
  title?: string
  open: boolean
  onClose: () => void
  actions: React.ReactNode
}

export default function ConfirmationDialog(props: Props) {
  const {
    children,
    title,
    open,
    onClose,
    actions,
  } = props

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogContent>
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContentText>
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {actions}
      </DialogActions>
    </Dialog>
  )
}