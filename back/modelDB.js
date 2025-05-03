const {Sequelize, Model, DataTypes, Op} = require('sequelize');
// const dayjs = require('dayjs');
// const sequelize = new Sequelize('calc', 'Aiatomas', 'Artem012345', {
const sequelize = new Sequelize('printpeaksdbnew', 'PrintPeaks', 'Kv14061992', {
// const sequelize = new Sequelize('xhiwdkjd_CalcArtemNew', 'PrintPeaks', 'Kv1406992@', {
    // host: 'netx.com.ua',
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+02:00',
    // dialect: 'postgres',
    logging: false,
    /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});
//5432 port postgress
// 6432 pgBouncer port
//CalcArtemNew

//Користувач: xhiwdkjd_PrintPeaks
//База даних: xhiwdkjd_CalcArtemNew


// const sequelize = new Sequelize('calc', 'root', '1234', {
//     host: '127.0.0.1',
//     dialect: 'mysql',
//     logging: false,
//     /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
// });
// const sequelize = new Sequelize('calc', 'calcCRUD', '12345', {
//     host: '46.30.160.210',
//     dialect: 'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
// });
// const sequelize = new Sequelize('calc', 'calcCRUDL', '12345', {
//     host: ''127.0.0.1',
//     dialect: 'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
// });
// const sequelize = new Sequelize('calc', 'calcCRUDL', '12345', {
//     host: '127.0.0.1',
//     dialect: 'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
// });

