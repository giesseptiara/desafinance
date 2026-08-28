const pool = require('../config/database');

async function getPublicSummary(req, res) {
    try {
        const budgetResult = await pool.query(`
            SELECT
                COALESCE(SUM(total_amount), 0) AS total_budget
            FROM budgets
        `);

        const incomeResult = await pool.query(`
            SELECT
                COALESCE(SUM(amount), 0) AS total_income
            FROM incomes
        `);

        const expenseResult = await pool.query(`
            SELECT
                COALESCE(SUM(amount), 0) AS total_expense
            FROM expenses
        `);

        const totalBudget = Number(
            budgetResult.rows[0].total_budget
        );

        const totalIncome = Number(
            incomeResult.rows[0].total_income
        );

        const totalExpense = Number(
            expenseResult.rows[0].total_expense
        );

        const remainingBudget =
            totalBudget - totalExpense;

        res.json({
            success: true,
            data: {
                totalBudget,
                totalIncome,
                totalExpense,
                remainingBudget
            }
        });

    } catch (error) {
        console.error('Public summary error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to load public summary'
        });
    }
}

async function getPublicBudgets(req, res) {
    try {
        const result = await pool.query(`
            SELECT
                id,
                year,
                name,
                total_amount,
                description
            FROM budgets
            ORDER BY year DESC, id DESC
        `);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Public budgets error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to load public budgets'
        });
    }
}

async function getPublicTransactions(req, res) {
    try {
        const { year } = req.query;

        let query = `
            SELECT *
            FROM (
                SELECT
                    i.id,
                    'income' AS type,
                    i.amount,
                    i.description,
                    i.transaction_date,
                    ic.name AS category_name
                FROM incomes i
                LEFT JOIN income_categories ic
                    ON ic.id = i.category_id

                UNION ALL

                SELECT
                    e.id,
                    'expense' AS type,
                    e.amount,
                    e.description,
                    e.transaction_date,
                    ec.name AS category_name
                FROM expenses e
                LEFT JOIN expense_categories ec
                    ON ec.id = e.category_id
            ) transactions
        `;

        const params = [];

        if (year) {
            query += `
                WHERE EXTRACT(YEAR FROM transaction_date) = $1
            `;

            params.push(Number(year));
        }

        query += `
            ORDER BY transaction_date DESC, id DESC
            LIMIT 50
        `;

        const result = await pool.query(query, params);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Public transactions error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to load public transactions'
        });
    }
}

async function getPublicProfile(req, res) {
    try {
        const result = await pool.query(`
            SELECT
                id,
                name,
                code,
                address,
                village_head,
                phone,
                email
            FROM desa_profile
            ORDER BY id ASC
            LIMIT 1
        `);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Village profile not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Public profile error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to load public profile'
        });
    }
}



module.exports = {
    getPublicSummary,
    getPublicBudgets,
    getPublicTransactions,
    getPublicProfile
};