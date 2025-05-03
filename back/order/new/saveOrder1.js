const {OrderUnit, Order, OrderUnitUnit, Materials, Users, Product, ProductUnit} = require("../../modelDB");
const newServerCalc = require('../../newcalc/newServerCalc');
module.exports = async function saveOrder(req, res, body, pricesNew, Materials, Order, OrderUnit, Users, Product, ProductUnit, calculating) {
    // Оновлення основного замовлення
    let order = await Order.findOne({
        where: {
            id: parseInt(body.thisOrder.id)
        },
        include: [
            {
                model: OrderUnit, as: 'orderunits',
                include: [{
                    model: OrderUnitUnit,
                    as: 'orderunitunits'
                }
                ]
            }],
    });

    if (!order) {
        throw new Error('Замовлення не знайдено');
    }
    let calculatedOrder = await newServerCalc(body.thisOrder)

    let UpdatetOrder = await order.update(calculatedOrder);

    let clientForThis = await Users.findAndCountAll({
        where: {
            id: calculatedOrder.clientId
        }
    });
    if(clientForThis.rows[0]){
        calculatedOrder.clientName = clientForThis.rows[0].dataValues.name
        calculatedOrder.clientPhone = clientForThis.rows[0].dataValues.phone
        calculatedOrder.clientMessenger = clientForThis.rows[0].dataValues.messenger
        if (calculatedOrder.orderunits && calculatedOrder.orderunits.length > 0) {
            const unitData = calculatedOrder.orderunits[0]; // Ensure we only process the first element
            let orderUnit;
            if (unitData.idKey) {
                orderUnit = await OrderUnit.findByPk(unitData.idKey);
                if (orderUnit) {
                    await orderUnit.update(unitData);
                }
            } else {
                orderUnit = await OrderUnit.create({
                    ...unitData,
                    orderId: order.id,
                    id: unitData.id,
                    xInStorage: unitData.xInStorage,
                    yInStorage: unitData.yInStorage
                });
            }

            // Оновлення або створення OrderUnitUnits
            if (unitData.orderunitunits) {
                for (const unitUnitData of unitData.orderunitunits) {
                    let orderUnitUnit;
                    if (unitUnitData.idKey) {
                        orderUnitUnit = await OrderUnitUnit.findByPk(unitUnitData.idKey);
                        if (orderUnitUnit) {
                            await orderUnitUnit.update(unitUnitData);
                        }
                    } else {
                        orderUnitUnit = await OrderUnitUnit.create({
                            ...unitUnitData,
                            orderunitIdKey: orderUnit.idKey,
                            id: unitUnitData.id,
                            xInStorage: unitUnitData.xInStorage,
                            yInStorage: unitUnitData.yInStorage
                        });
                    }
                }
            }
        }
        existingOrderUnits = existingOrderUnits.filter(unit => unit.idKey !== (orderUnit ? orderUnit.idKey : null));
        console.log(`Client name: ${calculatedOrder.clientName}`);
        console.log(`Client phone: ${calculatedOrder.clientPhone}`);
        console.log(`Client messenger: ${calculatedOrder.clientMessenger}`);

        if (!calculatedOrder.clientName || !calculatedOrder.clientPhone || !calculatedOrder.clientMessenger) {
            console.warn("One of the client details is missing or incorrect.");
        }
    }

    // Оновлення або створення OrderUnits
    let existingOrderUnits = await OrderUnit.findAll({where: {orderId: calculatedOrder.id}});
    for (const unitData of calculatedOrder.orderunits) {
        let orderUnit;
        if (unitData.idKey) {
            orderUnit = await OrderUnit.findByPk(unitData.idKey);
            if (orderUnit) {
                await orderUnit.update(unitData);
            }
        } else {
            orderUnit = await OrderUnit.create({...unitData, orderId: order.id, id: unitData.id,
                xInStorage: unitData.xInStorage, yInStorage: unitData.yInStorage});
        }

        // Оновлення або створення OrderUnitUnits
        if(unitData.orderunitunits){
            // let existingOrderUnitUnits = []
            if (unitData.idKey){
                // existingOrderUnitUnits = await OrderUnitUnit.findAll({where: {orderunitIdKey: orderUnit.idKey}});
            }
            for (const unitUnitData of unitData.orderunitunits) {
                let orderUnitUnit;
                if (unitUnitData.idKey) {
                    orderUnitUnit = await OrderUnitUnit.findByPk(unitUnitData.idKey);
                    if (orderUnitUnit) {
                        await orderUnitUnit.update(unitUnitData);
                    }
                } else {
                    orderUnitUnit = await OrderUnitUnit.create({...unitUnitData, orderunitIdKey: orderUnit.idKey, id: unitUnitData.id,
                    xInStorage: unitUnitData.xInStorage, yInStorage: unitUnitData.yInStorage});
                }
                // existingOrderUnitUnits = existingOrderUnitUnits.filter(unit => unit.idKey !== orderUnitUnit.idKey);
            }
            // for (let unit of existingOrderUnitUnits) {
            //     await OrderUnitUnit.destroy({where: {idKey: unit.idKey}});
            // }
        }
        existingOrderUnits = existingOrderUnits.filter(unit => unit.idKey !== orderUnit.idKey);
    }
    for (let unit of existingOrderUnits) {
        await OrderUnitUnit.destroy({
            where: {
                orderunitIdKey: unit.idKey // Переконайтеся, що orderUnitId це ключ, що пов'язує з OrderUnit
            }
        });
        await OrderUnit.destroy({where: {idKey: unit.idKey}});
    }


    let orderToSend = await Order.findOne({
        where: {
            id: parseInt(body.thisOrder.id)
        },
        include: [
            {
                model: OrderUnit, as: 'orderunits',
                include: [{
                    model: OrderUnitUnit,
                    as: 'orderunitunits'
                }
                ]
            }],
    });
    if (!orderToSend) {
        throw new Error('Замовлення не знайдено');
    }
    return orderToSend
    // return calculatedOrder
}