const optionsForModel = {
    // timestamps: Date.now(),
    // createdAt: false,
    // updatedAt: false
    // paranoid: true
}
const Files = sequelize.define('files', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    path: {
        type: DataTypes.STRING
    },
    userid: {
        type: DataTypes.INTEGER
    },
    user: {
        type: DataTypes.INTEGER
    },
    session: {
        type: DataTypes.STRING
    },
    orderid: {
        type: DataTypes.INTEGER
    },
    img: {
        type: DataTypes.BOOLEAN
    },
    red: {
        type: DataTypes.BOOLEAN
    },
    format: {
        type: DataTypes.STRING
    },
    sides: {
        type: DataTypes.STRING
    },
    color: {
        type: DataTypes.STRING
    },
    cower: {
        type: DataTypes.STRING
    },
    paper: {
        type: DataTypes.STRING
    },
    destiny: {
        type: DataTypes.STRING
    },
    destinyThis: {
        type: DataTypes.STRING
    },
    binding: {
        type: DataTypes.STRING
    },
    bindingSelect: {
        type: DataTypes.STRING
    },
    lamination: {
        type: DataTypes.STRING
    },
    roundCorner: {
        type: DataTypes.STRING
    },
    frontLining: {
        type: DataTypes.STRING
    },
    backLining: {
        type: DataTypes.STRING
    },
    big: {
        type: DataTypes.STRING
    },
    holes: {
        type: DataTypes.STRING
    },
    countInFile: {
        type: DataTypes.INTEGER
    },
    allPaperCount: {
        type: DataTypes.INTEGER
    },
    orient: {
        type: DataTypes.BOOLEAN
    },
    stickerCutting: {
        type: DataTypes.STRING
    },
    stickerCuttingThis: {
        type: DataTypes.STRING
    },
    x: {
        type: DataTypes.STRING
    },
    y: {
        type: DataTypes.STRING
    },
    list: {
        type: DataTypes.STRING
    },
    calc: {
        type: DataTypes.STRING
    },
    touse: {
        type: DataTypes.STRING
    },
    luvers: {
        type: DataTypes.STRING
    },
    bannerVarit: {
        type: DataTypes.STRING
    },
    floorLamination: {
        type: DataTypes.STRING
    },
    widthLamination: {
        type: DataTypes.STRING
    },
    cuttingSamokleika: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.STRING
    },
    count: {
        type: DataTypes.INTEGER
    },
    canToOrder: {
        type: DataTypes.BOOLEAN
    },
    inBasket: {
        type: DataTypes.BOOLEAN
    },
    newField1: {
        type: DataTypes.STRING
    },
    newField2: {
        type: DataTypes.STRING
    },
    newField3: {
        type: DataTypes.STRING
    },
    newField4: {
        type: DataTypes.STRING
    },
    newField5: {
        type: DataTypes.STRING
    },
}, optionsForModel);
const Sessions = sequelize.define('sessions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    session: {
        type: DataTypes.BIGINT
    },
    userid: {
        type: DataTypes.INTEGER
    },
    inBasket: {
        type: DataTypes.BOOLEAN
    },
    userAgent: {
        type: DataTypes.STRING
    },
    ip: {
        type: DataTypes.STRING
    },
    newField1: {
        type: DataTypes.STRING
    },
    newField2: {
        type: DataTypes.STRING
    },
    newField3: {
        type: DataTypes.STRING
    },
    newField4: {
        type: DataTypes.STRING
    },
    newField5: {
        type: DataTypes.STRING
    },
}, optionsForModel);
// const Users = sequelize.define('users', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     name: {
//         type: DataTypes.STRING
//     },
//     role: {
//         type: DataTypes.STRING
//     },
//     mail: {
//         type: DataTypes.STRING
//     },
//     pass: {
//         type: DataTypes.STRING
//     },
//     phone: {
//         type: DataTypes.STRING
//     },
//     messenger: {
//         type: DataTypes.STRING
//     },
//     newField1: {
//         type: DataTypes.STRING
//     },
//     newField2: {
//         type: DataTypes.STRING
//     },
//     newField3: {
//         type: DataTypes.STRING
//     },
//     newField4: {
//         type: DataTypes.STRING
//     },
//     newField5: {
//         type: DataTypes.STRING
//     },
// }, optionsForModel);
const Users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Ім\'я користувача',
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Прізвище користувача',
    },
    email: {
        type: DataTypes.STRING(100),
        // allowNull: false,
        // unique: true,
        // validate: {
        //     isEmail: true,
        // },
        comment: 'Електронна пошта користувача',
    },
    phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: true,
        comment: 'Номер телефону користувача',
    },
    password: {
        type: DataTypes.STRING,
        // allowNull: false,
        comment: 'Хешований пароль користувача',
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        // allowNull: false,
        comment: 'Роль користувача в системі',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Статус активності користувача',
    },
    lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Час останнього входу користувача',
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Час створення запису',
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        comment: 'Час останнього оновлення запису',
    },
}, {
    tableName: 'users',
    timestamps: true,
    paranoid: true, // Це додає колонки deletedAt, для м'якого видалення
    underscored: true, // Для використання snake_case у назвах колонок
    indexes: [
        {
            unique: true,
            fields: ['email'],
            comment: 'Індекс для швидкого пошуку по email',
        },
    ],
});
const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.STRING
    },
    executorId: {
        type: DataTypes.STRING
    },
    prepayment: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.STRING
    },
    allPrice: {
        type: DataTypes.STRING
    },
    timeCreate: {
        type: DataTypes.STRING
    },
    clientId: {
        type: DataTypes.STRING
    },
    payForm: {
        type: DataTypes.STRING
    },
    payStatus: {
        type: DataTypes.STRING
    },
    clientId: {
        type: DataTypes.STRING
    },
    newField1: {
        type: DataTypes.STRING
    },
    newField2: {
        type: DataTypes.STRING
    },
    newField3: {
        type: DataTypes.STRING
    },
    newField4: {
        type: DataTypes.STRING
    },
    newField5: {
        type: DataTypes.STRING
    },
}, optionsForModel);
const OrderUnit = sequelize.define('orderunit', {
    id: {
        type: DataTypes.INTEGER,
    },
    idKey: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    idInStorageUnit: {
        type: DataTypes.STRING
    },
    units: {
        type: DataTypes.STRING
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    amount: {
        type: DataTypes.INTEGER
    },
    priceForOneThis: {
        type: DataTypes.STRING
    },
    priceForThis: {
        type: DataTypes.STRING
    },
    x: {
        type: DataTypes.STRING
    },
    y: {
        type: DataTypes.STRING
    },
    xInStorage: {
        type: DataTypes.STRING
    },
    yInStorage: {
        type: DataTypes.STRING
    },
    price1: {
        type: DataTypes.STRING
    },
    price2: {
        type: DataTypes.STRING
    },
    price3: {
        type: DataTypes.STRING
    },
    price4: {
        type: DataTypes.STRING
    },
    price5: {
        type: DataTypes.STRING
    },
    newField1: {
        type: DataTypes.STRING
    },
    newField2: {
        type: DataTypes.STRING
    },
    newField3: {
        type: DataTypes.STRING
    },
    newField4: {
        type: DataTypes.STRING
    },
    newField5: {
        type: DataTypes.STRING
    },
}, optionsForModel);
const OrderUnitUnit = sequelize.define('orderunitunit', {
    id: {
        type: DataTypes.INTEGER,
    },
    idKey: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    idInStorageUnit: {
        type: DataTypes.STRING
    },
    units: {
        type: DataTypes.STRING
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    amount: {
        type: DataTypes.INTEGER
    },
    priceForOneThis: {
        type: DataTypes.STRING
    },
    priceForThis: {
        type: DataTypes.STRING
    },
    x: {
        type: DataTypes.STRING
    },
    y: {
        type: DataTypes.STRING
    },
    xInStorage: {
        type: DataTypes.STRING
    },
    yInStorage: {
        type: DataTypes.STRING
    },
    price1: {
        type: DataTypes.STRING
    },
    price2: {
        type: DataTypes.STRING
    },
    price3: {
        type: DataTypes.STRING
    },
    price4: {
        type: DataTypes.STRING
    },
    price5: {
        type: DataTypes.STRING
    },
    newField1: {
        type: DataTypes.STRING
    },
    newField2: {
        type: DataTypes.STRING
    },
    newField3: {
        type: DataTypes.STRING
    },
    newField4: {
        type: DataTypes.STRING
    },
    newField5: {
        type: DataTypes.STRING
    },
}, optionsForModel);

const OrderOrderUnitLink = sequelize.define('orderorderunitlink', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderunitIdKey: {
        type: DataTypes.INTEGER,
        references: {
            model: 'orderunits',
            key: 'idKey'
        }
    },
    materialId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'materials',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    priceForOne: {
        type: DataTypes.STRING
    },
    totalPrice: {
        type: DataTypes.STRING
    },
}, optionsForModel);

// Зв'язки
OrderUnit.hasMany(OrderOrderUnitLink, { as: 'orderorderunitlink' });
OrderOrderUnitLink.belongsTo(OrderUnit);


const Materials = sequelize.define('materials', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    photo: {
        type: DataTypes.STRING
    },
    article: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    units: {
        type: DataTypes.STRING
    },
    cost: {
        type: DataTypes.STRING
    },
    price1: {
        type: DataTypes.STRING
    },
    price2: {
        type: DataTypes.STRING
    },
    price3: {
        type: DataTypes.STRING
    },
    price4: {
        type: DataTypes.STRING
    },
    price5: {
        type: DataTypes.STRING
    },
    thickness: {
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.STRING
    },
    amountAll: {
        type: DataTypes.STRING
    },
    koef: {
        type: DataTypes.STRING
    },
    koefDamper: {
        type: DataTypes.STRING
    },
    IfCoef: {
        type: DataTypes.STRING
    },
    creator: {
        type: DataTypes.STRING
    },
    purveyor: {
        type: DataTypes.STRING
    },
    x: {
        type: DataTypes.STRING
    },
    y: {
        type: DataTypes.STRING
    },
    newField1: {
        type: DataTypes.STRING
    },
    newField2: {
        type: DataTypes.STRING
    },
    newField3: {
        type: DataTypes.STRING
    },
    newField4: {
        type: DataTypes.STRING
    },
    newField5: {
        type: DataTypes.STRING
    },
}, optionsForModel);
const Actions = sequelize.define('actions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userid: {
        type: DataTypes.INTEGER
    },
    session: {
        type: DataTypes.STRING
    },
    whatAction: {
        type: DataTypes.STRING
    },
    time: {
        type: DataTypes.STRING
    },
    result: {
        type: DataTypes.STRING
    },
    targetId: {
        type: DataTypes.STRING
    },
    value: {
        type: DataTypes.STRING
    },
}, optionsForModel);
const Services = sequelize.define('services', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT
    },
    use: {
        type: DataTypes.JSON,
    },
    useMaterials: {
        type: DataTypes.JSON,
    },
}, optionsForModel);
const Devices = sequelize.define('devices', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    units: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT
    },
}, optionsForModel);

