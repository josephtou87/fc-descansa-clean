const express = require('express');
const { query } = require('../config/database');

const router = express.Router();

// Get all matches
router.get('/', async (req, res) => {
    try {
        const result = await query(
            'SELECT id, home_team, away_team, date, time, venue, status FROM matches ORDER BY date, time'
        );
        
        const matches = result.rows.map(match => ({
            id: match.id,
            homeTeam: match.home_team,
            awayTeam: match.away_team,
            date: match.date,
            time: match.time,
            venue: match.venue,
            status: match.status
        }));

        res.json({ matches });
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get next match
router.get('/next', async (req, res) => {
    try {
        const result = await query(
            'SELECT id, home_team, away_team, date, time, venue, status FROM matches WHERE date >= CURRENT_DATE ORDER BY date, time LIMIT 1'
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No upcoming matches found' });
        }

        const match = result.rows[0];
        res.json({
            match: {
                id: match.id,
                homeTeam: match.home_team,
                awayTeam: match.away_team,
                date: match.date,
                time: match.time,
                venue: match.venue,
                status: match.status
            }
        });
    } catch (error) {
        console.error('Error fetching next match:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create match
router.post('/', async (req, res) => {
    try {
        const { homeTeam, awayTeam, date, time, venue } = req.body;

        if (!homeTeam || !awayTeam || !date || !time || !venue) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const result = await query(
            `INSERT INTO matches (home_team, away_team, date, time, venue) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, home_team, away_team, date, time, venue, status`,
            [homeTeam, awayTeam, date, time, venue]
        );

        const match = result.rows[0];
        res.status(201).json({
            message: 'Match created successfully',
            match: {
                id: match.id,
                homeTeam: match.home_team,
                awayTeam: match.away_team,
                date: match.date,
                time: match.time,
                venue: match.venue,
                status: match.status
            }
        });
    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update match
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { homeTeam, awayTeam, date, time, venue, status } = req.body;

        // Check if match exists
        const existingMatch = await query('SELECT id FROM matches WHERE id = $1', [id]);
        if (existingMatch.rows.length === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }

        // Update match
        const result = await query(
            `UPDATE matches 
             SET home_team = $1, away_team = $2, date = $3, time = $4, venue = $5, status = $6, updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 
             RETURNING id, home_team, away_team, date, time, venue, status`,
            [homeTeam, awayTeam, date, time, venue, status, id]
        );

        const match = result.rows[0];
        res.json({
            message: 'Match updated successfully',
            match: {
                id: match.id,
                homeTeam: match.home_team,
                awayTeam: match.away_team,
                date: match.date,
                time: match.time,
                venue: match.venue,
                status: match.status
            }
        });
    } catch (error) {
        console.error('Error updating match:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete match
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if match exists
        const existingMatch = await query('SELECT id FROM matches WHERE id = $1', [id]);
        if (existingMatch.rows.length === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }

        // Delete match
        await query('DELETE FROM matches WHERE id = $1', [id]);

        res.json({ message: 'Match deleted successfully' });
    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
