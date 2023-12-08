import React, { useState, useEffect, useCallback, Fragment } from "react";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";
import AddRegistrationDialog from "./AddRegistrationDialog";
import EditRegistrationDialog from "./EditRegistrationDialog";
import DeleteRegistrationDialog from "./DeleteRegistrationDialog";
import { PathConstant } from "../../../const";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button } from "@mui/material";
import { SideBar, NavBar } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { getAllRegistrations, getRegistrationID } from "../../../redux/apiRequest";
const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.auth.login?.currentUser);
  const allRegistration = useSelector(state => state.registration.allRegistration);

  const [isLeader, setIsLeader] = useState(false);
  const [registrationData, setRegistrationData] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filteredRegistration, setFilteredRegistration] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState({});

  const handleOpenEditDialog = useCallback(registration => {
    setIsEditDialogOpen(true);
    setSelectedRegistration(registration);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
  }, []);

  const handleOpenDeleteDialog = useCallback(registration => {
    setIsDeleteDialogOpen(true);
    setSelectedRegistration(registration);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  const handleCloseAddDialog = useCallback(() => {
    setIsAddDialogOpen(false);
  }, []);

  const handleFetchRegistration = async () => {
    if (!user) {
      navigate(PathConstant.LOGIN);
      return;
    }

    switch (user.userRole) {
      case "resident":
        setIsLeader(false);
        await getRegistrationID(user.token, dispatch, user.userId);
        break;
      case "accountant":
        setIsLeader(false);
        await getAllRegistrations(user.token, dispatch);
        break;
      default:
        setIsLeader(true);
        await getAllRegistrations(user.token, dispatch);
        break;
    }
  };

  useEffect(() => {
    handleFetchRegistration();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate(PathConstant.LOGIN);
    }

    const registrationData = allRegistration.map(item => {
      return { registrationId: item.id, address: item.address, numberOfResidents: item.residents.length };
    });

    setRegistrationData(registrationData);
    setFilteredRegistration(registrationData);
  }, [user, allRegistration]);

  return (
    <>
      <NavBar />
      <Box height={64} />
      <Box sx={{ display: "flex" }}>
        <SideBar />

        <Grid container direction="column" sx={{ margin: 3, gap: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={9}>
              <SearchBar registrationData={registrationData} setFilteredRegistration={setFilteredRegistration} />
            </Grid>
            {isLeader ? (
              <Grid item>
                <Button onClick={() => setIsAddDialogOpen(true)} variant="contained">
                  Thêm hộ khẩu
                </Button>
              </Grid>
            ) : (
              <Fragment />
            )}
          </Grid>

          <DataTable
            isLeader={isLeader}
            filteredRegistration={filteredRegistration}
            handleOpenEditDialog={handleOpenEditDialog}
            handleOpenDeleteDialog={handleOpenDeleteDialog}
          />
        </Grid>

        <AddRegistrationDialog isAddDialogOpen={isAddDialogOpen} handleCloseAddDialog={handleCloseAddDialog} />
        <EditRegistrationDialog
          selectedRegistration={selectedRegistration}
          isEditDialogOpen={isEditDialogOpen}
          handleCloseEditDialog={handleCloseEditDialog}
        />
        <DeleteRegistrationDialog
          selectedRegistration={selectedRegistration}
          isDeleteDialogOpen={isDeleteDialogOpen}
          handleCloseDeleteDialog={handleCloseDeleteDialog}
        />
      </Box>
    </>
  );
};

export default Registration;
