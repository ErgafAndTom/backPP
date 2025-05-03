const {Types, sequelize} = require("../../modelDB");
module.exports = {
    adminGetTable: async function adminGetTable(req, res, body, Files, Sessions, Users, Orders, Actions, Services, Devices, Materials, Counters, Op){

        try {
            let searchString = `%${body.search}%`;
            const pageNumber = body.currentPage; // Номер страницы (первая страница - 1)
            const pageSize = body.inPageCount; // Размер страницы
            const columnNameForOrder = body.columnName.column; // Ім'я колонки для сортування
            let toColumn = 'ASC'
            if (body.columnName.reverse) {
                toColumn = 'DESC'
            }

            if (body.name === 'Devices') {
                let fieldsForSearch = Object.keys(Materials.rawAttributes);
                let SearchConditions = fieldsForSearch.map(field => ({[field]: {[Op.like]: searchString}}));
                let toSend;
                if (body.search.length > 0) {
                    toSend = await Devices.findAndCountAll({
                        offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                        limit: pageSize, // Количество записей на странице
                        where: {
                            [Op.or]: SearchConditions
                        },
                        order: [
                            [columnNameForOrder, toColumn] // Сортування за заданою колонкою
                        ]
                    })
                } else {
                    toSend = await Devices.findAndCountAll({
                        offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                        limit: pageSize, // Количество записей на странице
                        order: [
                            [columnNameForOrder, toColumn] // Сортування за заданою колонкою
                        ]
                    })
                }
                toSend.metadata = Object.keys(Devices.rawAttributes)
                res.send(toSend)
            }
            if (body.name === 'Склад') {
                let fieldsForSearch = Object.keys(Materials.rawAttributes);
                let SearchConditions = fieldsForSearch.map(field => ({[field]: {[Op.like]: searchString}}));
                let toSend;
                if (body.search.length > 0) {
                    toSend = await Materials.findAndCountAll({
                        offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                        limit: pageSize, // Количество записей на странице
                        where: {
                            [Op.or]: SearchConditions
                        }
                    })
                } else {
                    toSend = await Materials.findAndCountAll({
                        offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                        limit: pageSize, // Количество записей на странице
                    })
                }
                toSend.metadata = Object.keys(Materials.rawAttributes)
                res.send(toSend)
            }
            if (body.name === 'Users') {
                let fieldsForSearch = Object.keys(Users.rawAttributes);
                let SearchConditions = fieldsForSearch.map(field => ({[field]: {[Op.like]: searchString}}));
                let toSend;
                if (body.search.length > 0) {
                    toSend = await Users.findAndCountAll({
                        offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                        limit: pageSize, // Количество записей на странице
                        where: {
                            [Op.or]: SearchConditions
                        }
                    })
                } else {
                    toSend = await Users.findAndCountAll({
                        offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                        limit: pageSize, // Количество записей на странице
                    })
                }
                toSend.metadata = Object.keys(Users.rawAttributes)
                res.send(toSend)
            }
            if (body.name === 'Лічиньники') {
                const toSend = await Counters.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                })
                toSend.metadata = Object.keys(Counters.rawAttributes)
                res.send(toSend)
            }
            if (body.name === 'Types') {
                const toSend = await Types.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                })
                res.send(toSend)
            }
            if (body.name === 'services') {
                const toSend = await Services.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                })
                res.send(toSend)
            }
            if (body.name === 'sessions') {
                const toSend = await Sessions.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                })
                res.send(toSend)
            }
            if (body.name === 'users') {
                const toSend = await Users.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                })
                res.send(toSend)
            }
            if (body.name === 'files') {
                const toSend = await Files.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                })
                res.send(toSend)
            }
            if (body.name === 'orders') {
                const toSend = await Orders.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                })
                res.send(toSend)
            }
            if (body.name === 'actions') {
                const toSend = await Actions.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                })
                res.send(toSend)
            }

            if (body.name === 'MaterialsPrices') {
                let toSend;
                if (body.material.type === "Папір" || body.material.type === "Плівка") {
                    toSend = await Materials.findAndCountAll({
                        offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                        limit: pageSize, // Количество записей на странице
                        where: {
                            type: body.material.type,
                            [Op.and]: sequelize.where(
                                sequelize.cast(sequelize.col('thickness'), 'UNSIGNED'),
                                {
                                    [Op.between]: (() => {
                                        if (body.material.thickness === "Тонкі") return [0, 140];
                                        if (body.material.thickness === "Середньої щільності") return [141, 240];
                                        if (body.material.thickness === "Цупкі") return [241, 999999];
                                        // if (body.thickness === "Самоклеючі") return [241, 999999];
                                        return [0, 1000000]; // Для випадків, коли товщина не задана або інша
                                    })()
                                }
                            )
                        }
                    })
                } else if (body.material.type === "Ламінування"){
                    toSend = await Materials.findAndCountAll({
                        offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                        limit: pageSize, // Количество записей на странице
                        where: {
                            type: body.material.type,
                            name: body.material.material
                        }
                    })
                } else if (body.material.type === "Папір Широкоформат"){
                    toSend = await Materials.findAndCountAll({
                        offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                        limit: pageSize, // Количество записей на странице
                        where: {
                            type: body.material.type,
                            // name: body.material.material
                        }
                    })
                }
                toSend.metadata = Object.keys(Materials.rawAttributes)
                res.send(toSend)
            }
        } catch (e) {
        }
    }
}