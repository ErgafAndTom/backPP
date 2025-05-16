const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const roleMiddleware = require('../middlewares/role');
const authMiddleware = require('../middlewares/auth');
const {Op} = require("../back/modelDB");
const { generateInvoiceDocx } = require('../services/document/generate_invoice');
const path = require('path');
const {readdirSync, existsSync} = require("node:fs");

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
    '/create',
    authMiddleware,
    roleMiddleware(['admin', 'operator']),
    async (req, res) => {
        try {
            const formValues = req.body;
            console.log(formValues);
            if (!formValues || typeof formValues !== 'object') {
                return res.status(400).json({ error: 'Некорректные данные формы' });
            }
            console.log('Отправленные данные:', formValues);
            const result = await db.sequelize.transaction(async (t) => {
                const user = await db.User.create(formValues, {
                    transaction: t
                });
                console.log(user.dataValues.id);
                return user;
            });

            if (!result) {
                return res.status(404).json({error: 'Заказ не найден после обновления'});
            }

            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ошибка при создании пользователя' });
        }
    }
);

router.post(
    '/registerInOrder',
    authMiddleware,
    roleMiddleware(['admin', 'operator']),
    async (req, res) => {
        try {
            const { thisOrderId, username, email, phoneNumber, telegram, firstName, lastName, familyName } = req.body;
            const result = await db.sequelize.transaction(async (t) => {
                const user = await db.User.create({ username, email, phoneNumber, telegram, firstName, lastName, familyName }, {
                    transaction: t
                });
                console.log(user.dataValues.id);
                const updatedOrder = await db.Order.update(
                    { clientId: user.dataValues.id },
                    { where: { id: thisOrderId }, transaction: t }
                );
                const order = await db.Order.findOne({
                    where: {id: thisOrderId},
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
                            as: 'executor',
                            attributes: ['username', 'id', 'firstName', "lastName", "familyName", 'email', 'phoneNumber', 'discount', 'telegram', 'photoLink'],
                        },
                        {
                            model: db.User,
                            as: 'client',
                            attributes: ['username', 'id', 'firstName', "lastName", "familyName", 'email', 'phoneNumber', 'discount', 'telegram', 'photoLink'],
                        },
                    ], transaction: t
                });
                if (!order) {
                    return res.status(404).json({error: 'Заказ не найден после обновления'});
                }
                res.status(201).json(order);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ошибка при создании пользователя' });
        }
    }
);

router.put(
    '/OnlyOneField',
    authMiddleware,
    roleMiddleware(['admin']),
    async (req, res) => {
        try {
            const pageNumber = req.body.currentPage; // Номер сторінки (перша сторінка - 1)
            const pageSize = req.body.inPageCount; // Розмір сторінки
            const columnNameForOrder = req.body.columnName.column; // Ім'я колонки для сортування
            const searchString = `%${req.body.search}%`;
            let fieldsForSearch = Object.keys(db.User.rawAttributes);
            let SearchConditions = fieldsForSearch.map(field => ({[field]: {[Op.like]: searchString}}));
            let toColumn = 'ASC'
            if (req.body.columnName.reverse) {
                toColumn = 'DESC'
            }


            const updatedFields = {};
            updatedFields[req.body.tablePosition] = req.body.input
            const [rowsUpdated] = await db.User.update(updatedFields, {
                where: {id: req.body.id},
            });
            console.log(rowsUpdated);
            console.log(req.body.id);
            if (rowsUpdated === 1) {
                const materials = await db.User.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Зсув для поточної сторінки
                    limit: pageSize, // Кількість записів на сторінці
                    where: {
                        [Op.or]: SearchConditions
                    },
                    order: [
                        [columnNameForOrder, toColumn] // Сортування за заданою колонкою
                    ]
                });
                materials.metadata = Object.keys(db.User.rawAttributes);
                console.log(req.body.id);
                res.status(200).json(materials);
            } else {
                res.status(500).json({error: 'Обновлено 0 rows'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Ошибка при обновлении заказа'});
        }
    }
);

router.get("/getprices", async function (req, res) {
    res.send(prices)
})
// router.get("/getUserInfo", authMiddleware,
//     async function (req, res) {
//     try {
//         const { username, password } = req.body;
//         const hash = bcrypt.hashSync(password, 8);
//         const user = await db.User.create({ username, password: hash });
//         res.status(201).json({ message: 'Пользователь создан', user });
//     } catch (error) {
//         res.status(500).json({ error: 'Ошибка при создании пользователя' });
//     }
//     res.send(req.userId)
// })

router.get('/getOneUser/:id', authMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await db.User.findByPk(id, {
            attributes: ['username', 'id', 'firstName', 'lastName', 'familyName', 'email', 'phoneNumber', 'discount', 'telegram', 'photoLink', 'role'],
        });
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении данных пользователя' });
    }
});

