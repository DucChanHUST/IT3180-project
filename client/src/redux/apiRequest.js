import axios from "axios";
import { loginFailed, loginStart, loginSuccess } from "./authSlice";
import {
  getUsersStart,
  getUsersSuccess,
  getUsersFailed,
  deleteUserFailed,
  deleteUserSuccess,
  deleteUserStart,
} from "./userSlice";
import {
  getRegistrationsStart,
  getRegistrationsSuccess,
  getRegistrationsFailed,
  deleteRegistrationFailed,
  deleteRegistrationStart,
  deleteRegistrationSuccess,
  addRegistrationsStart,
  addRegistrationsSuccess,
  addRegistrationsFailed,
  updateRegistrationsStart,
  updateRegistrationsSuccess,
  updateRegistrationsFailed,
} from "./registrationSlice";
import { getResidentStart, getResidentSuccess, getResidentFailed } from "./residentSlice";

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
    alert("Lỗi khi đăng nhập");
  }
};

// Ham logout ------------------------------------------------------------------

// export const logOut = async (dispatch, navigate, token, axiosJWT) => {
//   dispatch(loginStart())

//   try
//   {
//     await axiosJWT.post("")
//   }
// }
// Hàm getuser ----------------------------------------------------------------

export const getAllUsers = async (accessToken, dispatch) => {
  if (!accessToken) {
    // Handle the case when 'token' is missing or null
    return;
  }

  dispatch(getUsersStart());
  try {
    const res = await axios.get("http://localhost:3001/api/users", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    dispatch(getUsersFailed());
  }
};

//Hàm xóa user
export const deleteUser = async (accessToken, dispatch, id) => {
  dispatch(deleteUserStart());

  try {
    const res = await axios.delete(`http://localhost:3001/api/users/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    dispatch(deleteUserSuccess(res.data)); // Assuming that the API responds with a success message
    dispatch(getAllUsers(accessToken, dispatch)); // You can also refresh the user list after a successful deletion
  } catch (err) {
    dispatch(deleteUserFailed());
  }
};

// Hàm getAllRegistrations
export const getAllRegistrations = async (accessToken, dispatch) => {
  if (!accessToken) {
    // Handle the case when 'token' is missing or null
    return;
  }

  dispatch(getRegistrationsStart());
  try {
    const res = await axios.get("http://localhost:3001/api/registration", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(getRegistrationsSuccess(res.data));
  } catch (err) {
    dispatch(getRegistrationsFailed());
  }
};

//Hàm deleteRegistration
export const deleteRegistration = async (accessToken, dispatch, id) => {
  dispatch(deleteRegistrationStart());

  try {
    await axios.delete(`http://localhost:3001/api/registration/delete/${id}`, {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    dispatch(deleteRegistrationSuccess(id)); // Send the ID of the deleted registration
  } catch (err) {
    dispatch(deleteRegistrationFailed());
    alert("Deleting failed");
    console.log(err);
  }
};

//Hàm getRegistrationID
export const getRegistrationID = async (accessToken, dispatch, id) => {
  if (!accessToken) {
    // Handle the case when 'token' is missing or null
    return;
  }

  dispatch(getRegistrationsStart());
  try {
    const res = await axios.get(`http://localhost:3001/api/registration/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(getRegistrationsSuccess(res.data));
  } catch (err) {
    dispatch(getRegistrationsFailed());
  }
};

//Hàm addNewRegistration

export const addNewRegistration = async (accessToken, dispatch, data) => {
  dispatch(addRegistrationsStart());

  try {
    const res = await axios.post(`http://localhost:3001/api/registration/add`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.data.success) {
      // Registration created successfully
      dispatch(addRegistrationsSuccess(res.data));
    } else {
      // Handle specific error cases
      if (res.data.message === "Duplicate Identity Card Number")
      {
        console.log("híudaugasgdasf");
        // Handle the case where identity card number already exists
        dispatch(addRegistrationsFailed("This Identity Card Number already exists."));
      } else if (res.data.message === "Duplicate Address") {
        // Handle the case where the address already exists
        dispatch(addRegistrationsFailed("This Address already exists."));
      } else {
        // Handle other error cases
        dispatch(addRegistrationsFailed("An error occurred while creating the registration."));
      }
    }
  } catch (err) {
    // Handle other errors like network issues
    dispatch(addRegistrationsFailed("An error occurred while creating the registration."));
  }
};

//Hàm updateRegistration
export const updateRegistration = async (accessToken, dispatch, data, id) => {
  dispatch(updateRegistrationsStart());

  try {
    const res = await axios.put(`http://localhost:3001/api/registration/update/${id}`, data, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (res.data.success) {
      dispatch(updateRegistrationsSuccess(res.data));
    }
  } catch (err) {
    dispatch(updateRegistrationsFailed("An error occurred while updating the registration."));
  }
};

//Get all resident-----------------------------------------------------------------------------------
export const getAllResident = async (accessToken, dispatch) => {
  if (!accessToken) return;

  dispatch(getResidentStart());
  try {
    const res = await axios.get("http://localhost:3001/api/resident", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(getResidentSuccess(res.data));
  } catch (err) {
    dispatch(getResidentFailed());
  }
};
