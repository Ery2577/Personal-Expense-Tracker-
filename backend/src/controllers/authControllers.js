// ===== 3. backend/src/controllers/authController.js =====
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
    register: async(req, res) => {
        try {
            const { email, password, name } = req.body;

            // Vérification des champs requis
            if (!email || !password || !name) {
                return res.status(400).json({
                    message: 'Tous les champs sont requis'
                });
            }

            // Vérifier si l'utilisateur existe déjà
            User.findByEmail(email, async(err, existingUser) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Erreur serveur'
                    });
                }

                if (existingUser) {
                    return res.status(400).json({
                        message: 'Cet email est déjà utilisé'
                    });
                }

                // Hasher le mot de passe
                const hashedPassword = await bcrypt.hash(password, 10);

                // Créer l'utilisateur
                User.create({ email, password: hashedPassword, name },
                    (err, user) => {
                        if (err) {
                            return res.status(500).json({
                                message: 'Erreur lors de la création du compte'
                            });
                        }

                        // Générer le token JWT
                        const token = jwt.sign({ userId: user.id },
                            process.env.JWT_SECRET, { expiresIn: '24h' }
                        );

                        res.status(201).json({
                            message: 'Compte créé avec succès',
                            token,
                            user: { id: user.id, email: user.email, name: user.name }
                        });
                    }
                );
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    login: async(req, res) => {
        try {
            const { email, password } = req.body;

            // Vérification des champs requis
            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email et mot de passe requis'
                });
            }

            // Trouver l'utilisateur
            User.findByEmail(email, async(err, user) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Erreur serveur'
                    });
                }

                if (!user) {
                    return res.status(400).json({
                        message: 'Email ou mot de passe incorrect'
                    });
                }

                // Vérifier le mot de passe
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    return res.status(400).json({
                        message: 'Email ou mot de passe incorrect'
                    });
                }

                // Générer le token JWT
                const token = jwt.sign({ userId: user.id },
                    process.env.JWT_SECRET, { expiresIn: '24h' }
                );

                res.json({
                    message: 'Connexion réussie',
                    token,
                    user: { id: user.id, email: user.email, name: user.name }
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    },

    getProfile: (req, res) => {
        User.findById(req.userId, (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur serveur' });
            }

            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            res.json({
                user: { id: user.id, email: user.email, name: user.name }
            });
        });
    }
};

module.exports = authController;