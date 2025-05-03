const mysql = require("mysql2");
module.exports = {
    getSessionsCountOfPage: function getSessionsCountOfPage(req, res, body, configSQLConnection){
        let connection = mysql.createConnection(configSQLConnection);
        let dataToSql = [body.inPageCount];
        let sql = "SELECT CEIL(COUNT(*)/?) as totalP FROM sessions;"
        connection.query(sql, dataToSql,function (err, results) {
            if (err) {
                console.log(err);
                let toSend = {
                    status: "error",
                    error: "mySql error"
                }
                res.send(toSend)
            } else {
                getSessionsPageAndSend(req, res, body, results, configSQLConnection)
            }
        });
        connection.end();
    }
}

function getSessionsPageAndSend(req, res, body, resultsPageCount, configSQLConnection){
    let connection = mysql.createConnection(configSQLConnection);

    let isPageToNumber = 0;
    if(body.page > 1){
        isPageToNumber = body.page*body.inPageCount
        isPageToNumber = isPageToNumber - body.inPageCount;
        // console.log(isPageToNumber);
    }

    let dataToSql = [body.inPageCount, isPageToNumber];
    let sql = "SELECT * FROM sessions ORDER BY id DESC LIMIT ? OFFSET ?;"
    connection.query(sql, dataToSql,function (err, results) {
        if (err) {
            console.log(err);
            let toSend = {
                status: "error",
                error: "mySql error"
            }
            res.send(toSend)
        } else {
            console.log("Сессии просмотрели");
            let toSend = {
                status: "ok",
                data: {
                    pageCount: resultsPageCount[0].totalP,
                    page: body.page,
                    data: results
                }
            }
            res.send(toSend)
        }
    });
    connection.end();
}