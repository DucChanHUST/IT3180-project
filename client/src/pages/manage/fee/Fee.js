import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button } from "@mui/material";
import { SideBar, NavBar } from "../../../components";
import { getAllFee } from "../../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";
import AddFeeDialog from "./AddFeeDialog";
import EditFeeDialog from "./EditFeeDialog";
import DeleteFeeDialog from "./DeleteFeeDialog";

const Fee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.auth.login?.currentUser);
  const allFee = useSelector(state => state.fee.allFee);

  const [feeData, setFeeData] = useState([]);
  const [selectedFee, setSelectedFee] = useState({});
  const [filteredFee, setFilteredFee] = useState([]);
  const [isAccountant, setIsAccountant] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenEditDialog = useCallback(fee => {
    setIsEditDialogOpen(true);
    setSelectedFee(fee);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
  }, []);

  const handleOpenDeleteDialog = useCallback(fee => {
    setIsDeleteDialogOpen(true);
    setSelectedFee(fee);
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
    await getAllFee(user.token, dispatch);
  };

  useEffect(() => {
    handleFetchFee();
  }, []);

  console.log(allFee);

  useEffect(() => {
    if (!user) return;

    const feeData = allFee.map(item => {
      let { id, nameFee, type, amount, paid} = item;

      (type) ? (type = "Bắt buộc") : (type = "Tự nguyện");

      return { id, nameFee, type, amount, paid};
    });
    
    setFeeData(feeData);
    setFilteredFee(feeData);
  }, [allFee, user]);

  return (
    <>
      <NavBar />
      <Box height={64} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Grid container direction="column" sx={{ margin: 3, gap: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={9}>
              <SearchBar feeData={feeData} setFilteredFee={setFilteredFee} />
            </Grid>
            {isAccountant ? (
              <Grid item>
                <Button onClick={() => setIsAddDialogOpen(true)} variant="contained">
                  Thêm khoản thu
                </Button>
              </Grid>
            ) : (
              <Fragment />
            )}
          </Grid>

          <DataTable
            filteredFee={filteredFee}
            isAccountant={isAccountant}
            handleOpenEditDialog={handleOpenEditDialog}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
          />
        </Grid>

        <AddFeeDialog isAddDialogOpen={isAddDialogOpen} handleCloseAddDialog={handleCloseAddDialog} />
        <EditFeeDialog
          selectedFee={selectedFee}
          isEditDialogOpen={isEditDialogOpen}
          handleCloseEditDialog={handleCloseEditDialog}
        />
        <DeleteFeeDialog
          selectedFee={selectedFee}
          isDeleteDialogOpen={isDeleteDialogOpen}
          handleCloseDeleteDialog={handleCloseDeleteDialog}
        />
      </Box>
    </>
  );
};

export default Fee;