//get all users
router.post("/all",
    authMiddleware,
    roleMiddleware(['admin', 'manager', 'operator']),
    async function (req, res) {
    try {
        console.log(req.body);
        const pageNumber = req.body.currentPage; // Номер сторінки (перша сторінка - 1)
        const pageSize = req.body.inPageCount; // Розмір сторінки
        const columnNameForOrder = req.body.columnName.column; // Ім'я колонки для сортування
        const searchString = `%${req.body.search}%`;
        let fieldsForSearch = Object.keys(db.User.rawAttributes);
        let SearchConditions = fieldsForSearch.map(field => ({[field]: {[Op.like]: searchString}}));
        let toColumn = 'ASC'
        if (req.body.columnName.reverse) {
            toColumn = 'DESC'
        }
        console.log(SearchConditions);
        const users = await db.User.findAndCountAll({
            offset: (pageNumber - 1) * pageSize, // Зсув для поточної сторінки
            limit: pageSize, // Кількість записів на сторінці
            where: {
                [Op.or]: SearchConditions
            },
            order: [
                [columnNameForOrder, toColumn] // Сортування за заданою колонкою
            ]
        });
        users.metadata = Object.keys(db.User.rawAttributes);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ошибка отправки' });
    }
})

router.post("/generateDoc1",
    authMiddleware,
    async function (req, res) {
        try {
            const contractorId = req.body.contractorId;
            const thisOrderId = req.body.thisOrderId;

            // console.log(req.body);

            const result = await db.sequelize.transaction(async (t) => {
                const order = await db.Order.findOne({
                    where: {id: thisOrderId},
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
                    ],
                });
                const contractor = await db.Contractor.findOne({
                    where: {id: contractorId},
                });
                const user = await db.User.findOne({
                    where: {id: req.userId},
                    include: [
                        {
                            model: db.Contractor,
                        },
                    ],
                });
                console.log(user.Contractors);
                const supplier = await db.Contractor.findOne({
                    where: {id: 12},
                });

                // console.log(order);
                // console.log(contractor);
                const invoiceData = {
                    invoiceNumber: `2025/00123`,
                    invoiceDate: new Date().toLocaleDateString(),

                    userFio: `${user.role2} ${user.firstName} ${user.lastName} ${user.familyName}`,

                    supplierName: supplier.name,
                    supplierEdrpou: supplier.edrpou,
                    supplierAddress: supplier.address,
                    supplierIBAN: supplier.iban,
                    supplierBankName: supplier.bankName,
                    supplierPhone: supplier.phone,
                    supplierEmail: supplier.email,

                    buyerName: contractor.name,
                    buyerEdrpou: contractor.edrpou,
                    buyerIban: contractor.iban,
                    buyerBankName: contractor.bankName,
                    buyerAddress: contractor.address,
                    buyerPhone: contractor.phone,
                    buyerEmail: contractor.email,

                    paymentReason: 'Оплата згідно договору № 123 від 01.01.2025',

                    products: order.OrderUnits.map((unit, index) => ({
                        index: index + 1,
                        name: unit.name || '—',
                        unit: unit.unit || 'шт.',
                        quantity: unit.amount || 1,
                        price: unit.priceForOneThis || 0,
                        total: (unit.quantity || 1) * (unit.priceForThis || 0)
                    })),

                    totalSum: order.price,
                    vatSum: 9333.33,
                    totalSumWords: 'П\'ятдесят шість тисяч гривень 00 копійок',

                    directorName: 'Іваненко Іван Іванович',
                    accountantName: 'Петренко Петро Петрович'
                };
                try {
                    const templatePath = path.join(__dirname, '../services/document/Rahunok_template.docx');
                    const buffer = generateInvoiceDocx(invoiceData, templatePath);
                    const fileName = `invoice_${invoiceData.invoiceNumber}.docx`;
                    return {
                        buffer: buffer,
                        fileName: fileName
                    }
                } catch (error) {
                    console.error('❌ Помилка при генерації:', error);
                    res.status(500).send('Помилка генерації рахунку');
                }
            });
            res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            // res.status(200).json(result.buffer);

            res.end(result.buffer);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Помилка оновлення' });
        }
    });

