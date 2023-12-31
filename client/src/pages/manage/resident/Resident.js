import React, { useState, useEffect, useCallback, Fragment } from "react";
import DataTable from "./DataTable";
import SearchBar from "./SearchBar";
import AddResidentDialog from "./AddResidentDialog";
import EditResidentDialog from "./EditResidentDialog";
import DeleteResidentDialog from "./DeleteResidentDialog";
import { handleFormatDate } from "../helper";
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

  const [isLeader, setIsLeader] = useState(false);
  const [selectedResident, setSelectedResident] = useState({});
  const [filteredResident, setFilteredResident] = useState([]);
  const [flattenedResident, setFlattenedResident] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    let flattenedData = [];
    if (user.userRole === "leader" || user.userRole === "accountant") {
      flattenedData = allResident.map(item => {
        let { id, idNumber, name, dob, gender, phoneNumber, registration, relationship } = item;

        const registrationId = registration ? registration.id : null;
        dob = handleFormatDate(dob);

        return {
          id,
          idNumber,
          name,
          dob,
          gender,
          phoneNumber,
          registrationId,
          relationship,
        };
      });
    } else {
      flattenedData = allResident.map(item => {
        let { id, idNumber, name, dob, gender, phoneNumber, registrationId, relationship } = item;

        dob = handleFormatDate(dob);

        return {
          id,
          idNumber,
          name,
          dob,
          gender,
          phoneNumber,
          registrationId,
          relationship,
        };
      });
    }
    setFlattenedResident(flattenedData);
    setFilteredResident(flattenedData);
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
