const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
    testConnection: async () => {
        try {
            await pool.query('SELECT 1');
            return true;
        } catch (error) {
            console.error('Database connection test failed:', error.message);
            return false;
        }
    }
};
