import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/Dashboard", icon: "📊" },
  { name: "My Wallet", path: "/Wallet", icon: "💰" },
  { name: "Transaction", path: "/Transaction", icon: "💳" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-400 text-gray-800 flex flex-col border-r border-gray-200">
      {/* ===== TOP SECTION ===== */}
      <div>
        {/* Title */}
        <div className="p-6 flex items-center justify-center">
          <h1 className="text-xl font-bold text-gray-800">MoneyTrack</h1>
        </div>

        {/* User Profile */}
        <div className="flex items-center mb-3 justify-center">
          <div className="w-15 h-15 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-lg">👤</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mb-8">
          <p className="text-sm text-gray-700 font-medium">Hello, User</p>
          <p className="text-xs text-gray-500">user@example.com</p>
        </div>
      </div>

      {/* ===== MIDDLE SECTION ===== */}
      <div className="flex-1 flex items-center justify-center">
        <nav className="space-y-2 w-full px-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center p-3 rounded-lg text-left cursor-pointer transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ===== BOTTOM SECTION ===== */}
      <div className="p-6">
        <button
          onClick={() => navigate("/Settings")}
          className={`w-full flex items-center cursor-pointer p-3 rounded-lg text-left transition-colors ${
            location.pathname === "/Settings"
              ? "bg-gray-800 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span className="mr-3 text-lg">⚙️</span>
          <span className="text-sm font-medium">Setting</span>
        </button>
        <p className="text-xs text-gray-500 mt-4 text-center">
          © 2025 MoneyTrack
        </p>
      </div>
    </div>
  );
}