router.post("/generateDoc",
    authMiddleware,
    async function (req, res) {
        try {
            const contractorId = req.body.contractorId;
            const thisOrderId = req.body.thisOrderId;

            // console.log(req.body);

            const result = await db.sequelize.transaction(async (t) => {
                const order = await db.Order.findOne({
                    where: {id: thisOrderId},
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
                    ],
                });
                const contractor = await db.Contractor.findOne({
                    where: {id: contractorId},
                });
                const user = await db.User.findOne({
                    where: {id: req.userId},
                    include: [
                        {
                            model: db.Contractor,
                        },
                    ],
                });
                const supplier = await db.Contractor.findOne({
                    where: {id: 1},
                });
                
                // console.log(order);
                // console.log(contractor);
                const invoiceData = {
                    invoiceNumber: `2025/00123`,
                    invoiceDate: new Date().toLocaleDateString(),

                    userFio: `${user.role2} ${user.firstName} ${user.lastName} ${user.familyName}`,

                    supplierName: supplier.name,
                    supplierEdrpou: supplier.edrpou,
                    supplierAddress: supplier.address,
                    supplierIban: supplier.iban,
                    supplierBankName: supplier.bankName,
                    supplierPhone: supplier.phone,
                    supplierEmail: supplier.email,

                    buyerName: contractor.name,
                    buyerEdrpou: contractor.edrpou,
                    buyerIban: contractor.iban,
                    buyerBankName: contractor.bankName,
                    buyerAddress: contractor.address,
                    buyerPhone: contractor.phone,
                    buyerEmail: contractor.email,

                    paymentReason: 'Оплата згідно договору № 123 від 01.01.2025',

                    products: order.OrderUnits.map((unit, index) => ({
                        index: index + 1,
                        name: unit.name || '—',
                        unit: unit.unit || 'шт.',
                        quantity: unit.amount || 1,
                        price: unit.priceForOneThis || 0,
                        total: (unit.quantity || 1) * (unit.priceForThis || 0)
                    })),

                    totalSum: order.price,
                    vatSum: 9333.33,
                    totalSumWords: 'П\'ятдесят шість тисяч гривень 00 копійок',

                    directorName: 'Іваненко Іван Іванович',
                    accountantName: 'Петренко Петро Петрович'
                };
                try {
                    // Абсолютний шлях до директорії з шаблонами
                    const templatesDir = path.resolve(__dirname, '../services/document/');
                    let templatePath;
                    
                    if(contractor.taxSystem === 'загальна система без ПДВ' || contractor.taxSystem === 'загальна система із ПДВ') {
                        templatePath = path.join(templatesDir, 'invoice_template1.docx');
                    } else if(contractor.taxSystem === '1 група'
                        || contractor.taxSystem === '2 група'
                        || contractor.taxSystem === '3 група'
                        || contractor.taxSystem === '3 група із ПДВ'
                        || contractor.taxSystem === '4 група'
                        || contractor.taxSystem === 'Дія.Сіті'
                        || contractor.taxSystem === 'Неприбуткова організація'){
                        templatePath = path.join(templatesDir, 'Akt_template.docx');
                    } else {
                        // За замовчуванням
                        templatePath = path.join(templatesDir, 'Rahunok_template.docx');
                    }
                    
                    console.log('Використовуємо шаблон:', templatePath);
                    // Перевіряємо наявність файлу
                    if (!existsSync(templatePath)) {
                        console.error(`Файл шаблону не знайдено: ${templatePath}`);
                        console.log('Доступні файли в директорії:', readdirSync(templatesDir));
                    }
                    
                    const buffer = generateInvoiceDocx(invoiceData, templatePath);
                    const fileName = `invoice_${invoiceData.invoiceNumber}.docx`;
                    return {
                        buffer: buffer,
                        fileName: fileName
                    }
                } catch (error) {
                    console.error('❌ Помилка при генерації:', error);
                    res.status(500).send('Помилка генерації рахунку');
                }
            });
            res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            // res.status(200).json(result.buffer);

            res.end(result.buffer);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Помилка оновлення' });
        }
    });

module.exports = router;
