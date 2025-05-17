const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const {Op, OrderUnitUnit} = require("../back/modelDB");
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");
const {join, extname, basename} = require("node:path");
const processingPrice = require("../back/price/processingPrices");
const multer = require("multer");
const {toJSON} = require("express-session/session/cookie");


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

// Создание нового заказа
router.post('/create',
    authMiddleware,
    roleMiddleware(['admin', 'manager', "operator"]),
    async (req, res) => {
        try {
            // const fields = req.body.formValues;
            await db.sequelize.transaction(async (t) => {
                const user = await db.User.findOne({
                    where: {id: req.userId},
                    // attributes: ['priceForThis'],
                    transaction: t
                })
                const order = await db.Order.create(
                    {
                        // ...fields,
                        executorId: user.id,
                        clientId: user.id,
                        status: "0",
                        price: "0",
                        prepayment: user.discount,
                        allPrice: "0",
                        deadline: null,
                    },
                    {transaction: t}
                );
                order.update({
                    barcode: `${order.id} ${Date.now()}`,
                })
                const fullOrder = await db.Order.findOne({
                    where: {id: order.id},
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
                    ],
                    transaction: t
                });
                res.status(201).json(fullOrder);
                // console.log(order.dataValues);
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Ошибка при создании заказа'});
        }
    });

// Получение всех заказов (доступно только администратору или менеджеру)
router.post(
    '/all',
    authMiddleware,
    roleMiddleware(['admin', 'manager', "operator"]),
    async (req, res) => {
        try {
            console.log('=== Початок обробки запиту /orders/all ===');
            console.log('Тіло запиту:', JSON.stringify(req.body, null, 2));
            console.log('User ID:', req.userId);
            console.log('User Role:', req.userRole);

            // Валідація та встановлення значень за замовчуванням
            const pageNumber = req.body?.currentPage || 1;
            const pageSize = req.body?.inPageCount || 10;
            const columnNameForOrder = req.body?.columnName?.column || 'id';
            const searchString = `%${req.body?.search || ''}%`;
            const startDate = req.body?.startDate;
            const endDate = req.body?.endDate;

            console.log('Параметри запиту:', {
                pageNumber,
                pageSize,
                columnNameForOrder,
                searchString,
                startDate,
                endDate
            });

            // Підготовка умов пошуку
            let fieldsForSearch = Object.keys(db.Order.rawAttributes);
            console.log('Поля для пошуку:', fieldsForSearch);

            let SearchConditions = fieldsForSearch.map(field => ({[field]: {[Op.like]: searchString}}));
            let toColumn = req.body?.columnName?.reverse ? 'DESC' : 'ASC';

            let whereCondition = {
                [Op.or]: SearchConditions
            };

            console.log('Базова умова WHERE:', JSON.stringify(whereCondition, null, 2));

            // Додаємо умову фільтрації за датою
            if (startDate || endDate) {
                console.log('Додаємо фільтрацію за датою:', {startDate, endDate});
                if (startDate && endDate) {
                    whereCondition.createdAt = {[Op.between]: [startDate, endDate]};
                } else if (startDate) {
                    whereCondition.createdAt = {[Op.gte]: startDate};
                } else if (endDate) {
                    whereCondition.createdAt = {[Op.lte]: endDate};
                }
            }

            // Обробка статусів
            const statusesObj = req.body?.statuses || {};
            let selectedStatuses = [];

            if (statusesObj.status0) selectedStatuses.push("0");
            if (statusesObj.status1) selectedStatuses.push("1");
            if (statusesObj.status2) selectedStatuses.push("2");
            if (statusesObj.status3) selectedStatuses.push("3");
            if (statusesObj.status4) selectedStatuses.push("4");
            if (statusesObj.status5) selectedStatuses.push("Відміна");

            console.log('Вибрані статуси:', selectedStatuses);

            if (selectedStatuses.length > 0) {
                whereCondition.status = {[Op.in]: selectedStatuses};
            }

            console.log('Фінальна умова WHERE:', JSON.stringify(whereCondition, null, 2));
            console.log('Параметри сортування:', {columnNameForOrder, toColumn});

            try {
                console.log('Початок запиту до бази даних...');
                const orders = await db.Order.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize,
                    limit: pageSize,
                    where: whereCondition,
                    include: [
                        {
                            model: db.OrderUnit,
                            as: 'OrderUnits',
                            include: [{
                                model: db.OrderUnitUnit,
                                as: 'OrderUnitUnits'
                            }]
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
                    ],
                    order: [
                        [columnNameForOrder, toColumn]
                    ]
                });

                console.log('Запит успішно виконано');
                console.log('Кількість знайдених замовлень:', orders.count);

                orders.metadata = Object.keys(db.Order.rawAttributes).map(attribute => {
                    const attr = db.Order.rawAttributes[attribute];
                    return {
                        field: attribute,
                        comment: attr.comment || attribute
                    };
                });
                orders.metadataProductUnit = Object.keys(db.OrderUnit.rawAttributes);

                console.log('=== Завершення обробки запиту /orders/all ===');
                res.status(200).json(orders);
            } catch (dbError) {
                console.error('Детальна інформація про помилку бази даних:');
                console.error('Повідомлення:', dbError.message);
                console.error('Стек:', dbError.stack);
                if (dbError.original) {
                    console.error('Оригінальна помилка:', dbError.original);
                }
                if (dbError.sql) {
                    console.error('SQL запит:', dbError.sql);
                }
                if (dbError.parameters) {
                    console.error('Параметри:', dbError.parameters);
                }
                throw dbError;
            }
        } catch (error) {
            console.error('=== Помилка при обробці запиту /orders/all ===');
            console.error('Тип помилки:', error.name);
            console.error('Повідомлення:', error.message);
            console.error('Стек викликів:', error.stack);
            res.status(500).json({
                error: 'Помилка при отриманні замовлень',
                details: error.message
            });
        }
    }
);

