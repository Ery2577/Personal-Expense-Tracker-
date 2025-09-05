import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    createIncome,
    getIncomes,
    updateIncome,
    deleteIncome,
    getFinancialSummary,
    getFinancialTrends
} from '../controllers/transaction.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Gestion des dépenses
 */

/**
 * @swagger
 * tags:
 *   name: Incomes
 *   description: Gestion des revenus
 */

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Résumés financiers et statistiques
 */

// ========================================
// ROUTES POUR LES DÉPENSES
// ========================================

/**
 * @swagger
 * /transactions/expenses:
 *   post:
 *     summary: Créer une nouvelle dépense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - categoryId
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 25.50
 *                 description: Montant de la dépense
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-05T12:00:00Z"
 *                 description: Date de la dépense (pour type ONE_TIME)
 *               type:
 *                 type: string
 *                 enum: [ONE_TIME, RECURRING]
 *                 default: ONE_TIME
 *                 example: "ONE_TIME"
 *               description:
 *                 type: string
 *                 example: "Déjeuner restaurant"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-01T00:00:00Z"
 *                 description: Date de début (pour type RECURRING)
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59Z"
 *                 description: Date de fin (pour type RECURRING, optionnel)
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: "abc123-def456-ghi789"
 *                 description: ID de la catégorie
 *     responses:
 *       201:
 *         description: Dépense créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Expense'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/expenses', authenticate, createExpense);

/**
 * @swagger
 * /transactions/expenses:
 *   get:
 *     summary: Récupérer toutes les dépenses de l'utilisateur
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [ONE_TIME, RECURRING]
 *         description: Filtrer par type de dépense
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début pour la période
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin pour la période
 *     responses:
 *       200:
 *         description: Liste des dépenses récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Expense'
 *                     count:
 *                       type: integer
 */
router.get('/expenses', authenticate, getExpenses);

/**
 * @swagger
 * /transactions/expenses/{id}:
 *   get:
 *     summary: Récupérer une dépense par son ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dépense
 *     responses:
 *       200:
 *         description: Dépense récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Dépense non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/expenses/:id', authenticate, getExpenseById);

/**
 * @swagger
 * /transactions/expenses/{id}:
 *   put:
 *     summary: Modifier une dépense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dépense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 30.00
 *               date:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *                 enum: [ONE_TIME, RECURRING]
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Dépense modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Dépense non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/expenses/:id', authenticate, updateExpense);

/**
 * @swagger
 * /transactions/expenses/{id}:
 *   delete:
 *     summary: Supprimer une dépense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la dépense
 *     responses:
 *       200:
 *         description: Dépense supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Dépense non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/expenses/:id', authenticate, deleteExpense);

// ========================================
// ROUTES POUR LES REVENUS
// ========================================

/**
 * @swagger
 * /transactions/incomes:
 *   post:
 *     summary: Créer un nouveau revenu
 *     tags: [Incomes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - date
 *               - source
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 2500.00
 *                 description: Montant du revenu
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-01T00:00:00Z"
 *                 description: Date du revenu
 *               source:
 *                 type: string
 *                 example: "Salaire"
 *                 description: Source du revenu
 *               description:
 *                 type: string
 *                 example: "Salaire mensuel septembre"
 *                 description: Description optionnelle
 *     responses:
 *       201:
 *         description: Revenu créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Income'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/incomes', authenticate, createIncome);

/**
 * @swagger
 * /transactions/incomes:
 *   get:
 *     summary: Récupérer tous les revenus de l'utilisateur
 *     tags: [Incomes]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début pour la période
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin pour la période
 *     responses:
 *       200:
 *         description: Liste des revenus récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Income'
 *                     count:
 *                       type: integer
 */
router.get('/incomes', authenticate, getIncomes);

/**
 * @swagger
 * /transactions/incomes/{id}:
 *   put:
 *     summary: Modifier un revenu
 *     tags: [Incomes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du revenu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *               date:
 *                 type: string
 *                 format: date-time
 *               source:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Revenu modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Income'
 *       404:
 *         description: Revenu non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/incomes/:id', authenticate, updateIncome);

/**
 * @swagger
 * /transactions/incomes/{id}:
 *   delete:
 *     summary: Supprimer un revenu
 *     tags: [Incomes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du revenu
 *     responses:
 *       200:
 *         description: Revenu supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Revenu non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/incomes/:id', authenticate, deleteIncome);

// ========================================
// ROUTES POUR LE DASHBOARD
// ========================================

/**
 * @swagger
 * /transactions/summary:
 *   get:
 *     summary: Obtenir le résumé financier (dashboard)
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: Année pour le résumé (défaut = année actuelle)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 11
 *           example: 8
 *         description: Mois pour le résumé (0-11, défaut = mois actuel)
 *     responses:
 *       200:
 *         description: Résumé financier récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/FinancialSummary'
 */
router.get('/summary', authenticate, getFinancialSummary);

/**
 * @swagger
 * /transactions/trends:
 *   get:
 *     summary: Obtenir les tendances financières sur plusieurs mois
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 24
 *           default: 6
 *           example: 6
 *         description: Nombre de mois pour les tendances
 *     responses:
 *       200:
 *         description: Tendances financières récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: integer
 *                             example: 9
 *                           year:
 *                             type: integer
 *                             example: 2025
 *                           totalIncome:
 *                             type: number
 *                             format: float
 *                             example: 2500.00
 *                           totalExpenses:
 *                             type: number
 *                             format: float
 *                             example: 1800.00
 *                           balance:
 *                             type: number
 *                             format: float
 *                             example: 700.00
 */
router.get('/trends', authenticate, getFinancialTrends);

export default router;