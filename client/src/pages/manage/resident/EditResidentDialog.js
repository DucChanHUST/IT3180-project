import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const EditResidentDialog = ({ isEditDialogOpen, handleCloseEditDialog, selectedResident }) => {
  const [name, setName] = useState("");
  const [year, setYear] = useState();
  const [idnum, setIdnum] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    setName(selectedResident.name);
    setYear(selectedResident.year);
    setIdnum(selectedResident.idnum);
    setPhoneNumber(selectedResident.phoneNumber);
  }, [selectedResident]);

  return (
    <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} fullWidth>
      <DialogTitle>Chỉnh sửa</DialogTitle>
      <DialogContent>
        <DialogContentText>Chỉnh sửa thông tin nhân khẩu</DialogContentText>
        <TextField
          onChange={e => setName(e.target.value)}
          value={name}
          autoFocus
          margin="dense"
          label="Họ và tên"
          type="name"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCloseEditDialog}>Hủy bỏ</Button>
        <Button onClick={handleCloseEditDialog}>Thay đổi</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditResidentDialog;