const Types = sequelize.define('types', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    elemental: {
        type: DataTypes.BOOLEAN
    },
    creator: {
        type: DataTypes.STRING
    },
}, optionsForModel);
const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    x: {
        type: DataTypes.STRING
    },
    y: {
        type: DataTypes.STRING
    },
    newField1: {
        type: DataTypes.STRING
    },
    newField2: {
        type: DataTypes.STRING
    },
    newField3: {
        type: DataTypes.STRING
    },
    newField4: {
        type: DataTypes.STRING
    },
    newField5: {
        type: DataTypes.STRING
    },
}, optionsForModel);
const ProductUnit = sequelize.define('productunit', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productId: {
        type: DataTypes.INTEGER,
    },
    quantity: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    idInStorageUnit: {
        type: DataTypes.STRING
    },
    xInStorage: {
        type: DataTypes.STRING
    },
    yInStorage: {
        type: DataTypes.STRING
    },
    newField1: {
        type: DataTypes.STRING
    },
    newField2: {
        type: DataTypes.STRING
    },
    newField3: {
        type: DataTypes.STRING
    },
    newField4: {
        type: DataTypes.STRING
    },
    newField5: {
        type: DataTypes.STRING
    },
}, optionsForModel);

const Counters = sequelize.define('counters', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Epson_p800: {
        type: DataTypes.INTEGER
    },
    Epson_p800_system: {
        type: DataTypes.INTEGER
    },
    Epson_3800: {
        type: DataTypes.INTEGER
    },
    Epson_3800_system: {
        type: DataTypes.INTEGER
    },
    Epson_p800_3800: {
        type: DataTypes.INTEGER
    },
    Epson_p800_3800_system: {
        type: DataTypes.INTEGER
    },
    Epson_P700: {
        type: DataTypes.INTEGER
    },
    Epson_P700_system: {
        type: DataTypes.INTEGER
    },
    Epson_P9000: {
        type: DataTypes.INTEGER
    },
    Epson_P9000_system: {
        type: DataTypes.INTEGER
    },
    HP_m608dn: {
        type: DataTypes.INTEGER
    },
    HP_m608dn_system: {
        type: DataTypes.INTEGER
    },
    Xerox_80_1_colour: {
        type: DataTypes.INTEGER
    },
    Xerox_80_1_colour_system: {
        type: DataTypes.INTEGER
    },
    Xerox_80_2_bw: {
        type: DataTypes.INTEGER
    },
    Xerox_80_2_bw_system: {
        type: DataTypes.INTEGER
    },
    Xerox_80_3_O: {
        type: DataTypes.INTEGER
    },
    Xerox_80_3_O_system: {
        type: DataTypes.INTEGER
    },
    Xerox_80_4_А3: {
        type: DataTypes.INTEGER
    },
    Xerox_80_4_А3_system: {
        type: DataTypes.INTEGER
    },
}, optionsForModel);

