import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { SideBar, NavBar } from "../../../components";
import { getAllResident } from "../../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DataTable from "./DataTable";
import EditResidentDialog from "./EditResidentDialog";

const Resident = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.login?.currentUser);
  const allResident = useSelector(state => state.resident.allResident);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState({});

  const handleOpenEditDialog = resident => {
    setIsEditDialogOpen(true);
    setSelectedResident(resident);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleSelectResident = resident => {
    setSelectedResident(resident);
  };

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/Login");
      return;
    }

    const accessToken = user.token;
    getAllResident(accessToken, dispatch);
  }, [user, dispatch, navigate]);

  console.log("rerender");

  return (
    <>
      <NavBar />
      <Box height={64} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <DataTable
          allResident={allResident}
          handleOpenEditDialog={handleOpenEditDialog}
          onSelectResident={handleSelectResident}
        />
        <EditResidentDialog
          isEditDialogOpen={isEditDialogOpen}
          handleCloseEditDialog={handleCloseEditDialog}
          selectedResident={selectedResident}
        />
      </Box>
    </>
  );
};

export default Resident;
