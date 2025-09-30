const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const emailService = require('../services/emailService');
const whatsappService = require('../services/whatsappService');

const router = express.Router();

// Register player
router.post('/register', async (req, res) => {
    try {
        const { fullName, nickname, jerseyNumber, position, email, whatsapp, password } = req.body;

        // Validate required fields
        if (!fullName || !jerseyNumber || !position || !email || !whatsapp || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if email already exists
        const existingEmail = await query('SELECT id FROM players WHERE email = $1', [email]);
        if (existingEmail.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Check if jersey number already exists
        const existingJersey = await query('SELECT id FROM players WHERE jersey_number = $1', [jerseyNumber]);
        if (existingJersey.rows.length > 0) {
            return res.status(400).json({ error: 'Jersey number already taken' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert player
        const result = await query(
            `INSERT INTO players (full_name, nickname, jersey_number, position, email, whatsapp, password_hash) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, full_name, nickname, jersey_number, position, email, whatsapp`,
            [fullName, nickname, jerseyNumber, position, email, whatsapp, passwordHash]
        );

        const player = result.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            { id: player.id, email: player.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Send welcome notifications
        try {
            await emailService.sendWelcomeEmail(player.email, player.full_name);
            await whatsappService.sendWelcomeMessage(player.whatsapp, player.full_name);
        } catch (notificationError) {
            console.error('Error sending welcome notifications:', notificationError);
        }

        res.status(201).json({
            message: 'Player registered successfully',
            player: {
                id: player.id,
                fullName: player.full_name,
                nickname: player.nickname,
                jerseyNumber: player.jersey_number,
                position: player.position,
                email: player.email,
                whatsapp: player.whatsapp
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login player
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find player by email
        const result = await query(
            'SELECT id, full_name, nickname, jersey_number, position, email, whatsapp, password_hash FROM players WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const player = result.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, player.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: player.id, email: player.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            message: 'Login successful',
            player: {
                id: player.id,
                fullName: player.full_name,
                nickname: player.nickname,
                jerseyNumber: player.jersey_number,
                position: player.position,
                email: player.email,
                whatsapp: player.whatsapp
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = await query(
            'SELECT id, full_name, nickname, jersey_number, position, email, whatsapp FROM players WHERE id = $1',
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const player = result.rows[0];
        res.json({
            player: {
                id: player.id,
                fullName: player.full_name,
                nickname: player.nickname,
                jerseyNumber: player.jersey_number,
                position: player.position,
                email: player.email,
                whatsapp: player.whatsapp
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