router.post(
    '/OneOrder',
    authMiddleware,
    roleMiddleware(['admin', 'manager', "operator"]),
    async (req, res) => {
        try {
            const orderId = parseInt(req.body.id);
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
                        as: 'executor',
                        attributes: ['username', 'id', 'firstName', "lastName", "familyName", 'email', 'phoneNumber', 'discount', 'telegram', 'photoLink'],
                    },
                    {
                        model: db.User,
                        as: 'client',
                        attributes: ['username', 'id', 'firstName', "lastName", "familyName", 'email', 'phoneNumber', 'discount', 'telegram', 'photoLink'],
                    },
                ],
            });
            let w = `req.body.Order${order}`
            if (!order) {
                return res.status(404).json({error: 'Order not found'});
            }
            res.status(200).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Ошибка при получении заказа'});
        }
    }
);

router.delete(
    '/OneOrder/:id',
    authMiddleware,
    roleMiddleware(['admin', 'manager']),
    async (req, res) => {
        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({message: 'ID OrderUnitА не предоставлен'});
            }
            await db.sequelize.transaction(async (t) => {
                const Order = await db.Order.destroy({
                    model: db.OrderUnit,
                    as: 'OrderUnits',
                    include: [
                        {
                            model: db.OrderUnitUnit,
                            as: 'OrderUnitUnits',
                        },
                    ],
                    where: {
                        id: id
                    },
                    transaction: t
                });
                res.status(200).json(Order)
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Ошибка при удалении заказа'});
        }
    }
);

