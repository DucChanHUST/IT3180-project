import axios from "axios";
import { loginFailed, loginStart, loginSuccess } from "./authSlice";
import {
  getUsersStart,
  getUsersSuccess,
  getUsersFailed,
  deleteUserFailed,
  deleteUserSuccess,
  deleteUserStart,
  addUserStart,
  addUserSuccess,
  addUserFailed,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailed,
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
import {
  getResidentStart,
  getResidentSuccess,
  getResidentFailed,
  addResidentStart,
  addResidentSuccess,
  addResidentFailed,
  deleteResidentStart,
  deleteResidentSuccess,
  deleteResidentFailed,
  updateResidentStart,
  updateResidentSuccess,
  updateResidentFailed,
} from "./residentSlice";
import { getAllFeeSuccess, feeFailed } from "./feeSlice";
import { getAllExpenseSuccess, expenseFailed } from "./expenseSlice";
import { PathConstant } from "../const";

//Hàm đăng nhập -------------------------------------------------------------
export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("http://localhost:3001/api/login", user);
    dispatch(loginSuccess(res.data));
    navigate(PathConstant.HOMEPAGE);
  } catch (error) {
    dispatch(loginFailed());
    console.error("Lỗi khi gửi yêu cầu đăng nhập:", error);
    alert("Lỗi khi đăng nhập");
  }
};

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

//Ham getUserID------------------------------------------------------------------------------------------------
export const getUserID = async (accessToken, dispatch, id) => {
  if (!accessToken) {
    console.log("accessToken");
    return;
  }

  dispatch(getUsersStart());
  try {
    const res = await axios.get(`http://localhost:3001/api/users/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(res.data);
    // const array = [res.data.resident.registration];
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    dispatch(getUsersFailed());
    console.log(err);
  }
};

//Hàm xóa user-------------------------------------------------------------------------------------------------------------
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

//Hàm đổi password-----------------------------------------------------------------------------------------
export const changePassword = async (accessToken, dispatch, data, id) => {
  dispatch(changePasswordStart());

  try {
    const res = await axios.put(`http://localhost:3001/api/users/${id}`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.data.success) {
      alert("Đổi mật khẩu thành công");
      dispatch(changePasswordSuccess(res.data));
    }
  } catch (err) {
    alert("Có lỗi xảy ra, hãy thử nhập lại");
    dispatch(changePasswordFailed("An error occurred while changing password"));
  }
};

// Check Password
export const checkPassword = async (accessToken, userId, inputPassword) => {
  try {
    const checkPasswordResponse = await axios.post(
      `http://localhost:3001/api/users/isCorrectPassword/${userId}`,
      { password: inputPassword },
      {
        headers: { Authorization: `bearer ${accessToken}` },
      },
    );

    return checkPasswordResponse;
  } catch (error) {
    console.log(error);
  }
};

// Hàm getAllRegistrations------------------------------------------------------------------------------------------
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

