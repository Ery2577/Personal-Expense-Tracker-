import { PrismaClient } from '../../generated/prisma/index.js';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

class ReceiptService {
    constructor() {
        // Créer le dossier uploads s'il n'existe pas
        this.uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }

    // Valider le fichier
    validateFile(file) {
        // Vérifier le type de fichier
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Type de fichier non autorisé. Utilisez JPG, PNG ou PDF');
        }

        // Vérifier la taille du fichier (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Fichier trop volumineux. Maximum 5MB');
        }
    }

    // Uploader un reçu pour une dépense
    async uploadReceipt(expenseId, userId, file) {
        // Vérifier que la dépense existe et appartient à l'utilisateur
        const expense = await prisma.expense.findFirst({
            where: { id: expenseId, userId }
        });

        if (!expense) {
            throw new Error('Dépense non trouvée');
        }

        // Valider le fichier
        this.validateFile(file);

        // Supprimer l'ancien reçu s'il existe
        const existingReceipt = await prisma.receipt.findUnique({
            where: { expenseId }
        });

        if (existingReceipt) {
            // Supprimer l'ancien fichier
            const oldFilePath = path.join(this.uploadsDir, existingReceipt.fileName);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
            // Supprimer l'ancien enregistrement
            await prisma.receipt.delete({
                where: { expenseId }
            });
        }

        // Générer un nom de fichier unique
        const fileExtension = path.extname(file.originalname);
        const fileName = `receipt_${expenseId}_${Date.now()}${fileExtension}`;
        const filePath = path.join(this.uploadsDir, fileName);

        // Sauvegarder le fichier
        fs.writeFileSync(filePath, file.buffer);

        // Créer l'enregistrement dans la base de données
        return await prisma.receipt.create({
            data: {
                fileUrl: `/uploads/${fileName}`,
                fileName,
                fileSize: file.size,
                expenseId
            }
        });
    }

    // Récupérer un reçu
    async getReceipt(expenseId, userId) {
        // Vérifier que la dépense existe et appartient à l'utilisateur
        const expense = await prisma.expense.findFirst({
            where: { id: expenseId, userId }
        });

        if (!expense) {
            throw new Error('Dépense non trouvée');
        }

        const receipt = await prisma.receipt.findUnique({
            where: { expenseId }
        });

        if (!receipt) {
            throw new Error('Reçu non trouvé');
        }

        return receipt;
    }

    // Obtenir le chemin du fichier pour téléchargement
    async getReceiptFilePath(expenseId, userId) {
        const receipt = await this.getReceipt(expenseId, userId);
        const filePath = path.join(this.uploadsDir, receipt.fileName);

        if (!fs.existsSync(filePath)) {
            throw new Error('Fichier non trouvé');
        }

        return { filePath, fileName: receipt.fileName };
    }

    // Supprimer un reçu
    async deleteReceipt(expenseId, userId) {
        const receipt = await this.getReceipt(expenseId, userId);

        // Supprimer le fichier
        const filePath = path.join(this.uploadsDir, receipt.fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Supprimer l'enregistrement
        return await prisma.receipt.delete({
            where: { expenseId }
        });
    }
}

export default new ReceiptService();
