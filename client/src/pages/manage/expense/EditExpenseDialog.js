import React, { useState, memo, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import DialogContentText from "@mui/material/DialogContentText";
import { NumberTextField } from "../../../components";
import { useSelector, useDispatch } from "react-redux";
import { updateExpense } from "../../../redux/apiRequest";
import { INIT_ERRORS_VALUES, FIELD_MAPPING } from "./const";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { convertToVietnameseWords, formatAmount, handleConvertDateFormat } from "../helper";

const EditExpenseDialog = ({ selectedExpense, isEditDialogOpen, handleCloseEditDialog }) => {
  const INIT_EXPENSE_VALUES = useMemo(() => {
    return {
      registrationId: selectedExpense.registrationId,
      feeId: selectedExpense.feeId,
      amount: selectedExpense.amount,
      date: dayjs(handleConvertDateFormat(selectedExpense.date)),
    };
  }, [selectedExpense]);

  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.login?.currentUser);
  const allFee = useSelector(state => state.fee.allFee.map(fee => ({ id: fee.id, amount: fee.amount })));

  const [errors, setErrors] = useState(INIT_ERRORS_VALUES);
  const [isDisableAmount, setIsDisableAmount] = useState(true);
  const [errorDialogContent, setErrorDialogContent] = useState("");
  const [expenseValues, setExpenseValues] = useState(INIT_EXPENSE_VALUES);

  const handleCancelEdit = () => {
    handleCloseEditDialog();
    setErrors(INIT_ERRORS_VALUES);
    setExpenseValues(INIT_EXPENSE_VALUES);
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
      return;
    }

    // OK
    handleCloseEditDialog();
    updateExpense(user.token, dispatch, expenseValues);
  };

  const handleExpenseValueChange = field => value => {
    setExpenseValues(prevValue => ({ ...prevValue, [field]: value }));
  };

  useEffect(() => {
    setExpenseValues(INIT_EXPENSE_VALUES);
  }, [INIT_EXPENSE_VALUES]);

  useEffect(() => {
    const intValue = parseInt(expenseValues.feeId);
    const matchingFee = allFee.find(fee => fee.id === intValue && fee.amount);
    if (matchingFee) {
      handleExpenseValueChange(FIELD_MAPPING[2].id)(matchingFee.amount);
      setIsDisableAmount(true);
    } else {
      setIsDisableAmount(false);
    }
  }, [expenseValues.feeId]);

  return (
    <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} fullWidth>
      <DialogTitle>Thêm khoản nộp</DialogTitle>
      <DialogContent>
        <DialogContentText>{errorDialogContent}</DialogContentText>

        <Stack spacing={2} mt={1}>
          <Stack direction="row" spacing={1}>
            <NumberTextField
              disabled
              fullWidth
              error={errors[FIELD_MAPPING[0].id]}
              label={FIELD_MAPPING[0].label}
              value={expenseValues[FIELD_MAPPING[0].id]}
            />

            <NumberTextField
              disabled
              fullWidth
              error={errors[FIELD_MAPPING[1].id]}
              label={FIELD_MAPPING[1].label}
              value={expenseValues[FIELD_MAPPING[1].id]}
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <NumberTextField
              fullWidth
              error={errors[FIELD_MAPPING[2].id]}
              disabled={isDisableAmount}
              label={FIELD_MAPPING[2].label}
              value={formatAmount(expenseValues[FIELD_MAPPING[2].id])}
              onChange={handleExpenseValueChange(FIELD_MAPPING[2].id)}
              helperText={
                !expenseValues.feeId
                  ? "Vui lòng nhập Mã khoản phí trước"
                  : expenseValues[FIELD_MAPPING[2].id]
                  ? convertToVietnameseWords(expenseValues[FIELD_MAPPING[2].id])
                  : ""
              }
              InputProps={{
                startAdornment: <InputAdornment position="start">VND</InputAdornment>,
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={FIELD_MAPPING[3].label}
                value={expenseValues[FIELD_MAPPING[3].id]}
                onChange={value => {
                  handleExpenseValueChange(FIELD_MAPPING[3].id)(value.$d);
                }}
                maxDate={TODAY}
                minDate={START_OF_1900}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    error: !!errors.date,
                  },
                }}
              />
            </LocalizationProvider>
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

export default memo(EditExpenseDialog);

const TODAY = dayjs();
const START_OF_1900 = dayjs("1900-01-01T00:00:00.000");
