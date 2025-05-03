const {OrderUnit, Order, OrderUnitUnit, Materials, Users, Product, ProductUnit} = require("../../modelDB");
const newServerCalc = require('../../newcalc/newServerCalc');
module.exports = async function addThingToOrder(req, res, body, pricesNew, Materials, Order, OrderUnit, Users, Product, ProductUnit, calculating) {
    // Оновлення основного замовлення
    let order = await Order.findOne({
        where: {
            id: parseInt(body.orderId)
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
    let thing;
    let renewOrder = order.dataValues
    if(body.type === "prodU"){
        thing = await Product.findOne({
            where: {
                id: parseInt(body.thingId)
            },
            include: [{model: ProductUnit, as: 'productunits'}]
        });
        let orderunitunits = await Promise.all(thing.productunits.map(unit => {
            return Materials.findOne({
                where: {
                    id: parseInt(unit.idInStorageUnit)
                }
            }).then(material => {
                let materialData = material.dataValues;
                materialData.idInStorageUnit = unit.idInStorageUnit;
                materialData.quantity = unit.quantity;
                materialData.productId = unit.productId;
                materialData.amount = unit.quantity;
                return materialData;
            });
        }));
        thing.dataValues.orderunitunits = orderunitunits
        thing.dataValues.amount = 1
        thing.dataValues.newField2 = 45
        thing.dataValues.newField3 = 45
        thing.dataValues.idKey = 0
        renewOrder.orderunits.push(thing.dataValues)
    } else if(body.type === "storU"){
        thing = await Materials.findOne({
            where: {
                id: parseInt(body.thingId)
            }
        });
        thing.dataValues.amount = 1
        thing.dataValues.newField2 = 45
        thing.dataValues.newField3 = 45
        thing.dataValues.idInStorageUnit = thing.dataValues.id
        thing.dataValues.idKey = 0
        renewOrder.orderunits.push(thing.dataValues)
    }


    let calculatedOrder = await newServerCalc(renewOrder)

    //updatingStart
    let updatedOrder = await order.update(calculatedOrder);


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
        // if(unitData.orderunitunits){
        //     // let existingOrderUnitUnits = []
        //     if (unitData.idKey){
        //         // existingOrderUnitUnits = await OrderUnitUnit.findAll({where: {orderunitIdKey: orderUnit.idKey}});
        //     }
        //     for (const unitUnitData of unitData.orderunitunits) {
        //         let orderUnitUnit;
        //         if (unitUnitData.idKey) {
        //             orderUnitUnit = await OrderUnitUnit.findByPk(unitUnitData.idKey);
        //             if (orderUnitUnit) {
        //                 await orderUnitUnit.update(unitUnitData);
        //             }
        //         } else {
        //             orderUnitUnit = await OrderUnitUnit.create({...unitUnitData, orderunitIdKey: orderUnit.idKey, id: unitUnitData.id,
        //                 xInStorage: unitUnitData.xInStorage, yInStorage: unitUnitData.yInStorage});
        //         }
        //     }
        // }
        // existingOrderUnits = existingOrderUnits.filter(unit => unit.idKey !== orderUnit.idKey);
    }
    // for (let unit of existingOrderUnits) {
    //     await OrderUnitUnit.destroy({
    //         where: {
    //             orderunitIdKey: unit.idKey // Переконайтеся, що orderUnitId це ключ, що пов'язує з OrderUnit
    //         }
    //     });
    //     await OrderUnit.destroy({where: {idKey: unit.idKey}});
    // }

    let clientForThis = await Users.findAndCountAll({
        where: {
            id: calculatedOrder.clientId
        }
    });
    if(clientForThis.rows[0]){
        calculatedOrder.clientName = clientForThis.rows[0].dataValues.name
        calculatedOrder.clientPhone = clientForThis.rows[0].dataValues.phone
        calculatedOrder.clientMessenger = clientForThis.rows[0].dataValues.messenger
    }
    return calculatedOrder
}