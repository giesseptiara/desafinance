const pool = require('../config/database');

const getIncomeCategories = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, description
            FROM income_categories
            ORDER BY id ASC
        `);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get income categories error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to get income categories'
        });
    }
};

const getExpenseCategories = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, description
            FROM expense_categories
            ORDER BY id ASC
        `);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get expense categories error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to get expense categories'
        });
    }
};

module.exports = {
    getIncomeCategories,
    getExpenseCategories
};