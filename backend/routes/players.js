const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all players
router.get('/', async (req, res) => {
    try {
        const result = await query(
            'SELECT id, full_name, nickname, jersey_number, position, email, whatsapp, photo_url, is_active FROM players ORDER BY jersey_number'
        );
        
        const players = result.rows.map(player => ({
            id: player.id,
            fullName: player.full_name,
            nickname: player.nickname,
            jerseyNumber: player.jersey_number,
            position: player.position,
            email: player.email,
            whatsapp: player.whatsapp,
            photoUrl: player.photo_url,
            isActive: player.is_active
        }));

        res.json({ players });
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get player by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(
            'SELECT id, full_name, nickname, jersey_number, position, email, whatsapp, photo_url, is_active FROM players WHERE id = $1',
            [id]
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
                whatsapp: player.whatsapp,
                photoUrl: player.photo_url,
                isActive: player.is_active
            }
        });
    } catch (error) {
        console.error('Error fetching player:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update player (authenticated)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, nickname, jerseyNumber, position, email, whatsapp, photoUrl } = req.body;

        // Check if player exists
        const existingPlayer = await query('SELECT id FROM players WHERE id = $1', [id]);
        if (existingPlayer.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        // Update player
        const result = await query(
            `UPDATE players 
             SET full_name = $1, nickname = $2, jersey_number = $3, position = $4, email = $5, whatsapp = $6, photo_url = $7, updated_at = CURRENT_TIMESTAMP
             WHERE id = $8 
             RETURNING id, full_name, nickname, jersey_number, position, email, whatsapp, photo_url`,
            [fullName, nickname, jerseyNumber, position, email, whatsapp, photoUrl, id]
        );

        const player = result.rows[0];
        res.json({
            message: 'Player updated successfully',
            player: {
                id: player.id,
                fullName: player.full_name,
                nickname: player.nickname,
                jerseyNumber: player.jersey_number,
                position: player.position,
                email: player.email,
                whatsapp: player.whatsapp,
                photoUrl: player.photo_url
            }
        });
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete player (authenticated)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if player exists
        const existingPlayer = await query('SELECT id FROM players WHERE id = $1', [id]);
        if (existingPlayer.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        // Soft delete (mark as inactive)
        await query('UPDATE players SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);

        res.json({ message: 'Player deleted successfully' });
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get players by position
router.get('/position/:position', async (req, res) => {
    try {
        const { position } = req.params;
        const result = await query(
            'SELECT id, full_name, nickname, jersey_number, position, email, whatsapp, photo_url FROM players WHERE position = $1 AND is_active = true ORDER BY jersey_number',
            [position]
        );

        const players = result.rows.map(player => ({
            id: player.id,
            fullName: player.full_name,
            nickname: player.nickname,
            jerseyNumber: player.jersey_number,
            position: player.position,
            email: player.email,
            whatsapp: player.whatsapp,
            photoUrl: player.photo_url
        }));

        res.json({ players });
    } catch (error) {
        console.error('Error fetching players by position:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
