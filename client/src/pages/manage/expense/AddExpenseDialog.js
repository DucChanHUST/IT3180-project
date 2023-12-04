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
import { addFee } from "../../../redux/apiRequest";
import { NumberTextField } from "../../../components";
import { useSelector, useDispatch } from "react-redux";
import { INIT_ERRORS_VALUES, FIELD_MAPPING } from "./const";
import { convertToVietnameseWords, formatAmount } from "../helper";

const AddExpenseDialog = ({ isAddDialogOpen, handleCloseAddDialog }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.login?.currentUser);

  const [errors, setErrors] = useState(INIT_ERRORS_VALUES);
  const [expenseValues, setExpenseValues] = useState(INIT_EXPENSE_VALUES);
  const [errorDialogContent, setErrorDialogContent] = useState("");

  const handleCancelEdit = () => {
    handleCloseAddDialog();
    setExpenseValues(INIT_EXPENSE_VALUES);
    setErrors(INIT_ERRORS_VALUES);
    setErrorDialogContent("");
  };

  const handleEdit = () => {
    let hasErrors = false;
    let errorContent = [];
    const newErrors = Object.keys(errors).reduce((acc, field) => {
      if (!expenseValues[field] && expenseValues[field] !== 0) {
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
      handleCloseAddDialog();
      addFee(user.token, dispatch, expenseValues);
      setExpenseValues(INIT_EXPENSE_VALUES);
    }
  };

  const handleFeeValueChange = field => value => {
    setExpenseValues(prevValue => ({ ...prevValue, [field]: value }));
  };

  return (
    <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} fullWidth>
      <DialogTitle>Thêm khoản nộp</DialogTitle>
      <DialogContent>
        <DialogContentText>{errorDialogContent}</DialogContentText>

        <Stack spacing={2} mt={1}>
          <TextField
            required
            error={errors.nameFee}
            value={expenseValues.nameFee}
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
                value={expenseValues.type}
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
              disabled={!expenseValues.type}
              label={FIELD_MAPPING[3].label}
              value={formatAmount(expenseValues.amount)}
              onChange={handleFeeValueChange("amount")}
              helperText={
                expenseValues.type === 0
                  ? `Phí Tự nguyện không được đặt ${FIELD_MAPPING[3].label}`
                  : !expenseValues.type
                  ? `Vui lòng nhập ${FIELD_MAPPING[2].label} trước`
                  : expenseValues.amount
                  ? convertToVietnameseWords(expenseValues.amount)
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
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(AddExpenseDialog);

const INIT_EXPENSE_VALUES = {
  nameFee: "",
  type: "",
  amount: "",
};
