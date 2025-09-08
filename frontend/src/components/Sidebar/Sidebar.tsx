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
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#f5f9ee] to-[#d7e4b2] text-gray-800 flex flex-col shadow-lg">
      {/* ===== TOP SECTION ===== */}
      <div className="flex flex-col items-center border-b border-gray-200 p-6">
        {/* Logo */}
        <div className="mb-4 ">
          <img
            src="src/assets/images/Logo MoneyTrack.png"
            alt="MoneyTrack Logo"
            className="w-30 h-30 object-contain"
          />
        </div>
      </div>

      {/* ===== USER PROFILE ===== */}
      <div className="flex flex-col items-center p-6">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center shadow-md">
          <span className="text-white text-xl">👤</span>
        </div>
        <p className="mt-3 text-sm font-semibold text-gray-800">Hello, User</p>
        <p className="text-xs text-gray-500">user@example.com</p>
      </div>

      {/* ===== NAVIGATION ===== */}
      <div className="flex-1 px-6">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center p-3 rounded-xl text-left cursor-pointer transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-green-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-green-100 hover:text-green-700"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ===== SETTINGS & FOOTER ===== */}
      <div className="border-t border-gray-200 p-6">
        <button
          onClick={() => navigate("/Settings")}
          className={`w-full flex items-center p-3 rounded-xl text-left transition-all duration-200 font-medium ${
            location.pathname === "/Settings"
              ? "bg-green-500 text-white shadow-md"
              : "text-gray-700 hover:bg-green-100 hover:text-green-700"
          }`}
        >
          <span className="mr-3 text-lg">⚙️</span>
          <span className="text-sm">Settings</span>
        </button>
        <p className="text-xs text-gray-500 mt-6 text-center">
          © 2025 MoneyTrack
        </p>
      </div>
    </div>
  );
}
