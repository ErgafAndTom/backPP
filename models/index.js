const {Sequelize, Model, DataTypes, Op} = require('sequelize');
const config = require('../config/config').development;

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        logging: console.log,
        dialectOptions: {
            connectTimeout: 60000
        }
    },
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Model = Model;
db.DataTypes = DataTypes;

// Импорт моделей
db.User = require('./user')(sequelize, Sequelize);
db.Session = require('./session')(sequelize, Sequelize);
db.Order = require('./order')(sequelize, Sequelize);
db.OrderUnit = require('./orderunit')(sequelize, Sequelize);
db.OrderUnitUnit = require('./orderorderunit')(sequelize, Sequelize);
db.Material = require('./material')(sequelize, Sequelize);
db.List = require('./trello/List')(sequelize, Sequelize);
db.Card = require('./trello/Card')(sequelize, Sequelize);
db.Invoice = require('./invoice')(sequelize, Sequelize);
db.InvoiceDetails = require('./InvoiceDetails')(sequelize, Sequelize);
db.PaymentDetails = require('./PaymentDetails')(sequelize, Sequelize);

db.InTrelloPhoto = require('./trello/InTrelloPhoto')(sequelize, Sequelize);
db.InOrderFile = require('./order/InOrderFile')(sequelize, Sequelize);
db.InOrderComment = require('./order/InOrderComment')(sequelize, Sequelize);

db.LifeHackList = require('./lifeHacks/lifehackList')(sequelize, Sequelize);
db.LifeHackCard = require('./lifeHacks/lifehackCard')(sequelize, Sequelize);
db.InLifeHackPhoto = require('./lifeHacks/InLifeHackPhoto')(sequelize, Sequelize);

// db.UserInvoiceDetails = require('./user/UserInvoiceDetails')(sequelize, Sequelize);
// db.InvoiceItem = require('./user/InvoiceItem')(sequelize, Sequelize);

// db.LegalEntity = require('./user/LegalEntity')(sequelize, Sequelize);
// db.PaymentDetails = require('./user/PaymentDetails')(sequelize, Sequelize);

db.Contractor = require('./user/Contractor')(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Экспорт объекта db
module.exports = db;
