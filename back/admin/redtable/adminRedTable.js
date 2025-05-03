
async function adminRedTable(req, res, body, Files, Sessions, Users, Orders, Actions, Services, Devices, Materials){
    const pageNumber = body.currentPage; // Номер страницы (первая страница - 1)
    const pageSize = body.inPageCount; // Размер страницы
    if(body.tableName === 'Склад'){
        const updatedFields = {};
        updatedFields[body.tablePosition] = body.input
        const [rowsUpdated] = await Materials.update(updatedFields, {
            where: { id: body.id },
        });
        if (rowsUpdated === 1) {
            const toSend = await Materials.findAndCountAll({
                offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                limit: pageSize, // Количество записей на странице
            })
            toSend.metadata = Object.keys(Materials.rawAttributes)
            res.send(toSend)
        } else {
            res.send("error")
        }
    }
}

module.exports = {
    adminRedTable
}