interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'success' | 'warning';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'success'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return 'from-red-500 to-red-600';
      case 'warning':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-green-500 to-green-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600 mb-8">{message}</p>
        
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition duration-300"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3 bg-gradient-to-r ${getTypeStyles()} text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
