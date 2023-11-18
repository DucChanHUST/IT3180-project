import React, { useState, useEffect, memo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { NumberTextField, TextOnlyTextField } from "../../../components";

const EditResidentDialog = ({ isEditDialogOpen, handleCloseEditDialog, selectedResident }) => {
  const [name, setName] = useState("");
  const [year, setYear] = useState();
  const [idnum, setIdnum] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSetInitValue = () => {
    setName(selectedResident.name);
    setYear(selectedResident.year);
    setIdnum(selectedResident.idnum);
    setPhoneNumber(selectedResident.phoneNumber);
  };

  const handleCancelEdit = () => {
    handleCloseEditDialog();
    handleSetInitValue();
  };

  const handelChangeName = value => {
    setName(value);
  };

  const handleChangeYear = value => {
    setYear(value);
  };

  const handleChangeIdnum = value => {
    setIdnum(value);
  };

  const handleChangePhoneNumber = value => {
    setPhoneNumber(value);
  };

  useEffect(() => {
    handleSetInitValue();
  }, [selectedResident]);

  return (
    <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} fullWidth>
      <DialogTitle>Chỉnh sửa nhân khẩu</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextOnlyTextField label="Họ và tên" value={name} onChange={handelChangeName} />
          <NumberTextField label="Tuổi" value={year} onChange={handleChangeYear} />
          <NumberTextField label="Số CCCD" value={idnum} onChange={handleChangeIdnum} />
          <NumberTextField
            label="Số điện thoại"
            value={phoneNumber}
            onChange={handleChangePhoneNumber}
            required={false}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCancelEdit}>
          Hủy bỏ
        </Button>
        <Button variant="contained" onClick={handleCloseEditDialog}>
          Thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(EditResidentDialog);
