import { createSlice } from "@reduxjs/toolkit";

const registrationSlice = createSlice({
  name: "registration",
  initialState: {
    registrations: {
      allRegistrations: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getRegistrationsStart: state => {
      state.registrations.isFetching = true;
    },
    getRegistrationsSuccess: (state, action) => {
      state.registrations.isFetching = false;
      state.registrations.allRegistrations = action.payload;
    },
    getRegistrationsFailed: state => {
      state.registrations.isFetching = false;
      state.registrations.error = true;
    },

    deleteRegistrationStart: state => {
      state.registrations.isFetching = true;
    },
    deleteRegistrationSuccess: (state, action) => {
      state.registrations.isFetching = false;
      // Remove the deleted registration from the array
      state.registrations.allRegistrations = state.registrations.allRegistrations.filter(
        regis => regis.id !== action.payload,
      );
    },
    deleteRegistrationFailed: (state, action) => {
      state.registrations.isFetching = false;
      state.registrations.error = true;
      state.msg = action.payload;
    },

    addRegistrationsStart: state => {
      state.registrations.isFetching = true;
    },
    addRegistrationsSuccess: (state, action) => {
      state.registrations.isFetching = false;
      // You can update the state with the added registration data
      state.msg = action.payload;
    },
    addRegistrationsFailed: state => {
      state.registrations.isFetching = false;
      state.registrations.error = true;
      // You can handle errors when adding registrations
    },

    updateRegistrationsStart: state => {
      state.registrations.isFetching = true;
      state.registrations.error = false; // Reset error state
    },
    updateRegistrationsSuccess: (state, action) => {
      state.registrations.isFetching = false;
      state.msg = action.payload; // Store success message or updated data
    },
    updateRegistrationsFailed: state => {
      state.registrations.isFetching = false;
      state.registrations.error = true; // Set error flag
      // Additional error handling logic if needed
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
