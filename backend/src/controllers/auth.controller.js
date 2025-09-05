import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

// Fonction utilitaire pour générer un token JWT
const generateToken = (userId) => {
    return jwt.sign({ userId },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// Fonction utilitaire pour valider l'email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Inscription
export const register = async(req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Validation des données
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password required'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email Ivalide'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least 6 characters'
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'A user with this email already exists'
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
            message: 'User successfully created',
            data: {
                user,
                token
            }
        });

    } catch (error) {
        console.error('registration error: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Connexion
export const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // Validation des données
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password required'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email invalide'
            });
        }

        // Trouver l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect email or password'
            });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect email or password'
            });
        }

        // Générer le token
        const token = generateToken(user.id);

        // Retourner les données utilisateur (sans le mot de passe)
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Successful connection',
            data: {
                user: userWithoutPassword,
                token
            }
        });

    } catch (error) {
        console.error('Connection error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Obtenir le profil utilisateur
export const getProfile = async(req, res) => {
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
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Error when retrieving profile:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Rafraîchir le token
export const refreshToken = async(req, res) => {
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

        console.error('Error refreshing token:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};