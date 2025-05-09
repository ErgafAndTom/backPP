// services/document/docxGenerator.js
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

function generateInvoiceDocx(data, templatePath) {
    // Перевіряємо та шукаємо шаблон
    let fullPath = templatePath;
    if (!fs.existsSync(fullPath)) {
        const alt = path.join(process.cwd(), 'services', 'document', path.basename(templatePath));
        if (fs.existsSync(alt)) fullPath = alt;
        else throw new Error(`Шаблон не знайдено за шляхом ${templatePath}`);
    }

    // Зчитуємо шаблон
    const content = fs.readFileSync(fullPath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Заповнюємо дані й рендеримо
    doc.setData(data);
    doc.render();

    // Повертаємо буфер
    return doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
}

module.exports = generateInvoiceDocx;
