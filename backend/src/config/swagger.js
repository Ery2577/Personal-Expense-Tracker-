import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Personal Expense Tracker API',
            version: '1.0.0',
            description: `
                Une API complète pour gérer ses dépenses personnelles.
                
                ## Fonctionnalités
                - Authentification JWT
                - Gestion des dépenses (ponctuelles et récurrentes)
                - Gestion des revenus
                - Catégories personnalisables
                - Upload de reçus/justificatifs
                - Dashboard avec résumés et tendances
                
                ## Authentification
                Toutes les routes (sauf auth) nécessitent un token JWT dans le header:
                \`Authorization: Bearer <your-token>\`
            `,
            contact: {
                name: 'Support API',
                email: 'support@expense-tracker.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
                description: 'Serveur de développement'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        email: { type: 'string', format: 'email' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        userId: { type: 'string', format: 'uuid', nullable: true }
                    }
                },
                Expense: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        amount: { type: 'number', format: 'float' },
                        date: { type: 'string', format: 'date-time', nullable: true },
                        type: { type: 'string', enum: ['ONE_TIME', 'RECURRING'] },
                        description: { type: 'string', nullable: true },
                        startDate: { type: 'string', format: 'date-time', nullable: true },
                        endDate: { type: 'string', format: 'date-time', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        userId: { type: 'string', format: 'uuid' },
                        categoryId: { type: 'string', format: 'uuid' },
                        category: { '$ref': '#/components/schemas/Category' },
                        receipt: { '$ref': '#/components/schemas/Receipt' }
                    }
                },
                Income: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        amount: { type: 'number', format: 'float' },
                        date: { type: 'string', format: 'date-time' },
                        source: { type: 'string' },
                        description: { type: 'string', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        userId: { type: 'string', format: 'uuid' }
                    }
                },
                Receipt: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        fileUrl: { type: 'string' },
                        fileName: { type: 'string' },
                        fileSize: { type: 'integer' },
                        uploadedAt: { type: 'string', format: 'date-time' },
                        expenseId: { type: 'string', format: 'uuid' }
                    }
                },
                FinancialSummary: {
                    type: 'object',
                    properties: {
                        totalIncome: { type: 'number', format: 'float' },
                        totalExpenses: { type: 'number', format: 'float' },
                        balance: { type: 'number', format: 'float' },
                        expensesByCategory: { type: 'object' },
                        stats: {
                            type: 'object',
                            properties: {
                                totalTransactions: { type: 'integer' },
                                averageExpense: { type: 'number', format: 'float' },
                                averageIncome: { type: 'number', format: 'float' },
                                isOverBudget: { type: 'boolean' }
                            }
                        },
                        period: {
                            type: 'object',
                            properties: {
                                start: { type: 'string', format: 'date-time' },
                                end: { type: 'string', format: 'date-time' },
                                year: { type: 'integer' },
                                month: { type: 'integer' }
                            }
                        }
                    }
                },
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: { type: 'object' },
                        count: { type: 'integer' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js'] // Chemin vers les fichiers contenant les annotations Swagger
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
