import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

// Fonction utilitaire pour générer un token JWT
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// Fonction utilitaire pour valider l'email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Inscription
export const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Validation des données
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe sont requis'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format d\'email invalide'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Le mot de passe doit contenir au moins 6 caractères'
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }

        // Hasher le mot de passe
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName: firstName || null,
                lastName: lastName || null
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true
            }
        });

        // Générer le token
        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            data: {
                user,
                token
            }
        });

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Connexion
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation des données
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe sont requis'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format d\'email invalide'
            });
        }

        // Trouver l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token
        const token = generateToken(user.id);

        // Retourner les données utilisateur (sans le mot de passe)
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Connexion réussie',
            data: {
                user: userWithoutPassword,
                token
            }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Obtenir le profil utilisateur
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};

// Rafraîchir le token
export const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token requis'
            });
        }

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Générer un nouveau token
        const newToken = generateToken(decoded.userId);

        res.json({
            success: true,
            data: { token: newToken }
        });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: 'Token invalide'
            });
        }

        console.error('Erreur lors du rafraîchissement du token:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};