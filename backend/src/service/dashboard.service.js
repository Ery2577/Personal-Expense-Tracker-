import ExpenseService from './expense.service.js';
import IncomeService from './income.service.js';

class DashboardService {
    // Obtenir le résumé financier (dashboard)
    async getFinancialSummary(userId, filters = {}) {
        const { year, month } = filters;

        // Date du début et fin du mois
        const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()), 1);
        const endDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) + 1, 0);

        // Récupérer les revenus du mois
        const incomes = await IncomeService.getIncomesForPeriod(userId, startDate, endDate);

        // Récupérer les dépenses du mois
        const expenses = await ExpenseService.getExpensesForPeriod(userId, startDate, endDate);

        // Calculer les totaux
        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const balance = totalIncome - totalExpenses;

        // Dépenses par catégorie
        const expensesByCategory = expenses.reduce((acc, expense) => {
            const categoryName = expense.category.name;
            if (!acc[categoryName]) {
                acc[categoryName] = 0;
            }
            acc[categoryName] += expense.amount;
            return acc;
        }, {});

        // Statistiques additionnelles
        const stats = {
            totalTransactions: incomes.length + expenses.length,
            averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0,
            averageIncome: incomes.length > 0 ? totalIncome / incomes.length : 0,
            isOverBudget: balance < 0
        };

        return {
            totalIncome,
            totalExpenses,
            balance,
            expensesByCategory,
            stats,
            period: {
                start: startDate,
                end: endDate,
                year: startDate.getFullYear(),
                month: startDate.getMonth() + 1
            }
        };
    }

    // Obtenir les tendances sur plusieurs mois
    async getFinancialTrends(userId, months = 6) {
        const trends = [];
        const currentDate = new Date();

        for (let i = 0; i < months; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const summary = await this.getFinancialSummary(userId, {
                year: date.getFullYear(),
                month: date.getMonth()
            });

            trends.unshift({
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                totalIncome: summary.totalIncome,
                totalExpenses: summary.totalExpenses,
                balance: summary.balance
            });
        }

        return trends;
    }
}

export default new DashboardService();
