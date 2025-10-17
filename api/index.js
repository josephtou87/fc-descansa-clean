// API principal para Vercel - Maneja todas las rutas del backend
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar rutas del backend
const authRoutes = require('../backend/routes/auth');
const matchesRoutes = require('../backend/routes/matches');
const playersRoutes = require('../backend/routes/players');
const notificationsRoutes = require('../backend/routes/notifications');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/auth', authRoutes);
app.use('/matches', matchesRoutes);
app.use('/players', playersRoutes);
app.use('/notifications', notificationsRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'FC Descansa API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Ruta raíz de la API
app.get('/', (req, res) => {
    res.json({
        message: 'FC Descansa API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            matches: '/api/matches',
            players: '/api/players',
            notifications: '/api/notifications',
            health: '/api/health'
        }
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error en API:', err);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: err.message 
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        path: req.originalUrl 
    });
});

// Exportar para Vercel
module.exports = app;