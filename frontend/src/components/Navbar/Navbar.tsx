interface NavbarProps {
  title?: string;
}

export default function Navbar({ title }: NavbarProps) {
  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white text-gray-800 px-6 flex items-center justify-between border-b border-gray-200 shadow-sm z-10">
      {/* ===== LEFT SIDE ===== */}
      <div className="flex items-center space-x-6">
       

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-50 text-gray-800 placeholder-gray-400 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64 border border-gray-200"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
        </div>
      </div>

      {/* ===== RIGHT SIDE ===== */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 hover:bg-green-100 text-gray-600 rounded-full transition-colors">
          <span className="text-lg">🔔</span>
        </button>

        {/* Settings */}
        <button className="p-2 hover:bg-green-100 text-gray-600 rounded-full transition-colors">
          <span className="text-lg">⚙️</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-full hover:bg-green-100 transition">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700">
            User
          </span>
        </div>
      </div>
    </div>
  );
}
