const {Materials, OrderUnit, Product, ProductUnit, Op, OrderUnitUnit, sequelize} = require("../../modelDB");

module.exports = async function getAllOrders(req, res, body, pricesNew, Materials, Order, OrderUnit, Users, Product, ProductUnit) {
    console.log(body);
    if (body.name === "Orders") {
        const pageNumber = body.currentPage; // Номер сторінки (перша сторінка - 1)
        const pageSize = body.inPageCount; // Розмір сторінки
        const columnNameForOrder = body.columnName.column; // Ім'я колонки для сортування
        const searchString = `%${body.search}%`;

        let fieldsForSearch = Object.keys(Order.rawAttributes);
        let SearchConditions = fieldsForSearch.map(field => ({ [field]: { [Op.like]: searchString } }));
        // let SearchConditions = fieldsForSearch.map(field => ({
        //     [Op.or]: sequelize.where(sequelize.cast(sequelize.col(`Order.${field}`), 'TEXT'), { [Op.like]: searchString })
        // }));
        let toColumn = 'ASC'
        if(body.columnName.reverse){
            toColumn = 'DESC'
        }
        try {
            const toSend = await Order.findAndCountAll({
                offset: (pageNumber - 1) * pageSize, // Зсув для поточної сторінки
                limit: pageSize, // Кількість записів на сторінці
                where: {
                    [Op.or]: SearchConditions
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
                order: [
                    [columnNameForOrder, toColumn] // Сортування за заданою колонкою
                    // ["id", 'ASC'] // Сортування за заданою колонкою
                ]
            });
            toSend.metadata = Object.keys(Order.rawAttributes);
            toSend.metadataProductUnit = Object.keys(OrderUnit.rawAttributes);
            return toSend;
        } catch (e) {
            console.error('Помилка при отриманні замовлень:', e);
            throw e;
        }


        // const pageNumber = body.currentPage; // Номер страницы (первая страница - 1)
        // const pageSize = body.inPageCount; // Размер страницы
        // const columnNameForOrder = body.columnName; // Размер страницы
        // // let searchString = `%${body.search}%`;
        // //
        // // let fieldsForSearch = Object.keys(Order.rawAttributes);
        // // let SearchConditions = fieldsForSearch.map(field => ({[field]: {[Op.like]: searchString}}));
        // try {
        //     const toSend = await Order.findAndCountAll({
        //         // Додаємо вкладені моделі через асоціації
        //         offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
        //         limit: pageSize, // Количество записей на странице
        //         where: {
        //             // userId: req.userId,
        //            // [Op.or]: SearchConditions,
        //             // [Op.or]: [
        //             //     { id: SearchConditions },
        //             //     { executorId: SearchConditions },
        //             //     { price: SearchConditions },
        //             //     { allPrice: SearchConditions },
        //             //     { clientId: SearchConditions },
        //             //     { userId: SearchConditions },
        //             //     {
        //             //         createdAt: {
        //             //             [Op.between]: ['2024-01-01', '2024-01-31']
        //             //         }
        //             //     },
        //             //     {
        //             //         updatedAt: {
        //             //             [Op.between]: ['2024-01-01', '2024-01-31']
        //             //         }
        //             //     }
        //             // ]
        //         },
        //         include: [
        //             {
        //                 model: OrderUnit,
        //                 as: 'orderunits',
        //                 include: [{
        //                     model: OrderUnitUnit,
        //                     as: 'orderunitunits'
        //                 }]
        //             }
        //         ],
        //         order: [
        //             [columnNameForOrder, 'ASC'] // Замість 'columnName' вкажіть назву колонки, за якою хочете сортувати
        //         ]
        //     });
        //     toSend.metadata = Object.keys(Order.rawAttributes);
        //     toSend.metadataProductUnit = Object.keys(OrderUnit.rawAttributes);
        //     return toSend;
        // } catch (e) {
        //     console.error('Помилка при отриманні замовлень:', e);
        //     throw e;
        // }


        // for (let i = 0; i < toSend.rows.length; i++) {
        //     let executorUserForThis = await Users.findAndCountAll({
        //         where: {
        //             id: toSend.rows[i].dataValues.executorId
        //         }
        //     })
        //     toSend.rows[i].dataValues.executorId = `${toSend.rows[i].dataValues.executorId} => ${executorUserForThis.rows[0].dataValues.name}`
        //
        //     let userForThis = await Users.findAndCountAll({
        //         where: {
        //             id: toSend.rows[i].dataValues.userid
        //         }
        //     })
        //     toSend.rows[i].dataValues.userid = `${toSend.rows[i].dataValues.userid} => ${userForThis.rows[0].dataValues.name}`
        // }
        // toSend.metadataProduct = Object.keys(Order.rawAttributes)
        // toSend.metadataProductUnit = Object.keys(OrderUnit.rawAttributes)
        // return toSend


        // let orders = await Order.findAndCountAll({
        //     offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
        //     limit: pageSize, // Количество записей на странице
        //     where: {
        //         [Op.or]: SearchConditions
        //     },
        //     include: [{model: OrderUnit, as: 'orderunits'}],
        // });
        // for (let i = 0; i < orders.rows.length; i++){
        //     let executorUserForThis = await Users.findAndCountAll({
        //         where: {
        //             id: orders.rows[i].dataValues.executorId
        //         }
        //     })
        //     orders.rows[i].dataValues.executorId = `${orders.rows[i].dataValues.executorId} => ${executorUserForThis.rows[0].dataValues.name}`
        //
        //     let userForThis = await Users.findAndCountAll({
        //         where: {
        //             id: orders.rows[i].dataValues.userid
        //         }
        //     })
        //     orders.rows[i].dataValues.userid = `${orders.rows[i].dataValues.userid} => ${userForThis.rows[0].dataValues.name}`
        // }
        // orders.metadataProduct = Object.keys(Order.rawAttributes)
        // orders.metadataProductUnit = Object.keys(OrderUnit.rawAttributes)
    } else if (body.name === "OneOrder") {
        // console.log(body.id);
        let order = await Order.findOne({
            where: {
                id: parseInt(body.id)
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
        if (order) {
            let executorUserForThis = await Users.findAndCountAll({
                where: {
                    id: order.dataValues.executorId
                }
            });
            if(executorUserForThis.rows[0]){
                if(executorUserForThis.rows[0].dataValues){
                    order.dataValues.executorName = executorUserForThis.rows[0].dataValues.name
                    order.dataValues.executorPhone = executorUserForThis.rows[0].dataValues.phone
                    order.dataValues.executorMessenger = executorUserForThis.rows[0].dataValues.messenger
                }
            }

            if(order.dataValues.clientId){
                let clientForThis = await Users.findAndCountAll({
                    where: {
                        id: parseInt(order.dataValues.clientId)
                    }
                });
                if(clientForThis){
                    if(clientForThis.rows[0]){
                        order.dataValues.clientName = clientForThis.rows[0].dataValues.name
                        order.dataValues.clientPhone = clientForThis.rows[0].dataValues.phone
                        order.dataValues.clientMessenger = clientForThis.rows[0].dataValues.messenger
                    }
                }
            } else {
                order.dataValues.clientName = "Немає"
                order.dataValues.clientPhone = "Немає"
                order.dataValues.clientMessenger = "Немає"
            }

            order.metadataProduct = Object.keys(Order.rawAttributes);
            order.metadataProductUnit = Object.keys(OrderUnit.rawAttributes);


            // for (let i = 0; i < order.dataValues.orderunits.length; i++) {
            //     console.log(order.dataValues.orderunits[i].dataValues);
            //     if (order.dataValues.orderunits[i].dataValues.newField1 === "product") {
            //         let fullOrderProduct = await Product.findOne({
            //             where: {
            //                 id: order.dataValues.orderunits[i].dataValues.unitId
            //             },
            //             include: [{model: ProductUnit, as: 'productunits'}]
            //         });
            //         // console.log(fullOrderProduct.dataValues);
            //         order.dataValues.orderunits[i].dataValues.fullOrderProduct = fullOrderProduct.dataValues
            //     } else {
            //         let fullMaterial = await Materials.findOne({
            //             where: {
            //                 id: order.dataValues.orderunits[i].dataValues.unitId
            //             },
            //         });
            //         if (fullMaterial) {
            //             order.dataValues.orderunits[i].dataValues.fullMaterial = fullMaterial.dataValues
            //         }
            //     }
            // }

            return order;
        } else {
            return null;
        }
    }
}