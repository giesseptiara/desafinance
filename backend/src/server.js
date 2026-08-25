require('dotenv').config();

const express = require('express');
const pool = require('./config/database');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'DesaFinance API is running'
    });
});

app.listen(PORT, () => {
    console.log(`DesaFinance API running on http://localhost:${PORT}`);
});

app.get('/api/health/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.json({
            success: true,
            message: 'Database connected',
            time: result.rows[0].now
        });
    } catch (error) {
        console.error('Database connection error:', error);

        res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }
});