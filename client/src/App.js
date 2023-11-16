import React, { useContext } from "react";
import {Login,  HomePage, Fee, PayFee, Statistic, Setting, Registration, Residence} from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PathConstant } from "./const";
import { Navigate } from "react-router-dom";
import RegistrationDetails from "./pages/manage/Registration/RegistrationDetails";
import CreateNewRegis from './pages/manage/Registration/CreateNewRegis';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* MANAGE */}
        <Route path={PathConstant.ROOT} element={<HomePage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path={PathConstant.RESIDENCE} element={<Residence />} />
        <Route path={PathConstant.REGISTRATION} element={<Registration />} />
        <Route path="/CreateNewRegistration" element={<CreateNewRegis />} />
        <Route path="/RegistrationDetails" element={<RegistrationDetails/>}></Route>
        <Route path={PathConstant.FEE} element={<Fee />} />
        <Route path={PathConstant.PAY_FEE} element={<PayFee />} />
        <Route path={PathConstant.STATISTIC} element={<Statistic />} />
        <Route path={PathConstant.SETTING} element={<Setting />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
