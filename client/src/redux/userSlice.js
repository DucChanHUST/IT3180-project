import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: {
      allUsers: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getUsersStart: state => {
      state.users.isFetching = true;
    },
    getUsersSuccess: (state, action) => {
      state.users.isFetching = false;
      state.users.allUsers = action.payload;
    },
    getUsersFailed: state => {
      state.users.isFetching = false;
      state.users.error = true;
    },

    addUserStart: state => {
      state.users.isFetching = true;
    },
    addUserSuccess: (state, action) => {
      state.users.isFetching = false;
      console.log("added user", action.payload);
    },
    addUserFailed: state => {
      state.users.isFetching = false;
      state.error = true;
    },

    deleteUserStart: state => {
      state.users.isFetching = true;
    },
    deleteUserSuccess: (state, action) => {
      state.users.isFetching = false;
      console.log(action.payload);
    },
    deleteUserFailed: (state, action) => {
      state.users.isFetching = false;
      state.users.error = true;
    },

    changePasswordStart: state => {
      state.users.isFetching = true;
      state.users.error = false; // Reset error state
    },
    changePasswordSuccess: (state, action) => {
      state.users.isFetching = false;
      state.msg = action.payload; // Store success message or updated data
    },
    changePasswordFailed: state => {
      state.users.isFetching = false;
      state.users.error = true; // Set error flag
      // Additional error handling logic if needed
    },
  },
});

export const {
  getUsersStart,
  getUsersSuccess,
  getUsersFailed,
  deleteUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  addUserStart,
  addUserSuccess,
  addUserFailed,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailed,
} = userSlice.actions;

export default userSlice.reducer;
