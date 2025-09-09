import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { expenseService, incomeService, type Expense, type Income } from '../../services/api';
import { useToast } from '../../components/Toast/useToast';
import Toast from '../../components/Toast/Toast';
import { formatDateShort } from '../../utils/formatDate';
import SimpleBarChart from '../../components/Chart/SimpleBarChart';
import { useNavigate } from 'react-router-dom';

export default function Transaction() {
  const { token } = useAuth();
  const { toast, showSuccess, hideToast } = useToast();
  const navigate = useNavigate();
  
  // States
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  // Charger les données
  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      const [expensesRes, incomesRes] = await Promise.all([
        expenseService.getExpenses(token!),
        incomeService.getIncomes(token!)
      ]);
      
      setExpenses(expensesRes.data);
      setIncomes(incomesRes.data);
    } catch (error: any) {
      console.error('Error loading data:', error);
    }
  };

  // Fonction pour filtrer les transactions du mois actuel
  const getCurrentMonthTransactions = (transactions: any[]) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date || transaction.createdAt);
      return transactionDate.getFullYear() === currentYear && 
             transactionDate.getMonth() === currentMonth;
    });
  };

  // Calculer les totaux (tous les temps pour la balance principale)
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const principalBalance = totalIncome - totalExpense;

  // Filtrer les transactions pour le mois actuel
  const currentMonthExpenses = getCurrentMonthTransactions(expenses);
  const currentMonthIncomes = getCurrentMonthTransactions(incomes);

  // Calculer les totaux du mois actuel pour le bar chart
  const monthlyIncome = currentMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
  const monthlyExpense = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyBalance = monthlyIncome - monthlyExpense;

  // Combiner et trier les transactions du mois actuel
  const allTransactions = [
    ...currentMonthExpenses.map(expense => ({
      id: `expense-${expense.id}`,
      date: expense.date,
      description: `${expense.category?.name || 'Uncategorized'}`,
      amount: expense.amount,
      category: expense.category?.name || 'Uncategorized',
      isIncome: false,
      paymentMethod: expense.paymentMethod
    })),
    ...currentMonthIncomes.map(income => ({
      id: `income-${income.id}`,
      date: income.date,
      description: income.source || 'Income',
      amount: income.amount,
      category: 'Income',
      isIncome: true,
      paymentMethod: null
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d7e4b2] to-[#b8cc8a] p-10 space-y-10 font-sans rounded-xl">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-gray-800">Transaction</h1>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Transaction Button */} 
        <button 
          onClick={() => navigate('/dashboard?addExpense=1')}
          className="bg-white px-6 py-4 rounded-2xl shadow-lg font-semibold text-lg text-gray-800 hover:scale-105 transform transition duration-300 hover:shadow-xl cursor-pointer"
        >
          Add transaction
        </button>

        {/* Principal Balance */}
        <div className="bg-white px-8 py-6 rounded-2xl shadow-lg flex items-center justify-between">
          <span className="font-semibold text-gray-700 text-lg">Principal Balance</span> 
          <span className={`text-2xl font-extrabold ${principalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            MGA {principalBalance.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Transaction List - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <span className="px-4 py-2 text-sm bg-green-100 text-green-700 font-medium rounded-xl">
            {allTransactions.length} transactions
          </span>
        </div>

        <div className="overflow-y-auto max-h-80">
          <table className="w-full text-sm text-gray-600 table-auto border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr className="bg-green-200 text-gray-700 rounded-lg">
                <th className="py-3 px-4 text-left rounded-l-lg">Date</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Amount (MGA)</th>
                <th className="py-3 px-4 text-left rounded-r-lg">Category</th>
              </tr>
            </thead>
            <tbody>
              {allTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No transactions this month
                  </td>
                </tr>
              ) : (
                allTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{formatDateShort(transaction.date)}</td>
                    <td className="py-3 px-4 max-w-xs truncate" title={transaction.description}>
                      {transaction.description}
                    </td>
                    <td className={`py-3 px-4 font-semibold ${transaction.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.isIncome ? '+' : '-'} {transaction.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{transaction.category}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Bar Chart Section */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Monthly Overview - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <SimpleBarChart
          expenses={monthlyExpense}
          revenue={monthlyIncome}
          balance={monthlyBalance}
        />
      </div>

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
