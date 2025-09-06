export default function Transaction() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7e4b2] to-[#b8cc8a] p-10 space-y-10 font-sans rounded-xl">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-gray-800">Transaction</h1>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Transaction Button */}
        <button className="bg-white px-2 py- rounded-2xl shadow-lg font-semibold text-lg text-gray-800 hover:scale-105 transform transition duration-300 hover:shadow-xl">
          Add transaction
        </button>

        {/* Principal Balance */}
        <div className="bg-white px-8 py-6 rounded-2xl shadow-lg flex items-center justify-between">
          <span className="font-semibold text-gray-700 text-lg">Principal Balance</span> 
          <span className="text-2xl font-extrabold text-gray-900">MGA 00.000</span>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Transaction list</h2>
          <button className="px-4 py-2 text-sm bg-green-100 text-green-700 font-medium rounded-xl hover:bg-green-200 transition">
            Sorted by :
          </button>
        </div>

        <table className="w-full text-sm text-gray-600 table-auto border-collapse">
          <thead>
            <tr className="bg-green-200 text-gray-700 rounded-lg">
              <th className="py-3 px-4 text-left rounded-l-lg">Date</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Amount (MGA)</th>
              <th className="py-3 px-4 text-left rounded-r-lg">Category</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50 transition">
              <td className="py-3 px-4">01/09</td>
              <td>Deposit</td>
              <td className="text-green-600 font-semibold">+ 5,000</td>
              <td>Income</td>
            </tr>
            <tr className="border-b hover:bg-gray-50 transition">
              <td className="py-3 px-4">02/09</td>
              <td>Purchase</td>
              <td className="text-red-600 font-semibold">- 2,000</td>
              <td>Expense</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart Section */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6"> Bar chart</h2>
        <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="text-gray-400">[Bar chart placeholder]</span>
        </div>

        {/* Legend */}
        <div className="flex space-x-6 mt-6 justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Expense</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Balance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
