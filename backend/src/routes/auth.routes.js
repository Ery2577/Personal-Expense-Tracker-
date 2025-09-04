import { Router } from 'express';
import { register, login, getProfile, refreshToken } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Routes protégées
router.get('/profile', authenticate, getProfile);

export default router;