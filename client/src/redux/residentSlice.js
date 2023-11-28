import { createSlice } from "@reduxjs/toolkit";

const residentSlice = createSlice({
  name: "resident",
  initialState: {
    allResident: [],
    isLoading: false,
    errorMsg: "",
  },
  reducers: {
    getResidentStart: state => {
      state.isLoading = true;
    },
    getResidentSuccess: (state, action) => {
      state.isLoading = false;
      state.allResident = action.payload;
    },
    getResidentFailed: state => {
      state.isLoading = false;
    },

    addResidentStart: state => {
      state.isLoading = true;
    },
    addResidentSuccess: (state, action) => {
      state.isLoading = false;
      console.log("added resident", action.payload);
    },
    addResidentFailed: (state, action) => {
      state.isLoading = false;
      state.errorMsg = action.payload.message;
    },

    deleteResidentStart: state => {
      state.isLoading = true;
    },
    deleteResidentSuccess: (state, action) => {
      state.isLoading = false;
      console.log(action.payload);
    },
    deleteResidentFailed: state => {
      state.isLoading = false;
    },

    updateResidentStart: state => {
      state.isLoading = true;
    },
    updateResidentSuccess: (state, action) => {
      state.isLoading = false;
      console.log("updated resident", action.payload);
    },
    updateResidentFailed: (state, action) => {
      state.isLoading = false;
      state.errorMsg = action.payload.message;
    },

    clearResidentError: state => {
      state.errorMsg = "";
    },
  },
});

export const {
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
  clearResidentError,
} = residentSlice.actions;

export default residentSlice.reducer;
