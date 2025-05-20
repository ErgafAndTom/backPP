const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const {Op, OrderUnitUnit} = require("../back/modelDB");
const calculatingNewArtem = require("../back/calculatingNewArtem");
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");
const {join} = require("node:path");
const processingPrice = require("../back/price/processingPrices");


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

//create new orderUnitInOrder
router.post(
    '/OneOrder/OneOrderUnitInOrder',
    authMiddleware,
    roleMiddleware(['admin', 'manager', 'operator']),
    async (req, res) => {
        try {
            let toCalc = req.body.toCalc
            let orderId = req.body.orderId

            let pricesThis = await calculatingNewArtem(req, res, toCalc, pricesNew, db.Material)
            let newOrderUnitAfterCalc = createOrderUnit(toCalc, orderId, pricesThis, req)
            // console.log(newOrderUnitAfterCalc);
            if(!newOrderUnitAfterCalc){
                res.status(500).json({error: 'Не вибрано нічого".'});
                return
            }

            await db.sequelize.transaction(async (t) => {
                const order = await db.Order.findOne({
                    where: {id: orderId},
                    // attributes: ['priceForThis'],
                    transaction: t
                })
                console.log(order.dataValues);
                if(order.dataValues.status !== "0"){
                    res.status(500).json({error: 'Статус "Взятий в роботу".'});
                    return
                } else {
                    // let mappedNewOrderUnitAfterCalc = await Promise.all(newOrderUnitAfterCalc.OrderUnitUnits.map(OrderUnitUnit => {
                    //     OrderUnitUnit.priceForOneThisDiscount = calcSumPriceAndAllPrice(parseFloat(OrderUnitUnit.priceForOneThis), order.discount)
                    //         OrderUnitUnit.priceForThisDiscount = calcSumPriceAndAllPrice(parseFloat(OrderUnitUnit.priceForThis), order.discount)
                    //         OrderUnitUnit.priceForAllThisDiscount = calcSumPriceAndAllPrice(parseFloat(OrderUnitUnit.priceForAllThis), order.discount)
                    // }
                    // ));
                    // newOrderUnitAfterCalc.priceForOneThisDiscount =  calcSumPriceAndAllPrice(parseFloat(newOrderUnitAfterCalc.priceForOneThis), order.discount)
                    // newOrderUnitAfterCalc.priceForThisDiscount = calcSumPriceAndAllPrice(parseFloat(newOrderUnitAfterCalc.priceForThis), order.discount)
                    // const OrderUnit = await db.OrderUnit.create(mappedNewOrderUnitAfterCalc, {
                    //     include: [{
                    //         model: db.OrderUnitUnit,
                    //         as: 'OrderUnitUnits'
                    //     }],
                    //     transaction: t
                    // });

                    // Перерасчёт цен для OrderUnitUnits
                    let mappedNewOrderUnitAfterCalc = newOrderUnitAfterCalc
                    if(order.prepayment.includes('%')){
                        const mappedOrderUnitUnits = await Promise.all(
                            newOrderUnitAfterCalc.OrderUnitUnits.map(async (OrderUnitUnit) => ({
                                ...OrderUnitUnit,
                                priceForOneThisDiscount: calcSumPriceAndAllPriceFromOrders(parseFloat(OrderUnitUnit.priceForOneThis), order.prepayment),
                                priceForThisDiscount: calcSumPriceAndAllPriceFromOrders(parseFloat(OrderUnitUnit.priceForThis), order.prepayment),
                                priceForAllThisDiscount: calcSumPriceAndAllPriceFromOrders(parseFloat(OrderUnitUnit.priceForAllThis), order.prepayment)
                            }))
                        );

                        // Перерасчёт цен для самого OrderUnit
                        mappedNewOrderUnitAfterCalc = {
                            ...newOrderUnitAfterCalc,
                            priceForOneThisDiscount: calcSumPriceAndAllPriceFromOrders(parseFloat(newOrderUnitAfterCalc.priceForOneThis), order.prepayment),
                            priceForThisDiscount: calcSumPriceAndAllPriceFromOrders(parseFloat(newOrderUnitAfterCalc.priceForThis), order.prepayment),
                            OrderUnitUnits: mappedOrderUnitUnits
                        };
                    }


                    // Создание записи в БД с вложенными объектами
                    const OrderUnit = await db.OrderUnit.create(mappedNewOrderUnitAfterCalc, {
                        include: [{
                            model: db.OrderUnitUnit,
                            as: 'OrderUnitUnits'
                        }],
                        transaction: t
                    });



                    const orderUnits = await db.OrderUnit.findAll({
                        where: {orderId: orderId},
                        // attributes: ['priceForThis'],
                        transaction: t
                    })
                    let sum = 0;
                    orderUnits.forEach(e => {
                        console.log(sum);
                        sum = sum+parseFloat(e.priceForThis);
                    })
                    console.log(sum);

                    let allPrice = calcSumPriceAndAllPrice(order, sum)


                    await db.Order.update(
                        {price: sum, allPrice: allPrice},
                        {where: {id: orderId}, transaction: t}
                    );
                    const orderToSend = await db.Order.findOne({
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
                        ], transaction: t
                    });
                    if (!order) {
                        return res.status(404).json({error: 'Заказ не найден после обновления'});
                    }
                    res.status(200).json(orderToSend);
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Ошибка при обновлении заказа'});
        }
    }
);

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
            res.status(200).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Ошибка при обновлении заказа'});
        }
    }
);

router.delete(
    '/OneOrder/OneOrderUnitInOrder/:idKey',
    authMiddleware,
    roleMiddleware(['admin', 'manager' , 'operator']),
    async (req, res) => {
        try {
            const {idKey} = req.params;
            if (!idKey) {
                return res.status(400).json({message: 'ID OrderUnitА не предоставлен'});
            }
            await db.sequelize.transaction(async (t) => {
                const deletedOrderUnit = await db.OrderUnit.findOne({
                    where: {
                        idKey: idKey
                    },
                    // attributes: ['priceForThis'],
                    transaction: t
                })
                const order = await db.Order.findOne({
                    where: {id: deletedOrderUnit.orderId},
                    // attributes: ['priceForThis'],
                    transaction: t
                })
                // console.log(order.dataValues);
                if(order.dataValues.status !== "0"){
                    res.status(500).json({error: 'Статус "Взятий в роботу".'});

                } else {
                    const OrderUnit = await db.OrderUnit.destroy({
                        include: [{
                            model: db.OrderUnitUnit,
                            as: 'OrderUnitUnits'
                        }],
                        where: {
                            idKey: idKey
                        },
                        transaction: t
                    });
                    console.log(deletedOrderUnit.orderId);
                    const orderUnits = await db.OrderUnit.findAll({
                        where: {orderId: deletedOrderUnit.orderId},
                        // attributes: ['priceForThis'],
                        transaction: t
                    })
                    let sum = 0;
                    orderUnits.forEach(e => {
                        console.log(sum);
                        sum = sum+parseFloat(e.priceForThis);
                    })
                    console.log(sum);

                    let allPrice = calcSumPriceAndAllPrice(order, sum)


                    await db.Order.update(
                        {price: sum, allPrice: allPrice},
                        {where: {id: deletedOrderUnit.orderId}, transaction: t}
                    );

                    const orderAfterOperations = await db.Order.findOne({
                        where: {id: deletedOrderUnit.orderId},
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
                    })
                    res.status(200).json(orderAfterOperations)
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Ошибка при удалении заказа'});
        }
    }
);

function calcSumPriceAndAllPrice(order, sum) {
    const numericAmount = parseFloat(sum) || 0;
    let allPrice;
    if (order.prepayment.includes('%')) {
        const percent = parseFloat(order.prepayment.replace('%', ''));
        if (percent > 50) {
            return;
        }
        if (percent >= 1 && percent <= 50) {
            const discountedValue = numericAmount - (numericAmount * percent / 100);
            allPrice = discountedValue.toFixed(2);
        } else {
            allPrice = numericAmount.toFixed(2);
        }
    } else if (order.prepayment) {
        const discountNumeric = parseFloat(order.prepayment) || 0;
        const discountedValue = numericAmount - discountNumeric;
        allPrice = discountedValue < 0 ? '0.00' : discountedValue.toFixed(2);
    } else {
        allPrice = numericAmount.toFixed(2);
    }
    return allPrice;
}

function calcSumPriceAndAllPriceFromOrders(sum, newDiscount) {
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

function createOrderUnit(toCalc, orderId, pricesThis, req) {
    const OrderUnitUnits = [];

    // --- Додавання одиниці друку (якщо потрібен друк) ---
    if (toCalc.color.sides !== "Не потрібно") {
        OrderUnitUnits.push({
            OrderUnitUnits: [],
            priceForOneThis: pricesThis.priceDrukPerSheet,
            priceForThis: pricesThis.totalDrukPrice, // для всіх аркушів
            priceForAllThis: pricesThis.totalDrukPrice,
            name: `${pricesThis.selectedDruk.name} ${toCalc.color.sides} ${toCalc.color.allSidesColor}`,
            type: pricesThis.selectedDruk.type,
            typeUse: pricesThis.selectedDruk.typeUse,
            unit: pricesThis.selectedDruk.unit,
            x: toCalc.size.x,
            xInStorage: pricesThis.selectedDruk.x,
            y: toCalc.size.y,
            yInStorage: pricesThis.selectedDruk.y,
            id: parseInt(pricesThis.selectedDruk.id),
            quantity: 1,
            price1: pricesThis.selectedDruk.price1,
            price2: pricesThis.selectedDruk.price2,
            price3: pricesThis.selectedDruk.price3,
            price4: pricesThis.selectedDruk.price4,
            price5: pricesThis.selectedDruk.price5,
            newField5: pricesThis.sheetCount // (кількість одиниць, наприклад, тираж)
        });
    }

    // --- Додавання одиниці матеріалів (паперу) ---
    if (toCalc.material.type !== "Не потрібно") {
        OrderUnitUnits.push({
            OrderUnitUnits: [],
            priceForOneThis: pricesThis.pricePaperPerSheet,
            priceForThis: pricesThis.pricePaperPerSheet * pricesThis.sheetCount,
            priceForAllThis: pricesThis.pricePaperPerSheet * pricesThis.sheetCount,
            name: `${toCalc.material.thickness} ${toCalc.material.material} ${pricesThis.selectedPaper.thickness}`,
            type: pricesThis.selectedPaper.type,
            typeUse: pricesThis.selectedPaper.typeUse,
            unit: pricesThis.selectedPaper.unit,
            x: toCalc.size.x,
            xInStorage: pricesThis.selectedPaper.x,
            y: toCalc.size.y,
            yInStorage: pricesThis.selectedPaper.y,
            thickness: pricesThis.selectedPaper.thickness,
            id: parseInt(pricesThis.selectedPaper.id),
            quantity: 1,
            price1: pricesThis.selectedPaper.price1,
            price2: pricesThis.selectedPaper.price2,
            price3: pricesThis.selectedPaper.price3,
            price4: pricesThis.selectedPaper.price4,
            price5: pricesThis.selectedPaper.price5,
            newField5: pricesThis.sheetCount
        });
    }

    // --- Додавання одиниці ламінації (якщо потрібна) ---
    if (toCalc.lamination.type !== "Не потрібно") {
        OrderUnitUnits.push({
            OrderUnitUnits: [],
            priceForOneThis: pricesThis.priceLaminationPerSheet,
            priceForThis: pricesThis.priceLaminationPerSheet * pricesThis.sheetCount,
            priceForAllThis: pricesThis.priceLaminationPerSheet * pricesThis.sheetCount,
            name: pricesThis.selectedLamination.name,
            type: pricesThis.selectedLamination.type,
            typeUse: pricesThis.selectedLamination.typeUse,
            unit: pricesThis.selectedLamination.unit,
            x: toCalc.size.x,
            xInStorage: pricesThis.selectedLamination.x,
            y: toCalc.size.y,
            yInStorage: pricesThis.selectedLamination.y,
            thickness: pricesThis.selectedLamination.thickness,
            id: parseInt(pricesThis.selectedLamination.id),
            quantity: 1,
            price1: pricesThis.selectedLamination.price1,
            price2: pricesThis.selectedLamination.price2,
            price3: pricesThis.selectedLamination.price3,
            price4: pricesThis.selectedLamination.price4,
            price5: pricesThis.selectedLamination.price5,
            newField5: pricesThis.sheetCount
        });
    }

    // --- Додавання постпресових операцій: Згинання (Big) ---
    if (toCalc.big !== "Не потрібно") {
        OrderUnitUnits.push({
            OrderUnitUnits: [],
            priceForOneThis: pricesThis.big.pricePerUnit,
            priceForThis: pricesThis.big.pricePerUnit * parseInt(toCalc.big),
            priceForAllThis: pricesThis.big.totalPrice,
            name: pricesThis.selectedBig.name,
            type: pricesThis.selectedBig.type,
            typeUse: pricesThis.selectedBig.typeUse,
            unit: pricesThis.selectedBig.unit,
            quantity: parseInt(toCalc.big),
            price1: pricesThis.selectedBig.price1,
            price2: pricesThis.selectedBig.price2,
            price3: pricesThis.selectedBig.price3,
            price4: pricesThis.selectedBig.price4,
            price5: pricesThis.selectedBig.price5,
            newField5: parseInt(toCalc.big) * toCalc.count,
            newField3: toCalc.big,
            newField4: toCalc.count.toString()
        });
    }

    // --- Додавання постпресових операцій: Скруглення кутів (Cute) ---
    if (toCalc.cute !== "Не потрібно") {
        OrderUnitUnits.push({
            OrderUnitUnits: [],
            priceForOneThis: pricesThis.cute.pricePerUnit,
            priceForThis: pricesThis.cute.pricePerUnit * parseInt(toCalc.cute),
            priceForAllThis: pricesThis.cute.totalPrice,
            name: pricesThis.selectedCute.name,
            type: pricesThis.selectedCute.type,
            typeUse: pricesThis.selectedCute.typeUse,
            unit: pricesThis.selectedCute.unit,
            quantity: parseInt(toCalc.cute),
            price1: pricesThis.selectedCute.price1,
            price2: pricesThis.selectedCute.price2,
            price3: pricesThis.selectedCute.price3,
            price4: pricesThis.selectedCute.price4,
            price5: pricesThis.selectedCute.price5,
            newField5: parseInt(toCalc.cute) * toCalc.count
        });
    }

    // --- Додавання постпресових операцій: Свердління отворів (Holes) ---
    if (toCalc.holes !== "Не потрібно") {
        OrderUnitUnits.push({
            OrderUnitUnits: [],
            priceForOneThis: pricesThis.holes.pricePerUnit,
            priceForThis: pricesThis.holes.pricePerUnit * parseInt(toCalc.holes),
            priceForAllThis: pricesThis.holes.totalPrice,
            name: pricesThis.selectedHoles.name,
            type: pricesThis.selectedHoles.type,
            typeUse: pricesThis.selectedHoles.typeUse,
            unit: pricesThis.selectedHoles.unit,
            quantity: parseInt(toCalc.holes),
            price1: pricesThis.selectedHoles.price1,
            price2: pricesThis.selectedHoles.price2,
            price3: pricesThis.selectedHoles.price3,
            price4: pricesThis.selectedHoles.price4,
            price5: pricesThis.selectedHoles.price5,
            newField5: parseInt(toCalc.holes) * toCalc.count
        });
    }
    if (toCalc.type === "Cup") {
        OrderUnitUnits.push({
            OrderUnitUnits: [],
            priceForOneThis: pricesThis.priceForThisUnit,
            priceForThis: pricesThis.priceForThisUnitOfCup,
            priceForAllThis: pricesThis.priceForAllUnitOfCup,
            name: pricesThis.selectedCup.name,
            type: pricesThis.selectedCup.type,
            typeUse: pricesThis.selectedCup.typeUse,
            units: pricesThis.selectedCup.units,
            quantity: parseInt(toCalc.count),
            price1: pricesThis.selectedCup.price1,
            price2: pricesThis.selectedCup.price2,
            price3: pricesThis.selectedCup.price3,
            price4: pricesThis.selectedCup.price4,
            price5: pricesThis.selectedCup.price5,
            newField5: toCalc.count,
        });
    }
    if (toCalc.photo) {
        OrderUnitUnits.push({
            OrderUnitUnits: [],
            priceForOneThis: pricesThis.priceForThisUnitOfPapper,
            priceForThis: pricesThis.priceForThisUnitOfPapper,
            priceForAllThis: pricesThis.totalPrice,
            name: pricesThis.selectedPhoto.name,
            type: pricesThis.selectedPhoto.type,
            typeUse: pricesThis.selectedPhoto.typeUse,
            units: pricesThis.selectedPhoto.units,
            quantity: parseInt(toCalc.count),
            price1: pricesThis.selectedPhoto.price1,
            price2: pricesThis.selectedPhoto.price2,
            price3: pricesThis.selectedPhoto.price3,
            price4: pricesThis.selectedPhoto.price4,
            price5: pricesThis.selectedPhoto.price5,
            newField5: toCalc.count,
        });
    }
    if (toCalc.type === "PerepletMet") {
        OrderUnitUnits.push({
            OrderUnitUnits: [],
            priceForOneThis: pricesThis.priceForOneOfPereplet,
            priceForThis: pricesThis.priceForOneOfPereplet,
            priceForAllThis: pricesThis.price,
            name: pricesThis.selectedPerepletType.name,
            type: pricesThis.selectedPerepletType.type,
            typeUse: pricesThis.selectedPerepletType.typeUse,
            units: pricesThis.selectedPerepletType.units,
            quantity: parseInt(toCalc.count),
            price1: pricesThis.selectedPerepletType.price1,
            price2: pricesThis.selectedPerepletType.price2,
            price3: pricesThis.selectedPerepletType.price3,
            price4: pricesThis.selectedPerepletType.price4,
            price5: pricesThis.selectedPerepletType.price5,
            newField5: toCalc.count,
        });
    }
    if (toCalc.type === "Vishichka") {
        OrderUnitUnits.push({
            OrderUnitUnits: [],
            priceForOneThis: pricesThis.priceVishichkaPerSheet,
            priceForThis: pricesThis.priceVishichkaPerSheet,
            priceForAllThis: pricesThis.totalVishichkaPrice,
            name: pricesThis.selectedVishichka.name,
            type: pricesThis.selectedVishichka.type,
            typeUse: pricesThis.selectedVishichka.typeUse,
            units: pricesThis.selectedVishichka.units,
            quantity: parseInt(toCalc.count),
            price1: pricesThis.selectedVishichka.price1,
            price2: pricesThis.selectedVishichka.price2,
            price3: pricesThis.selectedVishichka.price3,
            price4: pricesThis.selectedVishichka.price4,
            price5: pricesThis.selectedVishichka.price5,
            newField5: pricesThis.sheetCount,
        });
    }

    if(OrderUnitUnits.length === 0){
        return;
    }
    // --- Формування основного об’єкта замовлення ---
    const OrderUnit = {
        name: toCalc.nameOrderUnit,
        amount: toCalc.count,
        newField2: toCalc.size.x,
        newField3: toCalc.size.y,
        newField4: pricesThis.sheetsPerUnit,  // використовується поле з першої функції
        newField5: pricesThis.sheetCount,      // використовується поле з першої функції
        priceForThis: pricesThis.price,
        priceForOneThis: pricesThis.priceForItemWithExtras,
        OrderUnitUnits: OrderUnitUnits,
        orderId: orderId
    };

    return OrderUnit;
}


module.exports = router;