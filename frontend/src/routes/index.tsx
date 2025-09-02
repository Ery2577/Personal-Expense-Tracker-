// src/route.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authentification from "../pages/Authentification/Authentification.tsx";
import Dashboard from "../pages/Dashboard/Dashboard.tsx";
import Wallet from "../pages/Wallet/Wallet.tsx";
import Transaction from "../pages/Transaction/Transaction.tsx";
import Setting from "../pages/Settings/Setting.tsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Authentification />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </BrowserRouter>
  );
}
