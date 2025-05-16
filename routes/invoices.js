const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middlewares/auth');
const path = require('path');
const fs = require('fs');
const { generateInvoiceDocx } = require('../templates/generateDoc');
const { Op } = require('sequelize');
const puppeteer = require('puppeteer');
const generateInvoicePdf = require("../services/document/docxGenerator.js");
const archiver = require('archiver');
const streamBuffers = require('stream-buffers');

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

router.post('/:id/document', authMiddleware, async (req, res) => {
    try {
        // 1. Збираємо дані
        const invoice = await db.Invoice.findByPk(req.params.id, {
            include: [
                { model: db.Contractor, as: 'supplier' },
                { model: db.Contractor, as: 'buyer' }
            ]
        });
        if (!invoice) return res.status(404).json({ error: 'Рахунок не знайдено' });

        const user = await db.User.findByPk(req.userId);

        const invoiceData = {
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: new Date(invoice.invoiceDate).toLocaleDateString(),
            supplierName: invoice.supplier.name,
            supplierCode: invoice.supplier.edrpou,
            supplierIBAN: invoice.supplier.iban,
            supplierBank: invoice.supplier.bankName,
            supplierPhone: invoice.supplier.phone,
            buyerName: invoice.buyer.name,
            buyerCode: invoice.buyer.edrpou,
            buyerAddress: invoice.buyer.address,
            buyerPhone: invoice.buyer.phone,
            products: invoice.items.map((item, idx) => ({
                index: idx + 1,
                name: item.name,
                unit: item.unit,
                quantity: item.quantity,
                price: item.price,
                total: item.quantity * item.price
            })),
            totalSum: invoice.items.reduce((sum, i) => sum + i.quantity * i.price, 0),
            approvalName: user ? `${user.firstName} ${user.lastName}` : ''
        };

        // 2. Вказуємо шлях до вашого шаблону
        const templatePath = path.join(__dirname, '../services/document/invoice_template.docx');

        // 3. Генеруємо DOCX
        const buffer = await generateInvoiceDocx(invoiceData, templatePath);

        // 4. Відправляємо клієнту
        const fileName = `invoice-${invoice.invoiceNumber.replace(/\//g, '_')}.docx`;
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(buffer);

    } catch (err) {
        console.error('Error generating document:', err);
        res.status(500).json({ error: 'Не вдалося згенерувати документ' });
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

// Создать новый счёт на основе заказа и сразу вернуть DOCX
router.post('/from-order/:orderId/document', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        const {
            supplierId,
            buyerId
        } = req.body;

        // 1. Получаем заказ
        const order = await db.Order.findByPk(orderId, {
            include: [
                { model: db.OrderUnit, as: 'OrderUnits', include: [{ model: db.OrderUnitUnit, as: 'OrderUnitUnits' }] },
                { model: db.User, as: 'client', attributes: ['firstName','lastName','familyName','email','phoneNumber'], include: [{ model: db.Contractor }] },
                { model: db.User, as: 'executor', attributes: ['firstName','lastName','familyName','email','phoneNumber'], include: [{ model: db.Contractor }] },
            ]
        });
        if (!order) return res.status(404).json({ error: 'Замовлення не знайдено' });

        // 2. Находим или создаём supplier & buyer (как в вашем /from-order)
        const supplier = supplierId
            ? await db.Contractor.findOne({ where: { id: 1}})
            : await db.Contractor.findOne({ where: { userId: req.userId }});
        if (!supplier) return res.status(405).json({ error: 'Постачальника не знайдено' });

        let buyer;
        if (buyerId) {
            buyer = await db.Contractor.findOne({ where: { id: buyerId}});
            if (!buyer) return res.status(406).json({ error: 'Покупця не знайдено' });
        } else if (order.client) {
            const clientName = [order.client.lastName, order.client.firstName, order.client.familyName].filter(Boolean).join(' ');
            buyer = await db.Contractor.findOrCreate({
                where: { userId: req.userId, name: clientName },
                defaults: { email: order.client.email, phone: order.client.phoneNumber }
            }).then(([c]) => c);
        } else {
            return res.status(400).json({ error: 'Нема даних про покупця' });
        }

        // 3. Собираем items и totalSum
        const items = order.OrderUnits.map(u => ({
            name: u.name || 'Товар/послуга',
            unit: 'шт.',
            quantity: u.count || 1,
            price: parseFloat(u.priceForOneThis) || 0,
            total: (u.count || 1) * (parseFloat(u.priceForThis) || 0)
        }));
        const totalSum = items.reduce((s, it) => s + it.total, 0);

        // 4. Генерируем номер и сохраняем запись
        const today = new Date();
        const invoiceNumber = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(order.id).padStart(4,'0')}`;
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

        // 5. Подготавливаем данные для шаблона
        const user = await db.User.findByPk(req.userId);
        const invoiceData = {
            invoiceNumber,
            invoiceDate: today.toLocaleDateString(),
            userFio: [user.role2, user.firstName, user.lastName, user.familyName].filter(Boolean).join(' '),
            supplierName: supplier.name,
            supplierEdrpou: supplier.edrpou,
            supplierAddress: supplier.address,
            supplierIban: supplier.iban,
            supplierBankName: supplier.bankName,
            supplierPhone: supplier.phone,
            supplierEmail: supplier.email,
            buyerName: buyer.name,
            buyerEdrpou: buyer.edrpou,
            buyerAddress: buyer.address,
            buyerIban: buyer.iban,
            buyerBankName: buyer.bankName,
            buyerPhone: buyer.phone,
            buyerEmail: buyer.email,
            paymentReason: 'Оплата згідно рахунку',
            products: items.map((it, i) => ({
                index: i+1,
                name: it.name,
                unit: it.unit,
                quantity: it.quantity,
                price: it.price,
                total: it.total
            })),
            totalSum,
            vatSum: totalSum * 0.2,
            totalSumWords: numberToWords(totalSum) + ' гривень 00 копійок',
            directorName: 'Іваненко Іван Іванович',
            accountantName: 'Петренко Петро Петрович'
        };

        // 6. Выбираем шаблон по taxSystem покупателя
        let templatePath = path.join(__dirname, '../services/document/invoice_template1.docx');
        if (['1 група','2 група','3 група','3 група із ПДВ','4 група','Дія.Сіті','Неприбуткова організація']
            .includes(buyer.taxSystem)) {
            templatePath = path.join(__dirname, '../services/document/Akt_template.docx');
        }

        // 7. Генерируем DOCX-буфер и отдаем его
        const buffer = await generateInvoiceDocx(invoiceData, templatePath);
        const fileName = `invoice_${invoiceNumber.replace(/\//g,'_')}.docx`;
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.end(buffer);

    } catch (err) {
        console.error('Помилка при генерації нового інвойсу:', err);
        res.status(500).json({ error: 'Серверна помилка при генерації інвойсу' });
    }
});

router.post('/from-order/:orderId/invoice', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        const {
            supplierId,
            buyerId
        } = req.body;

        // 1. Получаем заказ

        const result = await db.sequelize.transaction(async (t) => {
            const order = await db.Order.findByPk(orderId, {
                include: [
                    { model: db.OrderUnit, as: 'OrderUnits', include: [{ model: db.OrderUnitUnit, as: 'OrderUnitUnits' }] },
                    { model: db.User, as: 'client', attributes: ['firstName','lastName','familyName','email','phoneNumber'], include: [{ model: db.Contractor }] },
                    { model: db.User, as: 'executor', attributes: ['firstName','lastName','familyName','email','phoneNumber'], include: [{ model: db.Contractor }] },
                ],
                transaction: t
            });
            if (!order) return res.status(404).json({ error: 'Замовлення не знайдено' });

            // 2. Находим или создаём supplier & buyer (как в вашем /from-order)
            const supplier = await db.Contractor.findOne({ where: { id: supplierId}, transaction: t})
            if (!supplier) return res.status(405).json({ error: 'Постачальника не знайдено' });

            const buyer = await db.Contractor.findOne({ where: { id: buyerId}, transaction: t});
            if (!buyer) return res.status(406).json({ error: 'Покупця не знайдено' });

            // 3. Собираем items и totalSum
            const items = order.OrderUnits.map(u => ({
                name: u.name || 'Товар/послуга',
                unit: 'шт.',
                quantity: u.count || 1,
                price: parseFloat(u.priceForOneThis) || 0,
                total: (u.count || 1) * (parseFloat(u.priceForThis) || 0)
            }));
            const totalSum = items.reduce((s, it) => s + it.total, 0);

            // 4. Генерируем номер и сохраняем запись
            const today = new Date();
            const invoiceNumber = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(order.id).padStart(4,'0')}`;
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
            }, {transaction: t});

            return await db.Invoice.findOne({where: {id: invoice.id}, transaction: t});
        });

        res.status(201).json(result)
    } catch (err) {
        console.error('Помилка при генерації нового інвойсу:', err);
        res.status(500).json({ error: 'Серверна помилка при генерації інвойсу' });
    }
});

router.post('/from-order/:orderId/docInZip', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        const {
            supplierId,
            buyerId
        } = req.body;

        // 1. Получаем заказ

        const order = await db.Order.findByPk(orderId, {
            include: [
                { model: db.OrderUnit, as: 'OrderUnits', include: [{ model: db.OrderUnitUnit, as: 'OrderUnitUnits' }] },
                { model: db.User, as: 'client', attributes: ['firstName','lastName','familyName','email','phoneNumber'], include: [{ model: db.Contractor }] },
                { model: db.User, as: 'executor', attributes: ['firstName','lastName','familyName','email','phoneNumber'], include: [{ model: db.Contractor }] },
            ]
        });
        if (!order) return res.status(404).json({ error: 'Замовлення не знайдено' });

        // 2. Находим или создаём supplier & buyer (как в вашем /from-order)
        const supplier = await db.Contractor.findOne({ where: { id: supplierId}})
        if (!supplier) return res.status(405).json({ error: 'Постачальника не знайдено' });

        const buyer = await db.Contractor.findOne({ where: { id: buyerId}});
        if (!buyer) return res.status(406).json({ error: 'Покупця не знайдено' });

        // 3. Собираем items и totalSum
        const items = order.OrderUnits.map(u => ({
            name: u.name || 'Товар/послуга',
            unit: 'шт.',
            quantity: u.count || 1,
            price: parseFloat(u.priceForOneThis) || 0,
            total: (u.count || 1) * (parseFloat(u.priceForThis) || 0)
        }));
        const totalSum = items.reduce((s, it) => s + it.total, 0);

        // 4. Генерируем номер и сохраняем запись
        const today = new Date();
        const invoiceNumber = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(order.id).padStart(4,'0')}`;
        // const invoice = await db.Invoice.create({
        //     orderId: order.id,
        //     invoiceNumber,
        //     invoiceDate: today,
        //     supplierId: supplier.id,
        //     supplierName: supplier.name,
        //     buyerId: buyer.id,
        //     buyerName: buyer.name,
        //     totalSum,
        //     items,
        //     userId: req.userId
        // }, {transaction: t});

        // return await db.Contractor.findOne({where: {id: invoice.id}, transaction: t});

        // res.status(201).json(result)

        // 5. Подготавливаем данные для шаблона
        const user = await db.User.findByPk(req.userId);
        const invoiceData = {
            invoiceNumber,
            invoiceDate: today.toLocaleDateString(),
            userFio: [user.role2, user.firstName, user.lastName, user.familyName].filter(Boolean).join(' '),
            supplierName: supplier.name,
            supplierEdrpou: supplier.edrpou,
            supplierAddress: supplier.address,
            supplierIban: supplier.iban,
            supplierBankName: supplier.bankName,
            supplierPhone: supplier.phone,
            supplierEmail: supplier.email,
            buyerName: buyer.name,
            buyerEdrpou: buyer.edrpou,
            buyerAddress: buyer.address,
            buyerIban: buyer.iban,
            buyerBankName: buyer.bankName,
            buyerPhone: buyer.phone,
            buyerEmail: buyer.email,
            paymentReason: 'Оплата згідно рахунку',
            pdv: totalSum * 0.2,
            totalSumPdv: totalSum + (totalSum * 0.2),
            products: items.map((it, i) => ({
                index: i+1,
                name: it.name,
                unit: it.unit,
                quantity: it.quantity,
                price: it.price,
                total: it.total
            })),
            totalSum,
            vatSum: totalSum * 0.2,
            totalSumWords: numberToWords(totalSum) + ' гривень 00 копійок',
            directorName: 'Іваненко Іван Іванович',
            accountantName: 'Петренко Петро Петрович'
        };

        // 6. Выбираем шаблоны по taxSystem покупателя and pvd
        let templatePath1;
        let templatePath2;
        let names;
        if(buyer.taxSystem === "ФОП" || buyer.taxSystem === "Неприбуткова організація"){
            if(buyer.pdv === "true"){
                templatePath1 = path.join(__dirname, '../templates/aktPDV/aktPDV.docx');
                templatePath2 = path.join(__dirname, '../templates/aktPDV/rahunokAktPDV.docx');
            } else {
                templatePath1 = path.join(__dirname, '../templates/akt/akt.docx');
                templatePath2 = path.join(__dirname, '../templates/akt/rahunokAkt.docx');
            }
            names = ['Akt','Rahunok'];
        } else if(buyer.taxSystem === "ТОВ"){
            if(buyer.pdv === "true"){
                templatePath1 = path.join(__dirname, '../templates/nakladnaPDV/NakladnaPDV.docx');
                templatePath2 = path.join(__dirname, '../templates/nakladnaPDV/rahunokNakladnaPDV.docx');
            } else {
                templatePath1 = path.join(__dirname, '../templates/nakladna/nakladna.docx');
                templatePath2 = path.join(__dirname, '../templates/nakladna/rahunokNakladna.docx');
            }
            names = ['Akt','Rahunok'];
        }

        // let templatePath3 = path.join(__dirname, '../services/document/Rakhunok_Template.docx');

        // const buffer1 = await generateInvoiceDocx(invoiceData, templatePath1);
        // const buffer2 = await generateInvoiceDocx(invoiceData, templatePath2);

        // 1. Генерируем первый DOCX
        let buffer1;
        try {
            buffer1 = await generateInvoiceDocx(invoiceData, templatePath1);
            console.log('✔️ Первый DOCX успешно сгенерирован');
        } catch (err) {
            console.error('❌ Ошибка при генерации первого DOCX:', err);
            return res.status(500).json({ error: 'Ошибка при генерации первого документа' });
        }

        // 2. Генерируем второй DOCX
        let buffer2;
        try {
            buffer2 = await generateInvoiceDocx(invoiceData, templatePath2);
            console.log('✔️ Второй DOCX успешно сгенерирован');
        } catch (err) {
            console.error('❌ Ошибка при генерации второго DOCX:', err);
            return res.status(500).json({ error: 'Ошибка при генерации второго документа' });
        }

        // 3. Создаём ZIP-архив
        const outputBuffer = new streamBuffers.WritableStreamBuffer();
        const archive = archiver('zip', { zlib: { level: 9 } });

        // Ловим ошибки архивации
        archive.on('error', err => {
            console.error('❌ Archiver error:', err);
            return res.status(500).json({ error: 'Ошибка при создании ZIP' });
        });
        // Когда запись в буфер завершена — ZIP готов
        outputBuffer.on('finish', () => {
            console.log('✔️ ZIP успешно сформирован');
            const zipBuffer = outputBuffer.getContents();
            res
                .status(200)
                .set({
                    'Content-Disposition': `attachment; filename="${names[1]}_ta_${names[0]}_${invoiceNumber}.zip"`,
                    'Content-Type': 'application/zip',
                })
                .send(zipBuffer);
        });

        archive.pipe(outputBuffer);
        archive.append(buffer1, { name: `${names[0]}_${invoiceNumber}.docx` });
        archive.append(buffer2, { name: `${names[1]}_${invoiceNumber}.docx` });

        // Запускаем финализацию архива
        await archive.finalize();








        // const outputStreamBuffer = new streamBuffers.WritableStreamBuffer();
        // const archive = archiver('zip', { zlib: { level: 9 } });
        //
        // archive.pipe(outputStreamBuffer);
        // archive.append(buffer1, { name: `${names[0]}_${invoiceNumber}.docx` });
        // archive.append(buffer2, { name: `${names[1]}_${invoiceNumber}.docx` });
        //
        // await archive.finalize();
        //
        // archive.on('error', err => {
        //     throw err;
        // });
        //
        // archive.on('end', async () => {
        //     const zipBuffer = await outputStreamBuffer.getContents();
        //     console.log('✔️ ZIP успешно сформирован');
        //     res.setHeader('Content-Disposition', `attachment; filename="Рахунок_та_${names[0]}_${invoiceNumber}.zip"`);
        //     res.setHeader('Content-Type', 'application/zip');
        //     res.end(zipBuffer);
        // });

        // 7. Генерируем DOCX-буфер и отдаем его
        // const buffer = await generateInvoiceDocx(invoiceData, templatePath1);
        // const fileName = `invoice_${invoiceNumber.replace(/\//g,'_')}.docx`;
        // res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        // res.end(buffer);

    } catch (err) {
        console.error('Помилка при генерації нового інвойсу:', err);
        res.status(500).json({ error: 'Серверна помилка при генерації інвойсу' });
    }
});

// // Генерувати документ для рахунку
// router.post('/:id/document', authMiddleware, async (req, res) => {
//     try {
//         const invoice = await db.Invoice.findByPk(req.params.id, {
//             include: [
//                 {
//                     model: db.Contractor,
//                     as: 'supplier',
//                 },
//                 {
//                     model: db.Contractor,
//                     as: 'buyer',
//                 }
//             ]
//         });
//
//         if (!invoice) {
//             return res.status(404).json({ error: 'Рахунок не знайдено' });
//         }
//
//         const user = await db.User.findByPk(req.userId);
//
//         const invoiceData = {
//             invoiceNumber: invoice.invoiceNumber,
//             invoiceDate: new Date(invoice.invoiceDate).toLocaleDateString(),
//
//             userFio: user ? `${user.role2 || ''} ${user.firstName || ''} ${user.lastName || ''} ${user.familyName || ''}`.trim() : '',
//
//             supplierName: invoice.supplier.name,
//             supplierEdrpou: invoice.supplier.edrpou,
//             supplierAddress: invoice.supplier.address,
//             supplierIban: invoice.supplier.iban,
//             supplierBankName: invoice.supplier.bankName,
//             supplierPhone: invoice.supplier.phone,
//             supplierEmail: invoice.supplier.email,
//
//             buyerName: invoice.buyer.name,
//             buyerEdrpou: invoice.buyer.edrpou,
//             buyerAddress: invoice.buyer.address,
//             buyerIban: invoice.buyer.iban,
//             buyerBankName: invoice.buyer.bankName,
//             buyerPhone: invoice.buyer.phone,
//             buyerEmail: invoice.buyer.email,
//
//             paymentReason: 'Оплата згідно рахунку',
//
//             products: invoice.items.map((item, index) => ({
//                 index: index + 1,
//                 name: item.name || '—',
//                 unit: item.unit || 'шт.',
//                 quantity: item.quantity || 1,
//                 price: item.price || 0,
//                 total: (item.quantity || 1) * (item.price || 0)
//             })),
//
//             totalSum: invoice.totalSum,
//             vatSum: invoice.totalSum * 0.2, // Для прикладу - 20% ПДВ
//             totalSumWords: numberToWords(invoice.totalSum) + ' гривень 00 копійок',
//
//             directorName: 'Іваненко Іван Іванович',
//             accountantName: 'Петренко Петро Петрович'
//         };
//
//         let templatePath = path.join(__dirname, '../services/document/Rahunok_template.docx');
//
//         // Вибір шаблону в залежності від системи оподаткування
//         if (invoice.buyer.taxSystem) {
//             if (['загальна система без ПДВ', 'загальна система із ПДВ'].includes(invoice.buyer.taxSystem)) {
//                 templatePath = path.join(__dirname, '../services/document/invoice_template1.docx');
//             } else if (['1 група', '2 група', '3 група', '3 група із ПДВ', '4 група', 'Дія.Сіті', 'Неприбуткова організація'].includes(invoice.buyer.taxSystem)) {
//                 templatePath = path.join(__dirname, '../services/document/Akt_template.docx');
//             }
//         }
//         console.log('Дані для рахунку:', invoiceData);
//         console.log('Шлях до шаблону:', templatePath);
//
//         // Перевіряємо наявність файлу перед генерацією
//         if (!fs.existsSync(templatePath)) {
//             console.error(`ПОМИЛКА: Файл шаблону не знайдено: ${templatePath}`);
//             // Перевіряємо які файли є в директорії
//             const docDir = path.dirname(templatePath);
//             if (fs.existsSync(docDir)) {
//                 console.log('Вміст директорії:', fs.readdirSync(docDir));
//             } else {
//                 console.error(`Директорія не існує: ${docDir}`);
//             }
//         }
//
//         const buffer = await generateInvoiceDocx(invoiceData, templatePath);
//         const fileName = `invoice_${invoiceData.invoiceNumber.replace(/\//g, '_')}.docx`;
//
//         res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
//         res.end(buffer);
//     } catch (err) {
//         console.error('Помилка при генерації документу:', err);
//         res.status(500).json({ error: 'Помилка сервера при генерації документу' });
//     }
// });


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

// async function generateInvoicePdf(invoiceData) {
//     const templatePath = path.join(__dirname, 'templates', 'invoice-template.ejs');
//
//     // 1. Рендеримо HTML із шаблону та даних
//     const html = await ejs.renderFile(templatePath, invoiceData, { async: true });
//
//     // 2. Запускаємо Puppeteer для генерації PDF
//     const browser = await puppeteer.launch({ headless: 'new' });
//     const page = await browser.newPage();
//
//     await page.setContent(html, { waitUntil: 'networkidle0' });
//
//     const pdfBuffer = await page.pdf({
//         format: 'A4',
//         printBackground: true,
//         margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
//     });
//
//     await browser.close();
//     return pdfBuffer;
// }

module.exports = router;
