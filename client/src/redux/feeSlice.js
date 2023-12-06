import { createSlice } from "@reduxjs/toolkit";

const feeSlice = createSlice({
    name: "fee",
    initialState: {
      allFee: [],
      errorMsg: "",
    },
    reducers: {
      getAllFeeSuccess: (state, action) => {
        state.allFee = action.payload;
        state.errorMsg = "";
      },
      feeFailed: (state, action) => {
        console.log("fee error: ", action.payload);
        state.errorMsg = action.payload;
      },
      clearFeeError: state => {
        state.errorMsg = "";
      },
    },
});

export const { getAllFeeSuccess, feeFailed, clearFeeError } = feeSlice.actions;

export default feeSlice.reducer;