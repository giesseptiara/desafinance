const express = require('express');

const {
    getPublicSummary,
    getPublicBudgets,
    getPublicTransactions,
    getPublicProfile
} = require('../controllers/publicController');

const router = express.Router();

router.get('/summary', getPublicSummary);
router.get('/budgets', getPublicBudgets);
router.get('/transactions', getPublicTransactions);
router.get('/profile', getPublicProfile);

module.exports = router;