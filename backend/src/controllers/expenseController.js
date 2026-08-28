const pool = require('../config/database');

const getExpenses = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                e.id,
                e.amount,
                e.description,
                e.transaction_date,
                e.budget_id,
                b.year AS budget_year,
                b.name AS budget_name,
                ec.name AS category_name
            FROM expenses e
            LEFT JOIN budgets b ON b.id = e.budget_id
            LEFT JOIN expense_categories ec ON ec.id = e.category_id
            ORDER BY e.transaction_date DESC, e.id DESC
        `);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get expenses error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to get expenses'
        });
    }
};

const createExpense = async (req, res) => {
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

        const budgetResult = await pool.query(
    `
    SELECT total_amount
    FROM budgets
    WHERE id = $1
    `,
    [budget_id]
);

if (budgetResult.rows.length === 0) {
    return res.status(404).json({
        success: false,
        message: 'Budget not found'
    });
}

const budgetAmount = Number(
    budgetResult.rows[0].total_amount
);

const expenseResult = await pool.query(
    `
    SELECT COALESCE(SUM(amount), 0) AS total_expense
    FROM expenses
    WHERE budget_id = $1
    `,
    [budget_id]
);

const currentExpense = Number(
    expenseResult.rows[0].total_expense
);

const newTotalExpense =
    currentExpense + Number(amount);

if (newTotalExpense > budgetAmount) {
    return res.status(400).json({
        success: false,
        message: 'Total expense exceeds the selected budget'
    });
}

        const result = await pool.query(`
            INSERT INTO expenses
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
            message: 'Expense created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Create expense error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to create expense'
        });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM expenses WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        res.json({
            success: true,
            message: 'Expense deleted successfully'
        });
    } catch (error) {
        console.error('Delete expense error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to delete expense'
        });
    }
};

module.exports = {
    getExpenses,
    createExpense,
    deleteExpense
};