// ===== frontend/src/pages/Dashboard.jsx =====
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    CreditCard,
    Wallet,
    Settings,
    LogOut,
    TrendingUp,
    TrendingDown,
    DollarSign
} from 'lucide-react';

const dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

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
                    <div className="px-6 py-3 bg-green-50 border-r-4 border-green-500 text-green-700 flex items-center">
                        <Home className="mr-3" size={20} />
                        Dashboard
                    </div>
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
                    <button
                        onClick={() => navigate('/settings')}
                        className="w-full text-left px-6 py-3 text-gray-600 hover:bg-gray-50 flex items-center"
                    >
                        <Settings className="mr-3" size={20} />
                        Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 flex items-center mt-auto"
                    >
                        <LogOut className="mr-3" size={20} />
                        Logout
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                    <p className="text-gray-600">Welcome back, {(user as any)?.name || 'User'}!</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Income</p>
                                <p className="text-2xl font-bold text-green-600">$0.00</p>
                            </div>
                            <TrendingUp className="text-green-600" size={32} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Expenses</p>
                                <p className="text-2xl font-bold text-red-600">$0.00</p>
                            </div>
                            <TrendingDown className="text-red-600" size={32} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Balance</p>
                                <p className="text-2xl font-bold text-blue-600">$0.00</p>
                            </div>
                            <DollarSign className="text-blue-600" size={32} />
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h3 className="text-xl font-semibold">Recent Transactions</h3>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-500 text-center">No transactions yet. Start by adding your first transaction!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default dashboard;