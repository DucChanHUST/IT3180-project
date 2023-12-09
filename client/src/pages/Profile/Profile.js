import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SideBar, NavBar } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, getUserID } from "../../redux/apiRequest";
import { Box, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import "./profile.css";
const Profile = () => {
  const User = useSelector(state => state.auth.login?.currentUser);
  const selectCurrentUser = useSelector(state => state.user.users.allUsers);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  const [oldPassword, setOldPassword] = useState();
  const [newPassword1, setNewPassword1] = useState();
  const [newPassword2, setNewPassword2] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (User?.token) {
          getUserID(User.token, dispatch, User.userId); // Pass all required parameter
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch, User, navigate]);

  // Function to handle opening the password change dialog
  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
  };

  // Function to handle closing the password change dialog
  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };

  const handleCancelUpdatePassword = () => {
    handleClosePasswordDialog();
    setOldPassword("");
    setNewPassword1("");
    setNewPassword2("");
  };

  const handleUpdatePassword = async () => {
    const data = {
      password: oldPassword,
      newPassword: newPassword1,
    };

    if (newPassword1 !== newPassword2) alert("Mật khẩu lúc xác nhận lại không giống mật khẩu trên");
    else
      try {
        await changePassword(User.token, dispatch, data, User.userId);
        setOpenPasswordDialog(false);
      } catch (error) {
        console.error("Đổi mật khẩu thất bại", error);
        // Handle the error here or provide feedback to the user
        // For instance, show an alert/message to the user
        alert("Đổi mật khẩu thất bại, hãy thử lại!");
      }
  };

  return (
    <>
      <NavBar />
      <Box height={64} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {selectCurrentUser ? (
            <div className="container">
              <div className="my-5">
                <h3>My Profile</h3>
              </div>
              <form className="file-upload">
                {/* Contact detail */}
                <div className="row mb-5 gx-5">
                  {/* First Name */}
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      disabled={true}
                      value={selectCurrentUser.resident ? selectCurrentUser.resident.name : ""}
                    />
                  </div>
                  {/* Last name */}
                  <div className="col-md-6">
                    <label className="form-label">Ngày tháng năm sinh *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      disabled={true}
                      value={
                        selectCurrentUser.resident && selectCurrentUser.resident.dob
                          ? new Date(selectCurrentUser.resident.dob).toISOString().split("T")[0]
                          : ""
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Số CCCD/CMND *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="idNumber"
                      disabled={true}
                      value={selectCurrentUser.resident ? selectCurrentUser.resident.idNumber : ""}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Số điện thoại *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phoneNumber"
                      disabled={true}
                      value={selectCurrentUser.resident ? selectCurrentUser.resident.phoneNumber : ""}
                    />
                  </div>
                </div>

                <div className="gap-3 d-md-flex justify-content-md-end text-center">
                  <button type="button" className="btn btn-danger btn-lg" onClick={handleOpenPasswordDialog}>
                    Đổi mật khẩu
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="gap-3 d-md-flex justify-content-md-end text-center">
              <button type="button" className="btn btn-danger btn-lg" onClick={handleOpenPasswordDialog}>
                Đổi mật khẩu
              </button>
            </div>
          )}

          <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogContent sx={{ width: "500px" }}>
              <Stack spacing={2} mt={1}>
                <TextField
                  label="Mật khẩu hiện tại"
                  type="password"
                  fullWidth
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                />
                <TextField
                  label="Mật khẩu mới"
                  type="password"
                  fullWidth
                  value={newPassword1}
                  onChange={e => setNewPassword1(e.target.value)}
                />
                <TextField
                  label="Nhập lại mật khẩu mới"
                  fullWidth
                  type="password"
                  value={newPassword2}
                  onChange={e => setNewPassword2(e.target.value)}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelUpdatePassword}>Hủy</Button>
              <Button variant="contained" onClick={handleUpdatePassword}>
                Đổi mật khẩu
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
