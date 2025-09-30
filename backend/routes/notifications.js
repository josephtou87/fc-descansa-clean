const express = require('express');
const { query } = require('../config/database');
const emailService = require('../services/emailService');
const whatsappService = require('../services/whatsappService');

const router = express.Router();

// Send match notifications to all players
router.post('/match', async (req, res) => {
    try {
        const { matchId } = req.body;

        if (!matchId) {
            return res.status(400).json({ error: 'Match ID is required' });
        }

        // Get match details
        const matchResult = await query(
            'SELECT id, home_team, away_team, date, time, venue FROM matches WHERE id = $1',
            [matchId]
        );

        if (matchResult.rows.length === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }

        const match = matchResult.rows[0];
        const matchInfo = {
            date: match.date,
            time: match.time,
            venue: match.venue,
            homeTeam: match.home_team,
            awayTeam: match.away_team
        };

        // Get all active players
        const playersResult = await query(
            'SELECT id, full_name, email, whatsapp FROM players WHERE is_active = true'
        );

        const players = playersResult.rows;
        const notifications = [];

        // Send notifications to all players
        for (const player of players) {
            try {
                // Send email notification
                const emailResult = await emailService.sendMatchNotification(
                    player.email,
                    player.full_name,
                    matchInfo
                );

                // Send WhatsApp notification
                const whatsappResult = await whatsappService.sendMatchNotification(
                    player.whatsapp,
                    player.full_name,
                    matchInfo
                );

                // Log notification
                await query(
                    `INSERT INTO notifications (player_id, type, recipient, message, status, sent_at) 
                     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
                    [
                        player.id,
                        'match_notification',
                        player.email,
                        `Match notification sent for ${matchInfo.date}`,
                        emailResult.success ? 'sent' : 'failed'
                    ]
                );

                notifications.push({
                    playerId: player.id,
                    playerName: player.full_name,
                    email: emailResult,
                    whatsapp: whatsappResult
                });
            } catch (error) {
                console.error(`Error sending notification to player ${player.full_name}:`, error);
                notifications.push({
                    playerId: player.id,
                    playerName: player.full_name,
                    error: error.message
                });
            }
        }

        res.json({
            message: 'Match notifications sent',
            match: matchInfo,
            notifications
        });
    } catch (error) {
        console.error('Error sending match notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Send match reminder (1 hour before)
router.post('/reminder', async (req, res) => {
    try {
        const { matchId } = req.body;

        if (!matchId) {
            return res.status(400).json({ error: 'Match ID is required' });
        }

        // Get match details
        const matchResult = await query(
            'SELECT id, home_team, away_team, date, time, venue FROM matches WHERE id = $1',
            [matchId]
        );

        if (matchResult.rows.length === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }

        const match = matchResult.rows[0];
        const matchInfo = {
            date: match.date,
            time: match.time,
            venue: match.venue,
            homeTeam: match.home_team,
            awayTeam: match.away_team
        };

        // Get all active players
        const playersResult = await query(
            'SELECT id, full_name, email, whatsapp FROM players WHERE is_active = true'
        );

        const players = playersResult.rows;
        const notifications = [];

        // Send reminder notifications
        for (const player of players) {
            try {
                // Send email reminder
                const emailResult = await emailService.sendMatchReminder(
                    player.email,
                    player.full_name,
                    matchInfo
                );

                // Send WhatsApp reminder
                const whatsappResult = await whatsappService.sendMatchReminder(
                    player.whatsapp,
                    player.full_name,
                    matchInfo
                );

                notifications.push({
                    playerId: player.id,
                    playerName: player.full_name,
                    email: emailResult,
                    whatsapp: whatsappResult
                });
            } catch (error) {
                console.error(`Error sending reminder to player ${player.full_name}:`, error);
                notifications.push({
                    playerId: player.id,
                    playerName: player.full_name,
                    error: error.message
                });
            }
        }

        res.json({
            message: 'Match reminders sent',
            match: matchInfo,
            notifications
        });
    } catch (error) {
        console.error('Error sending match reminders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test notification system
router.get('/test', async (req, res) => {
    try {
        // Test email service
        const emailTest = await emailService.sendEmail(
            'test@example.com',
            'Test Email - FC Descansa',
            'This is a test email from FC Descansa notification system.'
        );

        // Test WhatsApp service
        const whatsappTest = await whatsappService.sendMessage(
            '+1234567890',
            'Test WhatsApp message from FC Descansa notification system.'
        );

        res.json({
            message: 'Notification system test completed',
            email: emailTest,
            whatsapp: whatsappTest,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error testing notification system:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test SendGrid configuration
router.get('/test-sendgrid', async (req, res) => {
    try {
        const result = await emailService.sendEmail(
            'test@example.com',
            'SendGrid Test - FC Descansa',
            'This is a test email to verify SendGrid configuration.'
        );

        res.json({
            message: 'SendGrid test completed',
            result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error testing SendGrid:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test Twilio configuration
router.get('/test-twilio', async (req, res) => {
    try {
        const result = await whatsappService.sendMessage(
            '+1234567890',
            'Twilio Test - FC Descansa notification system.'
        );

        res.json({
            message: 'Twilio test completed',
            result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error testing Twilio:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Send test email
router.post('/test-email', async (req, res) => {
    try {
        const { to, subject, message } = req.body;

        if (!to || !subject || !message) {
            return res.status(400).json({ error: 'To, subject, and message are required' });
        }

        const result = await emailService.sendEmail(to, subject, message);

        res.json({
            message: 'Test email sent',
            result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Send test WhatsApp message
router.post('/test-whatsapp', async (req, res) => {
    try {
        const { to, message } = req.body;

        if (!to || !message) {
            return res.status(400).json({ error: 'To and message are required' });
        }

        const result = await whatsappService.sendMessage(to, message);

        res.json({
            message: 'Test WhatsApp message sent',
            result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error sending test WhatsApp message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
