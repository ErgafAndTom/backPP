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

router.get("/getprices", async function (req, res) {
    res.send(prices)
})
router.get("/getUserInfo", async function (req, res) {
    res.send(req.userId)
})

router.put(
    '/OneOrder/OneOrderUnitInOrder',
    authMiddleware,
    roleMiddleware(['admin', 'manager']),
    async (req, res) => {
        try {
            let newOrderUnit = req.body.OrderUnit
            let orderId = req.body.orderId
            // let prices = await calculatingNewArtem(req, res, toCalc, pricesNew, db.Material)

            await db.sequelize.transaction(async (t) => {
                const OrderUnit = await db.OrderUnit.update(newOrderUnit, {
                    include: [{
                        model: db.OrderUnitUnit,
                        as: 'OrderUnitUnits'
                    }],
                    where: {id: orderId},
                    transaction: t
                });
            });
            const order = await db.Order.findOne({
                where: {id: orderId},
                include: [
                    {
                        model: db.OrderUnit,
                        as: 'OrderUnits',
                        include: [
                            {
                                model: db.OrderUnitUnit,
                                as: 'OrderUnitUnits',
                            },
                        ],
                    },
                    {
                        model: db.User,
                        as: 'User',
                        attributes: ['username', 'id', 'firstName', 'email', 'phoneNumber', 'discount', 'telegram', 'photoLink'],
                    },
                ],
            });

            if (!order) {
                return res.status(404).json({error: 'Заказ не найден после обновления'});
            }

            // Возвращаем обновленный заказ
            res.status(403).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Ошибка при обновлении заказа'});
        }
    }
);

module.exports = router;