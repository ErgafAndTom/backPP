const fs = require('fs');
const mysql = require('mysql2');
const csv = require('csv-parser');

// Настройки подключения к базе данных MySQL
const connection = mysql.createConnection({
    host: 'ваш_host',
    user: 'ваш_пользователь',
    password: 'ваш_пароль',
    database: 'ваша_база_данных'
});

// Имя файла CSV
const csvFilePath = 'путь_к_файлу/output.csv';

// Функция для вставки или обновления данных в MySQL
function importCsvToMySQL() {
    const rows = [];

    // Чтение CSV-файла
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            rows.push(row);
        })
        .on('end', () => {
            // Вставка данных в таблицу
            // rows.forEach((row) => {
            //     const sql = `
            //     REPLACE INTO ваша_таблица (столбец1, столбец2, столбец3, ...)
            //     VALUES (?, ?, ?, ...);
            //     `;
            //
            //     // Преобразуйте значения row в массив
            //     const values = [row.столбец1, row.столбец2, row.столбец3, ...];
            //
            //     connection.query(sql, values, (error, results) => {
            //         if (error) {
            //             console.error('Ошибка при вставке данных:', error);
            //         } else {
            //             console.log('Данные успешно вставлены/обновлены:', results);
            //         }
            //     });
            // });

            // Закрываем соединение после завершения всех операций
            connection.end();
        });
}

// Запуск функции импорта
importCsvToMySQL();
