const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middlewares/auth');
const path = require('path');
const fs = require('fs');
const { generateInvoiceDocx } = require('../services/document/generate_invoice');
const { Op } = require('sequelize');

// Отримати всі рахунки
router.get('/', authMiddleware, async (req, res) => {
    try {
        const invoices = await db.Invoice.findAll({
            include: [
                {
                    model: db.Contractor,
                    as: 'supplier',
                    attributes: ['id', 'name']
                },
                {
                    model: db.Contractor,
                    as: 'buyer',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(invoices);
    } catch (err) {
        console.error('Помилка при отриманні рахунків:', err);
        res.status(500).json({ error: 'Помилка сервера при отриманні рахунків' });
    }
});

// Отримати окремий рахунок за id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const invoice = await db.Invoice.findByPk(req.params.id, {
            include: [
                {
                    model: db.Contractor,
                    as: 'supplier',
                },
                {
                    model: db.Contractor,
                    as: 'buyer',
                }
            ]
        });

        if (!invoice) {
            return res.status(404).json({ error: 'Рахунок не знайдено' });
        }

        res.status(200).json(invoice);
    } catch (err) {
        console.error('Помилка при отриманні рахунку:', err);
        res.status(500).json({ error: 'Помилка сервера при отриманні рахунку' });
    }
});

// Створити новий рахунок
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { invoiceNumber, invoiceDate, supplierId, supplierName, buyerId, buyerName, totalSum, items } = req.body;

        const invoice = await db.Invoice.create({
            invoiceNumber,
            invoiceDate,
            supplierId,
            supplierName,
            buyerId,
            buyerName,
            totalSum,
            items,
            userId: req.userId
        });

        const newInvoice = await db.Invoice.findByPk(invoice.id, {
            include: [
                {
                    model: db.Contractor,
                    as: 'supplier',
                },
                {
                    model: db.Contractor,
                    as: 'buyer',
                }
            ]
        });

        res.status(201).json(newInvoice);
    } catch (err) {
        console.error('Помилка при створенні рахунку:', err);
        res.status(500).json({ error: 'Помилка сервера при створенні рахунку' });
    }
});

