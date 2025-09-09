import ExpenseService from '../service/expense.service.js';
import IncomeService from '../service/income.service.js';
import DashboardService from '../service/dashboard.service.js';

// ========================================
// CONTRÔLEURS POUR LES DÉPENSES
// ========================================

// Créer une dépense
export const createExpense = async (req, res) => {
    try {
        const { amount, date, type, description, startDate, endDate, categoryId, paymentMethod } = req.body;
        const userId = req.user.id;

        // Validation simple
        if (!amount || !categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Amount et categoryId sont requis'
            });
        }

        const expense = await ExpenseService.createExpense(userId, {
            amount, date, type, description, startDate, endDate, categoryId, paymentMethod
        });

        res.status(201).json({
            success: true,
            message: 'Dépense créée avec succès',
            data: expense
        });
    } catch (error) {
        console.error('Erreur création dépense:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la création de la dépense'
        });
    }
};

// Récupérer toutes les dépenses d'un utilisateur
export const getExpenses = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, categoryId, startDate, endDate } = req.query;

        const expenses = await ExpenseService.getExpensesByUser(userId, {
            type, categoryId, startDate, endDate
        });

        res.json({
            success: true,
            data: expenses,
            count: expenses.length
        });
    } catch (error) {
        console.error('Erreur récupération dépenses:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des dépenses'
        });
    }
};

// Récupérer une dépense par ID
export const getExpenseById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const expense = await ExpenseService.getExpenseById(id, userId);

        res.json({
            success: true,
            data: expense
        });
    } catch (error) {
        console.error('Erreur récupération dépense:', error);
        res.status(404).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération de la dépense'
        });
    }
};

// Mettre à jour une dépense
export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, date, type, description, startDate, endDate, categoryId, paymentMethod } = req.body;
        const userId = req.user.id;

        const expense = await ExpenseService.updateExpense(id, userId, {
            amount, date, type, description, startDate, endDate, categoryId, paymentMethod
        });

        res.json({
            success: true,
            message: 'Dépense mise à jour avec succès',
            data: expense
        });
    } catch (error) {
        console.error('Erreur mise à jour dépense:', error);
        res.status(404).json({
            success: false,
            message: error.message || 'Erreur lors de la mise à jour de la dépense'
        });
    }
};

// Supprimer une dépense
export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await ExpenseService.deleteExpense(id, userId);

        res.json({
            success: true,
            message: 'Dépense supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur suppression dépense:', error);
        res.status(404).json({
            success: false,
            message: error.message || 'Erreur lors de la suppression de la dépense'
        });
    }
};

// ========================================
// CONTRÔLEURS POUR LES REVENUS
// ========================================

// Créer un revenu
export const createIncome = async (req, res) => {
    try {
        const { amount, date, source, description } = req.body;
        const userId = req.user.id;

        // Validation simple
        if (!amount || !date || !source) {
            return res.status(400).json({
                success: false,
                message: 'Amount, date et source sont requis'
            });
        }

        const income = await IncomeService.createIncome(userId, {
            amount, date, source, description
        });

        res.status(201).json({
            success: true,
            message: 'Revenu créé avec succès',
            data: income
        });
    } catch (error) {
        console.error('Erreur création revenu:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du revenu'
        });
    }
};

// Récupérer tous les revenus d'un utilisateur
export const getIncomes = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        const incomes = await IncomeService.getIncomesByUser(userId, {
            startDate, endDate
        });

        res.json({
            success: true,
            data: incomes,
            count: incomes.length
        });
    } catch (error) {
        console.error('Erreur récupération revenus:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des revenus'
        });
    }
};

// Mettre à jour un revenu
export const updateIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, date, source, description } = req.body;
        const userId = req.user.id;

        const income = await IncomeService.updateIncome(id, userId, {
            amount, date, source, description
        });

        res.json({
            success: true,
            message: 'Revenu mis à jour avec succès',
            data: income
        });
    } catch (error) {
        console.error('Erreur mise à jour revenu:', error);
        res.status(404).json({
            success: false,
            message: error.message || 'Erreur lors de la mise à jour du revenu'
        });
    }
};

// Supprimer un revenu
export const deleteIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await IncomeService.deleteIncome(id, userId);

        res.json({
            success: true,
            message: 'Revenu supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur suppression revenu:', error);
        res.status(404).json({
            success: false,
            message: error.message || 'Erreur lors de la suppression du revenu'
        });
    }
};

// ========================================
// CONTRÔLEUR POUR LE DASHBOARD
// ========================================

// Obtenir le résumé financier (dashboard)
export const getFinancialSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year, month } = req.query;

        const summary = await DashboardService.getFinancialSummary(userId, { year, month });

        res.json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Erreur résumé financier:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du résumé financier'
        });
    }
};

// Obtenir les tendances financières
export const getFinancialTrends = async (req, res) => {
    try {
        const userId = req.user.id;
        const { months } = req.query;

        const trends = await DashboardService.getFinancialTrends(userId, parseInt(months) || 6);

        res.json({
            success: true,
            data: trends
        });
    } catch (error) {
        console.error('Erreur tendances financières:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des tendances'
        });
    }
};
