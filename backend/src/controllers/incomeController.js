const pool = require('../config/database');

const getIncomes = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                i.id,
                i.amount,
                i.description,
                i.transaction_date,
                i.budget_id,
                b.year AS budget_year,
                b.name AS budget_name,
                ic.name AS category_name
            FROM incomes i
            LEFT JOIN budgets b ON b.id = i.budget_id
            LEFT JOIN income_categories ic ON ic.id = i.category_id
            ORDER BY i.transaction_date DESC, i.id DESC
        `);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get incomes error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to get incomes'
        });
    }
};

const createIncome = async (req, res) => {
    try {
        const {
            budget_id,
            category_id,
            amount,
            description,
            transaction_date
        } = req.body;

        if (
    !budget_id ||
    !category_id ||
    !amount ||
    Number(amount) <= 0 ||
    !transaction_date
) {
    return res.status(400).json({
        success: false,
        message: 'Budget, category, amount, and transaction date are required, and amount must be greater than 0'
    });
}

        const result = await pool.query(`
            INSERT INTO incomes
                (
                    budget_id,
                    category_id,
                    amount,
                    description,
                    transaction_date
                )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [
            budget_id,
            category_id,
            amount,
            description || null,
            transaction_date
        ]);

        res.status(201).json({
            success: true,
            message: 'Income created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Create income error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to create income'
        });
    }
};

const deleteIncome = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM incomes WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Income not found'
            });
        }

        res.json({
            success: true,
            message: 'Income deleted successfully'
        });
    } catch (error) {
        console.error('Delete income error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to delete income'
        });
    }
};

module.exports = {
    getIncomes,
    createIncome,
    deleteIncome
};