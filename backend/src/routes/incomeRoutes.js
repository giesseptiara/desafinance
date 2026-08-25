const express = require('express');

const {
    getIncomes,
    createIncome,
    deleteIncome
} = require('../controllers/incomeController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getIncomes);

router.post('/', authMiddleware, createIncome);

router.delete('/:id', authMiddleware, deleteIncome);

module.exports = router;