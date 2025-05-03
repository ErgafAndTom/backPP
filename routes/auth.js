const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const roleMiddleware = require('../middlewares/role');
const authMiddleware = require('../middlewares/auth');

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = bcrypt.hashSync(password, 8);
        const user = await db.User.create({ username, password: hash });
        res.status(201).json({ message: 'Пользователь создан', user });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании пользователя' });
    }
});
router.post(
    '/register',
    authMiddleware,
    roleMiddleware(['admin']),
    async (req, res) => {
        try {
            const { username, password, role } = req.body;
            const hash = bcrypt.hashSync(password, 8);
            const user = await db.User.create({ username, password: hash, role });
            res.status(201).json({ message: 'Пользователь создан', user });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при создании пользователя' });
        }
    }
);

router.post('/login', async (req, res) => {
    try {
        console.log("1");
        const { username, password } = req.body;
        const user = await db.User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Неверный пароль' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            {
                expiresIn: 86400, // 24 часа
            }
        );

        req.session.userId = user.id;

        res.status(200).json({ message: 'Успешный вход', token });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при входе' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ message: 'Выход выполнен' });
    });
});

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await db.User.findByPk(req.userId, {
            attributes: ['username', 'id', 'firstName', 'lastName', 'familyName', 'email', 'phoneNumber', 'discount', 'telegram', 'photoLink', 'role'],
        });
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении данных пользователя' });
    }
});

router.get('/mePay', authMiddleware, async (req, res) => {
    try {
        const user = await db.User.findByPk(req.userId, {
            attributes: ['username', 'id', 'firstName', 'lastName', 'familyName', 'email', 'phoneNumber', 'discount', 'telegram', 'photoLink', 'role'],
        });
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении данных пользователя' });
    }
});

module.exports = router;
