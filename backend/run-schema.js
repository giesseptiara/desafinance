require('dotenv').config();
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : false
});

async function runSchema() {
    try {
        console.log('📦 Running database schema...');

        const schema = fs.readFileSync('./schema.sql', 'utf8');

        await pool.query(schema);

        console.log('✅ Database schema created successfully.');
    } catch (error) {
        console.error('❌ Schema failed:');
        console.error(error);
    } finally {
        await pool.end();
    }
}

runSchema();