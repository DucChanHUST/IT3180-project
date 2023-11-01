import "./App.scss";
import "boxicons/css/boxicons.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./components/page/Home";
import Charge from "./components/page/Charge";
import Household from "./components/page/Household/Household";
import Report from "./components/page/Logout";
import Logout from "./components/page/Logout";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/hogiadinh" element={<Household />} />
          <Route path="/thuphi" element={<Charge />} />
          <Route path="/baocao" element={<Report />} />
          <Route path="/dangxuat" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
