const mysql = require("mysql2");
module.exports = {
    addStatistics: async function addStatistics(userid, session, whatAction, result, targetId, value, Actions) {
        // let dataToSql = [
        //     userid, session, whatAction, Date.now().toString(), result, targetId, value
        // ]
        // const sql = "INSERT INTO actions(userid, session, whatAction, time, result, targetId, value) VALUES(?, ?, ?, ?, ?, ?, ?)";
        // const connectionCreateTablActions = mysql.createConnection(configSQLConnection);
        // connectionCreateTablActions.query(sql, dataToSql,
        //     function (err, results) {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //
        //         }
        //     });
        // connectionCreateTablActions.end();
        const createdFile = await Actions.create({
            userid: userid,
            session: session,
            whatAction: whatAction,
            result: result,
            targetId: targetId,
            value: value,
        });
    }
}