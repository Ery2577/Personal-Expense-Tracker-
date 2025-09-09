interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: {
    id: string;
    amount: number;
    description: string;
    isIncome: boolean;
  } | null;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  transaction, 
  isLoading = false 
}: DeleteConfirmationModalProps) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Delete Transaction
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this {transaction.isIncome ? 'income' : 'expense'}?
          </p>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Type:</span>
              <span className={`font-semibold ${transaction.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.isIncome ? 'Income' : 'Expense'}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="font-semibold">MGA {transaction.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Description:</span>
              <span className="font-medium text-right max-w-48 truncate" title={transaction.description}>
                {transaction.description}
              </span>
            </div>
          </div>

          {/* Warning */}
          <p className="text-sm text-red-600 mb-6">
            This action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition duration-200 cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
