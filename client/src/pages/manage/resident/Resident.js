import React, { useState, useEffect, useCallback } from "react";
import { SideBar, NavBar } from "../../../components";
import { getAllResident } from "../../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Box, Grid } from "@mui/material";
import DataTable from "./DataTable";
import EditResidentDialog from "./EditResidentDialog";
import AddResidentDialog from "./AddResidentDialog";
import DeleteResidentDialog from "./DeleteResidentDialog";
import SearchBar from "./SearchBar";

const Resident = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.login?.currentUser);
  const allResident = useSelector(state => state.resident.allResident);

  const [selectedResident, setSelectedResident] = useState({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filteredResident, setFilteredResident] = useState([]);
  const [flattenedResident, setFlattenedResident] = useState([]);

  const handleOpenEditDialog = useCallback(resident => {
    setIsEditDialogOpen(true);
    setSelectedResident(resident);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
  }, []);

  const handleOpenDeleteDialog = useCallback(resident => {
    setIsDeleteDialogOpen(true);
    setSelectedResident(resident);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  const handleCloseAddDialog = useCallback(() => {
    setIsAddDialogOpen(false);
  }, []);

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/Login");
      return;
    }

    const accessToken = user.token;
    getAllResident(accessToken, dispatch);
  }, [user, dispatch, navigate]);

  useEffect(() => {
    const flattenedData = allResident.map(item => {
      const {
        id,
        idnum,
        name,
        year,
        phoneNumber,
        registration: { id: registrationId },
        relationship,
      } = item;
  
      return {
        id,
        idnum,
        name,
        year,
        phoneNumber,
        registrationId,
        relationship,
      };
    });
    setFlattenedResident(flattenedData)
    setFilteredResident(flattenedData);
  }, [allResident]);

  return (
    <>
      <NavBar />
      <Box height={64} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Grid container direction="column" sx={{ margin: 3, gap: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={9}>
              <SearchBar flattenedResident={flattenedResident} setFilteredResident={setFilteredResident} />
            </Grid>
            <Grid item>
              <Button onClick={() => setIsAddDialogOpen(true)} variant="contained">
                Thêm nhân khẩu
              </Button>
            </Grid>
          </Grid>
          <DataTable
            filteredResident={filteredResident}
            handleOpenEditDialog={handleOpenEditDialog}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
          />
        </Grid>
        <EditResidentDialog
          isEditDialogOpen={isEditDialogOpen}
          handleCloseEditDialog={handleCloseEditDialog}
          selectedResident={selectedResident}
        />
        <DeleteResidentDialog
          isDeleteDialogOpen={isDeleteDialogOpen}
          handleCloseDeleteDialog={handleCloseDeleteDialog}
          selectedResident={selectedResident}
        />
        <AddResidentDialog isAddDialogOpen={isAddDialogOpen} handleCloseAddDialog={handleCloseAddDialog} />
      </Box>
    </>
  );
};

export default Resident;
