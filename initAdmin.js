const db = require('./models');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        const adminExists = await db.User.findOne({ where: { role: 'admin' } });
        const contractorExists = await db.Contractor.findOne({ where: {
            address: "Україна , 85400, Донецька обл., м. Селидове, вул. Чернишевського 18, кв. 50",
            } });
        if (!adminExists) {
            // const hash = bcrypt.hashSync('1', 8);
            await db.User.create({
                username: '1',
                password: bcrypt.hashSync('1', 8),
                role: 'admin',
                firstName: "Артем",
                lastName: "Пилипенко",
                familyName: "Юрійович",
                email: "hello@printpeaks.com.ua",
                phoneNumber: "+38 065 666 66 66",
                telegram: "https://t.me/aiatomas",
                discount: "0"
            });
            await db.User.create({
                username: 'aiatomas',
                password: bcrypt.hashSync('Artem0123', 8),
                role: 'admin',
                firstName: "Артем",
                lastName: "Пилипенко",
                familyName: "Юрійович",
                email: "hello@printpeaks.com.ua",
                phoneNumber: "+38 065 666 66 66",
                telegram: "https://t.me/aiatomas",
                discount: "0"
            });
            await db.User.create({
                username: 'printpeaks',
                password: bcrypt.hashSync('1', 8),
                role: 'operator',
                firstName: "Артем",
                lastName: "Пилипенко",
                familyName: "Юрійович",
                email: "hello@printpeaks.com.ua",
                phoneNumber: "+38 065 666 66 66",
                telegram: "https://t.me/aiatomas",
                discount: "0"
            });
            console.log('Администратор создан');
        } else {
            console.log('Администратор уже существует');
        }
        if(!contractorExists){
            await db.Contractor.create({
                name: 'ФОП Пилипенко А.Ю.',
                address: "Україна , 85400, Донецька обл., м. Селидове, вул. Чернишевського 18, кв. 50",
                bankName: 'АТ КБ "Приватбанк"',
                iban: "UA543052990000026005036242045",
                edrpou: "00692334",
                email: "aiatomas01@gmail.com",
                phone: "+38(098)-081-81-80",
                taxSystem: "3 група",
                comment: "",
                userId: 1
            });
            console.log('Contractor создан');
        }
    } catch (error) {
        console.error('Ошибка при создании администратора:', error);
    }
}

// db.sequelize.sync({ force: false }).then(() => {
//     createAdmin().then(() => {
//         process.exit();
//     });
// });

module.exports = createAdmin;
