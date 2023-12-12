import { createSlice } from "@reduxjs/toolkit";

const registrationSlice = createSlice({
  name: "registration",
  initialState: {
    allRegistration: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    getRegistrationsStart: state => {
      state.isFetching = true;
    },
    getRegistrationsSuccess: (state, action) => {
      state.isFetching = false;
      state.allRegistration = action.payload;
    },
    getRegistrationsFailed: state => {
      state.isFetching = false;
      state.error = true;
    },

    deleteRegistrationStart: state => {
      state.isFetching = true;
    },
    deleteRegistrationSuccess: (state) => {
      state.isFetching = false;
    },
    deleteRegistrationFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    addRegistrationsStart: state => {
      state.isFetching = true;
    },
    addRegistrationsSuccess: (state) => {
      state.isFetching = false;
    },
    addRegistrationsFailed: state => {
      state.isFetching = false;
      state.error = true;
    },

    updateRegistrationsStart: state => {
      state.isFetching = true;
      state.error = false;
    },
    updateRegistrationsSuccess: (state) => {
      state.isFetching = false;
    },
    updateRegistrationsFailed: state => {
      state.isFetching = false;
      state.error = true; 
    },
  },
});

export const {
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
} = registrationSlice.actions;

export default registrationSlice.reducer;
