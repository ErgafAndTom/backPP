const calculating = require("../../newcalc/calculating");
const {sequelize, Order, OrderUnit, OrderUnitUnit} = require("../../modelDB");
module.exports = async function createNewOrder(req, res, body, pricesNew, Materials, Order, OrderUnit, sequelize, calculating){
    // console.log(req.userId);
    body.method = "calculate"
    // const newOrder = await Order.create({...body.formValues, 'userId': 0})
    body.status = "створено"
    const newOrder = await Order.create({...body.formValues, status: 'створено', executorId: req.userId, price: 0});
    // const newOrder = await Order.create(body.formValues)

    // let calculated = await calculating(req, res, body, pricesNew, Materials)
    // console.log(calculated.newDataWithPrices2);
    // const newOrder = await Order.create({
    //     userId: parseInt(req.userId),
    //     executorId: parseInt(req.userId),
    //     status: "created",
    //     price: 0,
    //     prepayment: 0,
    //     // параметри для замовлення
    //     ...calculated,
    //     // Включення OrderUnit як вкладені одиниці
    //     orderunits: calculated.newDataWithPrices2
    // }, {
    //     // Вказуємо, що вкладені OrderUnits також потрібно створити
    //     include: [{
    //         model: OrderUnit,
    //         as: 'orderunits',
    //         include: [{
    //             model: OrderUnitUnit,
    //             as: 'orderunitunits'
    //         }]
    //     }]
    // });
    // if(body.id){
    //     const updatedFields = {};
    //     updatedFields[body.tablePosition] = body.tablePosition
    //     const [rowsUpdated] = await Order.update(updatedFields, {
    //         where: { id: body.id },
    //     });
    //     if (rowsUpdated === 1) {
    //         newOrder = await Order.findOne({ where: { id: req.userId } });
    //         // toSend.metadata = Object.keys(Order.rawAttributes)
    //         // res.send(toSend)
    //     } else {
    //         res.send("error")
    //     }
    // } else {
    //     // const order = await Order.findOne({ where: { id: req.userId } });
    //     await sequelize.transaction(async (t) => {
    //         newOrder = await Order.create({
    //             userid: parseInt(req.userId),
    //             executorId: parseInt(req.userId),
    //             status: "created",
    //             price: parseInt(calculated.calcResponse[0].price),
    //         }, { transaction: t });
    //
    //         for (let i = 0; i < calculated.newDataWithPrices2.length; i++) {
    //             let forCreate = {
    //                 unitType: calculated.newDataWithPrices2[i].type,
    //                 unitId: calculated.newDataWithPrices2[i].id,
    //                 unitName: calculated.newDataWithPrices2[i].name,
    //                 quantity: calculated.newDataWithPrices2[i].amount,
    //                 newField2: calculated.newDataWithPrices2[i].priceForThis
    //             }
    //             if(body.data[i].productunits){
    //                 forCreate.newField1 = "product"
    //             }
    //
    //             let newOrderUnit = await OrderUnit.create(forCreate, { transaction: t });
    //             await newOrder.addOrderunits(newOrderUnit, { transaction: t });
    //         }
    //     });
    // }
    return newOrder
}