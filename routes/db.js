const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const fs = require("fs");
const {join, extname} = require("node:path");
const ExcelJS = require('exceljs');
const multer = require('multer');
const archiver = require('archiver');
// const upload = multer({ dest: 'uploads/' });
const unzipper = require('unzipper');

const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, join(__dirname, '../data/db')); // Убедитесь, что папка существует
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + extname(file.originalname)); // Присвоение уникального имени
    }
});
const uploadDB = multer({storage: storage2});

const getModel = (schema, table) => {
    return db.sequelize.define(table, {
        // Определите атрибуты динамически или используйте существующие модели
    }, {
        schema: schema,
        tableName: table,
        timestamps: false, // Настройте по необходимости
    });
};
// Получение всех заказов (доступно только администратору или менеджеру)
router.get('/databases',
    authMiddleware,
    roleMiddleware(['admin' , 'operator']),
    async (req, res) => {
        try {
            // Получение списка схем
            const [schemas] = await db.sequelize.query(`
                SELECT schema_name
                FROM information_schema.schemata
                WHERE schema_name NOT IN ('information_schema', 'pg_catalog');
            `);

            console.log('Schemas:', schemas); // Отладочный вывод

            if (!schemas || schemas.length === 0) {
                return res.status(404).json({message: 'Схемы не найдены.'});
            }

            // Для каждой схемы получение таблиц
            const result = {};
            for (const schema of schemas) {
                console.log('Current schema object:', schema); // Отладка

                const schemaName = schema.schema_name;
                if (!schemaName) {
                    console.error('Свойство schema_name отсутствует в объекте схемы:', schema);
                    continue; // Пропускаем эту схему
                }

                const [tables] = await db.sequelize.query(`
                    SELECT table_name
                    FROM information_schema.tables
                    WHERE table_schema = :schema
                `, {
                    replacements: {schema: schemaName},
                    type: db.Sequelize.QueryTypes.SELECT
                });

                console.log(`Tables in schema ${schemaName}:`, tables); // Отладка

                result[schemaName] = tables.map(t => t.table_name);
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Ошибка при получении баз данных:', error);
            res.status(500).send('Ошибка при получении баз данных.');
        }
    });

router.post('/tables',
    authMiddleware,
    roleMiddleware(['admin' , 'operator']),
    async (req, res) => {
        try {
            // Выполнение запроса для получения списка таблиц из схемы public
            const [tables] = await db.sequelize.query('SHOW TABLES');

            // Проверка, есть ли таблицы
            if (!tables || tables.length === 0) {
                return res.status(404).json({message: 'Таблицы не найдены.'});
            }
            // console.log(tables);
            // Извлечение имен таблиц
            const tableNames = tables.map(table => table.Tables_in_printpeaksdbnew);

            res.status(200).json({tables: tableNames});
        } catch (error) {
            console.error('Ошибка при получении таблиц:', error);
            res.status(500).send('Ошибка при получении таблиц.');
        }
    }
);

router.post('/export-excel',
    authMiddleware,
    roleMiddleware(['admin' , 'operator']),
    async (req, res) => {

        // const table = req.body.table;
        // const schema = req.body.schema;
        // console.log(req.body);

        // if (!schema || !table) {
        //     return res.status(400).send('Необходимо указать схему и таблицу.');
        // }

        try {
            // const Model = getModel(schema, table);
            // await Model.sync(); // Убедитесь, что модель синхронизирована
            // console.log(Model);
            const records = await db.Material.findAll({raw: true});
            // console.log(records);
            if (records.length === 0) {
                return res.status(400).send('Нет данных для экспорта.');
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Material");

            // Добавление заголовков
            const columns = Object.keys(records[0]);
            worksheet.columns = columns.map(col => ({header: col, key: col}));

            // Добавление строк
            // records.forEach(record => {
            //     worksheet.addRow(record);
            // });
            const sanitizeData = (data) => JSON.parse(JSON.stringify(data));
            const sanitizedRecords = records.map(sanitizeData);
            sanitizedRecords.forEach(record => {
                worksheet.addRow(record);
            });

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="Material".xlsx`
            );

            await workbook.xlsx.write(res).catch((error) => {
                console.error('Ошибка при записи Excel:', error);
                res.status(500).send('Ошибка при записи Excel.');
                throw error;
            });
            res.end();
        } catch (error) {
            console.error('Ошибка при экспорте Excel:', error);
            res.status(500).send('Ошибка при экспорте данных.');
        }
    });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, join(__dirname, '../data')); // Убедитесь, что папка существует
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + extname(file.originalname)); // Присвоение уникального имени
    }
});
const upload = multer({storage: storage});

// Маршрут для импорта данных из Excel
router.post('/import-excel',
    authMiddleware,
    roleMiddleware(['admin' , 'operator']),
    upload.single('file'), async (req, res) => {
        const {schema, table} = req.body;
        // if (!schema || !table) {
        //     return res.status(400).send('Необходимо указать схему и таблицу.');
        // }

        if (!req.file) {
            return res.status(400).send('Файл не загружен.');
        }

        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(req.file.path);
            const worksheet = workbook.worksheets[0]; // Предполагаем, что данные на первом листе

            const columns = worksheet.getRow(1).values.slice(1); // Первый ряд - заголовки

            // const Model = getModel(schema, table);
            // await Model.sync(); // Убедитесь, что модель синхронизирована

            const rows = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Пропустить заголовок

                const record = {};
                columns.forEach((col, index) => {
                    record[col] = row.values[index + 1];
                });
                rows.push(record);
            });

            // Вставка данных
            await db.Material.bulkCreate(rows);

            res.send('Данные успешно импортированы.');
        } catch (error) {
            console.error('Ошибка при импорте Excel:', error);
            res.status(500).send('Ошибка при импорте данных.');
        }
    });





//---------------------------------------------------------------------------
const getModelKeys = (dbObj) => {
    return Object.keys(dbObj).filter(key => {
        // Припускаємо, що моделі мають метод findAll і не є назвами "sequelize" чи "Sequelize"
        return key !== 'sequelize' &&
            key !== 'Sequelize' &&
            dbObj[key] &&
            typeof dbObj[key].findAll === 'function';
    });
};
router.get('/export-data', authMiddleware,
    roleMiddleware(['admin']), async (req, res) => {
    try {
        const archive = archiver('zip');
        res.attachment('database_backup.zip');
        archive.pipe(res);

        // Фильтруем ключи, чтобы использовать только валидные модели
        const modelKeys = Object.keys(db).filter(key => {
            // Исключаем ключи, которые не являются моделями
            return key !== 'sequelize' &&
                key !== 'Sequelize' &&
                db[key] &&
                typeof db[key].findAll === 'function';
        });

        // Экспортируем данные для каждой модели
        for (const key of modelKeys) {
            try {
                console.log(`Экспорт модели: ${key}`);
                const data = await db[key].findAll();
                const jsonData = JSON.stringify(data, null, 2);
                archive.append(jsonData, { name: `${key}.json` });
            } catch (innerError) {
                console.error(`Ошибка при экспорте модели ${key}:`, innerError);
                // Вы можете решить, нужно ли прерывать выполнение или продолжать с другими моделями
            }
        }

        await archive.finalize();
    } catch (error) {
        console.error('Общая ошибка экспорта:', error);
        res.status(500).send('Ошибка при генерации архива');
    }
});
// {zlib: {level: 9}}
// router.post('/import-data', authMiddleware,
//     roleMiddleware(['admin']), uploadDB.single('archive'), async (req, res) => {
//     try {
//         const archivePath = req.file.path;
//         const extractPath = join(__dirname, '../data/extracted'); // Папка для распаковки
//
//         // Распаковываем архив
//         await fs.createReadStream(archivePath)
//             .pipe(unzipper.Extract({ path: extractPath }))
//             .promise();
//
//         // Итерируем по ключам db для обработки файлов
//         for (const key in db) {
//             if (db[key] && typeof db[key].bulkCreate === 'function') {
//                 const filePath = join(extractPath, `${key}.json`);
//                 if (fs.existsSync(filePath)) {
//                     const jsonData = fs.readFileSync(filePath, 'utf8');
//                     const records = JSON.parse(jsonData);
//                     await db[key].bulkCreate(records, {
//                         updateOnDuplicate: Object.keys(db[key].rawAttributes)
//                     });
//                 }
//             }
//         }
//
//         res.send('Данные успешно импортированы');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Ошибка при импорте данных');
//     } finally {
//         // Опционально: можно добавить удаление временных файлов из папок 'uploads' и 'extracted'
//     }
// });
router.post('/import-data', authMiddleware,
    roleMiddleware(['admin']), uploadDB.single('archive'), async (req, res) => {
        try {
            const archivePath = req.file.path;
            const extractPath = join(__dirname, '../data/extracted'); // Папка для распаковки

            // Распаковываем архив
            await fs.createReadStream(archivePath)
                .pipe(unzipper.Extract({ path: extractPath }))
                .promise();

            // Итерируем по ключам db для обработки файлов
            for (const key in db) {
                if (db[key] && typeof db[key].bulkCreate === 'function') {
                    const filePath = join(extractPath, `${key}.json`);
                    if (fs.existsSync(filePath)) {
                        const jsonData = fs.readFileSync(filePath, 'utf8');
                        let records = JSON.parse(jsonData);

                        const attributes = db[key].rawAttributes;

                        // Преобразуем значения полей с "" → null, если поле INTEGER
                        records = records.map(record => {
                            for (const field in record) {
                                if (
                                    record[field] === '' &&
                                    attributes[field] &&
                                    attributes[field].type &&
                                    attributes[field].type.constructor &&
                                    attributes[field].type.constructor.name === 'INTEGER'
                                ) {
                                    record[field] = null;
                                }
                            }
                            return record;
                        });

                        await db[key].bulkCreate(records, {
                            updateOnDuplicate: Object.keys(attributes)
                        });
                    }
                }
            }

            res.send('Данные успешно импортированы');
        } catch (error) {
            console.error(error);
            res.status(500).send('Ошибка при импорте данных');
        } finally {
            // Опционально: можно добавить удаление временных файлов из папок 'uploads' и 'extracted'
        }
    });

module.exports = router;