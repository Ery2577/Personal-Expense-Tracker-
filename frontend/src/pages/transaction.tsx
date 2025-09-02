// ===== frontend/src/pages/Transactions.jsx =====

import { useNavigate } from 'react-router-dom';
import { Home, CreditCard, Wallet, Settings, LogOut, Plus } from 'lucide-react';


const Transactions = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-green-600">MoneyTrack</h1>
        </div>
        <nav className="mt-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full text-left px-6 py-3 text-gray-600 hover:bg-gray-50 flex items-center"
          >
            <Home className="mr-3" size={20} />
            Dashboard
          </button>
          <div className="px-6 py-3 bg-green-50 border-r-4 border-green-500 text-green-700 flex items-center">
            <CreditCard className="mr-3" size={20} />
            Transactions
          </div>
          <button 
            onClick={() => navigate('/wallet')}
            className="w-full text-left px-6 py-3 text-gray-600 hover:bg-gray-50 flex items-center"
          >
            <Wallet className="mr-3" size={20} />
            My Wallet
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="w-full text-left px-6 py-3 text-gray-600 hover:bg-gray-50 flex items-center"
          >
            <Settings className="mr-3" size={20} />
            Settings
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 flex items-center"
          >
            <LogOut className="mr-3" size={20} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Transactions</h2>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-green-700">
            <Plus className="mr-2" size={20} />
            Add Transaction
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <p className="text-gray-500 text-center">No transactions found. Start by adding your first transaction!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;