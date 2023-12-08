import React, { memo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Stack, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { deleteResident, updateResident } from "../../../redux/apiRequest";

const DeleteResidentDialog = ({ isDeleteDialogOpen, handleCloseDeleteDialog, selectedResident }) => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.login?.currentUser);
  const allResident = useSelector(state => state.resident.allResident);

  const handleDeleteResident = async () => {
    handleCloseDeleteDialog();

    await deleteResident(user.token, dispatch, selectedResident);

    if (selectedResident.relationship === "Chủ hộ") {
      const residentsToUpdate = allResident.filter(
        item => item.registration.id === selectedResident.registrationId && item.id !== selectedResident.id,
      );

      residentsToUpdate.forEach(item => {
        updateResident(user.token, dispatch, { relationship: "" }, item.id);
      });
    }
  };

  return (
    <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog} fullWidth>
      <DialogTitle>Xóa nhân khẩu</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography>Bạn có chắc chắn rằng bạn muốn xóa nhân khẩu này chứ</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCloseDeleteDialog}>
          Hủy bỏ
        </Button>
        <Button variant="contained" color="error" onClick={handleDeleteResident}>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(DeleteResidentDialog);
