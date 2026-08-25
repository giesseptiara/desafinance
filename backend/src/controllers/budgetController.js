const pool = require('../config/database');

async function getBudgets(req, res) {
    try {
        const result = await pool.query(`
            SELECT
                id,
                year,
                name,
                total_amount,
                description,
                created_at,
                updated_at
            FROM budgets
            ORDER BY year DESC, id DESC
        `);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get budgets error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to get budgets'
        });
    }
}

async function getBudgetById(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT
                id,
                year,
                name,
                total_amount,
                description,
                created_at,
                updated_at
            FROM budgets
            WHERE id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Get budget error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to get budget'
        });
    }
}

async function createBudget(req, res) {
    try {
        const {
            year,
            name,
            total_amount,
            description
        } = req.body;

        if (!year || !name || total_amount === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Year, name, and total_amount are required'
            });
        }

        const result = await pool.query(`
            INSERT INTO budgets
                (year, name, total_amount, description)
            VALUES
                ($1, $2, $3, $4)
            RETURNING
                id,
                year,
                name,
                total_amount,
                description,
                created_at,
                updated_at
        `, [
            year,
            name,
            total_amount,
            description || null
        ]);

        res.status(201).json({
            success: true,
            message: 'Budget created successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create budget error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to create budget'
        });
    }
}

async function updateBudget(req, res) {
    try {
        const { id } = req.params;

        const {
            year,
            name,
            total_amount,
            description
        } = req.body;

        if (!year || !name || total_amount === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Year, name, and total_amount are required'
            });
        }

        const result = await pool.query(`
            UPDATE budgets
            SET
                year = $1,
                name = $2,
                total_amount = $3,
                description = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING
                id,
                year,
                name,
                total_amount,
                description,
                created_at,
                updated_at
        `, [
            year,
            name,
            total_amount,
            description || null,
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }

        res.json({
            success: true,
            message: 'Budget updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update budget error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to update budget'
        });
    }
}

async function deleteBudget(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            DELETE FROM budgets
            WHERE id = $1
            RETURNING id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }

        res.json({
            success: true,
            message: 'Budget deleted successfully'
        });

    } catch (error) {
        console.error('Delete budget error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to delete budget'
        });
    }
}

module.exports = {
    getBudgets,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget
};