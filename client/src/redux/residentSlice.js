import { createSlice } from "@reduxjs/toolkit";

const residentSlice = createSlice({
  name: "resident",
  initialState: {
    allResident: [],
    isFetching: false,
    isError: false,
  },
  reducers: {
    getResidentStart: state => {
      state.isFetching = true;
    },
    getResidentSuccess: (state, action) => {
      state.isFetching = false;
      state.allResident = action.payload;
    },
    getResidentFailed: state => {
      state.isFetching = false;
      state.isError = true;
    },
  },
});

export const { getResidentStart, getResidentSuccess, getResidentFailed } = residentSlice.actions;

export default residentSlice.reducer;