//Hàm deleteRegistration--------------------------------------------------
export const deleteRegistration = async (accessToken, dispatch, id) => {
  dispatch(deleteRegistrationStart());

  try {
    // Delete all resident in registration
    const registrationResponse = await axios.get(`http://localhost:3001/api/registration/${id}`, {
      headers: { Authorization: `bearer ${accessToken}` },
    });
    const residents = await registrationResponse.data.residents;

    residents.forEach(async resident => {
      const residentResponse = await axios.get(`http://localhost:3001/api/resident/${resident.id}`, {
        headers: { Authorization: `bearer ${accessToken}` },
      });

      const selectedResident = residentResponse.data;
      await deleteResident(accessToken, dispatch, selectedResident);
    });

    await axios.delete(`http://localhost:3001/api/registration/delete/${id}`, {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    getAllRegistrations(accessToken, dispatch);
    dispatch(deleteRegistrationSuccess(id));
  } catch (err) {
    dispatch(deleteRegistrationFailed());
    console.log(err);
  }
};

//Hàm getRegistrationID----------------------------------------------------------------------

export const getRegistrationID = async (accessToken, dispatch, id) => {
  if (!accessToken) {
    console.log("accessToken");
    return;
  }

  dispatch(getRegistrationsStart());
  try {
    const res = await axios.get(`http://localhost:3001/api/users/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    dispatch(getRegistrationsSuccess([res.data.resident.registration]));
  } catch (err) {
    dispatch(getRegistrationsFailed());
    console.log(err);
  }
};

//Hàm addNewRegistration

export const addNewRegistration = async (accessToken, dispatch, data) => {
  dispatch(addRegistrationsStart());

  try {
    const res = await axios.post(`http://localhost:3001/api/registration/add`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    dispatch(addRegistrationsSuccess(res.data));
    getAllRegistrations(accessToken, dispatch);
  } catch (err) {
    dispatch(addRegistrationsFailed("An error occurred while creating the registration."));
  }
};

//Hàm updateRegistration
export const updateRegistration = async (accessToken, dispatch, data, id) => {
  dispatch(updateRegistrationsStart());
  try {
    const res = await axios.put(`http://localhost:3001/api/registration/update/${id}`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    dispatch(updateRegistrationsSuccess(res.data));
    getAllRegistrations(accessToken, dispatch);
  } catch (err) {
    dispatch(updateRegistrationsFailed("An error occurred while updating the registration."));
  }
};

// Resident function-----------------------------------------------------------------------------------
// getAllResident
export const getAllResident = async (accessToken, dispatch) => {
  dispatch(getResidentStart());
  try {
    const response = await axios.get("http://localhost:3001/api/resident", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(getResidentSuccess(response.data));
  } catch (error) {
    dispatch(getResidentFailed(error));
  }
};

export const getRegistrationResident = async (accessToken, dispatch, userId) => {
  dispatch(getResidentStart());
  try {
    const response = await axios.get(`http://localhost:3001/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(getResidentSuccess(response.data.resident.registration.residents));
  } catch (error) {
    dispatch(getResidentFailed(error));
  }
};

// addNewResident
export const addNewResident = async (accessToken, dispatch, residentValues) => {
  dispatch(addResidentStart());
  try {
    const residentResponse = await axios.post(`http://localhost:3001/api/resident/add`, residentValues, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(addResidentSuccess(residentResponse.data));

    if (residentValues.idNumber) {
      const userData = {
        username: residentValues.idNumber,
        password: residentValues.idNumber,
        role: "resident",
        residentId: residentResponse.data.id,
      };

      dispatch(addUserStart());
      try {
        const userResponse = await axios.post(`http://localhost:3001/api/users`, userData, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        dispatch(addUserSuccess(userResponse.data));
      } catch (error) {
        dispatch(addUserFailed());
      }
    }

    getAllResident(accessToken, dispatch);
  } catch (error) {
    dispatch(addResidentFailed(error.response.data));
    return;
  }
};

// deleteResident
export const deleteResident = async (accessToken, dispatch, selectedResident) => {
  dispatch(deleteResidentStart());
  try {
    const residentResponse = await axios.delete(`http://localhost:3001/api/resident/delete/${selectedResident.id}`, {
      headers: { Authorization: `bearer ${accessToken}` },
    });
    dispatch(deleteResidentSuccess(residentResponse.data));
    getAllResident(accessToken, dispatch);
  } catch (error) {
    dispatch(deleteResidentFailed());
  }
};

// updateResident
export const updateResident = async (accessToken, dispatch, data, id) => {
  dispatch(updateResidentStart());

  try {
    const response = await axios.put(`http://localhost:3001/api/resident/update/${id}`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(updateResidentSuccess(response.data));
    getAllResident(accessToken, dispatch);
  } catch (error) {
    dispatch(updateResidentFailed(error.response.data.error.errors[0]));
  }
};

// Fee
export const getAllFee = async (accessToken, dispatch) => {
  try {
    let feeResponse = await axios.get("http://localhost:3001/api/fee", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    await Promise.all(
      feeResponse.data?.map(async (item, index) => {
        const expenseResponse = await axios.get(`http://localhost:3001/api/expense/fee/${item.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        feeResponse.data[index].paid = expenseResponse.data.length;
        feeResponse.data[index].total = expenseResponse.data.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.amount;
        }, 0);
      }),
    );

    dispatch(getAllFeeSuccess(feeResponse.data));
  } catch (error) {
    dispatch(feeFailed(error));
  }
};

export const getRegistrationFee = async (accessToken, dispatch, registrationId) => {
  try {
    let feeResponse = await axios.get("http://localhost:3001/api/fee", {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    let registrationExpense = await axios.get(`http://localhost:3001/api/expense/registration/${registrationId}`, {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    const feeData = feeResponse.data;
    const registrationExpenseData = registrationExpense.data;

    feeData.map((fee, index) => {
      registrationExpenseData.forEach(expense => {
        feeResponse.data[index].status = fee.id === expense.feeId ? "Đã nộp" : "Chưa nộp";
      });
    });

    console.log("registrationExpense", registrationExpense);
    console.log("feeResponse> ", feeResponse);
    dispatch(getAllFeeSuccess(feeResponse.data));
  } catch (error) {
    dispatch(feeFailed(error));
  }
};

export const addFee = async (accessToken, dispatch, feeData) => {
  try {
    await axios.post("http://localhost:3001/api/fee", feeData, {
      headers: { Authorization: `bearer ${accessToken}` },
    });
    getAllFee(accessToken, dispatch);
  } catch (error) {
    dispatch(feeFailed(error));
  }
};

export const deleteFee = async (accessToken, dispatch, feeId) => {
  try {
    await axios.delete(`http://localhost:3001/api/fee/${feeId}`, {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    const expenseResponse = await axios.get(`http://localhost:3001/api/expense/fee/${feeId}`, {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    expenseResponse.data.forEach(async expense => {
      await axios.delete(`http://localhost:3001/api/expense/`, {
        data: {
          registrationId: expense.registrationId,
          feeId: expense.feeId,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    });

    getAllFee(accessToken, dispatch);
  } catch (error) {
    dispatch(feeFailed(error));
  }
};

export const updateFee = async (accessToken, dispatch, feeData, feeId) => {
  try {
    await axios.put(`http://localhost:3001/api/fee/${feeId}`, feeData, {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    getAllFee(accessToken, dispatch);
  } catch (error) {
    dispatch(feeFailed(error));
  }
};

// Expense
export const getAllExpense = async (accessToken, dispatch) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/expense`, {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    dispatch(getAllExpenseSuccess(response.data));
  } catch (error) {
    dispatch(expenseFailed(error));
  }
};

export const getRegistrationExpense = async (accessToken, dispatch, registrationId) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/expense/registration/${registrationId}`, {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    dispatch(getAllExpenseSuccess(response.data));
  } catch (error) {
    dispatch(expenseFailed(error));
  }
};

export const addExpense = async (accessToken, dispatch, expenseData) => {
  try {
    await axios.post(`http://localhost:3001/api/expense`, expenseData, {
      headers: { Authorization: `bearer ${accessToken}` },
    });
    getAllExpense(accessToken, dispatch);
  } catch (error) {
    dispatch(expenseFailed(error));
  }
};

export const deleteExpense = async (accessToken, dispatch, expense) => {
  try {
    await axios.delete(`http://localhost:3001/api/expense/`, {
      data: {
        registrationId: expense.registrationId,
        feeId: expense.feeId,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    getAllExpense(accessToken, dispatch);
  } catch (error) {
    dispatch(expenseFailed(error));
  }
};

export const updateExpense = async (accessToken, dispatch, expenseData) => {
  try {
    await axios.put(`http://localhost:3001/api/expense`, expenseData, {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    getAllExpense(accessToken, dispatch);
  } catch (error) {
    dispatch(expenseFailed(error));
  }
};

export const getExpenseByRegistrationId = async (accessToken, dispatch, registrationId) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/expense/registration/${registrationId}`, {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    dispatch(getAllExpenseSuccess(response.data));
  } catch (error) {
    dispatch(expenseFailed());
  }
};
