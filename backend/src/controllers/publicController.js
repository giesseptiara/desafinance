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
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            50
        );

        const offset = (page - 1) * limit;

        const countResult = await pool.query(`
            SELECT COUNT(*) AS total
            FROM budgets
        `);

        const result = await pool.query(`
            SELECT
                id,
                year,
                name,
                total_amount,
                description
            FROM budgets
            ORDER BY year DESC, id DESC
            LIMIT $1 OFFSET $2
        `, [
            limit,
            offset
        ]);

        const total = Number(countResult.rows[0].total);

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
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
        const {
            year,
            type,
            page = 1,
            limit = 10
        } = req.query;

        const currentPage = Math.max(Number(page) || 1, 1);
        const perPage = Math.min(
            Math.max(Number(limit) || 10, 1),
            50
        );

        const offset = (currentPage - 1) * perPage;

        const conditions = [];
        const params = [];

        if (year) {
            params.push(Number(year));
            conditions.push(
                `EXTRACT(YEAR FROM transaction_date) = $${params.length}`
            );
        }

        if (type === 'income' || type === 'expense') {
            params.push(type);
            conditions.push(
                `type = $${params.length}`
            );
        }

        let baseQuery = `
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

        if (conditions.length > 0) {
            baseQuery += `
                WHERE ${conditions.join(' AND ')}
            `;
        }

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM (
                ${baseQuery}
            ) filtered_transactions
        `;

        const countResult = await pool.query(
            countQuery,
            params
        );

        const total = Number(countResult.rows[0].total);

        const dataQuery = `
            ${baseQuery}
            ORDER BY transaction_date DESC, id DESC
            LIMIT $${params.length + 1}
            OFFSET $${params.length + 2}
        `;

        const dataResult = await pool.query(
            dataQuery,
            [...params, perPage, offset]
        );

        const totalPages = Math.ceil(total / perPage);

        res.json({
            success: true,
            data: dataResult.rows,
            pagination: {
                page: currentPage,
                limit: perPage,
                total,
                totalPages
            }
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

async function getPublicTransactionYears(req, res) {
    try {
        const result = await pool.query(`
            SELECT DISTINCT
                EXTRACT(YEAR FROM transaction_date)::INTEGER AS year
            FROM (
                SELECT transaction_date
                FROM incomes

                UNION ALL

                SELECT transaction_date
                FROM expenses
            ) transactions
            ORDER BY year DESC
        `);

        res.json({
            success: true,
            data: result.rows.map((row) => row.year)
        });

    } catch (error) {
        console.error('Public transaction years error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to load transaction years'
        });
    }
}

module.exports = {
    getPublicSummary,
    getPublicBudgets,
    getPublicTransactions,
    getPublicTransactionYears,
    getPublicProfile
};