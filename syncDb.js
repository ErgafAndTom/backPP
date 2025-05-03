const db = require('./models');

async function syncDatabase() {
    try {
        console.log('Початок синхронізації бази даних...');
        await db.sequelize.sync({ 
            force: true,
            cascade: true 
        });
        console.log('База даних успішно синхронізована');
    } catch (error) {
        console.error('Помилка синхронізації:', error);
    } finally {
        process.exit();
    }
}

syncDatabase(); 