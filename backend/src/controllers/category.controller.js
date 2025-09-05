import CategoryService from '../service/category.service.js';

// Créer une catégorie
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        // Validation simple
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Le nom de la catégorie est requis'
            });
        }

        const category = await CategoryService.createCategory(userId, { name });

        res.status(201).json({
            success: true,
            message: 'Catégorie créée avec succès',
            data: category
        });
    } catch (error) {
        console.error('Erreur création catégorie:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Erreur lors de la création de la catégorie'
        });
    }
};

// Récupérer toutes les catégories (par défaut + utilisateur)
export const getCategories = async (req, res) => {
    try {
        const userId = req.user.id;

        const categories = await CategoryService.getCategoriesByUser(userId);

        res.json({
            success: true,
            data: categories,
            count: categories.length
        });
    } catch (error) {
        console.error('Erreur récupération catégories:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des catégories'
        });
    }
};

// Mettre à jour une catégorie
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const userId = req.user.id;

        const category = await CategoryService.updateCategory(id, userId, { name });

        res.json({
            success: true,
            message: 'Catégorie mise à jour avec succès',
            data: category
        });
    } catch (error) {
        console.error('Erreur mise à jour catégorie:', error);
        res.status(404).json({
            success: false,
            message: error.message || 'Erreur lors de la mise à jour de la catégorie'
        });
    }
};

// Supprimer une catégorie
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await CategoryService.deleteCategory(id, userId);

        res.json({
            success: true,
            message: 'Catégorie supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur suppression catégorie:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Erreur lors de la suppression de la catégorie'
        });
    }
};

// Initialiser les catégories par défaut (fonction utilitaire)
export const initDefaultCategories = async () => {
    try {
        await CategoryService.initDefaultCategories();
    } catch (error) {
        console.error('Erreur initialisation catégories par défaut:', error);
    }
};
