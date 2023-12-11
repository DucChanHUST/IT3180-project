import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
    name: "expense",
    initialState: {
      allExpense: [],
      errorMsg: "",
    },
    reducers: {
      getAllExpenseSuccess: (state, action) => {
        state.allExpense = action.payload;
        state.errorMsg = "";
      },
      expenseFailed: (state, action) => {
        state.errorMsg = action.payload;
        // console.log("expense error: ", action.payload);
      },
      clearExpenseError: state => {
        state.errorMsg = "";
      },
    },
});

export const { getAllExpenseSuccess, expenseFailed } = expenseSlice.actions;

export default expenseSlice.reducer;