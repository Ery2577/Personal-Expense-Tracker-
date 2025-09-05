import ReceiptService from '../service/receipt.service.js';

// Uploader un reçu pour une dépense
export const uploadReceipt = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const userId = req.user.id;

        // Vérifier qu'un fichier a été uploadé
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        const receipt = await ReceiptService.uploadReceipt(expenseId, userId, req.file);

        res.status(201).json({
            success: true,
            message: 'Reçu uploadé avec succès',
            data: receipt
        });
    } catch (error) {
        console.error('Erreur upload reçu:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Erreur lors de l\'upload du reçu'
        });
    }
};

// Récupérer un reçu
export const getReceipt = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const userId = req.user.id;

        const receipt = await ReceiptService.getReceipt(expenseId, userId);

        res.json({
            success: true,
            data: receipt
        });
    } catch (error) {
        console.error('Erreur récupération reçu:', error);
        res.status(404).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération du reçu'
        });
    }
};

// Télécharger un fichier de reçu
export const downloadReceipt = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const userId = req.user.id;

        const { filePath, fileName } = await ReceiptService.getReceiptFilePath(expenseId, userId);

        res.download(filePath, fileName);
    } catch (error) {
        console.error('Erreur téléchargement reçu:', error);
        res.status(404).json({
            success: false,
            message: error.message || 'Erreur lors du téléchargement du reçu'
        });
    }
};

// Supprimer un reçu
export const deleteReceipt = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const userId = req.user.id;

        await ReceiptService.deleteReceipt(expenseId, userId);

        res.json({
            success: true,
            message: 'Reçu supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur suppression reçu:', error);
        res.status(404).json({
            success: false,
            message: error.message || 'Erreur lors de la suppression du reçu'
        });
    }
};
