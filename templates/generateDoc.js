const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');

// Припустимо, що ти передаєш: generateInvoiceDocx(data, templatePath)

function generateInvoiceDocx(data, templatePath) {
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        // data // ✅ новий спосіб — просто передаєш обʼєкт даних
    });

    try {
        doc.render(data);
    } catch (error) {
        console.error("Docxtemplater render error:", error);
        throw error;
    }

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    return buffer;
}

module.exports = { generateInvoiceDocx };