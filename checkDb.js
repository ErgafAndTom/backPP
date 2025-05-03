const db = require('./models');

async function checkOrders() {
    try {
        const orders = await db.Order.findAll({
            attributes: ['id', 'status', 'manufacturingStartTime', 'finalManufacturingTime', 'totalManufacturingTimeSeconds']
        });
        
        console.log('=== Замовлення в базі даних ===');
        orders.forEach(order => {
            console.log(`\nЗамовлення ID: ${order.id}`);
            console.log(`Статус: ${order.status}`);
            console.log(`Час початку: ${order.manufacturingStartTime}`);
            console.log(`Час завершення: ${order.finalManufacturingTime}`);
            console.log(`Загальний час (сек): ${order.totalManufacturingTimeSeconds}`);
        });
    } catch (error) {
        console.error('Помилка при отриманні даних:', error);
    } finally {
        process.exit();
    }
}

checkOrders(); 