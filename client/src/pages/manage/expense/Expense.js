import React, { useState, useEffect, useCallback, Fragment } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";
import AddExpenseDialog from "./AddExpenseDialog";
import EditExpenseDialog from "./EditExpenseDialog";
import DeleteExpenseDialog from "./DeleteExpenseDialog";
import { handleFormatDate } from "../helper";
import { PathConstant } from "../../../const";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button } from "@mui/material";
import { SideBar, NavBar } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { getAllExpense, getRegistrationExpense } from "../../../redux/apiRequest";

const Expense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.auth.login?.currentUser);
  const allExpense = useSelector(state => state.expense.allExpense);

  const [expenseData, setExpenseData] = useState([]);
  const [isAccountant, setIsAccountant] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState({});
  const [filteredExpense, setFilteredExpense] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenEditDialog = useCallback(expense => {
    setIsEditDialogOpen(true);
    setSelectedExpense(expense);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
  }, []);

  const handleOpenDeleteDialog = useCallback(expense => {
    setIsDeleteDialogOpen(true);
    setSelectedExpense(expense);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  const handleCloseAddDialog = useCallback(() => {
    setIsAddDialogOpen(false);
  }, []);

  const handleFetchExpense = async () => {
    if (!user) {
      navigate(PathConstant.LOGIN);
      return;
    }

    switch (user.userRole) {
      case "resident":
        setIsAccountant(false);
        const registrationResponse = await axios.get(`http://localhost:3001/api/users/${user.userId}`, {
          headers: { Authorization: `bearer ${user.token}` },
        });
        const registrationId = registrationResponse.data.resident.registration.id;
        await getRegistrationExpense(user.token, dispatch, registrationId);
        break;
      case "leader":
        setIsAccountant(false);
        await getAllExpense(user.token, dispatch);
        break;
      default:
        setIsAccountant(true);
        await getAllExpense(user.token, dispatch);
        break;
    }
  };

  useEffect(() => {
    handleFetchExpense();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate(PathConstant.LOGIN)
    }

    const expenseData = allExpense.map(item => {
      let { registrationId, feeId, amount, date } = item;

      date = handleFormatDate(date);

      return { registrationId, feeId, amount, date };
    });

    setExpenseData(expenseData);
    setFilteredExpense(expenseData);
  }, [user, allExpense]);

  return (
    <>
      <NavBar />
      <Box height={64} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Grid container direction="column" sx={{ margin: 3, gap: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={9}>
              <SearchBar expenseData={expenseData} setFilteredExpense={setFilteredExpense} />
            </Grid>
            {isAccountant ? (
              <Grid item>
                <Button onClick={() => setIsAddDialogOpen(true)} variant="contained">
                  Thêm khoản nộp
                </Button>
              </Grid>
            ) : (
              <Fragment />
            )}
          </Grid>

          <DataTable
            filteredExpense={filteredExpense}
            isAccountant={isAccountant}
            handleOpenEditDialog={handleOpenEditDialog}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
          />

          <AddExpenseDialog isAddDialogOpen={isAddDialogOpen} handleCloseAddDialog={handleCloseAddDialog} />
          <EditExpenseDialog
            selectedExpense={selectedExpense}
            isEditDialogOpen={isEditDialogOpen}
            handleCloseEditDialog={handleCloseEditDialog}
          />
          <DeleteExpenseDialog
            selectedExpense={selectedExpense}
            isDeleteDialogOpen={isDeleteDialogOpen}
            handleCloseDeleteDialog={handleCloseDeleteDialog}
          />
        </Grid>
      </Box>
    </>
  );
};

export default Expense;
