const mysql = require("mysql2/promise");
const {addStatistics} = require("../log/log");
module.exports = {
    updateOrder: async function (req, res, body, configSQLConnection) {
        const connection = await mysql.createConnection(configSQLConnection);

        try {
            // Начало транзакции
            await connection.beginTransaction();

            console.log(body);
            let data3 = ["прийнятий", body];
            let sql3 = "UPDATE orders SET status=? WHERE id = ?";
            const [insertResult3] = await connection.query(sql3, data3);
            // console.log(insertResult3);

            await connection.commit();
            addStatistics(req.userId, req.sessionId, "update order", "success", body, configSQLConnection, "")
            res.send({
                status: "ok",
                orderId: body
            })
            console.log(`updateOrder id: ${body}`);
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