const {Op} = require("../../modelDB");
module.exports = {
    adminDeleteInTable: async function adminDeleteInTable(req, res, body, Files, Sessions, Users, Orders, Actions, Services, Devices, Materials){
        const pageNumber = body.currentPage; // Номер страницы (первая страница - 1)
        const pageSize = body.inPageCount; // Размер страницы
        let searchString = `%${body.search}%`;
        if(body.tableName === 'devices'){
            await Devices.destroy({
                where: {
                    id: body.id
                }
            });
            const toSend = await Devices.findAndCountAll({
                offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                limit: pageSize, // Количество записей на странице
            })
            toSend.status = true
            res.send(toSend)
        }
        if(body.tableName === 'Склад'){
            await Materials.destroy({
                where: {
                    id: body.id
                }
            });
            let fieldsForSearch = Object.keys(Materials.rawAttributes);
            let SearchConditions = fieldsForSearch.map(field => ({[field]: {[Op.like]: searchString}}));
            let toSend;
            if(body.search.length > 0){
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
        if(body.name === 'services'){
            const toSend = await Services.findAndCountAll({
                offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                limit: pageSize, // Количество записей на странице
            })
            res.send(toSend)
        }
        if(body.name === 'sessions'){
            const toSend = await Sessions.findAndCountAll({
                offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                limit: pageSize, // Количество записей на странице
            })
            res.send(toSend)
        }
        if(body.name === 'users'){
            const toSend = await Users.findAndCountAll({
                offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                limit: pageSize, // Количество записей на странице
            })
            res.send(toSend)
        }
        if(body.name === 'files'){
            const toSend = await Files.findAndCountAll({
                offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                limit: pageSize, // Количество записей на странице
            })
            res.send(toSend)
        }
        if(body.name === 'orders'){
            const toSend = await Orders.findAndCountAll({
                offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                limit: pageSize, // Количество записей на странице
            })
            res.send(toSend)
        }
        if(body.name === 'actions'){
            const toSend = await Actions.findAndCountAll({
                offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                limit: pageSize, // Количество записей на странице
            })
            res.send(toSend)
        }
    }
}