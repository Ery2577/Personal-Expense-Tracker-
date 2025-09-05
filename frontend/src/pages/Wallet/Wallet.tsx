export default function Wallet() {
  return (
    <div className="min-h-screen bg-[#b8cc8a]  p-6">
      {/* Title */}
      <h1 className="text-lg font-bold mb-4">My wallet</h1>

      {/* Balance */}
      <div className="bg-gray-100 p-4 rounded-xl shadow w-full max-w-3xl relative">
        <h2 className="font-bold ">Principal balance</h2>
        <p className="text-lg">MGA 00.000</p>
        <div className="absolute bottom-4 right-4 flex flex-col text-sm text-right">
          <span className="text-green-600">+MGA 00.000</span>
          <span className="text-red-600">-MGA 00.000</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Activities */}
        <div className="bg-gray-100 rounded-xl shadow p-4 h-64">
          <h2 className="font-semibold">Activities</h2>
        </div>

        {/* Receipts */}
        <div className="flex flex-col space-y-4">
          <button className="bg-gray-100 shadow rounded-xl px-4 py-3 text-left hover:bg-gray-200">
            <span className="font-medium">Month receipt</span>
            <br />
            <span className="text-sm text-gray-500">Download</span>
          </button>
          <button className="bg-gray-100 shadow rounded-xl px-4 py-3 text-left hover:bg-gray-200">
            <span className="font-medium">Week receipt</span>
            <br />
            <span className="text-sm text-gray-500">Download</span>
          </button>
          <button className="bg-gray-100 shadow rounded-xl px-4 py-3 text-left hover:bg-gray-200">
            <span className="font-medium">Day receipt</span>
            <br />
            <span className="text-sm text-gray-500">Download</span>
          </button>
        </div>
      </div>

      {/* Bottom Part */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button className="bg-gray-100 shadow rounded-xl py-3 font-semibold text-green-600 hover:bg-green-100">
            Depot
          </button>
          <button className="bg-gray-100 shadow rounded-xl py-3 font-semibold text-red-600 hover:bg-red-100">
            Removal
          </button>
        </div>

        {/* Transaction list */}
        <div className="bg-gray-100 rounded-xl shadow p-4 h-40">
          <h2 className="font-semibold">Transaction list</h2>
        </div>
      </div>
    </div>
  );
}
