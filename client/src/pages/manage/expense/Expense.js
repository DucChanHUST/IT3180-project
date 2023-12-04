import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button } from "@mui/material";
import { SideBar, NavBar } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";
import AddExpenseDialog from "./AddExpenseDialog";
import EditExpenseDialog from "./EditExpenseDialog";
import DeleteExpenseDialog from "./DeleteExpenseDialog";

const Expense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.auth.login?.currentUser);
  const allExpense = useSelector(state => state.expense.allExpense);

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

  const handleFetchFee = async () => {
    if (!user) {
      navigate("/Login");
      return;
    }

    user.userRole === "accountant" ? setIsAccountant(true) : setIsAccountant(false);
  };

  useEffect(() => {
    handleFetchFee();
  }, []);

  return (
    <>
      <NavBar />
      <Box height={64} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Grid container direction="column" sx={{ margin: 3, gap: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={9}>
              <SearchBar />
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
            allExpense={allExpense}
            isAccountant={isAccountant}
            handleOpenEditDialog={handleOpenEditDialog}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
          />

          <AddExpenseDialog isAddDialogOpen={isAddDialogOpen} handleCloseAddDialog={handleCloseAddDialog} />
          <EditExpenseDialog
            selectedFee={selectedExpense}
            isEditDialogOpen={isEditDialogOpen}
            handleCloseEditDialog={handleCloseEditDialog}
          />
          <DeleteExpenseDialog
            selectedFee={selectedExpense}
            isDeleteDialogOpen={isDeleteDialogOpen}
            handleCloseDeleteDialog={handleCloseDeleteDialog}
          />
        </Grid>
      </Box>
    </>
  );
};

export default Expense;
