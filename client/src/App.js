import React from "react";
import { Login, HomePage, Resident, Registration, Fee, Expense, Statistic, Setting } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PathConstant } from "./const";
import { Navigate } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* MANAGE */}
        <Route path={PathConstant.ROOT} element={<HomePage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path={PathConstant.RESIDENT} element={<Resident />} />
        <Route path={PathConstant.REGISTRATION} element={<Registration />} />
        <Route path={PathConstant.FEE} element={<Fee />} />
        <Route path={PathConstant.EXPENSE} element={<Expense />} />
        <Route path={PathConstant.STATISTIC} element={<Statistic />} />
        <Route path={PathConstant.SETTING} element={<Setting />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
