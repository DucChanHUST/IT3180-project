import React, { useState, memo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { NumberTextField, TextOnlyTextField } from "../../../components";
import { RelationshipConstant } from "../../../const";

const AddResidentDialog = ({ isAddDialogOpen, handleCloseAddDialog }) => {
  const [residentValues, setResidentValues] = useState(initialResidentValues);
  const [errors, setErrors] = useState({
    name: false,
    year: false,
    gender: false,
    idnum: false,
    registrationId: false,
    relationship: false,
  });
  const [errorDialogContent, setErrorDialogContent] = useState("");

  const handleCancelAdd = () => {
    handleCloseAddDialog();
    setResidentValues(initialResidentValues);
  };

  const handleAdd = () => {
    let hasErrors = false;
    let errorContent = [];
    const newErrors = Object.keys(errors).reduce((acc, field) => {
      if (!residentValues[field]) {
        acc[field] = true;
        hasErrors = true;
        errorContent.push(mapping[field]);
      } else {
        acc[field] = false;
      }
      return acc;
    }, {});
    setErrors(newErrors);
    
    if (hasErrors) {
      setErrorDialogContent(`Vui lòng nhập ${errorContent.join(", ")}`);
    } else {
      handleCloseAddDialog();
      setResidentValues(initialResidentValues);
      console.log("added", residentValues);
    }
    console.log(newErrors);
  };

  const handleResidentValueChange = field => value => {
    setResidentValues(prevValue => ({ ...prevValue, [field]: value }));
  };

  const handleGenderChange = event => {
    const value = event.target.value;
    setResidentValues(prevValue => ({ ...prevValue, gender: value }));
  };

  const handleRelationshipChange = event => {
    const value = event.target.value;
    setResidentValues(prevValues => ({ ...prevValues, relationship: value }));
  };

  return (
    <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} fullWidth>
      <DialogTitle>Thêm nhân khẩu</DialogTitle>
      <DialogContent>
        <DialogContentText>{errorDialogContent}</DialogContentText>
        <Stack spacing={2} mt={1.5}>
          <TextOnlyTextField
            label={mapping.name}
            value={residentValues.name}
            onChange={handleResidentValueChange("name")}
            error={errors.name}
          />
          <Stack direction="row" spacing={1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={mapping.year}
                value={residentValues.year}
                onChange={handleResidentValueChange("year")}
                maxDate={today}
                minDate={startOf1900}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    error: !!errors.year,
                  },
                }}
              />
            </LocalizationProvider>
            <FormControl style={{ width: "60%" }}>
              <InputLabel>Giới tính *</InputLabel>
              <Select
                label={mapping.gender + "*"}
                value={residentValues.gender}
                onChange={handleGenderChange}
                error={errors.gender}
                fullWidth
              >
                <MenuItem value={"Nam"}>Nam</MenuItem>
                <MenuItem value={"Nữ"}>Nữ</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <NumberTextField
            label={mapping.idnum}
            value={residentValues.idnum}
            onChange={handleResidentValueChange("idnum")}
            error={errors.idnum}
          />
          <NumberTextField
            label={mapping.phoneNumber}
            value={residentValues.phoneNumber}
            onChange={handleResidentValueChange("phoneNumber")}
            required={false}
          />
          <Stack direction="row" spacing={1}>
            <NumberTextField
              label={mapping.registrationId}
              value={residentValues.registrationId}
              onChange={handleResidentValueChange("registrationId")}
              error={errors.registrationId}
            />
            <FormControl fullWidth>
              <InputLabel>Quan hệ với chủ hộ *</InputLabel>
              <Select
                label={mapping.relationship + "*"}
                value={residentValues.relationship}
                onChange={handleRelationshipChange}
                disabled={!residentValues.registrationId}
                error={errors.relationship}
              >
                {RelationshipConstant.RELATIONSHIP.map(item => (
                  <MenuItem key={item.role} value={item.role}>
                    {item.role}
                  </MenuItem>
                ))}
              </Select>
              {!residentValues.registrationId && (
                <FormHelperText>
                  Vui lòng nhập {mapping.year}, {mapping.gender}, {mapping.registrationId} trước
                </FormHelperText>
              )}
            </FormControl>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCancelAdd}>
          Hủy bỏ
        </Button>
        <Button variant="contained" onClick={handleAdd}>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const today = dayjs();
const startOf1900 = dayjs("1900-01-01T00:00:00.000");

const initialResidentValues = {
  name: "",
  year: today,
  gender: "",
  idnum: "",
  phoneNumber: "",
  registrationId: "",
  relationship: "",
};

const mapping = {
  name: "Họ và tên",
  year: "Ngày sinh",
  gender: "Giới tính",
  idnum: "Số CCCD",
  phoneNumber: "Số điện thoại",
  registrationId: "Mã hộ",
  relationship: "Quan hệ với chủ hộ",
};

export default memo(AddResidentDialog);
