export default function Dashboard() {
  return (
    <div className="min-h-full p-6 rounded-xl" style={{
      background: 'linear-gradient(135deg, #a8b876 0%, #9aab6b 50%, #8b9c5d 100%)'
    }}>
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Actual balance</h3>
          <p className="text-lg font-bold text-gray-900">MGA 00.000</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Month expense</h3>
          <p className="text-lg font-bold text-gray-900">MGA 00.000</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Monthly revenue</h3>
          <p className="text-lg font-bold text-gray-900">MGA 00.000</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pie chart</h3>
          <div className="flex justify-center items-center h-48">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Evolution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolution chart</h3>
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-gray-400">Chart placeholder</span>
          </div>
        </div>
      </div>

      {/* Financial Objective Section */}
      <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Financial Objective</h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md">
              "To better manage your finances, this is where you can track your savings with every deposit you make into your piggy bank."
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-gray-700 px-6 py-2 rounded-full font-medium border border-gray-300 hover:bg-gray-50">
                Depot
              </button>
              <button className="bg-white text-gray-700 px-6 py-2 rounded-full font-medium border border-gray-300 hover:bg-gray-50">
                Removal
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-2">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-xs">Objective</span>
              </div>
            </div>
            <span className="text-xs text-gray-600">This time</span>
          </div>
        </div>
      </div>

      {/* Add Expense Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Add my expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 italic">Category :</label>
              <input
                type="text"
                className="w-full p-3 bg-green-200 rounded border-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 italic">Amount :</label>
              <input
                type="text"
                className="w-full p-3 bg-green-200 rounded border-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 italic">Means of payment :</label>
              <input
                type="text"
                className="w-full p-3 bg-green-200 rounded border-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 italic">Description :</label>
              <input
                type="text"
                className="w-full p-3 bg-green-200 rounded border-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 italic">Date :</label>
              <input
                type="text"
                className="w-full p-3 bg-green-200 rounded border-none focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="flex justify-end mt-auto pt-8">
              <button className="bg-green-600 text-white px-8 py-2 rounded font-medium hover:bg-green-700">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
