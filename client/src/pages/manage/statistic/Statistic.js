import React, { useState } from "react";
import { useSelector } from "react-redux";
import { SideBar, NavBar } from "../../../components";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Paper, Typography, Grid, TextField,} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import BarChart from "./Barchart";
import PieChart from "./Piechart";

const Statistic = () => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const allResidents = useSelector(state => state.resident.allResident);
  const allRegistrations = useSelector(state => state.registration.allRegistration);
  
  const numberOfResidents = allResidents.length;
  const numberOfRegistrations = allRegistrations.length;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleYearChange = (date) => {
    setSelectedYear(date.year());
  };

  return (
    <>
      <NavBar />
      <Box height={64} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={2}>
            {/* Hộp tổng số hộ */}
            {user && user.userRole !== "resident" && (
            <Grid item xs={2}>
              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Tổng số hộ
                </Typography>
                <Typography variant="h4">{numberOfRegistrations}</Typography>
              </Paper>
            </Grid>
            )}

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

          <Grid item xs={8} sx={{ marginBottom: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Chọn năm"
                views={["year"]}
                value={dayjs(selectedYear.toString())}
                onChange={handleYearChange}
                renderInput={params => <TextField {...params} variant="standard" fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <BarChart selectedYear={selectedYear} />
            </Grid>
            <Grid item xs={4}>
              <PieChart selectedYear={selectedYear} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Statistic;