// Створити новий рахунок на основі замовлення
router.post('/from-order/:orderId', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { supplierId, buyerId } = req.body;

        // Отримуємо замовлення з бази даних
        const order = await db.Order.findByPk(orderId, {
            include: [
                {
                    model: db.OrderUnit,
                    as: 'OrderUnits',
                    include: [
                        {
                            model: db.OrderUnitUnit,
                            as: 'OrderUnitUnits',
                        },
                    ],
                },
                {
                    model: db.User,
                    as: 'client',
                    attributes: ['id', 'firstName', 'lastName', 'familyName', 'email', 'phoneNumber'],
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ error: 'Замовлення не знайдено' });
        }

        // Отримуємо інформацію про постачальника
        let supplier;
        if (supplierId) {
            // Якщо вказано ID постачальника, використовуємо його
            supplier = await db.Contractor.findOne({
                where: { 
                    id: supplierId,
                    userId: req.userId 
                }
            });

            if (!supplier) {
                return res.status(404).json({ error: 'Вказаного постачальника не знайдено' });
            }
        } else {
            // Інакше використовуємо постачальника за замовчуванням
            supplier = await db.Contractor.findOne({
                where: { userId: req.userId, isDefault: true }
            });

            if (!supplier) {
                return res.status(404).json({ error: 'Постачальника за замовчуванням не знайдено' });
            }
        }

        // Отримуємо або створюємо контрагента для клієнта
        let buyer;
        if (buyerId) {
            // Якщо вказано ID покупця, використовуємо його
            buyer = await db.Contractor.findOne({
                where: { 
                    id: buyerId,
                    userId: req.userId 
                }
            });

            if (!buyer) {
                return res.status(404).json({ error: 'Вказаного покупця не знайдено' });
            }
        } else if (order.client) {
            // Інакше шукаємо або створюємо контрагента на основі даних клієнта
            buyer = await db.Contractor.findOne({
                where: { 
                    userId: req.userId,
                    name: { 
                        [db.Sequelize.Op.like]: `%${order.client.lastName || ''} ${order.client.firstName || ''}%` 
                    }
                }
            });

            if (!buyer) {
                // Створюємо нового контрагента на основі даних клієнта
                const clientName = `${order.client.lastName || ''} ${order.client.firstName || ''} ${order.client.familyName || ''}`.trim();
                buyer = await db.Contractor.create({
                    userId: req.userId,
                    name: clientName,
                    email: order.client.email,
                    phone: order.client.phoneNumber,
                    isDefault: false
                });
            }
        } else {
            return res.status(400).json({ error: 'Інформація про клієнта відсутня в замовленні і не вказано ID покупця' });
        }

        // Формуємо елементи рахунку з OrderUnits
        const items = order.OrderUnits.map(unit => {
            return {
                name: unit.name || 'Товар/послуга',
                unit: 'шт.',
                quantity: unit.count || 1,
                price: parseFloat(unit.price) || 0,
                total: (unit.count || 1) * (parseFloat(unit.price) || 0)
            };
        });

        // Розраховуємо загальну суму
        const totalSum = items.reduce((sum, item) => sum + item.total, 0);

        // Генеруємо номер рахунку
        const today = new Date();
        const invoiceNumber = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(order.id).padStart(4, '0')}`;

        // Створюємо рахунок
        const invoice = await db.Invoice.create({
            orderId: order.id,
            invoiceNumber,
            invoiceDate: today,
            supplierId: supplier.id,
            supplierName: supplier.name,
            buyerId: buyer.id,
            buyerName: buyer.name,
            totalSum,
            items,
            userId: req.userId
        });

        const newInvoice = await db.Invoice.findByPk(invoice.id, {
            include: [
                {
                    model: db.Contractor,
                    as: 'supplier',
                },
                {
                    model: db.Contractor,
                    as: 'buyer',
                },
                {
                    model: db.Order,
                    as: 'order',
                }
            ]
        });

        res.status(201).json(newInvoice);
    } catch (err) {
        console.error('Помилка при створенні рахунку з замовлення:', err);
        res.status(500).json({ error: 'Помилка сервера при створенні рахунку з замовлення' });
    }
});

// Оновити рахунок
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { invoiceNumber, invoiceDate, supplierId, supplierName, buyerId, buyerName, totalSum, items } = req.body;

        const invoice = await db.Invoice.findByPk(req.params.id);

        if (!invoice) {
            return res.status(404).json({ error: 'Рахунок не знайдено' });
        }

        await invoice.update({
            invoiceNumber,
            invoiceDate,
            supplierId,
            supplierName,
            buyerId,
            buyerName,
            totalSum,
            items
        });

        const updatedInvoice = await db.Invoice.findByPk(req.params.id, {
            include: [
                {
                    model: db.Contractor,
                    as: 'supplier',
                },
                {
                    model: db.Contractor,
                    as: 'buyer',
                }
            ]
        });

        res.status(200).json(updatedInvoice);
    } catch (err) {
        console.error('Помилка при оновленні рахунку:', err);
        res.status(500).json({ error: 'Помилка сервера при оновленні рахунку' });
    }
});

// Видалити рахунок
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const invoice = await db.Invoice.findByPk(req.params.id);

        if (!invoice) {
            return res.status(404).json({ error: 'Рахунок не знайдено' });
        }

        await invoice.destroy();

        res.status(200).json({ message: 'Рахунок успішно видалено' });
    } catch (err) {
        console.error('Помилка при видаленні рахунку:', err);
        res.status(500).json({ error: 'Помилка сервера при видаленні рахунку' });
    }
});

// Генерувати документ для рахунку
router.post('/:id/document', authMiddleware, async (req, res) => {
    try {
        const invoice = await db.Invoice.findByPk(req.params.id, {
            include: [
                {
                    model: db.Contractor,
                    as: 'supplier',
                },
                {
                    model: db.Contractor,
                    as: 'buyer',
                }
            ]
        });

        if (!invoice) {
            return res.status(404).json({ error: 'Рахунок не знайдено' });
        }

        const user = await db.User.findByPk(req.userId);

        const invoiceData = {
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: new Date(invoice.invoiceDate).toLocaleDateString(),

            userFio: user ? `${user.role2 || ''} ${user.firstName || ''} ${user.lastName || ''} ${user.familyName || ''}`.trim() : '',

            supplierName: invoice.supplier.name,
            supplierEdrpou: invoice.supplier.edrpou,
            supplierAddress: invoice.supplier.address,
            supplierIban: invoice.supplier.iban,
            supplierBankName: invoice.supplier.bankName,
            supplierPhone: invoice.supplier.phone,
            supplierEmail: invoice.supplier.email,

            buyerName: invoice.buyer.name,
            buyerEdrpou: invoice.buyer.edrpou,
            buyerAddress: invoice.buyer.address,
            buyerIban: invoice.buyer.iban,
            buyerBankName: invoice.buyer.bankName,
            buyerPhone: invoice.buyer.phone,
            buyerEmail: invoice.buyer.email,

            paymentReason: 'Оплата згідно рахунку',

            products: invoice.items.map((item, index) => ({
                index: index + 1,
                name: item.name || '—',
                unit: item.unit || 'шт.',
                quantity: item.quantity || 1,
                price: item.price || 0,
                total: (item.quantity || 1) * (item.price || 0)
            })),

            totalSum: invoice.totalSum,
            vatSum: invoice.totalSum * 0.2, // Для прикладу - 20% ПДВ
            totalSumWords: numberToWords(invoice.totalSum) + ' гривень 00 копійок',

            directorName: 'Іваненко Іван Іванович',
            accountantName: 'Петренко Петро Петрович'
        };

        let templatePath = path.join(__dirname, '../services/document/Рахунок до оплати темплейт.docx');

        // Вибір шаблону в залежності від системи оподаткування
        if (invoice.buyer.taxSystem) {
            if (['загальна система без ПДВ', 'загальна система із ПДВ'].includes(invoice.buyer.taxSystem)) {
                templatePath = path.join(__dirname, '../services/document/invoice_template1.docx');
            } else if (['1 група', '2 група', '3 група', '3 група із ПДВ', '4 група', 'Дія.Сіті', 'Неприбуткова організація'].includes(invoice.buyer.taxSystem)) {
                templatePath = path.join(__dirname, '../services/document/Akt_template.docx');
            }
        }
        console.log('Дані для рахунку:', invoiceData);
        console.log('Шлях до шаблону:', templatePath);

        // Перевіряємо наявність файлу перед генерацією
        if (!fs.existsSync(templatePath)) {
            console.error(`ПОМИЛКА: Файл шаблону не знайдено: ${templatePath}`);
            // Перевіряємо які файли є в директорії
            const docDir = path.dirname(templatePath);
            if (fs.existsSync(docDir)) {
                console.log('Вміст директорії:', fs.readdirSync(docDir));
            } else {
                console.error(`Директорія не існує: ${docDir}`);
            }
        }

        const buffer = await generateInvoiceDocx(invoiceData, templatePath);
        const fileName = `invoice_${invoiceData.invoiceNumber.replace(/\//g, '_')}.docx`;

        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.end(buffer);
    } catch (err) {
        console.error('Помилка при генерації документу:', err);
        res.status(500).json({ error: 'Помилка сервера при генерації документу' });
    }
});

