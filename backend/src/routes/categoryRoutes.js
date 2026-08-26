const express = require('express');

const {
    getIncomeCategories,
    getExpenseCategories
} = require('../controllers/categoryController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/income', authMiddleware, getIncomeCategories);
router.get('/expense', authMiddleware, getExpenseCategories);

module.exports = router;