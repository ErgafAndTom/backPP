const mysql = require("mysql2/promise");
module.exports = {
    getUsers: async function (req, res, body, configSQLConnection) {
        const connection = await mysql.createConnection(configSQLConnection);

        try {
            // Начало транзакции
            await connection.beginTransaction();

            let data1 = [body.inPageCount];
            let sql1 = "SELECT CEIL(COUNT(*)/?) as totalP FROM users;"
            const [insertResult1] = await connection.query(sql1, data1);

            let isPageToNumber = 0;
            if(body.page > 1){
                isPageToNumber = body.page*body.inPageCount
                isPageToNumber = isPageToNumber - body.inPageCount;
                // console.log(isPageToNumber);
            }

            let data2 = [body.inPageCount, isPageToNumber];
            let sql2 = "SELECT * FROM users ORDER BY id DESC LIMIT ? OFFSET ?;"
            const [insertResult2] = await connection.query(sql2, data2);

            await connection.commit();

            let toSend = {
                status: "ok",
                data: {
                    pageCount: insertResult1[0].totalP,
                    page: body.page,
                    data: insertResult2
                }
            }
            res.send(toSend)
            console.log("Користувачів просмотрели");
        } catch (error) {
            await connection.rollback();
            console.error('Ошибка во время транзакции:', error);
            res.send({
                status: "error",
                error: error
            })
        } finally {
            await connection.end();
        }
    }
};