const pool = require('../config/database');

async function getDashboard(req, res) {
    try {
        const { year } = req.query;

        let budgetQuery = `
            SELECT COALESCE(SUM(total_amount), 0) AS total_budget
            FROM budgets
        `;

        let incomeQuery = `
            SELECT
                COALESCE(SUM(amount), 0) AS total_income,
                COUNT(*) AS total_income_transactions
            FROM incomes
        `;

        let expenseQuery = `
            SELECT
                COALESCE(SUM(amount), 0) AS total_expense,
                COUNT(*) AS total_expense_transactions
            FROM expenses
        `;

        const queryParams = [];

        if (year) {
            budgetQuery += ` WHERE year = $1`;

            incomeQuery += `
                WHERE EXTRACT(YEAR FROM transaction_date) = $1
            `;

            expenseQuery += `
                WHERE EXTRACT(YEAR FROM transaction_date) = $1
            `;

            queryParams.push(Number(year));
        }

        const budgetResult = await pool.query(
            budgetQuery,
            queryParams
        );

        const incomeResult = await pool.query(
            incomeQuery,
            queryParams
        );

        const expenseResult = await pool.query(
            expenseQuery,
            queryParams
        );

        const totalBudget = Number(
            budgetResult.rows[0].total_budget
        );

        const totalIncome = Number(
            incomeResult.rows[0].total_income
        );

        const totalExpense = Number(
            expenseResult.rows[0].total_expense
        );

        const balance = totalIncome - totalExpense;

        res.json({
            success: true,
            data: {
                year: year ? Number(year) : null,
                totalBudget,
                totalIncome,
                totalExpense,
                balance,
                totalIncomeTransactions:
                    Number(
                        incomeResult.rows[0]
                            .total_income_transactions
                    ),
                totalExpenseTransactions:
                    Number(
                        expenseResult.rows[0]
                            .total_expense_transactions
                    )
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to load dashboard data'
        });
    }
}

module.exports = {
    getDashboard
};