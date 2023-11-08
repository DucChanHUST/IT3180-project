import React from "react";
import { Box } from "@mui/material";
import { SideBar, NavBar } from "../../../components";

const Residence = () => {
  return (
    <>
    <NavBar />
    <Box height={25} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>residence</h1>
        </Box>
      </Box>
    </>
  );
};

export default Residence;
