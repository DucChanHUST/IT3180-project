import React, { useState, useEffect, Fragment } from "react";
import { Box, Grid, Button } from "@mui/material";
import { SideBar, NavBar } from "../../../components";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DataTable from "./DataTable";

const Expense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.auth.login?.currentUser);
  const [isAccountant, setIsAccountant] = useState(false);

  const handleFetchFee = async () => {
    if (!user) {
      navigate("/Login");
      return;
    }

    user.userRole === "accountant" ? setIsAccountant(true) : setIsAccountant(false);
  };

  useEffect(() => {
    handleFetchFee();
  }, []);

  return (
    <>
      <NavBar />
      <Box height={64} />
      <Box sx={{ display: "flex" }}>
        <SideBar />
        <Grid container direction="column" sx={{ margin: 3, gap: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={9}>
              <SearchBar />
            </Grid>
            {isAccountant ? (
              <Grid item>
                <Button variant="contained">Thêm khoản nộp</Button>
              </Grid>
            ) : (
              <Fragment />
            )}
          </Grid>

          <DataTable />
        </Grid>
      </Box>
    </>
  );
};

export default Expense;
