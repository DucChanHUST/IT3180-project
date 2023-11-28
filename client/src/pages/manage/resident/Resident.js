import React, { useState, useEffect, useCallback, Fragment } from "react";
import { SideBar, NavBar } from "../../../components";
import { getAllResident, getRegistrationResident } from "../../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Box, Grid, Snackbar, Alert } from "@mui/material";
import DataTable from "./DataTable";
import EditResidentDialog from "./EditResidentDialog";
import AddResidentDialog from "./AddResidentDialog";
import DeleteResidentDialog from "./DeleteResidentDialog";
import SearchBar from "./SearchBar";
import { clearResidentError } from "../../../redux/residentSlice";

const Resident = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.auth.login?.currentUser);
  const allResident = useSelector(state => state.resident.allResident);
  const errorMsg = useSelector(state => state.resident.errorMsg);

  const [selectedResident, setSelectedResident] = useState({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filteredResident, setFilteredResident] = useState([]);
  const [flattenedResident, setFlattenedResident] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
  const [errorAlertMsg, setErrorAlertMsg] = useState("");

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

  const handleCloseAlert = () => {
    dispatch(clearResidentError());
  };

  const handleFetchResident = async () => {
    if (!user) {
      navigate("/Login");
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
  };

  useEffect(() => {
    handleFetchResident();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.userRole === "leader") {
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

  useEffect(() => {
    switch (errorMsg) {
      case "id_number must be unique":
        setErrorAlertMsg("Số CCCD đã tồn tại");
        break;
      default:
        setErrorAlertMsg(errorMsg);
    }
  }, [errorMsg]);

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

      <Snackbar open={Boolean(errorMsg)} autoHideDuration={5000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error">
          {errorAlertMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Resident;
