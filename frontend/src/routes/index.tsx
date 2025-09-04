import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentification from "../pages/Authentification/Authentification";
import Dashboard from "../pages/Dashboard/Dashboard";
import Wallet from "../pages/Wallet/Wallet";
import Transaction from "../pages/Transaction/Transaction";
import Setting from "../pages/Settings/Setting";
import Layout from "../components/Layout/Layout";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth page without layout */}
        <Route path="/" element={<Authentification />} />
        
        {/* Pages with layout */}
        <Route path="/Dashboard" element={
          <Layout title="Dashboard">
            <Dashboard />
          </Layout>
        } />
        <Route path="/Wallet" element={
          <Layout title="My Wallet">
            <Wallet />
          </Layout>
        } />
        <Route path="/Transaction" element={
          <Layout title="Transaction">
            <Transaction />
          </Layout>
        } />
        <Route path="/Settings" element={
          <Layout title="Setting">
            <Setting />
          </Layout>
        } />
      </Routes>
    </Router>
  )
}
