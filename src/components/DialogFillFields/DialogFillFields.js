import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

export default function ForgotPswdDialog({
  open,
  onClose,
  onClickOk,
  message
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      maxWidth={"xs"}
    >
      <DialogContent>
        <DialogContentText style={{ textAlign: "center" }}>
          <strong>
            {message}
          </strong>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}