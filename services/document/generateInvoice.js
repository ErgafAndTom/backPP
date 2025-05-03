
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { parseStringPromise } = require('xml2js');

async function generateInvoice() {
    try {
        const xmlData = fs.readFileSync(path.resolve(__dirname, 'invoice_data.xml'), 'utf-8');
        const jsonData = await parseStringPromise(xmlData, { explicitArray: false });

        const invoice = jsonData.invoice;
        const products = invoice.products.product;
        invoice.products = Array.isArray(products) ? products : [products];

        const content = fs.readFileSync(path.resolve(__dirname, 'Rakhunok_Template.docx'), 'binary');
        const zip = new PizZip(content);

        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        doc.setData(invoice);

        doc.render();

        const buffer = doc.getZip().generate({ type: 'nodebuffer' });
        fs.writeFileSync(path.resolve(__dirname, 'output/invoice_output.docx'), buffer);

        console.log('✅ Рахунок згенеровано успішно!');
    } catch (error) {
        console.error('❌ Помилка при генерації рахунку:', error);
    }
}

generateInvoice();
