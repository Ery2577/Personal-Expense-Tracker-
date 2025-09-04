import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Route temporaire pour les transactions
router.get('/', authenticate, (req, res) => {
    res.json({
        success: true,
        message: 'Routes transactions - À implémenter',
        user: req.user
    });
});

export default router;