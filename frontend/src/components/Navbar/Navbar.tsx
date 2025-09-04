interface NavbarProps {
  title?: string;
}

export default function Navbar({ }: NavbarProps) {
  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-gray-200 text-gray-800 px-6 flex items-center justify-between border-b border-gray-300 z-10">
      {/* Left side with search */}
      <div className="flex items-center space-x-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder=""
            className="bg-gray-300 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 w-64 border border-gray-400"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            🔍
          </span>
        </div>
      </div>

      {/* Right side with icons */}
      <div className="flex items-center space-x-4">
        {/* Settings Icon */}
        <button className="p-2 hover:bg-gray-300 rounded-full transition-colors">
          <span className="text-lg">⚙️</span>
        </button>

        {/* User Profile */}
        <button className="p-2 hover:bg-gray-300 rounded-full transition-colors">
          <span className="text-lg">👤</span>
        </button>
      </div>
    </div>
  );
}
