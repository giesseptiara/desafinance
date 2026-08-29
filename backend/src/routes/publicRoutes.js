const express = require('express');

const {
    getPublicSummary,
    getPublicBudgets,
    getPublicTransactions,
    getPublicTransactionYears,
    getPublicProfile
} = require('../controllers/publicController');

const router = express.Router();

router.get('/summary', getPublicSummary);
router.get('/budgets', getPublicBudgets);
router.get('/transactions', getPublicTransactions);
router.get('/profile', getPublicProfile);
router.get('/transaction-years', getPublicTransactionYears);

module.exports = router;