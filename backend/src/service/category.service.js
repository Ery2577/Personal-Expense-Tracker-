import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

class CategoryService {
    // Créer une catégorie
    async createCategory(userId, categoryData) {
        const { name } = categoryData;

        // Vérifier si la catégorie existe déjà pour cet utilisateur
        const existingCategory = await prisma.category.findFirst({
            where: {
                name,
                userId
            }
        });

        if (existingCategory) {
            throw new Error('Cette catégorie existe déjà');
        }

        return await prisma.category.create({
            data: {
                name,
                userId
            }
        });
    }

    // Récupérer toutes les catégories (par défaut + utilisateur)
    async getCategoriesByUser(userId) {
        return await prisma.category.findMany({
            where: {
                OR: [
                    { userId: null }, // Catégories par défaut
                    { userId }        // Catégories de l'utilisateur
                ]
            },
            orderBy: [
                { userId: 'asc' }, // Par défaut en premier
                { name: 'asc' }
            ]
        });
    }

    // Récupérer une catégorie par ID
    async getCategoryById(categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            throw new Error('Catégorie non trouvée');
        }

        return category;
    }

    // Mettre à jour une catégorie
    async updateCategory(categoryId, userId, updateData) {
        const { name } = updateData;

        // Vérifier que la catégorie existe et appartient à l'utilisateur
        const existingCategory = await prisma.category.findFirst({
            where: { id: categoryId, userId }
        });

        if (!existingCategory) {
            throw new Error('Catégorie non trouvée ou vous ne pouvez pas la modifier');
        }

        return await prisma.category.update({
            where: { id: categoryId },
            data: { name }
        });
    }

    // Supprimer une catégorie
    async deleteCategory(categoryId, userId) {
        // Vérifier que la catégorie existe et appartient à l'utilisateur
        const existingCategory = await prisma.category.findFirst({
            where: { id: categoryId, userId }
        });

        if (!existingCategory) {
            throw new Error('Catégorie non trouvée ou vous ne pouvez pas la supprimer');
        }

        // Vérifier s'il y a des dépenses liées à cette catégorie
        const expensesCount = await prisma.expense.count({
            where: { categoryId }
        });

        if (expensesCount > 0) {
            throw new Error('Impossible de supprimer cette catégorie car elle contient des dépenses');
        }

        return await prisma.category.delete({
            where: { id: categoryId }
        });
    }

    // Initialiser les catégories par défaut
    async initDefaultCategories() {
        const defaultCategories = [
            'Alimentation',
            'Transport',
            'Logement',
            'Loisirs',
            'Santé',
            'Vêtements',
            'Éducation',
            'Autres'
        ];

        for (const categoryName of defaultCategories) {
            const existingCategory = await prisma.category.findFirst({
                where: { name: categoryName, userId: null }
            });

            if (!existingCategory) {
                await prisma.category.create({
                    data: {
                        name: categoryName,
                        userId: null
                    }
                });
            }
        }

        console.log('✅ Catégories par défaut initialisées');
    }
}

export default new CategoryService();
