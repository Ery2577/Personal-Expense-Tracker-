import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
    uploadReceipt,
    getReceipt,
    downloadReceipt,
    deleteReceipt
} from '../controllers/receipt.controller.js';

const router = Router();

// Configuration de multer pour l'upload en mémoire
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

/**
 * @swagger
 * tags:
 *   name: Receipts
 *   description: Gestion des reçus/justificatifs de dépenses
 */

/**
 * @swagger
 * /receipts/expenses/{expenseId}/receipt:
 *   post:
 *     summary: Uploader un reçu pour une dépense
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dépense
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               receipt:
 *                 type: string
 *                 format: binary
 *                 description: Fichier du reçu (JPG, PNG ou PDF, max 5MB)
 *     responses:
 *       201:
 *         description: Reçu uploadé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Receipt'
 *       400:
 *         description: Fichier invalide ou dépense non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Dépense non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/expenses/:expenseId/receipt', authenticate, upload.single('receipt'), uploadReceipt);

/**
 * @swagger
 * /receipts/expenses/{expenseId}/receipt:
 *   get:
 *     summary: Récupérer les informations d'un reçu
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dépense
 *     responses:
 *       200:
 *         description: Informations du reçu récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Receipt'
 *       404:
 *         description: Reçu ou dépense non trouvé(e)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/expenses/:expenseId/receipt', authenticate, getReceipt);

/**
 * @swagger
 * /receipts/expenses/{expenseId}/receipt/download:
 *   get:
 *     summary: Télécharger le fichier d'un reçu
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dépense
 *     responses:
 *       200:
 *         description: Fichier du reçu
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Reçu ou fichier non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/expenses/:expenseId/receipt/download', authenticate, downloadReceipt);

/**
 * @swagger
 * /receipts/expenses/{expenseId}/receipt:
 *   delete:
 *     summary: Supprimer un reçu
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dépense
 *     responses:
 *       200:
 *         description: Reçu supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Reçu ou dépense non trouvé(e)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/expenses/:expenseId/receipt', authenticate, deleteReceipt);

export default router;
