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
import { addNewResident } from "../../../redux/apiRequest";
import { useSelector, useDispatch } from "react-redux";
import { INIT_ERRORS_VALUES, FIELD_MAPPING } from "./const";
import { handleFilterRelationship } from "./helper";

const AddResidentDialog = ({ isAddDialogOpen, handleCloseAddDialog, flattenedResident }) => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const dispatch = useDispatch();

  const [residentValues, setResidentValues] = useState(INIT_RESIDENT_VALUES);
  const [errors, setErrors] = useState(INIT_ERRORS_VALUES);
  const [errorDialogContent, setErrorDialogContent] = useState("");
  const [possibleRelationship, setPossibleRelationship] = useState(ALL_RESIDENT_ROLE);

  const handleCancelAdd = () => {
    handleCloseAddDialog();
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
    } else {
      handleCloseAddDialog();
      setResidentValues(INIT_RESIDENT_VALUES);
      residentValues.idNumber = residentValues.idNumber || null;
      addNewResident(user.token, dispatch, residentValues);
    }
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

export default memo(AddResidentDialog);