import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentification from "../pages/Authentification/Authentification";
import Dashboard from "../pages/Dashboard/Dashboard";
import Wallet from "../pages/Wallet/Wallet";
import Transaction from "../pages/Transaction/Transaction";
import Setting from "../pages/Settings/Setting";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authentification />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Wallet" element={<Wallet />} />
        <Route path="/Transaction" element={<Transaction />} />
        <Route path="/Settings" element={<Setting />} />
      </Routes>
    </Router>
  )
}
