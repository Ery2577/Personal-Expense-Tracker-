import { useState, useEffect, useRef } from 'react';
import { PieChart, EvolutionChart } from '../../components/Chart';
import { incomeService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { categoryService, expenseService, type Category, type CreateExpenseData } from '../../services/api';
import { useToast } from '../../components/Toast/useToast';
import Toast from '../../components/Toast/Toast';
import ExpenseModal from '../../components/Modal/ExpenseModal';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
  const { token } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const location = useLocation();
  
  // State pour le formulaire
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    description: '',
    paymentMethod: 'CASH',
    date: new Date().toISOString().split('T')[0]
  });
  // State pour le modal
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // State pour les données financières
  const [expenses, setExpenses] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [_, setLoadingData] = useState(true);

  // Récupérer les dépenses et revenus
  useEffect(() => {
    if (!token) return;
    setLoadingData(true);
    Promise.all([
      expenseService.getExpenses(token),
      incomeService.getIncomes(token)
    ]).then(([exp, inc]) => {
      setExpenses(exp.data || []);
      setIncomes(inc.data || []);
    }).finally(() => setLoadingData(false));
  }, [token]);

  // Charger les catégories
  useEffect(() => {
    if (token) {
      loadCategories();
    }
  }, [token]);

  // Scroll to Add Expense form if addExpense=1 in the URL
  const addExpenseFormRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('addExpense') === '1' && addExpenseFormRef.current) {
      addExpenseFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [location.search]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories(token!);
      setCategories(response.data);
    } catch (error: any) {
      console.error('Error loading categories:', error);
    }
  };

  // Gérer le changement des inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!formData.categoryId || !formData.amount) {
      showError('Please fill in all required fields');
      return;
    }
    if (parseFloat(formData.amount) <= 0) {
      showError('Amount must be greater than 0');
      return;
    }

    // Validation du balance pour éviter les négatifs
    const currentBalance = totalIncome - totalExpense;
    if (currentBalance - parseFloat(formData.amount) < 0) {
      showError(`Insufficient funds! Current balance: MGA ${currentBalance.toLocaleString()}. Cannot spend MGA ${parseFloat(formData.amount).toLocaleString()}.`);
      return;
    }
    
    // S'assurer qu'il y a une date (utiliser aujourd'hui par défaut)
    if (!formData.date) {
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0]
      }));
    }
    
    setShowModal(true);
  };

  // Gérer le reset du formulaire
  const handleCancelForm = () => {
    setFormData({
      categoryId: '',
      amount: '',
      description: '',
      paymentMethod: 'CASH',
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Confirmer l'ajout de l'expense
  const confirmAddExpense = async () => {
    setIsLoading(true);
    setShowModal(false);

    try {
      // S'assurer que la date n'est pas vide - utiliser la date d'aujourd'hui par défaut
      const dateToUse = formData.date || new Date().toISOString().split('T')[0];
      
      const expenseData: CreateExpenseData = {
        categoryId: formData.categoryId,
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
        paymentMethod: formData.paymentMethod,
        date: dateToUse,
        type: 'ONE_TIME'
      };

      console.log('Sending expense data:', expenseData);

      await expenseService.createExpense(expenseData, token!);
      showSuccess('Expense added successfully!');
      
      // Reset form
      setFormData({
        categoryId: '',
        amount: '',
        description: '',
        paymentMethod: 'CASH',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error: any) {
      showError(error.message || 'Failed to add expense');
    } finally {
      setIsLoading(false);
    }
  };

  // Obtenir le nom de la catégorie sélectionnée
  const getSelectedCategoryName = () => {
    const category = categories.find(cat => cat.id === formData.categoryId);
    return category ? category.name : 'No category selected';
  };

  // Obtenir le nom lisible du moyen de paiement
  const getPaymentMethodName = () => {
    const methods: { [key: string]: string } = {
      'CASH': 'Cash',
      'CREDIT_CARD': 'Credit Card',
      'DEBIT_CARD': 'Debit Card',
      'BANK_TRANSFER': 'Bank Transfer',
      'MOBILE_PAYMENT': 'Mobile Payment',
      'CHECK': 'Check',
      'OTHER': 'Other'
    };
    return methods[formData.paymentMethod] || formData.paymentMethod;
  };


  // Calculs financiers
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const monthIncomes = incomes.filter(i => {
    const d = new Date(i.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const totalExpense = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const totalIncome = incomes.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
  const totalMonthExpense = monthExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const totalMonthIncome = monthIncomes.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
  const actualBalance = totalIncome - totalExpense;

  // Pie chart data (dépenses par catégorie)
  const pieData = categories.map(cat => {
    const value = expenses.filter(e => e.categoryId === cat.id).reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    // Couleur simple basée sur l'index
    const color = [
      '#22c55e', '#ef4444', '#f59e42', '#3b82f6', '#a855f7', '#eab308', '#14b8a6', '#6366f1', '#f43f5e', '#84cc16'
    ][cat.id.charCodeAt(0) % 10];
    return { label: cat.name, value, color };
  }).filter(d => d.value > 0);

  // Evolution chart data (par mois)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth() + 1}`,
      label: d.toLocaleString('default', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth()
    };
  });
  const evolutionData = months.map(m => {
    const expense = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === m.year && d.getMonth() === m.month;
    }).reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const income = incomes.filter(i => {
      const d = new Date(i.date);
      return d.getFullYear() === m.year && d.getMonth() === m.month;
    }).reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
    return { month: m.label, expense, income };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7e4b2] to-[#b8cc8a] p-8 space-y-8 rounded-3xl">
      {/* Dashboard Header */}
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide">Dashboard</h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Actual Balance */}
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Actual balance</h3>
          <p className="text-2xl font-extrabold text-gray-900">MGA {actualBalance.toLocaleString()}</p>
        </div>

        {/* Month Expense (Rouge international) */}
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Month expense</h3>
          <p className="text-2xl font-extrabold text-red-500">MGA {totalMonthExpense.toLocaleString()}</p>
        </div>

        {/* Monthly Revenue (Vert international) */}
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly revenue</h3>
          <p className="text-2xl font-extrabold text-green-500">MGA {totalMonthIncome.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Pie Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Expenses by Category</h3>
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {pieData.length} categories
            </div>
          </div>
          <div className="flex justify-center items-center min-h-[400px]">
            {pieData.length > 0 ? (
              <PieChart data={pieData} />
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <span className="text-gray-400 text-3xl">📊</span>
                </div>
                <p className="text-gray-500 text-base font-medium mb-2">No expenses yet</p>
                <p className="text-gray-400 text-sm">Add some expenses to see the breakdown by category</p>
              </div>
            )}
          </div>
        </div>

        {/* Evolution Chart */}
        <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Financial Evolution</h3>
              <p className="text-sm text-gray-500 mt-1">Last 6 months overview</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></span>
                <span className="text-sm font-medium text-gray-700">Expenses</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></span>
                <span className="text-sm font-medium text-gray-700">Income</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto min-h-[400px] flex items-center justify-center">
            {evolutionData.some(d => d.expense > 0 || d.income > 0) ? (
              <div className="w-full">
                <EvolutionChart data={evolutionData} />
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <span className="text-gray-400 text-3xl">📈</span>
                </div>
                <p className="text-gray-500 text-base font-medium mb-2">No financial data yet</p>
                <p className="text-gray-400 text-sm">Start adding transactions to see your financial evolution</p>
              </div>
            )}
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

  <form ref={addExpenseFormRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition cursor-pointer"
                required
              >
                <option value="">Select a category...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Amount (MGA) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition cursor-text"
                required
              />
            </div>

            {/* Means of payment */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Means of Payment</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition cursor-pointer"
              >
                <option value="CASH">Cash</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="MOBILE_PAYMENT">Mobile Payment</option>
                <option value="CHECK">Check</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Add a short note..."
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition cursor-text"
              ></textarea>
            </div>
          </div>

          {/* Right side */}
          <div className="flex flex-col justify-between space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition cursor-pointer"
                required
              />
            </div>

            {/* Button + Cancel */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !formData.categoryId || !formData.amount}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-3 rounded-xl font-semibold shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Adding...' : 'Add Expense'}
                </button>
                {/* Bouton Cancel visible si un champ est rempli */}
                {(formData.categoryId || formData.amount || formData.description || (formData.paymentMethod && formData.paymentMethod !== 'CASH')) && (
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-8 py-3 rounded-xl font-semibold shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {(!formData.categoryId || !formData.amount) && (
                <p className="text-sm text-gray-500 mt-2">
                  Please select a category and enter an amount
                </p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Expense Confirmation Modal */}
      <ExpenseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmAddExpense}
        expenseData={{
          category: getSelectedCategoryName(),
          amount: formData.amount,
          description: formData.description,
          paymentMethod: getPaymentMethodName(),
          date: formData.date
        }}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
