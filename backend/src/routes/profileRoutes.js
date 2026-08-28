const express = require('express');

const {
    getProfile,
    updateProfile
} = require('../controllers/profileController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getProfile);
router.put('/', updateProfile);

module.exports = router;