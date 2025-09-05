import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

class ExpenseService {
    // Créer une dépense
    async createExpense(userId, expenseData) {
        const { amount, date, type, description, startDate, endDate, categoryId } = expenseData;

        // Vérifier que la catégorie existe
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            throw new Error('Catégorie non trouvée');
        }

        return await prisma.expense.create({
            data: {
                amount: parseFloat(amount),
                date: type === 'ONE_TIME' ? new Date(date) : null,
                type: type || 'ONE_TIME',
                description,
                startDate: type === 'RECURRING' ? new Date(startDate) : null,
                endDate: type === 'RECURRING' && endDate ? new Date(endDate) : null,
                userId,
                categoryId
            },
            include: {
                category: true,
                receipt: true
            }
        });
    }

    // Récupérer toutes les dépenses d'un utilisateur
    async getExpensesByUser(userId, filters = {}) {
        const { type, categoryId, startDate, endDate } = filters;
        const where = { userId };

        // Filtres optionnels
        if (type) where.type = type;
        if (categoryId) where.categoryId = categoryId;
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        return await prisma.expense.findMany({
            where,
            include: {
                category: true,
                receipt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    // Récupérer une dépense par ID
    async getExpenseById(expenseId, userId) {
        const expense = await prisma.expense.findFirst({
            where: { id: expenseId, userId },
            include: {
                category: true,
                receipt: true
            }
        });

        if (!expense) {
            throw new Error('Dépense non trouvée');
        }

        return expense;
    }

    // Mettre à jour une dépense
    async updateExpense(expenseId, userId, updateData) {
        const { amount, date, type, description, startDate, endDate, categoryId } = updateData;

        // Vérifier que la dépense existe et appartient à l'utilisateur
        const existingExpense = await prisma.expense.findFirst({
            where: { id: expenseId, userId }
        });

        if (!existingExpense) {
            throw new Error('Dépense non trouvée');
        }

        return await prisma.expense.update({
            where: { id: expenseId },
            data: {
                amount: amount ? parseFloat(amount) : undefined,
                date: type === 'ONE_TIME' && date ? new Date(date) : undefined,
                type: type || undefined,
                description: description !== undefined ? description : undefined,
                startDate: type === 'RECURRING' && startDate ? new Date(startDate) : undefined,
                endDate: type === 'RECURRING' && endDate ? new Date(endDate) : undefined,
                categoryId: categoryId || undefined
            },
            include: {
                category: true,
                receipt: true
            }
        });
    }

    // Supprimer une dépense
    async deleteExpense(expenseId, userId) {
        // Vérifier que la dépense existe et appartient à l'utilisateur
        const existingExpense = await prisma.expense.findFirst({
            where: { id: expenseId, userId }
        });

        if (!existingExpense) {
            throw new Error('Dépense non trouvée');
        }

        return await prisma.expense.delete({
            where: { id: expenseId }
        });
    }

    // Récupérer les dépenses pour une période (dashboard)
    async getExpensesForPeriod(userId, startDate, endDate) {
        return await prisma.expense.findMany({
            where: {
                userId,
                OR: [
                    {
                        type: 'ONE_TIME',
                        date: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    {
                        type: 'RECURRING',
                        startDate: { lte: endDate },
                        OR: [
                            { endDate: null },
                            { endDate: { gte: startDate } }
                        ]
                    }
                ]
            },
            include: {
                category: true
            }
        });
    }
}

export default new ExpenseService();
