import React, { useState, useEffect, useCallback, Fragment } from "react";
import DataTable from "./DataTable";
import SearchBar from "./SearchBar";
import AddResidentDialog from "./AddResidentDialog";
import EditResidentDialog from "./EditResidentDialog";
import DeleteResidentDialog from "./DeleteResidentDialog";
import { PathConstant } from "../../../const";
import { useNavigate } from "react-router-dom";
import { Button, Box, Grid } from "@mui/material";
import { SideBar, NavBar } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { getAllResident, getRegistrationResident } from "../../../redux/apiRequest";

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
  const [isLeader, setIsLeader] = useState(false);

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

  const handleFetchResident = async () => {
    if (!user) {
      navigate(PathConstant.LOGIN);
      return;
    }
    try {
      if (user.userRole === "leader") {
        setIsLeader(true);
        await getAllResident(user.token, dispatch);
      } else {
        setIsLeader(false);
        await getRegistrationResident(user.token, dispatch, user.userId);
      }
    } catch (error) {
      console.error(error);
    }

    switch (user.userRole) {
      case "resident":
        setIsLeader(false);
        await getRegistrationResident(user.token, dispatch, user.userId);
        break;
      case "accountant":
        setIsLeader(false);
        await getAllResident(user.token, dispatch);
        break;
      default:
        setIsLeader(true);
        await getAllResident(user.token, dispatch);
        break;
    }
  };

  useEffect(() => {
    handleFetchResident();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.userRole === "leader" || user.userRole === "accountant") {
      const flattenedData = allResident.map(item => {
        const { id, idNumber, name, dob, gender, phoneNumber, registration, user, relationship } = item;

        const registrationId = registration ? registration.id : null;
        const userId = user ? user.id : null;

        return {
          id,
          idNumber,
          name,
          dob,
          gender,
          phoneNumber,
          registrationId,
          userId,
          relationship,
        };
      });


      setFlattenedResident(flattenedData);
      setFilteredResident(flattenedData);
    } else {
      setFlattenedResident(allResident);
      setFilteredResident(allResident);
    }
  }, [user, allResident]);

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
            {isLeader ? (
              <Grid item>
                <Button onClick={() => setIsAddDialogOpen(true)} variant="contained">
                  Thêm nhân khẩu
                </Button>
              </Grid>
            ) : (
              <Fragment />
            )}
          </Grid>

          <DataTable
            filteredResident={filteredResident}
            handleOpenEditDialog={handleOpenEditDialog}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
            isLeader={isLeader}
          />
        </Grid>

        <EditResidentDialog
          isEditDialogOpen={isEditDialogOpen}
          handleCloseEditDialog={handleCloseEditDialog}
          flattenedResident={filteredResident}
          selectedResident={selectedResident}
        />
        <DeleteResidentDialog
          isDeleteDialogOpen={isDeleteDialogOpen}
          handleCloseDeleteDialog={handleCloseDeleteDialog}
          selectedResident={selectedResident}
        />
        <AddResidentDialog
          isAddDialogOpen={isAddDialogOpen}
          handleCloseAddDialog={handleCloseAddDialog}
          flattenedResident={flattenedResident}
        />
      </Box>
    </>
  );
};

export default Resident;
