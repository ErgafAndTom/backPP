const fs = require('fs');
const mysql = require('mysql2');

// Настройки подключения к базе данных MySQL
const connection = mysql.createConnection({
    host: 'ваш_host',
    user: 'ваш_пользователь',
    password: 'ваш_пароль',
    database: 'ваша_база_данных'
});

// Путь для сохранения CSV-файла
const csvFilePath = 'output.csv';

// SQL-запрос для извлечения данных из таблицы
const query = 'SELECT * FROM ваша_таблица';

connection.query(query, (error, results) => {
    if (error) {
        console.error('Ошибка при выполнении запроса:', error);
        return;
    }

    // Получаем заголовки (имена столбцов)
    const headers = Object.keys(results[0]);
    const rows = results.map(row => Object.values(row));

    // Открываем файл для записи
    const writeStream = fs.createWriteStream(csvFilePath);

    // Записываем заголовки в CSV
    writeStream.write(headers.join(',') + '\n');

    // Записываем данные построчно
    rows.forEach(row => {
        writeStream.write(row.join(',') + '\n');
    });

    writeStream.end(() => {
        console.log(`Данные успешно экспортированы в файл ${csvFilePath}`);
        connection.end();
    });
});
