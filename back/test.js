const mysql = require('mysql2/promise');

module.exports = {
    test: async function test() {
        const connection = await mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            database: "databaseName",
            password: "Kv14061992"
        });

        try {
            // Начало транзакции
            await connection.beginTransaction();

            // Первый запрос: добавление записи в таблицу users
            const sql1 = 'INSERT INTO users (name, age) VALUES (?, ?)';
            const data1 = ['Ivan', 30]
            const [insertResult] = await connection.execute(sql1, data1);
            const userId = insertResult.insertId;

            // Второй запрос: добавление записи в таблицу orders, используя результат первого запроса
            const sql2 = 'INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)';
            const data2 = [userId, 1, 2]
            await connection.execute(sql2, data2);

            // Завершение транзакции
            await connection.commit();
            console.log('Транзакция успешно выполнена');
        } catch (error) {
            // Откат транзакции в случае ошибки
            await connection.rollback();
            console.error('Ошибка во время транзакции:', error);
        } finally {
            // Закрытие соединения
            await connection.end();
        }
    }
};