router.put(
    '/OneOrder/discount',
    authMiddleware,
    roleMiddleware(['admin', 'manager', "operator"]),
    async (req, res) => {
        try {
            let orderId = req.body.orderId
            let newDiscount = req.body.newDiscound

            await db.sequelize.transaction(async (t) => {
                const order = await db.Order.findOne({
                    where: {id: orderId},
                    // attributes: ['priceForThis'],
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
                    transaction: t
                })
                // await Promise.all(order.OrderUnits.map(async OrderUnit => {
                //     await db.OrderUnit.update(
                //         {
                //             priceForOneThisDiscount: (OrderUnit.priceForOneThis * (1 - parseInt(newDiscount) / 100)).toFixed(2),
                //             priceForThisDiscount: (OrderUnit.priceForThis * (1 - parseInt(newDiscount) / 100)).toFixed(2),
                //         },
                //         { where: { idKey: OrderUnit.idKey }, transaction: t }
                //     );
                //     await Promise.all(OrderUnit.OrderUnitUnits.map(OrderUnitUnit =>
                //         db.OrderUnitUnit.update(
                //             {
                //                 priceForOneThisDiscount: (OrderUnitUnit.priceForOneThis * (1 - parseInt(newDiscount) / 100)).toFixed(2),
                //                 priceForThisDiscount: (OrderUnitUnit.priceForThis * (1 - parseInt(newDiscount) / 100)).toFixed(2),
                //                 priceForAllThisDiscount: (OrderUnitUnit.priceForAllThis * (1 - parseInt(newDiscount) / 100)).toFixed(2),
                //             },
                //             { where: { idKey: OrderUnitUnit.idKey }, transaction: t }
                //         )
                //     ));
                // }));
                await Promise.all(order.OrderUnits.map(async OrderUnit => {
                    await db.OrderUnit.update(
                        {
                            priceForOneThisDiscount: calcSumPriceAndAllPrice(parseFloat(OrderUnit.priceForOneThis), newDiscount),
                            priceForThisDiscount: calcSumPriceAndAllPrice(parseFloat(OrderUnit.priceForThis), newDiscount),
                        },
                        { where: { idKey: OrderUnit.idKey }, transaction: t }
                    );
                    await Promise.all(OrderUnit.OrderUnitUnits.map(OrderUnitUnit =>
                        db.OrderUnitUnit.update(
                            {
                                priceForOneThisDiscount: calcSumPriceAndAllPrice(parseFloat(OrderUnitUnit.priceForOneThis), newDiscount),
                                priceForThisDiscount: calcSumPriceAndAllPrice(parseFloat(OrderUnitUnit.priceForThis), newDiscount),
                                priceForAllThisDiscount: calcSumPriceAndAllPrice(parseFloat(OrderUnitUnit.priceForAllThis), newDiscount),
                            },
                            { where: { idKey: OrderUnitUnit.idKey }, transaction: t }
                        )
                    ));
                }));
                let allPrice = calcSumPriceAndAllPrice(parseFloat(order.price), newDiscount)


                await db.Order.update(
                    {prepayment: newDiscount, allPrice: allPrice},
                    {where: {id: orderId}, transaction: t}
                );
                const orderAfterAll = await db.Order.findOne({
                    where: {id: orderId},
                    attributes: ['prepayment', 'allPrice'],
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
                    transaction: t
                });
                if (!orderAfterAll) {
                    return res.status(404).json({error: 'Заказ не найден после обновления'});
                }
                res.status(200).json(orderAfterAll);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Ошибка при обновлении заказа'});
        }
    }
);
router.put(
    '/OneOrder/user',
    authMiddleware,
    roleMiddleware(['admin', 'manager, "operator"']),
    async (req, res) => {
        try {
            let orderId = req.body.orderId
            let clientId = req.body.userId

            await db.sequelize.transaction(async (t) => {
                const order = await db.Order.findOne({
                    where: {id: orderId},
                    // attributes: ['priceForThis'],
                    transaction: t
                })
                await db.Order.update(
                    {clientId: clientId},
                    {where: {id: orderId}, transaction: t}
                );
                const orderAfterAll = await db.Order.findOne({
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
                            as: 'executor',
                            attributes: ['username', 'id', 'firstName', "lastName", "familyName", 'email', 'phoneNumber', 'discount', 'telegram', 'photoLink'],
                        },
                        {
                            model: db.User,
                            as: 'client',
                            attributes: ['username', 'id', 'firstName', "lastName", "familyName", 'email', 'phoneNumber', 'discount', 'telegram', 'photoLink'],
                        },
                    ],
                    transaction: t
                });
                if (!orderAfterAll) {
                    return res.status(404).json({error: 'Заказ не найден после обновления'});
                }
                res.status(200).json(orderAfterAll);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Ошибка при обновлении заказа'});
        }
    }
);

router.put(
    '/OneOrder/OnlyOneField',
    authMiddleware,
    roleMiddleware(['admin', 'manager', "operator"]),
    async (req, res) => {
        try {
            const pageNumber = req.body.currentPage; // Номер сторінки (перша сторінка - 1)
            const pageSize = req.body.inPageCount; // Розмір сторінки
            const columnNameForOrder = req.body.columnName.column; // Ім'я колонки для сортування
            const searchString = `%${req.body.search}%`;
            let fieldsForSearch = Object.keys(db.Order.rawAttributes);
            let SearchConditions = fieldsForSearch.map(field => ({[field]: {[Op.like]: searchString}}));
            let toColumn = 'ASC'
            if (req.body.columnName.reverse) {
                toColumn = 'DESC'
            }


            const updatedFields = {};
            updatedFields[req.body.tablePosition] = req.body.input
            const [rowsUpdated] = await db.Order.update(updatedFields, {
                where: {id: req.body.id},
            });
            if (rowsUpdated === 1) {
                const orders = await db.Order.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Зсув для поточної сторінки
                    limit: pageSize, // Кількість записів на сторінці
                    where: {
                        [Op.or]: SearchConditions
                    },
                    include: [
                        {
                            model: db.OrderUnit,
                            as: 'OrderUnits',
                            include: [{
                                model: db.OrderUnitUnit,
                                as: 'OrderUnitUnits'
                            }]
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
                    ],
                    order: [
                        [columnNameForOrder, toColumn] // Сортування за заданою колонкою
                    ]
                });
                orders.metadata = Object.keys(db.Order.rawAttributes);
                orders.metadataProductUnit = Object.keys(db.OrderUnit.rawAttributes);

                res.status(200).json(orders);
            } else {
                res.status(500).json({error: 'Обновлено 0 rows'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Ошибка при обновлении заказа'});
        }
    }
);

router.put(
    '/OneOrder/AllFieldsAndContains',
    authMiddleware, // Проверка аутентификации
    roleMiddleware(['admin', 'manager', "operator"]), // Проверка роли пользователя
    async (req, res) => {
        const {newOrder} = req.body;
        const orderId = newOrder.id;

        // Начало транзакции
        const transaction = await db.sequelize.transaction();

        try {
            // Получаем существующий заказ с его OrderUnits и OrderUnitUnits
            let existingOrderUnits = await db.OrderUnit.findAll({where: {orderId: orderId}});

            const existingOrder = await db.Order.findOne({
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
                ],
                transaction,
                // lock: transaction.LOCK.UPDATE, // Блокировка записи для предотвращения гонок
            });

            if (!existingOrder) {
                await transaction.rollback();
                return res.status(404).json({message: 'Заказ не найден'});
            }

            // Обновляем основные поля заказа
            await existingOrder.update(newOrder, {transaction});

            // Создаем мапы для существующих OrderUnits и OrderUnitUnits для быстрого доступа
            const existingOrderUnitsMap = new Map();
            existingOrder.OrderUnits.forEach((unit) => {
                existingOrderUnitsMap.set(unit.idKey, unit);
            });

            // Итерация по входящим OrderUnits
            for (const incomingUnit of newOrder.OrderUnits || []) {
                const {idKey, OrderUnitUnits, ...unitData} = incomingUnit;

                let orderUnit;
                if (idKey && existingOrderUnitsMap.has(idKey)) {
                    // Обновляем существующий OrderUnit
                    orderUnit = existingOrderUnitsMap.get(idKey);
                    await orderUnit.update(unitData, {transaction});
                    existingOrderUnitsMap.delete(idKey); // Отмечаем как обработанный
                } else {
                    // Создаем новый OrderUnit
                    orderUnit = await db.OrderUnit.create(
                        {
                            ...unitData,
                            orderId: existingOrder.id,
                            idKey: incomingUnit.idKey, // Устанавливаем idKey при создании
                        },
                        {transaction}
                    );
                }

                // Обработка OrderUnitUnits внутри текущего OrderUnit
                if (OrderUnitUnits && Array.isArray(OrderUnitUnits)) {
                    // Получаем существующие OrderUnitUnits текущего OrderUnit
                    const existingUnitUnits = await db.OrderUnitUnit.findAll({
                        where: {orderUnitIdKey: orderUnit.idKey},
                        transaction,
                    });

                    const existingUnitUnitsMap = new Map();
                    existingUnitUnits.forEach((unitUnit) => {
                        existingUnitUnitsMap.set(unitUnit.idKey, unitUnit);
                    });

                    for (const incomingUnitUnit of OrderUnitUnits) {
                        const {idKey: unitUnitIdKey, ...unitUnitData} = incomingUnitUnit;

                        if (unitUnitIdKey && existingUnitUnitsMap.has(unitUnitIdKey)) {
                            // Обновляем существующий OrderUnitUnit
                            const orderUnitUnit = existingUnitUnitsMap.get(unitUnitIdKey);
                            await orderUnitUnit.update(unitUnitData, {transaction});
                            existingUnitUnitsMap.delete(unitUnitIdKey); // Отмечаем как обработанный
                        } else {
                            // Создаем новый OrderUnitUnit
                            await db.OrderUnitUnit.create(
                                {
                                    ...unitUnitData,
                                    orderUnitIdKey: orderUnit.idKey,
                                    idKey: incomingUnitUnit.idKey, // Устанавливаем idKey при создании
                                },
                                {transaction}
                            );
                        }
                    }

                    // Удаляем OrderUnitUnits, которых нет во входящих данных
                    for (const [remainingUnitUnitIdKey, remainingUnitUnit] of existingUnitUnitsMap) {
                        await remainingUnitUnit.destroy({transaction});
                    }
                }
                existingOrderUnits = existingOrderUnits.filter(unit => unit.idKey !== orderUnit.idKey);
            }
            for (let unit of existingOrderUnits) {
                await db.OrderUnitUnit.destroy({
                    where: {
                        orderUnitIdKey: unit.idKey // Переконайтеся, що orderUnitId це ключ, що пов'язує з OrderUnit
                    }
                }, {transaction});
                await db.OrderUnit.destroy({where: {idKey: unit.idKey}}, {transaction});
            }

            // Подтверждаем транзакцию
            await transaction.commit();

            // Получаем обновленный заказ с его ассоциациями
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
                        as: 'executor',
                        attributes: ['username', 'id', 'firstName', "lastName", "familyName", 'email', 'phoneNumber', 'discount', 'telegram', 'photoLink'],
                    },
                    {
                        model: db.User,
                        as: 'client',
                        attributes: ['username', 'id', 'firstName', "lastName", "familyName", 'email', 'phoneNumber', 'discount', 'telegram', 'photoLink'],
                    },
                ],
            });

            if (!order) {
                return res.status(404).json({error: 'Заказ не найден после обновления'});
            }

            // Возвращаем обновленный заказ
            res.status(200).json({order});
        } catch (error) {
            // Откатываем транзакцию в случае ошибки
            await transaction.rollback();
            console.error('Ошибка при обновлении заказа:', error);
            res.status(500).json({message: 'Ошибка при обновлении заказа'});
        }
    }
);