Product.hasMany(ProductUnit, { as: 'productunits' });
ProductUnit.belongsTo(Product);

Order.hasMany(OrderUnit, { as: 'orderunits' });
OrderUnit.belongsTo(Order);
OrderUnit.hasMany(OrderUnitUnit, { as: 'orderunitunits' });
OrderUnitUnit.belongsTo(OrderUnit);

Users.hasMany(Order, { as: 'orders' });
Order.belongsTo(Users);

Devices.belongsToMany(Materials, { through: 'DevicesMaterials' });
Materials.belongsToMany(Devices, { through: 'DevicesMaterials' });





// const Entities = sequelize.define('Entities', {
//     Entity_ID: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     Entity_Name: {
//         type: DataTypes.STRING
//     }
// }, optionsForModel);
// const Attributes = sequelize.define('Attributes', {
//     Attribute_ID: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     Attribute_Name: {
//         type: DataTypes.STRING
//     }
// }, optionsForModel);
// const Values = sequelize.define('Values', {
//     Value_ID: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     Value: {
//         type: DataTypes.STRING
//     },
//     Entity_ID: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: 'Entities',
//             key: 'Entity_ID'
//         }
//     },
//     Attribute_ID: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: 'Attributes',
//             key: 'Attribute_ID'
//         }
//     }
// }, optionsForModel);
// function User(sequelize) {
//     return sequelize.define('User', {
//         name: { type: DataTypes.STRING, allowNull: true },
//         role: { type: DataTypes.STRING, allowNull: true },
//         mail: { type: DataTypes.STRING, allowNull: true },
//         pass: { type: DataTypes.STRING, allowNull: true },
//         phone: { type: DataTypes.STRING, allowNull: true },
//         messenger: { type: DataTypes.STRING, allowNull: true },
//         newField1: { type: DataTypes.STRING, allowNull: true },
//         newField2: { type: DataTypes.STRING, allowNull: true },
//         newField3: { type: DataTypes.STRING, allowNull: true },
//         newField4: { type: DataTypes.STRING, allowNull: true },
//         newField5: { type: DataTypes.STRING, allowNull: true },
//         createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
//         updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
//     }, {
//         tableName: 'users',
//         timestamps: true,
//     });
// }

// OrderUnitUnit.beforeCreate((unit, options) => {
//     delete unit.dataValues.id; // видалити id перед збереженням
// });

module.exports = {
    Files,
    Sessions,
    Users,
    Order,
    OrderUnit,
    OrderUnitUnit,
    sequelize,
    Types,
    Actions,
    Services,
    Devices,
    Materials,
    Product,
    ProductUnit,
    Counters,
    Op
}
