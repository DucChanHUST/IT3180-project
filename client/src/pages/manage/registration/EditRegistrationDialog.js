import React, { useState, memo, useMemo, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useDispatch, useSelector } from "react-redux";
import { FIELD_MAPPING, INIT_ERRORS_VALUES } from "./const";
import { updateRegistration } from "../../../redux/apiRequest";

const EditRegistrationDialog = ({ selectedRegistration, isEditDialogOpen, handleCloseEditDialog }) => {
  const INIT_REGISTRATION_VALUES = useMemo(() => {
    return {
      address: selectedRegistration.address,
    };
  }, [selectedRegistration]);

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.login?.currentUser);

  const [errors, setErrors] = useState(INIT_ERRORS_VALUES);
  const [errorDialogContent, setErrorDialogContent] = useState("");
  const [registrationValues, setRegistrationValues] = useState(INIT_REGISTRATION_VALUES);

  const handleCancelEdit = () => {
    handleCloseEditDialog();
    setErrorDialogContent("");
    setErrors(INIT_ERRORS_VALUES);
    setRegistrationValues(INIT_REGISTRATION_VALUES);
  };

  const handleEdit = () => {
    let hasErrors = false;
    let errorContent = [];
    const newErrors = Object.keys(errors).reduce((acc, field) => {
      if (!registrationValues[field]) {
        acc[field] = true;
        hasErrors = true;
        const fieldMappingItem = FIELD_MAPPING.find(item => item.id === field);
        errorContent.push(fieldMappingItem.label);
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

    handleCloseEditDialog();
    updateRegistration(user.token, dispatch, registrationValues, selectedRegistration.registrationId);
    setRegistrationValues(INIT_REGISTRATION_VALUES);
  };

  const handleRegistrationValueChange = field => value => {
    setRegistrationValues(prevValue => ({ ...prevValue, [field]: value }));
  };

  useEffect(() => {
    setRegistrationValues(INIT_REGISTRATION_VALUES);
  }, [INIT_REGISTRATION_VALUES]);

  return (
    <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} fullWidth>
      <DialogTitle>Chỉnh sửa hộ khẩu</DialogTitle>
      <DialogContent>
        <DialogContentText>{errorDialogContent}</DialogContentText>

        <Stack spacing={2} mt={1}>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              error={errors[FIELD_MAPPING[1].id]}
              label={FIELD_MAPPING[1].label}
              value={registrationValues[FIELD_MAPPING[1].id]}
              onChange={event => {
                const value = event.target.value;
                handleRegistrationValueChange(FIELD_MAPPING[1].id)(value);
              }}
            />
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

export default memo(EditRegistrationDialog);
