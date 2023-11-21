import { createSlice } from "@reduxjs/toolkit";

const residentSlice = createSlice({
  name: "resident",
  initialState: {
    allResident: [],
    isLoading: false,
    isError: false,
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
      state.isError = true;
    },

    addResidentStart: state => {
      state.isLoading = true;
    },
    addResidentSuccess: (state, action) => {
      state.isLoading = false;
      console.log("added", action.payload);
    },
    addResidentFailed: state => {
      state.isLoading = false;
      state.isError = true;
    },

    deleteResidentStart: state => {
      state.isLoading = true;
    },
    deleteResidentSuccess: (state, action) => {
      state.isLoading = false;
      console.log("deleted", action.payload);
    },
    deleteResidentFailed: state => {
      state.isError = true;
    },

    updateResidentStart: state => {
      state.isLoading = true;
    },
    updateResidentSuccess: (state, action) => {
      state.isLoading = false;
      console.log("updated", action.payload);
    },
    updateResidentFailed: state => {
      state.isLoading = false;
      state.isError = true;
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
} = residentSlice.actions;

export default residentSlice.reducer;
