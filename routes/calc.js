const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const calculatingNewArtem = require("../back/calculatingNewArtem");
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");
const processingPrice = require("../back/price/processingPrices");
const {join} = require("node:path");
let tableNew
let pricesNew
function readPricesNew() {
    readXlsxFile(fs.createReadStream(join(__dirname, "../data/PricesNEW.xlsx"))).then((rows) => {
        tableNew = rows
        console.log("tableMain reading close with no err");
        pricesNew = processingPrice.processingPricesInTableToPrices(tableNew)
        console.log("цены преобразованы");
    })
}
readPricesNew()
// var sessionStore = 1
// Создание нового заказа
router.post('/pricing', async (req, res) => {
    try {


        let prices = await calculatingNewArtem(req, res, req.body, pricesNew, db.Material)
        res.status(200).json({ message: 'цена:', prices });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при оценке!' });
        console.log(error);
    }
});

// Получение всех заказов (доступно только администратору или менеджеру)
router.get(
    '/',
    authMiddleware,
    roleMiddleware(['admin', 'manager']),
    async (req, res) => {
        try {
            const orders = await db.Order.findAll({
                include: [{ model: db.User, attributes: ['username', 'role'] }],
            });
            res.status(200).json({ orders });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении заказов' });
        }
    }
);

// Получение заказов текущего пользователя
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const orders = await db.Order.findAll({
            where: { userId: req.userId },
        });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении заказов' });
    }
});

module.exports = router;