router.put(
    '/OneOrder/statusUpdate',
    authMiddleware,
    roleMiddleware(['admin', 'manager', "operator"]),
    async (req, res) => {
        try {
            const {newStatus, thisOrderId} = req.body;

            const updateData = {
                status: newStatus
            };

            // Отримуємо поточний заказ для перевірки попереднього статусу
            const currentOrder = await db.Order.findOne({
                where: {id: thisOrderId}
            });

            if (!currentOrder) {
                return res.status(404).json({error: 'Замовлення не знайдено'});
            }

            // Якщо статус змінюється на "1" і час початку ще не встановлено
            if (newStatus === "1" && !currentOrder.manufacturingStartTime) {
                updateData.manufacturingStartTime = new Date();
                console.log('Встановлено час початку виготовлення:', updateData.manufacturingStartTime);
            }

            // Якщо статус змінюється на "3" і є час початку виготовлення
            if (newStatus === "3" && currentOrder.manufacturingStartTime) {
                const finalTime = new Date();
                updateData.finalManufacturingTime = finalTime;

                // Розрахунок загального часу в секундах
                const startTime = new Date(currentOrder.manufacturingStartTime);
                const totalSeconds = Math.floor((finalTime - startTime) / 1000);
                updateData.totalManufacturingTimeSeconds = totalSeconds;

                console.log('Встановлено час завершення виготовлення:', finalTime);
                console.log('Загальний час виготовлення (секунд):', totalSeconds);
            }

            let result = await db.sequelize.transaction(async (t) => {
                await db.Order.update(
                    updateData,
                    {where: {id: thisOrderId}, transaction: t}
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
                    ],
                    transaction: t
                });
                return order;
            });

            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Помилка при оновленні замовлення'});
        }
    }
);

