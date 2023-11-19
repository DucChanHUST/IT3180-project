import React, { useState, useEffect, memo } from "react";
import {
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { NumberTextField, TextOnlyTextField } from "../../../components";
import { RelationshipConstant } from "../../../const";

const EditResidentDialog = ({ isEditDialogOpen, handleCloseEditDialog, selectedResident }) => {
  const [name, setName] = useState("");
  const [year, setYear] = useState();
  const [idnum, setIdnum] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [registrationId, setRegistrationId] = useState();
  const [relationship, setRelationship] = useState("");

  const handleSetInitValue = () => {
    setName(selectedResident.name);
    setYear(selectedResident.year);
    setIdnum(selectedResident.idnum);
    setPhoneNumber(selectedResident.phoneNumber);
    setRegistrationId(selectedResident.registrationId);
    setRelationship(selectedResident.relationship);
  };

  const handleCancelEdit = () => {
    handleCloseEditDialog();
    handleSetInitValue();
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

  useEffect(() => {
    handleSetInitValue();
  }, [selectedResident]);

  return (
    <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} fullWidth>
      <DialogTitle>Chỉnh sửa nhân khẩu</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Stack direction="row" spacing={1}>
            <TextOnlyTextField label="Họ và tên" value={name} onChange={handleNameChange} fullWidth/>
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
