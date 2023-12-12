import React, { memo } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useSelector, useDispatch } from "react-redux";
import { deleteFee } from "../../../redux/apiRequest";

const DeleteFeeDialog = ({ selectedFee, isDeleteDialogOpen, handleCloseDeleteDialog }) => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.login?.currentUser);

  const handleDeleteFee = async () => {
    handleCloseDeleteDialog();

    await deleteFee(user.token, dispatch, selectedFee.id);

  };

  return (
    <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog} fullWidth>
      <DialogTitle>Xóa khoản phí</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography>Xóa khoản phí sẽ xóa luôn tất cả các khoản thu thuộc khoản phí này</Typography>
          <Typography>Bạn có chắc chắn rằng bạn muốn xóa khoản phí này chứ</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCloseDeleteDialog}>
          Hủy bỏ
        </Button>
        <Button variant="contained" color="error" onClick={handleDeleteFee}>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(DeleteFeeDialog);