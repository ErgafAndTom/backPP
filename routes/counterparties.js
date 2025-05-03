const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middlewares/auth');
const { Op } = require('sequelize');

// Отримання всіх контрагентів
router.get('/', authMiddleware, async (req, res) => {
    try {
        const contractors = await db.Contractor.findAll({
            where: { userId: req.userId },
            attributes: ['id', 'name', 'edrpou', 'taxSystem', 'address', 'phone', 'email']
        });
        res.status(200).json(contractors);
    } catch (err) {
        console.error('Помилка при отриманні контрагентів:', err);
        res.status(500).json({ error: 'Помилка сервера при отриманні контрагентів' });
    }
});

// Пошук контрагентів за назвою
router.get('/search', authMiddleware, async (req, res) => {
    try {
        const query = req.query.query || '';
        
        const contractors = await db.Contractor.findAll({
            where: {
                userId: req.userId,
                name: {
                    [Op.like]: `%${query}%`
                }
            },
            attributes: ['id', 'name', 'edrpou', 'taxSystem', 'address', 'phone', 'email']
        });
        
        res.status(200).json(contractors);
    } catch (err) {
        console.error('Помилка при пошуку контрагентів:', err);
        res.status(500).json({ error: 'Помилка сервера при пошуку контрагентів' });
    }
});

// Отримання контрагента за ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const contractor = await db.Contractor.findOne({
            where: { 
                id: req.params.id,
                userId: req.userId 
            }
        });
        
        if (!contractor) {
            return res.status(404).json({ error: 'Контрагента не знайдено' });
        }
        
        res.status(200).json(contractor);
    } catch (err) {
        console.error('Помилка при отриманні контрагента:', err);
        res.status(500).json({ error: 'Помилка сервера при отриманні контрагента' });
    }
});

// Створення нового контрагента
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newContractor = await db.Contractor.create({
            ...req.body,
            userId: req.userId
        });
        
        res.status(201).json(newContractor);
    } catch (err) {
        console.error('Помилка при створенні контрагента:', err);
        res.status(500).json({ error: 'Помилка сервера при створенні контрагента' });
    }
});

// Оновлення контрагента
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const contractor = await db.Contractor.findOne({
            where: { 
                id: req.params.id,
                userId: req.userId 
            }
        });
        
        if (!contractor) {
            return res.status(404).json({ error: 'Контрагента не знайдено' });
        }
        
        await contractor.update(req.body);
        
        res.status(200).json(contractor);
    } catch (err) {
        console.error('Помилка при оновленні контрагента:', err);
        res.status(500).json({ error: 'Помилка сервера при оновленні контрагента' });
    }
});

// Видалення контрагента
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const contractor = await db.Contractor.findOne({
            where: { 
                id: req.params.id,
                userId: req.userId 
            }
        });
        
        if (!contractor) {
            return res.status(404).json({ error: 'Контрагента не знайдено' });
        }
        
        await contractor.destroy();
        
        res.status(200).json({ message: 'Контрагента успішно видалено' });
    } catch (err) {
        console.error('Помилка при видаленні контрагента:', err);
        res.status(500).json({ error: 'Помилка сервера при видаленні контрагента' });
    }
});

module.exports = router;
