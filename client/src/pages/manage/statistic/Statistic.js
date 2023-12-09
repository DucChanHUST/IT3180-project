import React from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import { SideBar, NavBar } from "../../../components";
import { useSelector } from "react-redux";
import BarChart from "./Barchart";
import PieChart from "./Piechart";

const Statistic = () => {
  const allResidents = useSelector(state => state.resident.allResident);
  const allRegistrations = useSelector(state => state.registration.allRegistration);
  const numberOfResidents = allResidents.length;
  const numberOfRegistrations = allRegistrations.length;

  return (
    <>
      <NavBar />
      <Box height={64} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {/* <h1>Thống kê</h1> */}

          <Grid container spacing={2}>
            {/* Hộp tổng số hộ */}
            <Grid item xs={2}>
              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Tổng số hộ
                </Typography>
                <Typography variant="h4">{numberOfRegistrations}</Typography>
              </Paper>
            </Grid>

            {/* Hộp tổng số dân */}
            <Grid item xs={2}>
              <Paper elevation={4} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Tổng số dân
                </Typography>
                <Typography variant="h4">{numberOfResidents}</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={8} >
              <BarChart
              />
            </Grid>
            <Grid item xs={4} >
              <PieChart/>
            </Grid>
          </Grid> 
        </Box>
      </Box>
    </>
  );
};

export default Statistic;

