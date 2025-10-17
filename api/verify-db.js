// API endpoint para verificar la base de datos desde Vercel
// Accede a: https://tu-app.vercel.app/api/verify-db

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req, res) {
    // Solo permitir GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Test 1: Conexión básica
        const connectionTest = await pool.query('SELECT NOW() as current_time, version()');
        
        // Test 2: Contar jugadores
        const playersCount = await pool.query('SELECT COUNT(*) as count FROM players');
        
        // Test 3: Contar partidos
        const matchesCount = await pool.query('SELECT COUNT(*) as count FROM matches');
        
        // Test 4: Últimos jugadores registrados
        const recentPlayers = await pool.query(`
            SELECT id, full_name, jersey_number, position, created_at 
            FROM players 
            ORDER BY created_at DESC 
            LIMIT 5
        `);

        // Test 5: Información de la base de datos
        const dbInfo = await pool.query('SELECT current_database(), current_user');
        
        // Respuesta exitosa
        res.status(200).json({
            status: 'success',
            message: 'Base de datos funcionando correctamente',
            timestamp: new Date().toISOString(),
            database_info: {
                name: dbInfo.rows[0].current_database,
                user: dbInfo.rows[0].current_user,
                current_time: connectionTest.rows[0].current_time,
                version: connectionTest.rows[0].version.split(' ')[1]
            },
            statistics: {
                total_players: parseInt(playersCount.rows[0].count),
                total_matches: parseInt(matchesCount.rows[0].count)
            },
            recent_players: recentPlayers.rows.map(player => ({
                id: player.id,
                name: player.full_name,
                number: player.jersey_number,
                position: player.position,
                registered: player.created_at
            })),
            tests_passed: {
                connection: true,
                players_table: true,
                matches_table: true,
                data_retrieval: true
            }
        });

    } catch (error) {
        console.error('Database verification error:', error);
        
        res.status(500).json({
            status: 'error',
            message: 'Error verificando base de datos',
            error: error.message,
            timestamp: new Date().toISOString(),
            tests_passed: {
                connection: false,
                players_table: false,
                matches_table: false,
                data_retrieval: false
            }
        });
    }
}





