import React, { useState, memo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack } from "@mui/material";
import { NumberTextField, TextOnlyTextField } from "../../../components";

const AddResidentDialog = ({ isAddDialogOpen, handleCloseAddDialog }) => {
  const [name, setName] = useState("");
  const [year, setYear] = useState();
  const [idnum, setIdnum] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCancelAdd = () => {
    handleCloseAddDialog();
    setName("");
    setYear();
    setIdnum("");
    setPhoneNumber("");
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

  return (
    <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} fullWidth>
      <DialogTitle>Thêm nhân khẩu</DialogTitle>
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
        <Button variant="outlined" onClick={handleCancelAdd}>
          Hủy bỏ
        </Button>
        <Button variant="contained" onClick={handleCloseAddDialog}>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(AddResidentDialog);
