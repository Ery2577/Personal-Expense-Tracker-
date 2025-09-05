import React from 'react';

const WalletTemplate: React.FC = () => {
  return (
    <div className="min-h-screen bg-green-300 p-4">
      <div className="w-full h-full">{/* Removed max-w-md mx-auto */}
        {/* Header */}
        <h1 className="text-xl font-semibold text-gray-800 mb-6">My wallet</h1>
        
        {/* Principal Balance */}
        <div className="bg-gray-200 rounded-lg p-4 mb-4">
          <h2 className="text-sm font-medium text-gray-600 mb-2">Principal balance</h2>
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-800">MGA 00.000</span>
            <div className="text-right">
              <div className="text-sm text-green-500">MGA 00.000</div>
              <div className="text-sm text-red-500">MGA 00.000</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Activities */}
          <div className="bg-gray-200 rounded-lg p-4 h-48">
            <h3 className="text-center font-medium text-gray-700">Activities</h3>
          </div>

          {/* Receipt Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-gray-200 rounded-lg p-3 text-center">
              <div className="font-medium text-gray-700">Month receipt</div>
              <div className="text-sm text-gray-500">Download</div>
            </button>
            
            <button className="w-full bg-gray-200 rounded-lg p-3 text-center">
              <div className="font-medium text-gray-700">Week receipt</div>
              <div className="text-sm text-gray-500">Download</div>
            </button>
            
            <button className="w-full bg-gray-200 rounded-lg p-3 text-center">
              <div className="font-medium text-gray-700">Day receipt</div>
              <div className="text-sm text-gray-500">Download</div>
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-gray-200 rounded-lg p-4 text-green-500 font-medium shadow-md hover:bg-green-100 hover:scale-105 hover:shadow-lg active:scale-95 active:shadow-sm hover:text-green-600 transition-all duration-200 ease-in-out">
              Depot
            </button>
            
            <button className="w-full bg-gray-200 rounded-lg p-4 text-red-500 font-medium shadow-md hover:bg-red-100 hover:scale-105 hover:shadow-lg active:scale-95 active:shadow-sm hover:text-red-600 transition-all duration-200 ease-in-out">
              Removal
            </button>
          </div>

          {/* Transaction List */}
          <div className="bg-gray-200 rounded-lg p-4 h-32 shadow-md hover:shadow-lg transition-shadow duration-200">
            <h3 className="text-center font-medium text-gray-700">Transaction list</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletTemplate;