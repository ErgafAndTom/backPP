// const fs = require('fs');
// const path = require('path');
// const PizZip = require('pizzip');
// const Docxtemplater = require('docxtemplater');
// const express = require("express");
// const router = express.Router();
//
//
// // Функция загрузки файла
// const loadFile = (filePath) => fs.readFileSync(path.resolve(__dirname, filePath), 'binary');
//
// const content = loadFile('invoice_template.docx');
// // const content = loadFile('invoice_template.docx');
//
// // Создание DOCX-документа
// const zip = new PizZip(content);
// const doc = new Docxtemplater(zip, {
//     paragraphLoop: true,
//     linebreaks: true,
// });
//
// // Данные для заполнения
// const invoiceData = {
//     invoiceNumber: '2025/00123',
//     invoiceDate: '03.04.2025',
//
//     supplierName: 'ТОВ "Компанія-постачальник"',
//     supplierCode: '12345678',
//     supplierIBAN: 'UA123456789012345678901234567',
//     supplierBank: 'АТ КБ "ПриватБанк"',
//     supplierPhone: '+380501234567',
//
//     buyerName: 'ТОВ "Компанія-покупець"',
//     buyerCode: '87654321',
//     buyerAddress: 'м. Київ, вул. Хрещатик, 1',
//     buyerPhone: '+380671234567',
//
//     paymentReason: 'Оплата згідно договору № 123 від 01.01.2025',
//
//     products: [
//         { index: 1, name: 'Ноутбук Asus ZenBook, Ноутбук Asus ZenBookЮ, Ноутбук Asus ZenBook, Ноутбук Asus ZenBook Ноутбук Asus ZenBook', unit: 'шт.', quantity: 1, price: 40000, total: 40000 },
//         { index: 2, name: 'Монітор LG UltraWide', unit: 'шт.', quantity: 20000, price: 80000.01, total: 16000 },
//     ],
//
//     totalSum: 56000,
//     vatSum: 9333.33,
//     totalSumWords: 'П\'ятдесят шість тисяч гривень 00 копійок',
//
//     directorName: 'Іваненко Іван Іванович',
//     accountantName: 'Петренко Петро Петрович'
// };
//
// // Заполнение шаблона
// doc.render(invoiceData);
//
// // Сохранение документа
// const buf = doc.getZip().generate({ type: 'nodebuffer' });
// fs.writeFileSync(path.resolve(__dirname, 'output/invoice_output.docx'), buf);
//
// console.log('✅ Документ успешно сгенерирован!');
//
// module.exports = router;


const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

/**
 * Генерує документ рахунку у форматі DOCX на основі шаблону
 * @param {Object} data - Дані для заповнення шаблону рахунку
 * @param {string} templatePath - Шлях до шаблону документа
 * @returns {Buffer} - Буфер згенерованого документа
 */
function generateInvoiceDocx(data, templatePath) {
    try {
        // Виправляємо шлях до шаблону, переконуємось що шлях правильний
        let fullTemplatePath = templatePath;
        
        // Перевіряємо наявність файлу за вказаним шляхом
        if (!fs.existsSync(fullTemplatePath)) {
            console.warn(`Файл не знайдено за шляхом: ${fullTemplatePath}`);
            
            // Спробуємо інші варіанти шляхів
            const possiblePaths = [
                templatePath,
                path.join(__dirname, path.basename(templatePath)),
                path.join(process.cwd(), 'services', 'document', path.basename(templatePath)),
                path.join(__dirname, '..', path.basename(templatePath))
            ];
            
            for (const possiblePath of possiblePaths) {
                if (fs.existsSync(possiblePath)) {
                    fullTemplatePath = possiblePath;
                    console.log(`Знайдено файл за шляхом: ${fullTemplatePath}`);
                    break;
                }
            }
        }
        
        // Зчитуємо шаблон файлу
        const template = fs.readFileSync(fullTemplatePath, 'binary');
        
        // Створюємо zip з шаблону
        const zip = new PizZip(template);
        
        // Створюємо docxtemplater об'єкт з zip
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
        
        // Встановлюємо дані для шаблону
        doc.setData(data);
        
        // Рендеримо документ
        doc.render();
        
        // Отримуємо буфер документа
        const buffer = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });
        
        return buffer;
    } catch (error) {
        console.error('Помилка при генерації рахунку:', error);
        throw new Error('Не вдалося згенерувати документ рахунку');
    }
}

module.exports = { generateInvoiceDocx };
