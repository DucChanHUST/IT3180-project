import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack, Typography } from "@mui/material";

const DeleteResidentDialog = ({ isDeleteDialogOpen, handleCloseDeleteDialog, selectedResident }) => {
  console.log(selectedResident);
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
        <Button variant="contained" color="error" onClick={handleCloseDeleteDialog}>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteResidentDialog;
