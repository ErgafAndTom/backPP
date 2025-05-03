const mysql = require("mysql2/promise");
module.exports = {
    getOrdersAwait: async function (req, res, body, configSQLConnection) {
        const connection = await mysql.createConnection(configSQLConnection);

        try {
            // Начало транзакции
            await connection.beginTransaction();

            let data1 = [body.inPageCount];
            let sql1 = "SELECT CEIL(COUNT(*)/?) as totalP FROM orders;"
            const [insertResult1] = await connection.execute(sql1, data1);

            let isPageToNumber = 0;
            if(body.page > 1){
                isPageToNumber = body.page*body.inPageCount
                isPageToNumber = isPageToNumber - body.inPageCount;
                // console.log(isPageToNumber);
            }

            let data2 = [body.inPageCount, isPageToNumber];
            let sql2 = "SELECT * FROM orders ORDER BY id DESC LIMIT ? OFFSET ?;"
            const [insertResult2] = await connection.query(sql2, data2);


            for (const order of insertResult2) {
                let data3 = [order.id];
                let sql3 = "SELECT * FROM files WHERE orderid=?;"
                const [insertResult3] = await connection.query(sql3, data3);
                order.files = insertResult3

                let data4 = [order.userid];
                let sql4 = "SELECT * FROM users WHERE id = ?"
                const [insertResult4] = await connection.query(sql4, data4);
                order.user = insertResult4[0]
            }

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
            console.log("Замовлення просмотрели");
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