import React, { memo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack, Typography } from "@mui/material";
import { deleteResident, updateResident } from "../../../redux/apiRequest";
import { useSelector, useDispatch } from "react-redux";

const DeleteResidentDialog = ({ isDeleteDialogOpen, handleCloseDeleteDialog, selectedResident }) => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.login?.currentUser);
  const allResident = useSelector(state => state.resident.allResident);

  const handleDeleteResident = async () => {
    handleCloseDeleteDialog();

    await deleteResident(user.token, dispatch, selectedResident.id);

    if (selectedResident.relationship === "Chủ hộ") {
      const residentsToUpdate = allResident.filter(item => item.registration.id === selectedResident.registrationId);

      residentsToUpdate.forEach(item => {
        if (item.user) {
          updateResident(user.token, dispatch, { relationship: "" }, item.id);
        }
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
