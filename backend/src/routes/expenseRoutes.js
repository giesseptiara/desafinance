const express = require('express');

const {
    getExpenses,
    createExpense,
    deleteExpense
} = require('../controllers/expenseController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getExpenses);

router.post('/', authMiddleware, createExpense);

router.delete('/:id', authMiddleware, deleteExpense);

module.exports = router;