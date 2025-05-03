const mysql = require('mysql2/promise');
const {addStatistics} = require("../log/log");

module.exports = {
    createOrder: async function (req, res, body, configSQLConnection) {
        const connection = await mysql.createConnection(configSQLConnection);

        try {
            // Начало транзакции
            await connection.beginTransaction();

            let userId = req.userId
            if(req.userId === 0){
                const data1 = [body.name, "user", body.mail, body.phone, body.messenger]
                const sql1 = "INSERT INTO users(name, role, mail, phone, messenger) VALUES(?, ?, ?, ?, ?)";
                const [insertResult1] = await connection.execute(sql1, data1);
                userId = insertResult1.insertId;

                let data2 = [userId, req.sessionId];
                let sql2 = "UPDATE sessions SET userid=? WHERE id = ?";
                const [insertResult2] = await connection.execute(sql2, data2);
            }
            let data3 = [userId, "очікування", Date.now().toString()];
            let sql3 = "INSERT INTO orders(userid, status, timeCreate) VALUES(?, ?, ?)";
            const [insertResult3] = await connection.execute(sql3, data3);


            let data4 = [insertResult3.insertId, req.sessionValue, true];
            let sql4 = "UPDATE files SET orderid=? WHERE session = ? AND inBasket = ?";
            const [insertResult4] = await connection.execute(sql4, data4);


            await connection.commit();
            addStatistics(req.userId, req.sessionId, "add order", "success", insertResult3.insertId, configSQLConnection, "")
            res.send({
                status: "ok",
                orderId: insertResult3.insertId
            })
            console.log(`createOrder id: ${insertResult3.insertId}`);
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