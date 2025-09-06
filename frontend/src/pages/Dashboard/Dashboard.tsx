export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7e4b2] to-[#b8cc8a] p-8 space-y-8 rounded-3xl">
      {/* Dashboard Header */}
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide">Dashboard</h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Actual Balance */}
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Actual balance</h3>
          <p className="text-2xl font-extrabold text-gray-900">MGA 00.000</p>
        </div>

        {/* Month Expense (Rouge international) */}
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Month expense</h3>
          <p className="text-2xl font-extrabold text-red-500">MGA 00.000</p>
        </div>

        {/* Monthly Revenue (Vert international) */}
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly revenue</h3>
          <p className="text-2xl font-extrabold text-green-500">MGA 00.000</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Pie chart</h3>
          <div className="flex justify-center items-center h-56">
            <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-28 h-28 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-3">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <div className="w-4 h-4 bg-red-400 rounded-full"></div>
          </div>
        </div>

        {/* Evolution Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Evolution chart</h3>
          <div className="h-56 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-gray-400">Chart placeholder</span>
          </div>
        </div>
      </div>

      {/* Financial Objective Section */}
      <div className="bg-gradient-to-r from-blue-200 to-blue-300 rounded-3xl p-8 shadow-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-4"> Financial Objective</h3>
            <p className="text-sm text-gray-700 mb-6 max-w-md">
              "To better manage your finances, this is where you can track your savings with every deposit you make into your piggy bank."
            </p>
            <div className="flex space-x-4">
              <button className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-2 rounded-full font-semibold shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg">
                Deposit
              </button>
              <button className="bg-gradient-to-r from-red-400 to-red-500 text-white px-6 py-2 rounded-full font-semibold shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg">
                Removal
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-2 shadow-md">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-xs">Objective</span>
              </div>
            </div>
            <span className="text-xs text-gray-700">This time</span>
          </div>
        </div>
      </div>

      {/* Add Expense Section */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        {/* Title */}
        <h3 className="text-2xl font-extrabold text-gray-800 mb-8 flex items-center gap-2">
          <span>Add My Expense</span>
        </h3>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
              <input
                type="text"
                placeholder="e.g. Food, Transport..."
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Amount</label>
              <input
                type="number"
                placeholder="MGA 00.000"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            {/* Means of payment */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Means of Payment</label>
              <select
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              >
                <option>Cash</option>
                <option>Credit Card</option>
                <option>Bank Transfer</option>
                <option>Mobile Money</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
              <textarea
                rows={3}
                placeholder="Add a short note..."
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              ></textarea>
            </div>
          </div>

          {/* Right side */}
          <div className="flex flex-col justify-between space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Date</label>
              <input
                type="date"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
            </div>

            {/* Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-3 rounded-xl font-semibold shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg"
              >
                 Add Expense
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}
