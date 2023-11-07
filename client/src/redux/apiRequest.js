import axios from "axios";
import { loginFailed, loginStart, loginSuccess } from "./authSlice";
import { getUsersStart, getUsersSuccess, getUsersFailed, deleteUserFailed, deleteUserSuccess, deleteUserStart } from "./userSlice";

//Hàm đăng nhập -------------------------------------------------------------
export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("http://localhost:3001/api/login", user);
    dispatch(loginSuccess(res.data));
    navigate("/");
  } catch (error) {
    dispatch(loginFailed());
    console.error("Lỗi khi gửi yêu cầu đăng nhập:", error);
  }
};

// Hàm getuser ----------------------------------------------------------------

export const getAllUsers = async (accessToken, dispatch) => {
  if (!accessToken) {
    // Handle the case when 'token' is missing or null
    return;
  }

  dispatch(getUsersStart());
  try {
    const res = await axios.get("http://localhost:3001/api/users", {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    dispatch(getUsersFailed());
  }
};


//Hàm xóa nhân khẩu
export const deleteUser = async (accessToken, dispatch, id) => {
  dispatch(deleteUserStart());

  try {
    const res = await axios.delete(`http://localhost:3001/api/users/${id}`, {
      headers: { token: `Bearer ${accessToken}` },
    });

    dispatch(deleteUserSuccess(res.data)); // Assuming that the API responds with a success message
    dispatch(getAllUsers(accessToken, dispatch)); // You can also refresh the user list after a successful deletion
  } catch (err) {
    dispatch(deleteUserFailed());
  }
};

