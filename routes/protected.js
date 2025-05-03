const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

router.get('/dashboard', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Добро пожаловать в защищенную область' });
});

module.exports = router;
