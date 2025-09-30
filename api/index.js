const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'FC Descansa API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});

// Mock auth endpoints for testing
app.post('/auth/register', (req, res) => {
    res.json({
        message: 'Mock registration endpoint',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

app.post('/auth/login', (req, res) => {
    res.json({
        message: 'Mock login endpoint',
        status: 'success',
        token: 'mock-jwt-token',
        timestamp: new Date().toISOString()
    });
});

// Mock players endpoint
app.get('/players', (req, res) => {
    res.json({
        players: [],
        message: 'Mock players endpoint',
        timestamp: new Date().toISOString()
    });
});

// Mock matches endpoint
app.get('/matches', (req, res) => {
    res.json({
        matches: [],
        message: 'Mock matches endpoint',
        timestamp: new Date().toISOString()
    });
});

// Mock notifications endpoint
app.post('/notifications/test', (req, res) => {
    res.json({
        message: 'Mock notification test endpoint',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

// Export for Vercel
module.exports = app;
