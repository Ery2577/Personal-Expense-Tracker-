import app from './app.js';
import CategoryService from './service/category.service.js';

const PORT = process.env.PORT || 5000;

// Initialiser les catégories par défaut au démarrage
CategoryService.initDefaultCategories();

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API available at http://localhost:${PORT}`);
    console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;