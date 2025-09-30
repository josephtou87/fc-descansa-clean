const { pool } = require('./config/database');

async function setupDatabase() {
    try {
        console.log('🔧 Setting up database tables...');

        // Create players table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS players (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                nickname VARCHAR(100),
                jersey_number INTEGER UNIQUE NOT NULL,
                position VARCHAR(50) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                whatsapp VARCHAR(20) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                photo_url VARCHAR(500),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create matches table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS matches (
                id SERIAL PRIMARY KEY,
                home_team VARCHAR(255) NOT NULL,
                away_team VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                time TIME NOT NULL,
                venue VARCHAR(255) NOT NULL,
                status VARCHAR(50) DEFAULT 'scheduled',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create notifications table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                player_id INTEGER REFERENCES players(id),
                type VARCHAR(50) NOT NULL,
                recipient VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                sent_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create match_confirmations table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS match_confirmations (
                id SERIAL PRIMARY KEY,
                player_id INTEGER REFERENCES players(id),
                match_id INTEGER REFERENCES matches(id),
                status VARCHAR(10) NOT NULL,
                confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(player_id, match_id)
            );
        `);

        console.log('✅ Database tables created or already exist.');

        // Insert sample match if none exists
        const matchCount = await pool.query('SELECT COUNT(*) FROM matches');
        if (parseInt(matchCount.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO matches (home_team, away_team, date, time, venue, status) 
                VALUES ('FC Descansa', 'FC Titanes', '2025-09-28', '08:00:00', 'Cancha del Panteón, Chilapa Alvarez Guerrero', 'scheduled')
            `);
            console.log('✅ Sample match inserted.');
        }

        console.log('🎉 Database setup completed successfully!');
    } catch (error) {
        console.error('❌ Error setting up database:', error);
        throw error;
    }
}

// Run setup if called directly
if (require.main === module) {
    setupDatabase()
        .then(() => {
            console.log('✅ Setup completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Setup failed:', error);
            process.exit(1);
        });
}

module.exports = { setupDatabase };
