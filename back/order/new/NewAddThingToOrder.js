const {OrderUnit, Order, OrderUnitUnit, Materials, Users, Product, ProductUnit, sequelize} = require("../../modelDB");
const newServerCalc = require('../../newcalc/newServerCalc');
module.exports = async function addThingToOrder(req, res, body, pricesNew, Materials, Order, OrderUnit, Users, Product, ProductUnit, calculating) {
    // Оновлення основного замовлення

    sequelize.transaction(async (t) => {
        const order = await Order.findOne({
            where: {
                id: parseInt(body.orderId)
            },
            include: [
                {
                    model: OrderUnit,
                    as: 'orderunits',
                    include: [{
                        model: OrderUnitUnit,
                        as: 'orderunitunits'
                    }]
                }
            ],
            transaction: t
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
            renewOrder.orderunits.push(thing.dataValues)
        }


        let calculatedOrder = await newServerCalc(renewOrder)

        // Оновлення головного об'єкта замовлення
        let updatedOrder = await order.update(body.updatedOrderData, { transaction: t });
        // let updatedOrder = await order.update(calculatedOrder);
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

        // Оновлення OrderUnits та OrderUnitUnits
        await Promise.all(calculatedOrder.orderunits.map(async (orderUnit) => {
            await OrderUnit.update(orderUnit,
                { transaction: t,
                    where: {
                        idKey: orderUnit.idKey  // Умова, яка вказує, яку саме одиницю замовлення оновити
                    }},

                );
            await Promise.all(orderUnit.orderunitunits.map(async orderUnitUnit => {
                await Promise.all(calculatedOrder.orderunits.map(async (orderUnit) => {

                    // If orderUnit.idKey is not defined, it means it's a new entry
                    if (!orderUnit.idKey) {
                        if(orderUnit.idKey !== undefined) {

                        }
                        const [newOrderUnit, created] = await OrderUnit.create({
                            defaults: orderUnit,
                            transaction: t
                        });
                        orderUnit.idKey = newOrderUnit.idKey;
                    } else {
                        await OrderUnit.update(orderUnit,
                            {
                                transaction: t,
                                where: {
                                    idKey: orderUnit.idKey
                                }
                            },
                        );
                    }

                    await Promise.all(orderUnit.orderunitunits.map(async orderUnitUnit => {
                        if (!orderUnitUnit.idKey) {
                            const [newOrderUnitUnit, created] = await OrderUnitUnit.create({
                                defaults: orderUnitUnit,
                                transaction: t
                            });
                            orderUnitUnit.idKey = newOrderUnitUnit.idKey;
                        } else {
                            await OrderUnitUnit.update(orderUnitUnit,
                                {
                                    transaction: t,
                                    where: {
                                        idKey: orderUnitUnit.idKey
                                    }
                                });
                        }

                    }));
                }));
                return OrderUnitUnit.update(orderUnitUnit, { transaction: t,
                    where: {
                        idKey: orderUnitUnit.idKey  // Умова, яка вказує, яку саме одиницю замовлення оновити
                    }
                });
            }));
        }));

        return calculatedOrder
    }).then(() => {
        console.log('Всі дані успішно оновлено');
    }).catch((error) => {
        console.error('Помилка при оновленні:', error);
    });
}