router.put(
    '/OneOrder/deadlineUpdate',
    authMiddleware,
    roleMiddleware(['admin', 'manager', "operator"]),
    async (req, res) => {
        try {
            const deadline = req.body.deadlineNew;
            const id = req.body.thisOrderId;
            let dateObject = null
            if (deadline !== null) {
                dateObject = new Date(deadline);
            }
            let rowsUpdated;
            await db.sequelize.transaction(async (t) => {
                [rowsUpdated] = await db.Order.update(
                    {deadline: dateObject},
                    {where: {id: id}, transaction: t}
                );
                if (rowsUpdated === 1) {
                    const order = await db.Order.findOne({
                        where: {id: id},
                        attributes: ["deadline"], transaction: t
                    });

                    res.status(200).json(order);

                } else {
                    res.status(500).json({error: 'Обновлено 0 rows'});
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Ошибка при обновлении заказа'});
        }
    }
);

// Получение заказов текущего пользователя
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const orders = await db.Order.findAll({
            where: {userId: req.userId},
        });
        res.status(200).json({orders});
    } catch (error) {
        res.status(500).json({error: 'Ошибка при получении заказов'});
    }
});

function calcSumPriceAndAllPrice(sum, newDiscount) {
    const numericAmount = parseFloat(sum) || 0;
    let allPrice;
    if (newDiscount.includes('%')) {
        const percent = parseFloat(newDiscount.replace('%', ''));
        if (percent > 50) {
            return;
        }
        if (percent >= 1 && percent <= 50) {
            const discountedValue = numericAmount - (numericAmount * percent / 100);
            allPrice = discountedValue.toFixed(2);
        } else {
            allPrice = numericAmount.toFixed(2);
        }
    } else if (newDiscount) {
        const discountNumeric = parseFloat(newDiscount) || 0;
        const discountedValue = numericAmount - discountNumeric;
        allPrice = discountedValue < 0 ? '0.00' : discountedValue.toFixed(2);
    } else {
        allPrice = numericAmount.toFixed(2);
    }
    return allPrice;
}

