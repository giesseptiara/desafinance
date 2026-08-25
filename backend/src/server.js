require('dotenv').config();

const express = require('express');
const cors = require('cors');

const pool = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const incomeRoutes = require('./routes/incomeRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.json({
            success: true,
            message: 'Database connected',
            time: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/incomes', incomeRoutes);

app.listen(PORT, () => {
    console.log(`DesaFinance API running on http://localhost:${PORT}`);
});