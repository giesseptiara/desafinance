const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
    '/',
    authenticateToken,
    dashboardController.getDashboard
);

module.exports = router;