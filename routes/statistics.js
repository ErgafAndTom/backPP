const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const roleMiddleware = require('../middlewares/role');
const authMiddleware = require('../middlewares/auth');
const { Op, fn, col, literal } = require("sequelize");

router.post('/get1', async (req, res) => {
    // const { start_date, end_date } = req.query;

    try {
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const totalOrders = await db.Order.count({
            where: {
                createdAt: {
                    [Op.between]: [start_date, end_date],
                },
            },
        });

        const totalSum = await db.Order.sum('price', {
            where: {
                createdAt: {
                    [Op.between]: [start_date, end_date],
                },
            },
        });

        const paidSum = await db.Order.sum('price', {
            where: {
                createdAt: {
                    [Op.between]: [start_date, end_date],
                },
                payStatus: 'pay',
            },
        });

        const unpaidSum = await db.Order.sum('price', {
            where: {
                createdAt: {
                    [Op.between]: [start_date, end_date],
                },
                payStatus: '',
            },
        });

        const unpaidCount = await db.Order.count({
            where: {
                createdAt: {
                    [Op.between]: [start_date, end_date],
                },
                payStatus: '',
            },
        });
        const paidCount = await db.Order.count({
            where: {
                createdAt: {
                    [Op.between]: [start_date, end_date],
                },
                payStatus: 'pay',
            },
        });

        res.status(200).json({
            total_orders: totalOrders || 0,
            total_sum: totalSum || 0,
            paid_sum: paidSum || 0,
            unpaid_sum: unpaidSum || 0,
            unpaid_count: unpaidCount || 0,
            paidCount: paidCount || 0,
        });
    } catch (error) {
        console.error('Помилка отримання статистики:', error);
        res.status(500).send('Помилка отримання статистики');
    }
});

router.post('/getChartData1', async (req, res) => {
    try {
        const { start_date, end_date } = req.body;

        // Группировка по дате (без учета времени)
        const chartData = await db.Order.findAll({
            attributes: [
                [fn('DATE', col('createdAt')), 'date'],
                [fn('sum', col('price')), 'total']
            ],
            where: {
                createdAt: {
                    [Op.between]: [start_date, end_date],
                },
            },
            group: [fn('DATE', col('createdAt'))],
            order: [[literal('date'), 'ASC']]
        });

        // Преобразование данных в нужный формат для графика
        const data = chartData.map(item => ({
            time: item.getDataValue('date'),
            value: parseFloat(item.getDataValue('total'))
        }));

        res.status(200).json(data);
    } catch (error) {
        console.error('Ошибка получения данных для графика:', error);
        res.status(500).send('Ошибка получения данных для графика');
    }
});
router.post('/getChartData2', async (req, res) => {
    try {
        const { start_date, end_date } = req.body;

        const orders = await db.Order.findAll({
            attributes: [
                // Форматируем дату до секунд для отображения
                [fn('DATE_FORMAT', col('createdAt'), '%Y-%m-%d %H:%i:%s'), 'datetime'],
                'price', 'payStatus', 'status',
            ],
            where: {
                createdAt: {
                    [Op.between]: [start_date, end_date],
                },
            },
            order: [[literal('datetime'), 'ASC']]
        });

        // Преобразуем данные для графика, каждая точка соответствует отдельному заказу
        const data = orders.map(item => ({
            time: item.getDataValue('datetime'),
            value: parseFloat(item.getDataValue('price')),
            status: parseFloat(item.getDataValue('status')),
            payStatus: parseFloat(item.getDataValue('payStatus'))
        }));

        res.status(200).json(data);
    } catch (error) {
        console.error('Ошибка получения данных для графика:', error);
        res.status(500).send('Ошибка получения данных для графика');
    }
});

router.post('/getChartData', async (req, res) => {
    try {
        const { start_date, end_date } = req.body;
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const diffInHours = (endDate - startDate) / (1000 * 60 * 60);

        let interval;
        if (diffInHours <= 48) {
            interval = 'HOUR'; // Групуємо по годинам
        } else if (diffInHours <= 144) {
            interval = '12 HOUR'; // Групуємо по півдня
        } else {
            interval = 'DAY'; // Групуємо по дням
        }

        const orders = await db.Order.findAll({
            attributes: [
                [fn('DATE_FORMAT', col('createdAt'), '%Y-%m-%d %H:%i:%s'), 'datetime'],
                [fn('SUM', col('price')), 'total_price'],
                [fn('AVG', col('payStatus')), 'avg_payStatus'],
                [fn('AVG', col('status')), 'avg_status'],
            ],
            where: {
                createdAt: {
                    [Op.between]: [start_date, end_date],
                },
            },
            group: [fn('DATE_FORMAT', col('createdAt'), '%Y-%m-%d %H:%i:%s')],
            order: [[literal('datetime'), 'ASC']]
        });

        const data = orders.map((item, index, arr) => {
            const startTime = item.getDataValue('datetime');
            const nextItem = arr[index + 1];
            const endTime = nextItem ? nextItem.getDataValue('datetime') : endDate.toISOString().slice(0, 19).replace('T', ' ');
            return {
                time: `${startTime}`,
                timeEnd: `${endTime}`,
                value: parseFloat(item.getDataValue('total_price')),
                status: parseFloat(item.getDataValue('avg_status')),
                payStatus: parseFloat(item.getDataValue('avg_payStatus'))
            };
        });

        res.status(200).json(data);
    } catch (error) {
        console.error('Ошибка получения данных для графика:', error);
        res.status(500).send('Ошибка получения данных для графика');
    }
});


router.post('/getSchema', async (req, res) => {
    console.log("getSchema");
    try {
        const models = db.sequelize.models;
        let schema = [];

        // Проходим по всем моделям
        Object.keys(models).forEach(modelName => {
            let model = models[modelName];
            let associations = [];
            // Извлекаем ассоциации модели
            Object.keys(model.associations).forEach(assocKey => {
                let association = model.associations[assocKey];
                associations.push({
                    type: association.associationType, // например, HasMany, BelongsTo, и т.д.
                    target: association.target.name,     // имя связанной модели
                    as: association.as                   // алиас связи
                });
            });
            schema.push({
                table: modelName,
                associations
            });
        });

        res.json(schema);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения схемы базы данных' });
    }
});

module.exports = router;
