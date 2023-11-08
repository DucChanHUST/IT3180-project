import React from "react";
import { Box } from "@mui/material";
import { SideBar, NavBar } from "../../../components";

const Statistic = () => {
  return (
    <>
    <NavBar />
    <Box height={25} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>statistic</h1>
        </Box>
      </Box>
    </>
  );
};

export default Statistic;
