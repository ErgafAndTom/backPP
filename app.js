const lifeHacksRoutes = require("./routes/lifeHacks");
const express = require('express');
const session = require('express-session');
const db = require('./models');
const authRoutes = require('./routes/auth');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const orderRoutes = require('./routes/orders');
const orderUnitsRoutes = require('./routes/orderUnits');
const oldRoutes = require('./routes/old');
const userRoutes = require('./routes/user');
const materialRoutes = require('./routes/materials');
const calcRoutes = require('./routes/calc');
const statisticsRoutes = require('./routes/statistics');
const trelloRoutes = require('./routes/trello');
const dbRoutes = require('./routes/db');
const novaposhtaRoutes = require('./routes/novaposhta');
const counterpartyRoutes = require('./routes/counterparty');
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");
const processingPrice = require("./back/price/processingPrices");
const path = require("path");
const createAdmin = require("./initAdmin");
const { createElementalStructure } = require("./coldStart");
const { exec } = require("child_process");
const https = require("https");
const {createServer} = require("node:http");
const authMiddleware = require("./middlewares/auth");
const roleMiddleware = require("./middlewares/role");
const cors = require('cors');
const invoiceRoutes = require('./routes/invoices');
require('dotenv').config();
// 1

const app = express();

// Налаштування CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

app.use(express.json());

const sessionStore = new SequelizeStore({
    db: db.sequelize,
    tableName: 'sessions',
});

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your_session_secret_key',
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
    })
);
const PathToBuild = "frontpp";
app.use(express.static(path.resolve(__dirname, `../${PathToBuild}/build`)));
app.use('/fonts', express.static(path.resolve(__dirname, 'data/fonts')));
app.get(['/Orders','/Orders/*', '/Desktop', '/Users', '/Storage', '/db2', '/Trello', '/login', '/Invoices', '/Invoices/*', '/Contractors', '/Contractors/*'], (req, res) => {
    res.sendFile(path.resolve(__dirname, `../${PathToBuild}/build`, 'index.html'));
});

app.get('/images/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'data/inTrelloPhoto', req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Фото не найдено');
        }
    });
});
// app.get('/files/:orderId/:fileName',
//     authMiddleware,
//     roleMiddleware(['admin']),
//     (req, res) => {
//     const filePath = path.join(__dirname, `data/inOrderFiles/${req.params.orderId}`, req.params.fileName);
//     res.sendFile(filePath, (err) => {
//         if (err) {
//             res.status(404).send('Фото не найдено');
//         }
//     });
// });
app.get('/files/:orderId/:fileName',
    authMiddleware,
    roleMiddleware(['admin']),
    (req, res) => {
        const orderId = req.params.orderId;
        const fileName = req.params.fileName;

        // Validate input to prevent directory traversal attacks
        if (!/^\d+$/.test(orderId) || /[<>:"\/\\|?*\x00-\x1F]/.test(fileName)) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        const filePath = path.join(__dirname, 'data/inOrderFiles', orderId, fileName);

        // Check if file exists before sending
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).json({ error: 'File not found' });
            }

            // Set headers for better performance
            res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
            res.sendFile(filePath, (err) => {
                if (err) {
                    console.error(`Error sending file: ${err.message}`);
                    res.status(500).json({ error: 'Error retrieving file' });
                }
            });
        });
    }
);

app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/orderUnits', orderUnitsRoutes);
app.use('/old', oldRoutes);
app.use('/user', userRoutes);
app.use('/materials', materialRoutes);
app.use('/calc', calcRoutes);
app.use('/statistics', statisticsRoutes);
app.use('/db', dbRoutes);
app.use('/trello', trelloRoutes);
app.use('/novaposhta', novaposhtaRoutes);
app.use('/counterparties', counterpartyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);

// Правильний проміжний обробник для перенаправлення запитів контрагентів
app.use('/api/contractors', (req, res, next) => {
    const basePath = '/api/invoices/contractors';
    if (req.path === '/') {
        // Перенаправлення на /api/invoices/contractors/all
        app._router.handle({ 
            method: req.method, 
            url: `${basePath}/all`, 
            headers: req.headers,
            body: req.body,
            query: req.query,
            app
        }, res, next);
    } else if (req.path === '/search') {
        // Перенаправлення на /api/invoices/contractors/search
        app._router.handle({ 
            method: req.method, 
            url: `${basePath}/search?${new URLSearchParams(req.query).toString()}`, 
            headers: req.headers,
            body: req.body,
            query: req.query,
            app
        }, res, next);
    } else {
        res.status(404).json({ error: 'Маршрут не знайдено' });
    }
});
// 1
app.use("/lifehack", lifeHacksRoutes);

let tableNew;
let pricesNew;
function readPricesNew() {
    readXlsxFile(fs.createReadStream(__dirname + "/data/PricesNEW.xlsx")).then((rows) => {
        tableNew = rows;
        pricesNew = processingPrice.processingPricesInTableToPrices(tableNew);
        console.log("Цены преобразованы");
    });
}

app.get('/getpricesNew', (req, res) => {
    res.status(200).json(pricesNew);
});

const PORT = process.env.PORT || 5555;
// const PORT = process.env.PORT || 5555;


db.sequelize.sync(
    // {force: true}
).then(async () => {
    await createAdmin();
    try {
        await readPricesNew();
        await sessionStore.sync();
        console.log('Таблица сессий синхронизирована');

        // let options = {
        //     key: fs.readFileSync(__dirname + "/data/sslNew/key.txt"),
        //     cert: fs.readFileSync(__dirname + "/data/sslNew/mainCert.txt"),
        //     ca: fs.readFileSync(__dirname + "/data/sslNew/CABUNDLE.txt")
        // };
        // const httpsServer = https.createServer(options, app);

        const httpServer = createServer(app);
        httpServer.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}!`);
        });
    } catch (e) {
        console.error('Ошибка запуска сервера:', e);
    }
}).catch(async (err) => {
    // if (err.original && err.original.code === 'ER_NO_DB_ERROR') {
    //     exec('mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS PrintPeaksDBNew;"', (error) => {
    //         if (error) {
    //             console.error('Ошибка создания базы данных:', error);
    //         } else {
    //             console.log('База данных создана или уже существует.');
    //             db.sequelize.sync(
    //                 // { force: true }
    //             ).then(() => {
    //                 console.log('База данных синхронизирована');
    //             }).catch((syncErr) => {
    //                 console.error('Ошибка синхронизации базы данных:', syncErr);
    //             });
    //         }
    //     });
    // } else {
    //     console.error('Ошибка синхронизации базы данных:', err);
    // }
    console.error('Ошибка синхронизации базы данных:', err);
});

// 82.193.98.232:6666
