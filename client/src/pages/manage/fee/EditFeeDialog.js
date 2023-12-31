import React, { useState, useMemo, memo, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import DialogContentText from "@mui/material/DialogContentText";
import { updateFee } from "../../../redux/apiRequest";
import { NumberTextField } from "../../../components";
import { useSelector, useDispatch } from "react-redux";
import { INIT_ERRORS_VALUES, FIELD_MAPPING } from "./const";
import { convertToVietnameseWords, formatAmount } from "../helper";

const EditFeeDialog = ({ selectedFee, isEditDialogOpen, handleCloseEditDialog }) => {
  const INIT_FEE_VALUES = useMemo(() => {
    return {
      nameFee: selectedFee.nameFee,
      type: selectedFee.type === "Bắt buộc" ? 1 : 0,
      amount: selectedFee.amount,
    };
  }, [selectedFee]);

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.login?.currentUser);

  const [errors, setErrors] = useState(INIT_ERRORS_VALUES);
  const [feeValues, setFeeValues] = useState(INIT_FEE_VALUES);
  const [errorDialogContent, setErrorDialogContent] = useState("");

  const handleCancelEdit = () => {
    handleCloseEditDialog();
    setFeeValues(INIT_FEE_VALUES);
    setErrors(INIT_ERRORS_VALUES);
    setErrorDialogContent("");
  };

  const handleEdit = () => {
    let hasErrors = false;
    let errorContent = [];
    const newErrors = Object.keys(errors).reduce((acc, field) => {
      if (!feeValues[field] && feeValues[field] !== 0) {
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
    } else {
      handleCloseEditDialog();
      updateFee(user.token, dispatch, feeValues, selectedFee.id);
    }
  };

  const handleFeeValueChange = field => value => {
    setFeeValues(prevValue => ({ ...prevValue, [field]: value }));
  };

  useEffect(() => {
    setFeeValues(INIT_FEE_VALUES);
  }, [INIT_FEE_VALUES]);

  return (
    <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} fullWidth>
      <DialogTitle>Chỉnh sửa khoản phí</DialogTitle>
      <DialogContent>
        <DialogContentText>{errorDialogContent}</DialogContentText>

        <Stack spacing={2} mt={1}>
          <TextField
            required
            error={errors.nameFee}
            value={feeValues.nameFee}
            label={FIELD_MAPPING[1].label}
            onChange={event => {
              const value = event.target.value;
              handleFeeValueChange("nameFee")(value);
            }}
          />

          <Stack direction="row" spacing={2}>
            <FormControl style={{ width: "40%" }}>
              <InputLabel>{`${FIELD_MAPPING[2].label} *`}</InputLabel>
              <Select
                error={errors.type}
                value={feeValues.type}
                label={`${FIELD_MAPPING[2].label} *`}
                onChange={event => {
                  const value = event.target.value;
                  handleFeeValueChange("type")(value);
                  if (!value) {
                    handleFeeValueChange("amount")(0);
                  } else {
                    handleFeeValueChange("amount")("");
                  }
                }}
                fullWidth
              >
                <MenuItem value={0}>Tự nguyện</MenuItem>
                <MenuItem value={1}>Bắt buộc</MenuItem>
              </Select>
            </FormControl>

            <NumberTextField
              fullWidth
              error={errors.amount}
              disabled={!feeValues.type}
              label={FIELD_MAPPING[3].label}
              value={formatAmount(feeValues.amount)}
              onChange={handleFeeValueChange("amount")}
              helperText={
                feeValues.type === 0
                  ? `Phí Tự nguyện không được đặt ${FIELD_MAPPING[3].label}`
                  : !feeValues.type
                  ? `Vui lòng nhập ${FIELD_MAPPING[2].label} trước`
                  : feeValues.amount
                  ? convertToVietnameseWords(feeValues.amount)
                  : ""
              }
              InputProps={{
                startAdornment: <InputAdornment position="start">VND</InputAdornment>,
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

export default memo(EditFeeDialog);
