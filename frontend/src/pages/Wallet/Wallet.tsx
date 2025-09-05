<<<<<<< HEAD
export default function Wallet(){
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
=======
export default function Wallet() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7e4b2] to-[#b8cc8a] p-8 space-y-8 rounded-3xl">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide"> My Wallet</h1>

      {/* Balance */}
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full relative ">
        <h2 className="font-bold text-gray-700 text-xl mb-2">Principal Balance</h2>
        <p className="text-4xl font-extrabold text-gray-900">MGA 00.000</p>

        <div className="absolute bottom-6 right-8 flex flex-col text-sm text-right space-y-1">
          <span className="text-green-600 font-semibold">+ MGA 00.000</span>
          <span className="text-red-600 font-semibold">- MGA 00.000</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-8">
        {/* Activities*/}
        <div className="bg-white rounded-3xl shadow-xl p-6 h-150 overflow-auto">
          <h2 className="font-bold text-gray-700 text-xl mb-2 "> Activities</h2>
          <table className="w-full text-sm text-gray-600">
            <thead>
              <tr className="border-b text-left text-gray-500 ">
                <th className="pb-2">Date</th>
                <th className="pb-2">Action</th>
                <th className="pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">01/09</td>
                <td>Deposit</td>
                <td className="text-green-600">+ MGA 5000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">02/09</td>
                <td>Purchase</td>
                <td className="text-red-600">- MGA 2000</td>
              </tr>
            </tbody>
          </table>
>>>>>>> b889d49 (Style modification in Wallet page)
        </div>

        {/* Receipts */}
        <div className="flex flex-col space-y-4 items-center justify-center ">
          {["Month receipt", "Week receipt", "Day receipt"].map((label, i) => (
            <button
              key={i}
              className="flex flex-col items-center justify-center bg-white text-gray-900 font-semibold shadow-md rounded-2xl h-24 w-64 max-w-full transition duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <span className="text-base">{label}</span>
              <span className="text-xs opacity-80">Download</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Part */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        {/* Buttons */}
        <div className="flex flex-col gap-4 justify-center items-center font-sans">
          <button className="flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold text-lg shadow-lg rounded-xl h-24 w-64 hover:scale-105 transform transition duration-300">
            Deposit
            <span className="text-sm text-white/80 mt-1">Click to deposit</span>
          </button>
          <button className="flex flex-col items-center justify-center bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold text-lg shadow-lg rounded-xl h-24 w-64 hover:scale-105 transform transition duration-300">
            Removal
            <span className="text-sm text-white/80 mt-1">Click to withdraw</span>
          </button>
        </div>


        {/* Transaction list  */}
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-4xl mx-auto h-150 hover:shadow-2xl transition-all duration-300 overflow-auto">
          <h2 className="font-bold text-gray-700 text-2xl mb-4">Transaction list</h2>
          <table className="w-full text-sm text-gray-600 table-auto">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3">Date</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-4">03/09</td>
                <td>Withdrawal</td>
                <td className="text-red-600">- MGA 1000</td>
              </tr>
              <tr className="border-b">
                <td className="py-4">04/09</td>
                <td>Deposit</td>
                <td className="text-green-600">+ MGA 3000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
};

=======
}
>>>>>>> b889d49 (Style modification in Wallet page)
