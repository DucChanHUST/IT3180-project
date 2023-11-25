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
      console.log("user added", action.payload);
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
      // state.msg = action.payload;
      console.log("deleted", action.payload);
    },
    deleteUserFailed: (state, action) => {
      state.users.isFetching = false;
      state.users.error = true;
      // state.msg = action.payload;
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
} = userSlice.actions;

export default userSlice.reducer;
