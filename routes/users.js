const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const userController = require('../controllers/user.controller');

router.put('/change-profile', authMiddleware, userController.changeProfile);

module.exports = router;
