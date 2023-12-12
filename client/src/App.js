import React from "react";
import { PathConstant } from "./const";
import { Navigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Profile, HomePage, Resident, Registration, Fee, Expense, Statistic } from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path={PathConstant.LOGIN} element={<Login />} />
        <Route path="/" element={<Navigate to={PathConstant.LOGIN} />} />
        {/* MANAGE */}
        <Route path={PathConstant.HOMEPAGE} element={<HomePage />} />
        <Route path={PathConstant.RESIDENT} element={<Resident />} />
        <Route path={PathConstant.REGISTRATION} element={<Registration />} />
        <Route path={PathConstant.FEE} element={<Fee />} />
        <Route path={PathConstant.EXPENSE} element={<Expense />} />
        <Route path={PathConstant.STATISTIC} element={<Statistic />} />
        <Route path={PathConstant.PROFILE} element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
