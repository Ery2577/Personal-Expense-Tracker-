// ===== frontend/src/pages/Settings.jsx =====

import { useNavigate } from 'react-router-dom';
import { Home, CreditCard, Wallet, Settings as SettingsIcon, LogOut } from 'lucide-react';

const Settings = () => {
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
          <button 
            onClick={() => navigate('/transactions')}
            className="w-full text-left px-6 py-3 text-gray-600 hover:bg-gray-50 flex items-center"
          >
            <CreditCard className="mr-3" size={20} />
            Transactions
          </button>
          <button 
            onClick={() => navigate('/wallet')}
            className="w-full text-left px-6 py-3 text-gray-600 hover:bg-gray-50 flex items-center"
          >
            <Wallet className="mr-3" size={20} />
            My Wallet
          </button>
          <div className="px-6 py-3 bg-green-50 border-r-4 border-green-500 text-green-700 flex items-center">
            <SettingsIcon className="mr-3" size={20} />
            Settings
          </div>
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
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Settings</h2>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
          <p className="text-gray-500">Your settings and preferences will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;