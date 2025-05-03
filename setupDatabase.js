const { Sequelize } = require('sequelize');

// Конфігурація підключення до MySQL без зазначення конкретної бази даних
const sequelizeRoot = new Sequelize('printpeaksdbnew', 'PrintPeaks', 'Kv14061992', {
    host: 'localhost',
    // host: '192.168.0.100',
    // dialect: 'mysql',
    dialect: 'mysql',
    logging: false,
});

const databaseName = 'printpeaksdbnew';

async function createDatabase() {
    try {
        await sequelizeRoot.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
        console.log(`База даних "${databaseName}" створена або вже існує.`);
    } catch (error) {
        console.error('Помилка при створенні бази даних:', error);
        process.exit(1);
    }
}

async function syncModels() {
    const sequelize = new Sequelize('printpeaksdbnew', 'PrintPeaks', 'Kv14061992', {
        host: 'localhost',
        dialect: 'mysql',
        logging: false,
    });

    try {
        // Імпортуйте та ініціалізуйте ваші моделі перед синхронізацією, якщо потрібно
        await sequelize.sync({ alter: true });
        console.log('Моделі успішно синхронізовані з базою даних.');
    } catch (error) {
        console.error('Помилка при синхронізації моделей:', error);
    } finally {
        await sequelize.close();
    }
}

async function setupDatabase() {
    await createDatabase();
    await syncModels();
    await sequelizeRoot.close();
}

setupDatabase();
