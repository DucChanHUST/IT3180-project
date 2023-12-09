import React, { useEffect, useState } from "react";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import { useNavigate } from "react-router-dom";
import { SideBar, NavBar } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, getUserID, checkPassword } from "../../redux/apiRequest";
import {
  Box,
  Grid,
  Stack,
  Paper,
  Button,
  Dialog,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { handleFormatDate } from "../manage/helper";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.login?.currentUser);
  const selectCurrentUser = useSelector(state => state.user.users.allUsers);

  const [qrData, setQrData] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isCheckedPassword, setIsCheckedPassword] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newPassword2HelperText, setNewPassword2HelperText] = useState("");
  const [currentPasswordHelperText, setCurrentPasswordHelperText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.token) {
          getUserID(user.token, dispatch, user.userId); // Pass all required parameter
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch, user, navigate]);

  useEffect(() => {}, [isCheckedPassword]);

  useEffect(() => {
    const userData = `${selectCurrentUser.resident.name} | ${selectCurrentUser.resident.idNumber} | ${
      selectCurrentUser.resident.id
    } | ${handleFormatDate(selectCurrentUser.resident.dob)} | ${selectCurrentUser.resident.gender} | ${
      selectCurrentUser.resident.registration.address
    }`;
    setQrData(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${userData}`);
  }, [selectCurrentUser]);

  // Function to handle opening the password change dialog
  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
  };

  // Function to handle closing the password change dialog
  const handleCancelUpdatePassword = () => {
    setNewPassword1("");
    setNewPassword2("");
    setCurrentPassword("");
    setOpenPasswordDialog(false);
    setNewPassword2HelperText("");
    setCurrentPasswordHelperText("");
    setIsCheckedPassword(false);
  };

  const handleUpdatePassword = async () => {
    if (newPassword1 !== newPassword2)
      setNewPassword2HelperText("Mật khẩu mới không khớp. Hãy nhập lại mật khẩu mới tại đây.");
    else
      try {
        const data = {
          password: currentPassword,
          newPassword: newPassword1,
        };
        await changePassword(user.token, dispatch, data, user.userId);
        handleCancelUpdatePassword();
        alert("Đổi mật khẩu thành công");
      } catch (error) {
        console.error("Đổi mật khẩu thất bại", error);
        // Handle the error here or provide feedback to the user
        // For instance, show an alert/message to the user
        alert("Đổi mật khẩu thất bại, hãy thử lại!");
      }
  };

  const handleCheckPassword = async () => {
    try {
      const result = await checkPassword(user.token, user.userId, currentPassword);
      if (result.data) {
        setIsCheckedPassword(true);
      } else {
        setCurrentPasswordHelperText("Mật khẩu hiện tại không chính xác");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <>
      <NavBar />
      <Box height={64} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Grid container direction="column" sx={{ margin: 3, gap: 2 }}>
          <Stack alignItems="center">
            <Typography variant="h4" fontWeight="bold" style={{ textDecoration: "underline" }}>
              Thông tin cá nhân
            </Typography>
          </Stack>

          <Stack spacing={2} mb="55px">
            <Stack spacing={4} direction="row" alignItems="center">
              <Stack spacing={2} width="75%">
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2">Họ và tên:</Typography>
                  <Typography variant="h5">{selectCurrentUser.resident.name}</Typography>
                </Paper>

                <Stack direction="row" spacing={4}>
                  <Paper sx={{ p: 2, width: "50%" }}>
                    <Typography variant="subtitle2">Số CCCD:</Typography>
                    <Typography variant="h5">{selectCurrentUser.resident.idNumber}</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, width: "50%" }}>
                    <Typography variant="subtitle2">Mã nhân khẩu:</Typography>
                    <Typography variant="h5">{selectCurrentUser.resident.id}</Typography>
                  </Paper>
                </Stack>

                <Stack direction="row" spacing={4}>
                  <Paper sx={{ p: 2, width: "50%" }}>
                    <Typography variant="subtitle2">Ngày sinh:</Typography>
                    <Typography variant="h5">{handleFormatDate(selectCurrentUser.resident.dob)}</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, width: "50%" }}>
                    <Typography variant="subtitle2">Giới tính:</Typography>
                    <Typography variant="h5">{selectCurrentUser.resident.gender}</Typography>
                  </Paper>
                </Stack>
              </Stack>

              <Stack width="25%">
                <Paper sx={{ p: 4 }}>
                  <img alt="QR Code" src={qrData} style={{ width: "100%", objectFit: "cover" }} />
                </Paper>
              </Stack>
            </Stack>

            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2">Nơi thường trú:</Typography>
              <Typography variant="h5">{selectCurrentUser.resident.registration.address}</Typography>
            </Paper>
          </Stack>

          <Stack sx={{ width: "fit-content" }}>
            <Button variant="contained" onClick={handleOpenPasswordDialog}>
              Đổi mật khẩu
            </Button>
          </Stack>

          <Dialog open={openPasswordDialog} onClose={handleCancelUpdatePassword}>
            <DialogTitle>Đổi mật khẩu</DialogTitle>

            <DialogContent sx={{ width: "500px" }}>
              <Stack spacing={2} mt={1}>
                {!isCheckedPassword && (
                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      type="password"
                      value={currentPassword}
                      label="Mật khẩu hiện tại"
                      error={currentPasswordHelperText}
                      helperText={currentPasswordHelperText}
                      onChange={e => setCurrentPassword(e.target.value)}
                    />
                    <IconButton size="large" color="primary" disabled={!currentPassword} onClick={handleCheckPassword}>
                      <VerifiedUserRoundedIcon />
                    </IconButton>
                  </Stack>
                )}

                {isCheckedPassword && (
                  <>
                    <TextField
                      fullWidth
                      type="password"
                      value={newPassword1}
                      label="Mật khẩu mới"
                      onChange={e => setNewPassword1(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      type="password"
                      value={newPassword2}
                      label="Nhập lại mật khẩu mới"
                      error={newPassword2HelperText}
                      helperText={newPassword2HelperText}
                      onChange={e => setNewPassword2(e.target.value)}
                    />
                  </>
                )}
              </Stack>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCancelUpdatePassword}>Hủy</Button>
              <Button
                variant="contained"
                onClick={handleUpdatePassword}
                disabled={!isCheckedPassword || !newPassword1 || !newPassword2}
              >
                Đổi mật khẩu
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Box>
    </>
  );
};

export default Profile;
