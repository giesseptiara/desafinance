const express = require('express');

const {
    getPublicSummary,
    getPublicBudgets,
    getPublicTransactions
} = require('../controllers/publicController');

const router = express.Router();

router.get('/summary', getPublicSummary);
router.get('/budgets', getPublicBudgets);
router.get('/transactions', getPublicTransactions);

module.exports = router;