// Отримати список контрагентів
router.get('/contractors/all', authMiddleware, async (req, res) => {
    try {
        const contractors = await db.Contractor.findAll({
            where: {
                userId: req.userId
            },
            attributes: ['id', 'name', 'edrpou', 'taxSystem']
        });

        res.status(200).json(contractors);
    } catch (err) {
        console.error('Помилка при отриманні контрагентів:', err);
        res.status(500).json({ error: 'Помилка сервера при отриманні контрагентів' });
    }
});

// Пошук контрагентів за назвою
router.get('/contractors/search', authMiddleware, async (req, res) => {
    try {
        const query = req.query.query || '';

        const contractors = await db.Contractor.findAll({
            where: {
                userId: req.userId,
                name: {
                    [Op.like]: `%${query}%`
                }
            },
            attributes: ['id', 'name', 'edrpou', 'taxSystem']
        });

        res.status(200).json(contractors);
    } catch (err) {
        console.error('Помилка при пошуку контрагентів:', err);
        res.status(500).json({ error: 'Помилка сервера при пошуку контрагентів' });
    }
});

// Допоміжна функція для конвертації суми в словесний вираз
function numberToWords(number) {
    const units = ['', 'одна', 'дві', 'три', 'чотири', 'п\'ять', 'шість', 'сім', 'вісім', 'дев\'ять'];
    const teens = ['', 'одинадцять', 'дванадцять', 'тринадцять', 'чотирнадцять', 'п\'ятнадцять', 'шістнадцять', 'сімнадцять', 'вісімнадцять', 'дев\'ятнадцять'];
    const tens = ['', 'десять', 'двадцять', 'тридцять', 'сорок', 'п\'ятдесят', 'шістдесят', 'сімдесят', 'вісімдесят', 'дев\'яносто'];
    const hundreds = ['', 'сто', 'двісті', 'триста', 'чотириста', 'п\'ятсот', 'шістсот', 'сімсот', 'вісімсот', 'дев\'ятсот'];
    const thousands = ['', 'тисяча', 'тисячі', 'тисяч'];
    const millions = ['', 'мільйон', 'мільйони', 'мільйонів'];

    if (number === 0) return 'нуль';

    let words = '';

    // Мільйони
    if (number >= 1000000) {
        const millions_num = Math.floor(number / 1000000);
        words += convertGroup(millions_num) + ' ' + getForm(millions_num, millions) + ' ';
        number %= 1000000;
    }

    // Тисячі
    if (number >= 1000) {
        const thousands_num = Math.floor(number / 1000);
        words += convertGroup(thousands_num) + ' ' + getForm(thousands_num, thousands) + ' ';
        number %= 1000;
    }

    // Сотні, десятки, одиниці
    if (number > 0) {
        words += convertGroup(number);
    }

    return words.trim();

    // Конвертувати групу чисел (1-999)
    function convertGroup(num) {
        let result = '';

        // Сотні
        if (num >= 100) {
            result += hundreds[Math.floor(num / 100)] + ' ';
            num %= 100;
        }

        // Десятки і одиниці
        if (num >= 10 && num < 20) {
            result += teens[num - 10] + ' ';
        } else {
            if (num >= 20) {
                result += tens[Math.floor(num / 10)] + ' ';
                num %= 10;
            }

            if (num > 0) {
                result += units[num] + ' ';
            }
        }

        return result;
    }

    // Отримати правильну форму слова (1, 2-4, 5-9)
    function getForm(num, forms) {
        if (num > 10 && num < 20) return forms[3] || forms[0];
        const lastDigit = num % 10;
        if (lastDigit === 1) return forms[1];
        if (lastDigit >= 2 && lastDigit <= 4) return forms[2];
        return forms[3] || forms[0];
    }
}

module.exports = router;
