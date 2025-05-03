module.exports = {
    adminAddToTable: async function adminAddToTable(req, res, body, Files, Sessions, Users, Orders, Actions, Services, Devices, Materials){
        try {
            const pageNumber = body.currentPage; // Номер страницы (первая страница - 1)
            const pageSize = body.inPageCount; // Размер страницы
            if(body.tableName === 'devices'){
                let created = await Devices.create({
                    name: body.name,
                    type: body.type,
                    units: body.units,
                    price: body.price,
                })
                const toSend = await Devices.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                })
                toSend.status = true
                res.send(toSend)
            }
            if(body.tableName === 'Склад'){
                let created = await Materials.create(body.formValues)
                const toSend = await Materials.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                })
                toSend.metadata = Object.keys(Materials.rawAttributes)
                toSend.status = true
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
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        }
    }
}