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
import { handleFilterRelationship } from "../helper";
import { RelationshipConstant } from "../../../const";
import { useSelector, useDispatch } from "react-redux";
import { addNewResident } from "../../../redux/apiRequest";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { INIT_ERRORS_VALUES, FIELD_MAPPING } from "./const";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { NumberTextField, TextOnlyTextField } from "../../../components";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const AddResidentDialog = ({ isAddDialogOpen, handleCloseAddDialog, flattenedResident }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.login?.currentUser);
  const allRegistrationId = useSelector(state => state.registration.allRegistration)?.map(
    registration => registration.id,
  );

  const [errors, setErrors] = useState(INIT_ERRORS_VALUES);
  const [errorDialogContent, setErrorDialogContent] = useState("");
  const [residentValues, setResidentValues] = useState(INIT_RESIDENT_VALUES);
  const [possibleRelationship, setPossibleRelationship] = useState(ALL_RESIDENT_ROLE);

  const handleCancelAdd = () => {
    handleCloseAddDialog();
    setErrorDialogContent("");
    setErrors(INIT_ERRORS_VALUES);
    setResidentValues(INIT_RESIDENT_VALUES);
  };

  const handleAdd = () => {
    let hasErrors = false;
    let errorContent = [];
    const newErrors = Object.keys(errors).reduce((acc, field) => {
      if (!residentValues[field]) {
        acc[field] = true;
        hasErrors = true;
        errorContent.push(FIELD_MAPPING[field]);
      } else {
        acc[field] = false;
      }
      return acc;
    }, {});
    setErrors(newErrors);

    if (hasErrors) {
      setErrorDialogContent(`Vui lòng nhập ${errorContent.join(", ")}`);
      return;
    }

    // Không được thêm `Nhân khẩu` có idNumber đã tồn tại
    const allResidentIdNumber = flattenedResident.map(item => item.idNumber);
    if (allResidentIdNumber.includes(residentValues.idNumber)) {
      setErrorDialogContent(`Số CCCD "${residentValues.idNumber}" đã tồn tại`);
      return;
    }

    // `Nhân khẩu` mới phải có `Mã hộ` đã tồn tại
    if (!allRegistrationId.includes(parseInt(residentValues.registrationId))) {
      setErrorDialogContent(`Mã hộ "${residentValues.registrationId}" chưa tồn tại`);
      return;
    }

    // `Chủ hộ` bắt buộc phải có `Số CCCD`
    if (residentValues.relationship === "Chủ hộ" && !residentValues.idNumber) {
      setErrorDialogContent(`Vui lòng nhập ${FIELD_MAPPING.idNumber} cho Chủ hộ`);
      return;
    }

    residentValues.idNumber = residentValues.idNumber || null;
    handleCloseAddDialog();
    setResidentValues(INIT_RESIDENT_VALUES);
    addNewResident(user.token, dispatch, residentValues);
  };

  const handleResidentValueChange = field => value => {
    setResidentValues(prevValue => ({ ...prevValue, [field]: value }));
  };

  return (
    <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} fullWidth>
      <DialogTitle>Thêm nhân khẩu</DialogTitle>
      <DialogContent>
        <DialogContentText>{errorDialogContent}</DialogContentText>
        <Stack spacing={2} mt={1.5}>
          <TextOnlyTextField
            label={FIELD_MAPPING.name}
            value={residentValues.name}
            onChange={handleResidentValueChange("name")}
            error={errors.name}
          />
          <Stack direction="row" spacing={1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={FIELD_MAPPING.dob}
                value={residentValues.dob}
                onChange={value => {
                  handleResidentValueChange("dob")(value.$d);
                  const filteredRelationship = handleFilterRelationship(
                    residentValues.registrationId,
                    residentValues.gender,
                    value,
                    flattenedResident,
                  );
                  setPossibleRelationship(filteredRelationship);
                  handleResidentValueChange("relationship")("");
                }}
                maxDate={TODAY}
                minDate={START_OF_1900}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    error: !!errors.dob,
                  },
                }}
              />
            </LocalizationProvider>
            <FormControl style={{ width: "60%" }}>
              <InputLabel>{FIELD_MAPPING.gender + " *"}</InputLabel>
              <Select
                label={FIELD_MAPPING.gender + " *"}
                value={residentValues.gender}
                onChange={event => {
                  const value = event.target.value;
                  handleResidentValueChange("gender")(value);
                  const filteredRelationship = handleFilterRelationship(
                    residentValues.registrationId,
                    value,
                    residentValues.dob,
                    flattenedResident,
                  );
                  setPossibleRelationship(filteredRelationship);
                  handleResidentValueChange("relationship")("");
                }}
                error={errors.gender}
                fullWidth
              >
                <MenuItem value={"Nam"}>Nam</MenuItem>
                <MenuItem value={"Nữ"}>Nữ</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <NumberTextField
            label={FIELD_MAPPING.idNumber}
            value={residentValues.idNumber}
            onChange={handleResidentValueChange("idNumber")}
            required={false}
          />
          <NumberTextField
            label={FIELD_MAPPING.phoneNumber}
            value={residentValues.phoneNumber}
            onChange={handleResidentValueChange("phoneNumber")}
            required={false}
          />
          <Stack direction="row" spacing={1}>
            <NumberTextField
              label={FIELD_MAPPING.registrationId}
              value={residentValues.registrationId}
              onChange={value => {
                handleResidentValueChange("registrationId")(value);
                const filteredRelationship = handleFilterRelationship(
                  value,
                  residentValues.gender,
                  residentValues.dob,
                  flattenedResident,
                );
                setPossibleRelationship(filteredRelationship);
                handleResidentValueChange("relationship")("");
              }}
              error={errors.registrationId}
            />
            <FormControl fullWidth>
              <InputLabel>{FIELD_MAPPING.relationship + " *"}</InputLabel>
              <Select
                label={FIELD_MAPPING.relationship + " *"}
                value={residentValues.relationship}
                onChange={event => {
                  const value = event.target.value;
                  handleResidentValueChange("relationship")(value);
                }}
                disabled={!residentValues.registrationId || !residentValues.gender || !residentValues.dob}
                error={errors.relationship}
              >
                {possibleRelationship.map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              {(!residentValues.registrationId || !residentValues.gender || !residentValues.dob) && (
                <FormHelperText>
                  Vui lòng nhập {FIELD_MAPPING.dob}, {FIELD_MAPPING.gender}, {FIELD_MAPPING.registrationId} trước
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

export default memo(AddResidentDialog);

const TODAY = dayjs();
const START_OF_1900 = dayjs("1900-01-01T00:00:00.000");

const INIT_RESIDENT_VALUES = {
  name: "",
  dob: TODAY,
  gender: "",
  idNumber: "",
  phoneNumber: "",
  registrationId: "",
  relationship: "",
};

const ALL_RESIDENT_ROLE = RelationshipConstant.RELATIONSHIP.map(item => item.role);
