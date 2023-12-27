import React, { useState, useEffect, memo, useMemo } from "react";
import dayjs from "dayjs";
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
import { RelationshipConstant } from "../../../const";
import { useSelector, useDispatch } from "react-redux";
import { updateResident } from "../../../redux/apiRequest";
import { INIT_ERRORS_VALUES, FIELD_MAPPING } from "./const";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { NumberTextField, TextOnlyTextField } from "../../../components";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { handleFilterRelationship, handleConvertDateFormat } from "../helper";

const EditResidentDialog = ({ isEditDialogOpen, handleCloseEditDialog, flattenedResident, selectedResident }) => {
  const INIT_RESIDENT_VALUES = useMemo(() => {
    return {
      name: selectedResident.name,
      dob: dayjs(handleConvertDateFormat(selectedResident.dob)),
      gender: selectedResident.gender,
      idNumber: selectedResident.idNumber,
      phoneNumber: selectedResident.phoneNumber,
      registrationId: selectedResident.registrationId,
      relationship: selectedResident.relationship,
    };
  }, [selectedResident]);

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.login?.currentUser);
  const allRegistrationId = useSelector(state => state.registration.allRegistration)?.map(
    registration => registration.id,
  );

  const [residentValues, setResidentValues] = useState(INIT_RESIDENT_VALUES);
  const [errors, setErrors] = useState(INIT_ERRORS_VALUES);
  const [errorDialogContent, setErrorDialogContent] = useState("");
  const [possibleRelationship, setPossibleRelationship] = useState(ALL_RESIDENT_ROLE);

  const handleCancelEdit = () => {
    handleCloseEditDialog();
    setErrorDialogContent("");
    setErrors(INIT_ERRORS_VALUES);
    setResidentValues(INIT_RESIDENT_VALUES);
  };

  const handleEdit = () => {
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

    if (!isValidIdNumber(residentValues.idNumber)) {
      setErrorDialogContent(`Số CCCD "${residentValues.idNumber}" không hợp lệ`);
      return;
    }

    if (!isValidPhoneNumber(residentValues.phoneNumber)) {
      setErrorDialogContent(`Số điện thoại "${residentValues.phoneNumber}" không hợp lệ`);
      return;
    }

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

    handleCancelEdit();
    setResidentValues(INIT_RESIDENT_VALUES);
    residentValues.idNumber = residentValues.idNumber || null;
    updateResident(user.token, dispatch, residentValues, selectedResident.id);
  };

  const handleResidentValueChange = field => value => {
    setResidentValues(prevValue => ({ ...prevValue, [field]: value }));
  };

  useEffect(() => {
    setResidentValues(INIT_RESIDENT_VALUES);
  }, [INIT_RESIDENT_VALUES]);

  useEffect(() => {
    const filteredRelationship = handleFilterRelationship(
      INIT_RESIDENT_VALUES.registrationId,
      INIT_RESIDENT_VALUES.gender,
      INIT_RESIDENT_VALUES.dob,
      flattenedResident,
      INIT_RESIDENT_VALUES.relationship,
    );
    setPossibleRelationship(filteredRelationship);
  }, [INIT_RESIDENT_VALUES, flattenedResident]);

  return (
    <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} fullWidth>
      <DialogTitle>Chỉnh sửa nhân khẩu</DialogTitle>
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
                    INIT_RESIDENT_VALUES.relationship,
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
              <InputLabel>{FIELD_MAPPING.gender + "*"}</InputLabel>
              <Select
                label={FIELD_MAPPING.gender + "*"}
                value={residentValues.gender}
                onChange={event => {
                  const value = event.target.value;
                  handleResidentValueChange("gender")(value);
                  const filteredRelationship = handleFilterRelationship(
                    residentValues.registrationId,
                    value,
                    residentValues.dob,
                    flattenedResident,
                    INIT_RESIDENT_VALUES.relationship,
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
            required={false}
            error={errors.idNumber}
            label={FIELD_MAPPING.idNumber}
            value={residentValues.idNumber}
            onChange={handleResidentValueChange("idNumber")}
            helperText={!isValidIdNumber(residentValues.idNumber) ? "Phải nhập đúng 12 chữ số" : ""}
          />
          <NumberTextField
            required={false}
            error={errors.phoneNumber}
            label={FIELD_MAPPING.phoneNumber}
            value={residentValues.phoneNumber}
            onChange={handleResidentValueChange("phoneNumber")}
            helperText={!isValidPhoneNumber(residentValues.phoneNumber) ? "Phải nhập đúng 10 chữ số" : ""}
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
                  INIT_RESIDENT_VALUES.relationship,
                );
                setPossibleRelationship(filteredRelationship);
                handleResidentValueChange("relationship")("");
              }}
              error={errors.registrationId}
            />
            <FormControl fullWidth>
              <InputLabel>{FIELD_MAPPING.relationship + "*"}</InputLabel>
              <Select
                label={FIELD_MAPPING.relationship + "*"}
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
              {!residentValues.registrationId && (
                <FormHelperText>
                  Vui lòng nhập {FIELD_MAPPING.dob}, {FIELD_MAPPING.gender}, {FIELD_MAPPING.registrationId} trước
                </FormHelperText>
              )}
            </FormControl>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCancelEdit}>
          Hủy bỏ
        </Button>
        <Button variant="contained" onClick={handleEdit}>
          Chỉnh sửa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TODAY = dayjs();
const START_OF_1900 = dayjs("1900-01-01T00:00:00.000");

const ALL_RESIDENT_ROLE = RelationshipConstant.RELATIONSHIP.map(item => item.role);

export default memo(EditResidentDialog);

const isValidIdNumber = value => {
  return !value || value.length === 12;
};

const isValidPhoneNumber = value => {
  return !value || value.length === 10;
};
