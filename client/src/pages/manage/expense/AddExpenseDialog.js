import React, { useState, memo } from "react";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import DialogContentText from "@mui/material/DialogContentText";
import { addExpense } from "../../../redux/apiRequest";
import { NumberTextField } from "../../../components";
import { useSelector, useDispatch } from "react-redux";
import { INIT_ERRORS_VALUES, FIELD_MAPPING } from "./const";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { convertToVietnameseWords, formatAmount } from "../helper";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const AddExpenseDialog = ({ isAddDialogOpen, handleCloseAddDialog }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.login?.currentUser);
  const allFee = useSelector(state => state.fee.allFee)?.map(fee => ({ id: fee.id, amount: fee.amount }));
  const allRegistrationId = useSelector(state => state.registration?.allRegistration)?.map(
    registration => registration.id,
  );
  const allExpense = useSelector(state => state.expense.allExpense);

  const [errors, setErrors] = useState(INIT_ERRORS_VALUES);
  const [isDisableAmount, setIsDisableAmount] = useState(true);
  const [errorDialogContent, setErrorDialogContent] = useState("");
  const [expenseValues, setExpenseValues] = useState(INIT_EXPENSE_VALUES);

  const handleCancelAdd = () => {
    handleCloseAddDialog();
    setErrorDialogContent("");
    setErrors(INIT_ERRORS_VALUES);
    setExpenseValues(INIT_EXPENSE_VALUES);
  };

  const handleAdd = async () => {
    const registrationIdToCheck = parseInt(expenseValues.registrationId);
    const feeIdToCheck = parseInt(expenseValues.feeId);

    const isRegistrationIdValid = allRegistrationId.includes(registrationIdToCheck);
    const isFeeIdValid = allFee.some(fee => fee.id === feeIdToCheck);
    const isExpenseExists = allExpense.some(
      expense => expense.registrationId === registrationIdToCheck && expense.feeId === feeIdToCheck,
    );

    if (!isRegistrationIdValid) {
      setErrorDialogContent("Mã hộ không tồn tại");
      return;
    } else if (!isFeeIdValid) {
      setErrorDialogContent("Mã khoản phí không tồn tại");
      return;
    } else if (isExpenseExists) {
      setErrorDialogContent("Khoản nộp đã tồn tại");
      return;
    }

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

    await addExpense(user.token, dispatch, expenseValues);

    // OK
    handleCloseAddDialog();
    setExpenseValues(INIT_EXPENSE_VALUES);
  };

  const handleExpenseValueChange = field => value => {
    setExpenseValues(prevValue => ({ ...prevValue, [field]: value }));
  };

  return (
    <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} fullWidth>
      <DialogTitle>Thêm khoản nộp</DialogTitle>
      <DialogContent>
        <DialogContentText>{errorDialogContent}</DialogContentText>

        <Stack spacing={2} mt={1}>
          <Stack direction="row" spacing={1}>
            <NumberTextField
              fullWidth
              error={errors[FIELD_MAPPING[0].id]}
              label={FIELD_MAPPING[0].label}
              value={expenseValues[FIELD_MAPPING[0].id]}
              onChange={handleExpenseValueChange(FIELD_MAPPING[0].id)}
            />

            <NumberTextField
              fullWidth
              error={errors[FIELD_MAPPING[1].id]}
              label={FIELD_MAPPING[1].label}
              value={expenseValues[FIELD_MAPPING[1].id]}
              onChange={value => {
                const intValue = parseInt(value);
                const matchingFee = allFee.find(fee => fee.id === intValue && fee.amount);
                if (matchingFee) {
                  handleExpenseValueChange(FIELD_MAPPING[2].id)(matchingFee.amount);
                  setIsDisableAmount(true);
                } else {
                  handleExpenseValueChange(FIELD_MAPPING[2].id)("");
                  setIsDisableAmount(false);
                }
                handleExpenseValueChange(FIELD_MAPPING[1].id)(value);
              }}
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

export default memo(AddExpenseDialog);

const TODAY = dayjs();
const START_OF_1900 = dayjs("1900-01-01T00:00:00.000");

const INIT_EXPENSE_VALUES = {
  registrationId: "",
  feeId: "",
  amount: "",
  date: TODAY,
};
