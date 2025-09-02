import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/authentification';
import Dashboard from './pages/dashboard';
import Transactions from './pages/transaction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/authentication" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
}

export default App;