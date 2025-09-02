// ===== 2. backend/src/middleware/auth.js =====
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
    //const token = req.header('Authorization') ? replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};

module.exports = authMiddleware;