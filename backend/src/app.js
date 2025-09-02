// ===== 5. backend/src/app.js (Version mise à jour) =====
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Importer les routes
const authRoutes = require('./routes/auth');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialiser la base de données
User.initializeDatabase();

// Database connection pour les tests
const dbPath = path.join(__dirname, '../database/database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
    } else {
        console.log('Base de données SQLite connectée');
    }
});

// Routes
app.use('/api/auth', authRoutes);

// Route de test
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend MoneyTrack connecté avec succès !' });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(` Serveur démarré sur http://localhost:${PORT}`);
});

module.exports = app;