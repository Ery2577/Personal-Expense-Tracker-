interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expenseData: {
    category: string;
    amount: string;
    description: string;
    paymentMethod: string;
    date: string;
  };
}

export default function ExpenseModal({ isOpen, onClose, onConfirm, expenseData }: ExpenseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#d7e4b2] to-[#b8cc8a] rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Confirm Expense</h3>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium text-gray-800">{expenseData.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium text-gray-800">MGA {expenseData.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Description:</span>
            <span className="font-medium text-gray-800">{expenseData.description || 'No description'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium text-gray-800">{expenseData.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium text-gray-800">{expenseData.date}</span>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition duration-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
}