router.post('/:orderId/getComment',
    authMiddleware,
    async (req, res) => {
        try {
            const toSend = await db.InOrderComment.findAll({
                where: {orderId: req.params.orderId},
                include: [
                    {
                        model: db.User,
                        as: 'createdBy',
                        attributes: ['id', 'username']
                    },
                ]
                // attributes: ['id', 'fileLink', 'fileName', 'createdAt'] // можно добавить и другие поля по необходимости
            });
            res.status(200).json(toSend);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Помилка сервера'});
        }
    });

router.post('/:orderId/addNewComment',
    authMiddleware,
    async (req, res) => {
        try {
            await db.sequelize.transaction(async (t) => {
                const newC = await db.InOrderComment.create({
                    createdById: req.userId,
                    orderId: req.params.orderId,
                    comment: req.body.comment,
                }, {transaction: t},);
                await newC.reload({
                    include: [{
                        model: db.User,
                        as: 'createdBy',
                        attributes: ['id', 'username']
                    }],
                    transaction: t
                });
                res.status(200).json(newC);
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Помилка сервера'});
        }
    });


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Получаем orderId из параметров запроса
        const orderId = req.params.orderId;
        // Формируем путь к папке, в которую будут сохранены файлы для данного заказа
        const orderFolder = join(__dirname, '../data/inOrderFiles', orderId);

        // Проверяем, существует ли папка, и если нет – создаем её
        if (!fs.existsSync(orderFolder)) {
            fs.mkdirSync(orderFolder, {recursive: true});
        }
        cb(null, orderFolder);
    },
    filename: function (req, file, cb) {
        // Генерируем уникальное имя файла, можно использовать Date.now() или другой подход
        cb(null, Date.now() + extname(file.originalname));
    }
});
const uploadInOrderFiles = multer({storage: storage});

