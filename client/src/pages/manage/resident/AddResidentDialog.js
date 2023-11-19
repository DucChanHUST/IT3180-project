import React, { useState, memo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { NumberTextField, TextOnlyTextField } from "../../../components";
import { RelationshipConstant } from "../../../const";

const AddResidentDialog = ({ isAddDialogOpen, handleCloseAddDialog }) => {
  const [name, setName] = useState("");
  const [year, setYear] = useState();
  const [idnum, setIdnum] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [registrationId, setRegistrationId] = useState();
  const [relationship, setRelationship] = useState("");

  const handleCancelAdd = () => {
    handleCloseAddDialog();
    setName("");
    setYear();
    setIdnum("");
    setPhoneNumber("");
    setRegistrationId();
    setRelationship("");
  };

  const handleNameChange = value => {
    setName(value);
  };

  const handleYearChange = value => {
    setYear(value);
  };

  const handleIdnumChange = value => {
    setIdnum(value);
  };

  const handlePhoneNumberChange = value => {
    setPhoneNumber(value);
  };

  const handleRegistrtionIdChange = value => {
    setRegistrationId(value);
  };

  const handleRelationshipChange = event => {
    setRelationship(event.target.value);
  };

  return (
    <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} fullWidth>
      <DialogTitle>Thêm nhân khẩu</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Stack direction="row" spacing={1}>
            <TextOnlyTextField label="Họ và tên" value={name} onChange={handleNameChange} fullWidth />
            <NumberTextField label="Tuổi" value={year} onChange={handleYearChange} />
          </Stack>
          <NumberTextField label="Số CCCD" value={idnum} onChange={handleIdnumChange} />
          <NumberTextField
            label="Số điện thoại"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            required={false}
          />
          <Stack direction="row" spacing={1}>
            <NumberTextField label="Mã hộ" value={registrationId} onChange={handleRegistrtionIdChange} />
            <FormControl fullWidth>
              <Select value={relationship} onChange={handleRelationshipChange} disabled={!registrationId}>
                {RelationshipConstant.RELATIONSHIP.map(item => (
                  <MenuItem key={item.role} value={item.role}>
                    {item.role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
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
