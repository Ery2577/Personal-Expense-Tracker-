import React from 'react';
import SearchModal from '../Search/SearchModal';

interface NavbarProps {
  title?: string;
  expenses?: any[];
  incomes?: any[];
  categories?: any[];
  onSearchOpen?: () => void;
  isSearchOpen?: boolean;
  onSearchClose?: () => void;
}

export default function Navbar({  
  expenses = [], 
  incomes = [], 
  categories = [],
  onSearchOpen,
  isSearchOpen = false,
  onSearchClose
}: NavbarProps) {
  const handleSearchClick = () => {
    onSearchOpen?.();
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSearchOpen?.();
    }
  };

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white text-gray-800 px-6 flex items-center justify-between border-b border-gray-200 shadow-sm z-10">
      {/* ===== LEFT SIDE ===== */}
      <div className="flex items-center space-x-6">
       

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions, categories..."
            onClick={handleSearchClick}
            onKeyDown={handleSearchKeyDown}
            readOnly
            className="bg-gray-50 text-gray-800 placeholder-gray-400 px-4 py-2 pr-16 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-100 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <span className="text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded border font-mono">
              ⌘K
            </span>
            <span className="text-gray-400 text-sm">🔍</span>
          </div>
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

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => onSearchClose?.()}
        expenses={expenses}
        incomes={incomes}
        categories={categories}
      />
    </div>
  );
}