router.post('/:orderId/getFiles',
    authMiddleware,
    async (req, res) => {
        try {
            const files = await db.InOrderFile.findAll({
                where: {orderId: req.params.orderId},
                include: [
                    {
                        model: db.User,
                        as: 'createdBy',
                        attributes: ['id', 'username']
                    },
                ]
                // attributes: ['id', 'fileLink', 'fileName', 'createdAt'] // можно добавить и другие поля по необходимости
            });
            res.status(200).json(files);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Помилка сервера'});
        }
    });

router.post('/:orderId/addNewFile',
    authMiddleware,
    uploadInOrderFiles.single('file'), async (req, res) => {
        if (!req.file) {
            return res.status(400).send('Файл не загружен.');
        }
        // if (!req.file.mimetype.startsWith('image/')) {
        //     fs.unlink(req.file.path, (err) => {
        //         if (err) {
        //             console.error('Ошибка при удалении файла:', err);
        //         } else {
        //             console.log('Файл успешно удалён, так как это не изображение');
        //         }
        //     });
        //     return res.status(400).send('Файл не является изображением.');
        // }

        try {
            await db.sequelize.transaction(async (t) => {

                // Створюємо запис у базі без імені файлу
                const originalNameWithoutExt = basename(req.file.originalname, extname(req.file.originalname));
                const newFile = await db.InOrderFile.create({
                    ...req.body,
                    orderId: req.params.orderId,
                    createdById: req.userId,
                    fileName: `${req.file.originalname}`,
                }, {transaction: t});

                // Отримуємо розширення файлу
                const newFileName = `${newFile.id}_${req.file.originalname}`;

                // Шлях нового файлу
                const newFilePath = join(req.file.destination, newFileName);

                // Перейменовуємо файл
                fs.rename(req.file.path, newFilePath, (err) => {
                    if (err) {
                        console.error('Ошибка при переименовании файла:', err);
                        throw new Error('Ошибка при обработке файла.');
                    }
                });

                // Оновлюємо запис у базі даних з новим іменем файлу
                await db.InOrderFile.update(
                    {fileLink: newFileName},
                    {where: {id: newFile.id}, transaction: t}
                );

                const newFileToSend = await db.InOrderFile.findOne({
                    where: {id: newFile.id},
                    include: [
                        {model: db.User, as: 'createdBy', attributes: ['id', 'username']}
                    ],
                    transaction: t
                });

                res.status(201).json(newFileToSend);
            });
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            res.status(500).send('Ошибка при загрузке файла.');
        }
    });


// Удаление фото карточки
// router.delete('/:fileId/files', authMiddleware, async (req, res) => {
//     const photoId = req.params.photoId;
//
//     try {
//         await db.sequelize.transaction(async (t) => {
//             // Ищем запись фото в базе данных
//             const photo = await db.InOrderFile.findOne({
//                 where: { id: photoId },
//                 transaction: t
//             });
//
//             if (!photo) {
//                 return res.status(404).send('Фото не найдено.');
//             }
//
//             // Формируем полный путь к файлу
//             const filePath = join(__dirname, '../data/inTrelloPhoto', photo.photoLink);
//
//             // Удаляем файл с диска
//             fs.unlink(filePath, (err) => {
//                 if (err) {
//                     console.error('Ошибка при удалении файла:', err);
//                     // Если ошибка возникает при удалении файла, можно логировать и продолжать удаление записи
//                 } else {
//                     console.log('Файл успешно удалён');
//                 }
//             });
//
//             // Удаляем запись из базы данных
//             await db.InOrderFile.destroy({
//                 where: { id: photoId },
//                 transaction: t
//             });
//             res.sendStatus(200);
//         });
//
//         // Если всё прошло успешно, отправляем статус 200
//     } catch (error) {
//         console.error('Ошибка при удалении фото:', error);
//         res.status(500).send('Ошибка при удалении фото.');
//     }
// });


module.exports = router;
