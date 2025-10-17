// API endpoint para ver estadísticas de jugadores en tiempo real
// Accede a: https://tu-app.vercel.app/api/players-stats

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Estadísticas generales
        const generalStats = await pool.query(`
            SELECT 
                COUNT(*) as total_players,
                COUNT(CASE WHEN is_active THEN 1 END) as active_players,
                COUNT(CASE WHEN NOT is_active THEN 1 END) as inactive_players
            FROM players
        `);

        // Jugadores por posición
        const positionStats = await pool.query(`
            SELECT position, COUNT(*) as count 
            FROM players 
            WHERE is_active = true 
            GROUP BY position 
            ORDER BY count DESC
        `);

        // Últimos registros
        const recentRegistrations = await pool.query(`
            SELECT 
                full_name, 
                nickname, 
                jersey_number, 
                position, 
                email,
                created_at 
            FROM players 
            ORDER BY created_at DESC 
            LIMIT 10
        `);

        // Registros por día (últimos 7 días)
        const dailyRegistrations = await pool.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as registrations
            FROM players 
            WHERE created_at >= NOW() - INTERVAL '7 days'
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `);

        // Números de camiseta ocupados
        const occupiedNumbers = await pool.query(`
            SELECT jersey_number 
            FROM players 
            WHERE is_active = true 
            ORDER BY jersey_number
        `);

        res.status(200).json({
            status: 'success',
            timestamp: new Date().toISOString(),
            general_stats: {
                total: parseInt(generalStats.rows[0].total_players),
                active: parseInt(generalStats.rows[0].active_players),
                inactive: parseInt(generalStats.rows[0].inactive_players)
            },
            by_position: positionStats.rows.map(row => ({
                position: row.position,
                count: parseInt(row.count)
            })),
            recent_registrations: recentRegistrations.rows.map(player => ({
                name: player.full_name,
                nickname: player.nickname,
                number: player.jersey_number,
                position: player.position,
                email: player.email,
                registered_at: player.created_at
            })),
            daily_registrations: dailyRegistrations.rows.map(day => ({
                date: day.date,
                count: parseInt(day.registrations)
            })),
            occupied_numbers: occupiedNumbers.rows.map(row => row.jersey_number),
            available_numbers: (() => {
                const occupied = occupiedNumbers.rows.map(row => row.jersey_number);
                const available = [];
                for (let i = 1; i <= 99; i++) {
                    if (!occupied.includes(i)) {
                        available.push(i);
                    }
                }
                return available.slice(0, 20); // Primeros 20 disponibles
            })()
        });

    } catch (error) {
        console.error('Players stats error:', error);
        
        res.status(500).json({
            status: 'error',
            message: 'Error obteniendo estadísticas',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}





