import React, { memo } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useSelector, useDispatch } from "react-redux";
import { deleteExpense } from "../../../redux/apiRequest";

const DeleteExpenseDialog = ({ selectedExpense, isDeleteDialogOpen, handleCloseDeleteDialog }) => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.login?.currentUser);

  const handleDeleteExpense = async () => {
    handleCloseDeleteDialog();

    await deleteExpense(user.token, dispatch, selectedExpense);
  };

  return (
    <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog} fullWidth>
      <DialogTitle>Xóa khoản nộp</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography>Bạn có chắc chắn rằng bạn muốn xóa khoản nộp này chứ</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCloseDeleteDialog}>
          Hủy bỏ
        </Button>
        <Button variant="contained" color="error" onClick={handleDeleteExpense}>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(DeleteExpenseDialog);
