import { useState } from 'react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { amount: number; source: string; description: string; date: string }) => void;
}

export default function DepositModal({ isOpen, onClose, onConfirm }: DepositModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.source) return;
    
    onConfirm({
      amount: parseFloat(formData.amount),
      source: formData.source,
      description: formData.description,
      date: formData.date
    });
    
    // Reset form
    setFormData({
      amount: '',
      source: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#d7e4b2] to-[#b8cc8a] rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Add Income (Deposit)</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (MGA) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full p-3 bg-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition cursor-text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source *</label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              placeholder="e.g. Salary, Freelance, Gift..."
              className="w-full p-3 bg-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition cursor-text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Add a note..."
              className="w-full p-3 bg-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition cursor-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-3 bg-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition cursor-pointer"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition duration-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.amount || !formData.source}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
