import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Gestion propre de la fermeture de la connexion
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

export default prisma;