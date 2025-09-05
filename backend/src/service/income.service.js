import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

class IncomeService {
    // Créer un revenu
    async createIncome(userId, incomeData) {
        const { amount, date, source, description } = incomeData;

        return await prisma.income.create({
            data: {
                amount: parseFloat(amount),
                date: new Date(date),
                source,
                description,
                userId
            }
        });
    }

    // Récupérer tous les revenus d'un utilisateur
    async getIncomesByUser(userId, filters = {}) {
        const { startDate, endDate } = filters;
        const where = { userId };

        // Filtre par date
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        return await prisma.income.findMany({
            where,
            orderBy: {
                date: 'desc'
            }
        });
    }

    // Récupérer un revenu par ID
    async getIncomeById(incomeId, userId) {
        const income = await prisma.income.findFirst({
            where: { id: incomeId, userId }
        });

        if (!income) {
            throw new Error('Revenu non trouvé');
        }

        return income;
    }

    // Mettre à jour un revenu
    async updateIncome(incomeId, userId, updateData) {
        const { amount, date, source, description } = updateData;

        // Vérifier que le revenu existe et appartient à l'utilisateur
        const existingIncome = await prisma.income.findFirst({
            where: { id: incomeId, userId }
        });

        if (!existingIncome) {
            throw new Error('Revenu non trouvé');
        }

        return await prisma.income.update({
            where: { id: incomeId },
            data: {
                amount: amount ? parseFloat(amount) : undefined,
                date: date ? new Date(date) : undefined,
                source: source || undefined,
                description: description !== undefined ? description : undefined
            }
        });
    }

    // Supprimer un revenu
    async deleteIncome(incomeId, userId) {
        // Vérifier que le revenu existe et appartient à l'utilisateur
        const existingIncome = await prisma.income.findFirst({
            where: { id: incomeId, userId }
        });

        if (!existingIncome) {
            throw new Error('Revenu non trouvé');
        }

        return await prisma.income.delete({
            where: { id: incomeId }
        });
    }

    // Récupérer les revenus pour une période (dashboard)
    async getIncomesForPeriod(userId, startDate, endDate) {
        return await prisma.income.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
    }
}

export default new IncomeService();
