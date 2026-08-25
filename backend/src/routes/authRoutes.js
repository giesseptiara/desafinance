const express = require('express');
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authController.login);

router.get('/me', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Authenticated user',
        data: req.user
    });
});

module.exports = router;