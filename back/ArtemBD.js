const {Sequelize, Model, DataTypes, Op} = require('sequelize');
// const sequelize = new Sequelize('calc', 'Aiatomas', 'Artem012345', {
const sequelize = new Sequelize('PrintPeaksDB', 'root', 'Kv14061992', {
    host: '127.0.0.1',
    // host: '192.168.0.100',
    // dialect: 'mysql',
    dialect: 'mysql',
    logging: false,
    /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});

// Функція для створення моделі "files"
function QFile(sequelize) {
    return sequelize.define('QFile', {
        name: { type: DataTypes.STRING, allowNull: true },
        path: { type: DataTypes.STRING, allowNull: true },
        userid: { type: DataTypes.INTEGER, allowNull: true },
        user: { type: DataTypes.INTEGER, allowNull: true },
        session: { type: DataTypes.STRING, allowNull: true },
        orderid: { type: DataTypes.INTEGER, allowNull: true },
        img: { type: DataTypes.BOOLEAN, allowNull: true },
        red: { type: DataTypes.BOOLEAN, allowNull: true },
        format: { type: DataTypes.STRING, allowNull: true },
        sides: { type: DataTypes.STRING, allowNull: true },
        color: { type: DataTypes.STRING, allowNull: true },
        cower: { type: DataTypes.STRING, allowNull: true },
        paper: { type: DataTypes.STRING, allowNull: true },
        destiny: { type: DataTypes.STRING, allowNull: true },
        destinyThis: { type: DataTypes.STRING, allowNull: true },
        binding: { type: DataTypes.STRING, allowNull: true },
        bindingSelect: { type: DataTypes.STRING, allowNull: true },
        lamination: { type: DataTypes.STRING, allowNull: true },
        roundCorner: { type: DataTypes.STRING, allowNull: true },
        frontLining: { type: DataTypes.STRING, allowNull: true },
        backLining: { type: DataTypes.STRING, allowNull: true },
        big: { type: DataTypes.STRING, allowNull: true },
        holes: { type: DataTypes.STRING, allowNull: true },
        countInFile: { type: DataTypes.INTEGER, allowNull: true },
        allPaperCount: { type: DataTypes.INTEGER, allowNull: true },
        orient: { type: DataTypes.BOOLEAN, allowNull: true },
        stickerCutting: { type: DataTypes.STRING, allowNull: true },
        stickerCuttingThis: { type: DataTypes.STRING, allowNull: true },
        x: { type: DataTypes.STRING, allowNull: true },
        y: { type: DataTypes.STRING, allowNull: true },
        list: { type: DataTypes.STRING, allowNull: true },
        calc: { type: DataTypes.STRING, allowNull: true },
        touse: { type: DataTypes.STRING, allowNull: true },
        luvers: { type: DataTypes.STRING, allowNull: true },
        bannerVarit: { type: DataTypes.STRING, allowNull: true },
        floorLamination: { type: DataTypes.STRING, allowNull: true },
        widthLamination: { type: DataTypes.STRING, allowNull: true },
        cuttingSamokleika: { type: DataTypes.STRING, allowNull: true },
        price: { type: DataTypes.STRING, allowNull: true },
        count: { type: DataTypes.INTEGER, allowNull: true },
        canToOrder: { type: DataTypes.BOOLEAN, allowNull: true },
        inBasket: { type: DataTypes.BOOLEAN, allowNull: true },
        newField1: { type: DataTypes.STRING, allowNull: true },
        newField2: { type: DataTypes.STRING, allowNull: true },
        newField3: { type: DataTypes.STRING, allowNull: true },
        newField4: { type: DataTypes.STRING, allowNull: true },
        newField5: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'files',
        timestamps: true,
    });
}

// Функція для створення моделі "sessions"
function QSession(sequelize) {
    return sequelize.define('QSession', {
        session: { type: DataTypes.BIGINT, allowNull: true },
        userid: { type: DataTypes.INTEGER, allowNull: true },
        inBasket: { type: DataTypes.BOOLEAN, allowNull: true },
        userAgent: { type: DataTypes.STRING, allowNull: true },
        ip: { type: DataTypes.STRING, allowNull: true },
        newField1: { type: DataTypes.STRING, allowNull: true },
        newField2: { type: DataTypes.STRING, allowNull: true },
        newField3: { type: DataTypes.STRING, allowNull: true },
        newField4: { type: DataTypes.STRING, allowNull: true },
        newField5: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'sessions',
        timestamps: true,
    });
}

// // Функція для створення моделі "users"
function User(sequelize) {
    return sequelize.define('User', {
        name: { type: DataTypes.STRING, allowNull: true },
        role: { type: DataTypes.STRING, allowNull: true },
        mail: { type: DataTypes.STRING, allowNull: true },
        pass: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        messenger: { type: DataTypes.STRING, allowNull: true },
        newField1: { type: DataTypes.STRING, allowNull: true },
        newField2: { type: DataTypes.STRING, allowNull: true },
        newField3: { type: DataTypes.STRING, allowNull: true },
        newField4: { type: DataTypes.STRING, allowNull: true },
        newField5: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'users',
        timestamps: true,
    });
}

// Функція для створення моделі "orders"
function QOrder(sequelize) {
    return sequelize.define('QOrder', {
        status: { type: DataTypes.STRING, allowNull: true },
        executorId: { type: DataTypes.STRING, allowNull: true },
        prepayment: { type: DataTypes.STRING, allowNull: true },
        price: { type: DataTypes.STRING, allowNull: true },
        allPrice: { type: DataTypes.STRING, allowNull: true },
        timeCreate: { type: DataTypes.STRING, allowNull: true },
        clientId: { type: DataTypes.STRING, allowNull: true },
        payForm: { type: DataTypes.STRING, allowNull: true },
        payStatus: { type: DataTypes.STRING, allowNull: true },
        newField1: { type: DataTypes.STRING, allowNull: true },
        newField2: { type: DataTypes.STRING, allowNull: true },
        newField3: { type: DataTypes.STRING, allowNull: true },
        newField4: { type: DataTypes.STRING, allowNull: true },
        newField5: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User', // назва моделі
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
    }, {
        tableName: 'orders',
        timestamps: true,
    });
}

// Функція для створення моделі "orderunits"
function QOrderUnit(sequelize) {
    return sequelize.define('QOrderUnit', {
        name: { type: DataTypes.STRING, allowNull: true },
        type: { type: DataTypes.STRING, allowNull: true },
        idInStorageUnit: { type: DataTypes.STRING, allowNull: true },
        units: { type: DataTypes.STRING, allowNull: true },
        quantity: { type: DataTypes.INTEGER, allowNull: true },
        amount: { type: DataTypes.INTEGER, allowNull: true },
        priceForOneThis: { type: DataTypes.STRING, allowNull: true },
        priceForThis: { type: DataTypes.STRING, allowNull: true },
        x: { type: DataTypes.STRING, allowNull: true },
        y: { type: DataTypes.STRING, allowNull: true },
        xInStorage: { type: DataTypes.STRING, allowNull: true },
        yInStorage: { type: DataTypes.STRING, allowNull: true },
        price1: { type: DataTypes.STRING, allowNull: true },
        price2: { type: DataTypes.STRING, allowNull: true },
        price3: { type: DataTypes.STRING, allowNull: true },
        price4: { type: DataTypes.STRING, allowNull: true },
        price5: { type: DataTypes.STRING, allowNull: true },
        newField1: { type: DataTypes.STRING, allowNull: true },
        newField2: { type: DataTypes.STRING, allowNull: true },
        newField3: { type: DataTypes.STRING, allowNull: true },
        newField4: { type: DataTypes.STRING, allowNull: true },
        newField5: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        orderId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'QOrder', // назва моделі
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
    }, {
        tableName: 'orderunits',
        timestamps: true,
    });
}

// Функція для створення моделі "orderunitunits"
function QOrderUnitUnit(sequelize) {
    return sequelize.define('QOrderUnitUnit', {
        name: { type: DataTypes.STRING, allowNull: true },
        type: { type: DataTypes.STRING, allowNull: true },
        idInStorageUnit: { type: DataTypes.STRING, allowNull: true },
        units: { type: DataTypes.STRING, allowNull: true },
        quantity: { type: DataTypes.INTEGER, allowNull: true },
        amount: { type: DataTypes.INTEGER, allowNull: true },
        priceForOneThis: { type: DataTypes.STRING, allowNull: true },
        priceForThis: { type: DataTypes.STRING, allowNull: true },
        x: { type: DataTypes.STRING, allowNull: true },
        y: { type: DataTypes.STRING, allowNull: true },
        xInStorage: { type: DataTypes.STRING, allowNull: true },
        yInStorage: { type: DataTypes.STRING, allowNull: true },
        price1: { type: DataTypes.STRING, allowNull: true },
        price2: { type: DataTypes.STRING, allowNull: true },
        price3: { type: DataTypes.STRING, allowNull: true },
        price4: { type: DataTypes.STRING, allowNull: true },
        price5: { type: DataTypes.STRING, allowNull: true },
        newField1: { type: DataTypes.STRING, allowNull: true },
        newField2: { type: DataTypes.STRING, allowNull: true },
        newField3: { type: DataTypes.STRING, allowNull: true },
        newField4: { type: DataTypes.STRING, allowNull: true },
        newField5: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        orderunitIdKey: {
            type: DataTypes.INTEGER,
            references: {
                model: 'QOrderUnit', // назва моделі
                key: 'idKey',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
    }, {
        tableName: 'orderunitunits',
        timestamps: true,
    });
}

// Функція для створення моделі "actions"
function QAction(sequelize) {
    return sequelize.define('QAction', {
        userid: { type: DataTypes.INTEGER, allowNull: true },
        session: { type: DataTypes.STRING, allowNull: true },
        whatAction: { type: DataTypes.STRING, allowNull: true },
        time: { type: DataTypes.STRING, allowNull: true },
        result: { type: DataTypes.STRING, allowNull: true },
        targetId: { type: DataTypes.STRING, allowNull: true },
        value: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'actions',
        timestamps: true,
    });
}

// Функція для створення моделі "services"
function QService(sequelize) {
    return sequelize.define('QService', {
        type: { type: DataTypes.STRING, allowNull: true },
        price: { type: DataTypes.DOUBLE, allowNull: true },
        use: { type: DataTypes.JSON, allowNull: true },
        useMaterials: { type: DataTypes.JSON, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'services',
        timestamps: true,
    });
}

// Функція для створення моделі "devices"
function QDevice(sequelize) {
    return sequelize.define('QDevice', {
        type: { type: DataTypes.STRING, allowNull: true },
        name: { type: DataTypes.STRING, allowNull: true },
        units: { type: DataTypes.STRING, allowNull: true },
        price: { type: DataTypes.DOUBLE, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'devices',
        timestamps: true,
    });
}

// Функція для створення моделі "materials"
function QMaterial(sequelize) {
    return sequelize.define('QMaterial', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: true },
        type: { type: DataTypes.STRING, allowNull: true },
        name: { type: DataTypes.STRING, allowNull: true },
        units: { type: DataTypes.STRING, allowNull: true },
        cost: { type: DataTypes.STRING, allowNull: true },
        price1: { type: DataTypes.STRING, allowNull: true },
        price2: { type: DataTypes.STRING, allowNull: true },
        price3: { type: DataTypes.STRING, allowNull: true },
        price4: { type: DataTypes.STRING, allowNull: true },
        price5: { type: DataTypes.STRING, allowNull: true },
        amount: { type: DataTypes.STRING, allowNull: true },
        amountAll: { type: DataTypes.STRING, allowNull: true },
        koef: { type: DataTypes.STRING, allowNull: true },
        koefDamper: { type: DataTypes.STRING, allowNull: true },
        IfCoef: { type: DataTypes.STRING, allowNull: true },
        creator: { type: DataTypes.STRING, allowNull: true },
        purveyor: { type: DataTypes.STRING, allowNull: true },
        x: { type: DataTypes.STRING, allowNull: true },
        y: { type: DataTypes.STRING, allowNull: true },
        newField1: { type: DataTypes.STRING, allowNull: true },
        newField2: { type: DataTypes.STRING, allowNull: true },
        newField3: { type: DataTypes.STRING, allowNull: true },
        newField4: { type: DataTypes.STRING, allowNull: true },
        newField5: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'materials',
        timestamps: true,
    });
}

// Функція для створення моделі "types"
function QType(sequelize) {
    return sequelize.define('QType', {
        name: { type: DataTypes.STRING, allowNull: true },
        elemental: { type: DataTypes.BOOLEAN, allowNull: true },
        creator: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'types',
        timestamps: true,
    });
}

// Функція для створення моделі "products"
function QProduct(sequelize) {
    return sequelize.define('QProduct', {
        type: { type: DataTypes.STRING, allowNull: true },
        name: { type: DataTypes.STRING, allowNull: true },
        x: { type: DataTypes.STRING, allowNull: true },
        y: { type: DataTypes.STRING, allowNull: true },
        newField1: { type: DataTypes.STRING, allowNull: true },
        newField2: { type: DataTypes.STRING, allowNull: true },
        newField3: { type: DataTypes.STRING, allowNull: true },
        newField4: { type: DataTypes.STRING, allowNull: true },
        newField5: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'products',
        timestamps: true,
    });
}

// Функція для створення моделі "productunits"
function QProductUnit(sequelize) {
    return sequelize.define('QProductUnit', {
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'QProduct', // назва моделі
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        quantity: { type: DataTypes.STRING, allowNull: true },
        name: { type: DataTypes.STRING, allowNull: true },
        idInStorageUnit: { type: DataTypes.STRING, allowNull: true },
        xInStorage: { type: DataTypes.STRING, allowNull: true },
        yInStorage: { type: DataTypes.STRING, allowNull: true },
        newField1: { type: DataTypes.STRING, allowNull: true },
        newField2: { type: DataTypes.STRING, allowNull: true },
        newField3: { type: DataTypes.STRING, allowNull: true },
        newField4: { type: DataTypes.STRING, allowNull: true },
        newField5: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'productunits',
        timestamps: true,
    });
}
// const User = sequelize.define('Users', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     role: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     mail: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     phone: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     messenger: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }, {
//     timestamps: false
// });

// Функція для створення моделі "counters"
function QCounter(sequelize) {
    return sequelize.define('QCounter', {
        Epson_p800: { type: DataTypes.INTEGER, allowNull: true },
        Epson_p800_system: { type: DataTypes.INTEGER, allowNull: true },
        Epson_3800: { type: DataTypes.INTEGER, allowNull: true },
        Epson_3800_system: { type: DataTypes.INTEGER, allowNull: true },
        Epson_p800_3800: { type: DataTypes.INTEGER, allowNull: true },
        Epson_p800_3800_system: { type: DataTypes.INTEGER, allowNull: true },
        Epson_P700: { type: DataTypes.INTEGER, allowNull: true },
        Epson_P700_system: { type: DataTypes.INTEGER, allowNull: true },
        Epson_P9000: { type: DataTypes.INTEGER, allowNull: true },
        Epson_P9000_system: { type: DataTypes.INTEGER, allowNull: true },
        HP_m608dn: { type: DataTypes.INTEGER, allowNull: true },
        HP_m608dn_system: { type: DataTypes.INTEGER, allowNull: true },
        Xerox_80_1_colour: { type: DataTypes.INTEGER, allowNull: true },
        Xerox_80_1_colour_system: { type: DataTypes.INTEGER, allowNull: true },
        Xerox_80_2_bw: { type: DataTypes.INTEGER, allowNull: true },
        Xerox_80_2_bw_system: { type: DataTypes.INTEGER, allowNull: true },
        Xerox_80_3_O: { type: DataTypes.INTEGER, allowNull: true },
        Xerox_80_3_O_system: { type: DataTypes.INTEGER, allowNull: true },
        Xerox_80_4_А3: { type: DataTypes.INTEGER, allowNull: true },
        Xerox_80_4_А3_system: { type: DataTypes.INTEGER, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'counters',
        timestamps: true,
    });
}

// Функція для створення моделі "Entities"
function QEntity(sequelize) {
    return sequelize.define('QEntity', {
        Entity_Name: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'Entities',
        timestamps: true,
    });
}

// Функція для створення моделі "Attributes"
function QAttribute(sequelize) {
    return sequelize.define('QAttribute', {
        Attribute_Name: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'Attributes',
        timestamps: true,
    });
}

// Функція для створення моделі "Values"
function QValue(sequelize) {
    return sequelize.define('QValue', {
        Value: { type: DataTypes.STRING, allowNull: true },
        Entity_ID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'QEntity', // назва моделі
                key: 'Entity_ID',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        Attribute_ID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'QAttribute', // назва моделі
                key: 'Attribute_ID',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'Values',
        timestamps: true,
    });
}

// Функція для створення моделі "paper_thin"
function QPaperThin(sequelize) {
    return sequelize.define('QPaperThin', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false },
        price_1_10: { type: DataTypes.DOUBLE, allowNull: false },
        price_11_50: { type: DataTypes.DOUBLE, allowNull: false },
        price_51_100: { type: DataTypes.DOUBLE, allowNull: false },
        price_101_500: { type: DataTypes.DOUBLE, allowNull: false },
        price_500_plus: { type: DataTypes.DOUBLE, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'paper_thin',
        timestamps: true,
    });
}

// Функція для створення моделі "paper_average"
function QPaperAverage(sequelize) {
    return sequelize.define('QPaperAverage', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Average' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price_1_10: { type: DataTypes.DOUBLE, allowNull: false },
        price_11_50: { type: DataTypes.DOUBLE, allowNull: false },
        price_51_100: { type: DataTypes.DOUBLE, allowNull: false },
        price_101_500: { type: DataTypes.DOUBLE, allowNull: false },
        price_500_plus: { type: DataTypes.DOUBLE, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'paper_average',
        timestamps: true,
    });
}

// Функція для створення моделі "paper_thick"
function QPaperThick(sequelize) {
    return sequelize.define('QPaperThick', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Thick' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price_1_10: { type: DataTypes.DOUBLE, allowNull: false },
        price_11_50: { type: DataTypes.DOUBLE, allowNull: false },
        price_51_100: { type: DataTypes.DOUBLE, allowNull: false },
        price_101_500: { type: DataTypes.DOUBLE, allowNull: false },
        price_500_plus: { type: DataTypes.DOUBLE, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'paper_thick',
        timestamps: true,
    });
}

// Функція для створення моделі "paper_label"
function QPaperLabel(sequelize) {
    return sequelize.define('QPaperLabel', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Label' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price_1_10: { type: DataTypes.DOUBLE, allowNull: false },
        price_11_50: { type: DataTypes.DOUBLE, allowNull: false },
        price_51_100: { type: DataTypes.DOUBLE, allowNull: false },
        price_101_500: { type: DataTypes.DOUBLE, allowNull: false },
        price_500_plus: { type: DataTypes.DOUBLE, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'paper_label',
        timestamps: true,
    });
}

// Функція для створення моделі "Print_Cmyk"
function QPrintCmyk(sequelize) {
    return sequelize.define('QPrintCmyk', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Print' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price_1_10: { type: DataTypes.DOUBLE, allowNull: false },
        price_11_50: { type: DataTypes.DOUBLE, allowNull: false },
        price_51_100: { type: DataTypes.DOUBLE, allowNull: false },
        price_101_500: { type: DataTypes.DOUBLE, allowNull: false },
        price_500_plus: { type: DataTypes.DOUBLE, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'Print_Cmyk',
        timestamps: true,
    });
}

// Функція для створення моделі "paper_postpres"
function QPaperPostpres(sequelize) {
    return sequelize.define('QPaperPostpres', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Postpres' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price_1_10: { type: DataTypes.DOUBLE, allowNull: false },
        price_11_50: { type: DataTypes.DOUBLE, allowNull: false },
        price_51_100: { type: DataTypes.DOUBLE, allowNull: false },
        price_101_500: { type: DataTypes.DOUBLE, allowNull: false },
        price_500_plus: { type: DataTypes.DOUBLE, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'paper_postpres',
        timestamps: true,
    });
}

// Функція для створення моделі "Print_B/w"
function QPrintBW(sequelize) {
    return sequelize.define('QPrintBW', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'B/W' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price_1: { type: DataTypes.STRING, allowNull: false },
        price_11: { type: DataTypes.STRING, allowNull: false },
        price_51: { type: DataTypes.STRING, allowNull: false },
        price_101: { type: DataTypes.STRING, allowNull: false },
        price_500_plus: { type: DataTypes.STRING, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'Print_B/w',
        timestamps: true,
    });
}

// Функція для створення моделі "paper_photo_wide"
function QPaperPhotoWide(sequelize) {
    return sequelize.define('QPaperPhotoWide', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Photo Wide' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price_1_2_5: { type: DataTypes.DOUBLE, allowNull: false },
        price_2_5_6: { type: DataTypes.DOUBLE, allowNull: false },
        price_6_10: { type: DataTypes.DOUBLE, allowNull: false },
        price_11_20: { type: DataTypes.DOUBLE, allowNull: false },
        price_20_plus: { type: DataTypes.DOUBLE, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'paper_photo_wide',
        timestamps: true,
    });
}

// Функція для створення моделі "print_sublimation"
function QPrintSublimation(sequelize) {
    return sequelize.define('QPrintSublimation', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Sublimation' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price_1_5: { type: DataTypes.STRING, allowNull: false },
        price_6_11: { type: DataTypes.STRING, allowNull: false },
        price_12_20: { type: DataTypes.STRING, allowNull: false },
        price_21_50: { type: DataTypes.STRING, allowNull: false },
        price_51: { type: DataTypes.STRING, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'print_sublimation',
        timestamps: true,
    });
}

// Функція для створення моделі "print_wide_uv_solvent"
function QPrintWideUVSolvent(sequelize) {
    return sequelize.define('QPrintWideUVSolvent', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Wide UV Solvent' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price_1_2_5: { type: DataTypes.DOUBLE, allowNull: false },
        price_2_5_6: { type: DataTypes.DOUBLE, allowNull: false },
        price_6_10: { type: DataTypes.DOUBLE, allowNull: false },
        price_11_20: { type: DataTypes.DOUBLE, allowNull: false },
        price_20_plus: { type: DataTypes.DOUBLE, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'print_wide_uv_solvent',
        timestamps: true,
    });
}

// Функція для створення моделі "print_ofset"
function QPrintOfset(sequelize) {
    return sequelize.define('QPrintOfset', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Ofset' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price_1_500: { type: DataTypes.DOUBLE, allowNull: false },
        price_500_1000: { type: DataTypes.DOUBLE, allowNull: false },
        price_2000_5000: { type: DataTypes.DOUBLE, allowNull: false },
        price_5000_10000: { type: DataTypes.DOUBLE, allowNull: false },
        price_20000_: { type: DataTypes.DOUBLE, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'print_ofset',
        timestamps: true,
    });
}

// Функція для створення моделі "print_photo"
function QPrintPhoto(sequelize) {
    return sequelize.define('QPrintPhoto', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Photo' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price_1: { type: DataTypes.DOUBLE, allowNull: false },
        price_11: { type: DataTypes.DOUBLE, allowNull: false },
        price_51: { type: DataTypes.DOUBLE, allowNull: false },
        price_101: { type: DataTypes.DOUBLE, allowNull: false },
        price_500_plus: { type: DataTypes.DOUBLE, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'print_photo',
        timestamps: true,
    });
}

// Функція для створення моделі "print_post"
function QPrintPost(sequelize) {
    return sequelize.define('QPrintPost', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Post' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price: { type: DataTypes.STRING, allowNull: false },
        price_2: { type: DataTypes.STRING, allowNull: false },
        price_3: { type: DataTypes.STRING, allowNull: false },
        price_4: { type: DataTypes.STRING, allowNull: false },
        price_500_plus: { type: DataTypes.STRING, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'print_post',
        timestamps: true,
    });
}

// Функція для створення моделі "print_binding"
function QPrintBinding(sequelize) {
    return sequelize.define('QPrintBinding', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Binding' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price_1_5: { type: DataTypes.STRING, allowNull: false },
        price_6_11: { type: DataTypes.STRING, allowNull: false },
        price_12_20: { type: DataTypes.STRING, allowNull: false },
        price_21_50: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.STRING, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'print_binding',
        timestamps: true,
    });
}

// Функція для створення моделі "print_photo_wide"
function QPrintPhotoWide(sequelize) {
    return sequelize.define('QPrintPhotoWide', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Photo Wide' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price_1_2_5: { type: DataTypes.DOUBLE, allowNull: false },
        price_2_5_6: { type: DataTypes.DOUBLE, allowNull: false },
        price_6_10: { type: DataTypes.DOUBLE, allowNull: false },
        price_11_20: { type: DataTypes.DOUBLE, allowNull: false },
        price_20_plus: { type: DataTypes.DOUBLE, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'print_photo_wide',
        timestamps: true,
    });
}

// Функція для створення моделі "paper_photo"
function QPaperPhoto(sequelize) {
    return sequelize.define('QPaperPhoto', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Photo' },
        name: { type: DataTypes.STRING, allowNull: false },
        unit: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gsm' },
        cost_price: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
        price: { type: DataTypes.DOUBLE, allowNull: false },
        price_2: { type: DataTypes.DOUBLE, allowNull: false },
        price_3: { type: DataTypes.DOUBLE, allowNull: false },
        price_4: { type: DataTypes.DOUBLE, allowNull: false },
        price_500_plus: { type: DataTypes.DOUBLE, allowNull: false },
        coefficient: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 1 },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: false,
            defaultValue: 'quantity',
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        last_added_date: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'paper_photo',
        timestamps: true,
    });
}

// Функція для створення моделі "lamination_type"
function QLaminationType(sequelize) {
    return sequelize.define('QLaminationType', {
        lamination_type: { type: DataTypes.STRING, allowNull: true },
    }, {
        tableName: 'lamination_type',
        timestamps: true,
    });
}

// Функція для створення моделі "lamination_thickness"
function QLaminationThickness(sequelize) {
    return sequelize.define('QLaminationThickness', {
        thickness: { type: DataTypes.STRING, allowNull: true },
    }, {
        tableName: 'lamination_thickness',
        timestamps: true,
    });
}

// Функція для створення моделі "lamination_full"
function QLaminationFull(sequelize) {
    return sequelize.define('QLaminationFull', {
        photo: { type: DataTypes.STRING, allowNull: true },
        article: { type: DataTypes.STRING, allowNull: true },
        lamination_type_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'QLaminationType',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },
        lamination_thickness_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'QLaminationThickness',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },
        unit: { type: DataTypes.STRING, allowNull: true },
        cost_price: { type: DataTypes.DOUBLE, allowNull: true },
        price_1_10: { type: DataTypes.STRING, allowNull: true },
        price_11_50: { type: DataTypes.STRING, allowNull: true },
        price_51_100: { type: DataTypes.STRING, allowNull: true },
        price_101_200: { type: DataTypes.STRING, allowNull: true },
        price_200: { type: DataTypes.STRING, allowNull: true },
        coefficient: { type: DataTypes.DOUBLE, allowNull: true },
        calculation_switch: {
            type: DataTypes.ENUM('quantity', 'cost'),
            allowNull: true,
        },
        stock_quantity: { type: DataTypes.INTEGER, allowNull: true },
        in_work_quantity: { type: DataTypes.INTEGER, allowNull: true },
        last_added_date: { type: DataTypes.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    }, {
        tableName: 'lamination_full',
        timestamps: true,
    });
}

// Функція для створення моделі "typeprint_cpm"
function QTypePrintCpm(sequelize) {
    return sequelize.define('QTypePrintCpm', {
        types: { type: DataTypes.STRING, allowNull: true },
    }, {
        tableName: 'typeprint_cpm',
        timestamps: true,
    });
}

module.exports = {
    QFile,
    QSession,
    User,
    QOrder,
    QOrderUnit,
    QOrderUnitUnit,
    QAction,
    QService,
    QDevice,
    QMaterial,
    QType,
    QProduct,
    QProductUnit,
    QCounter,
    QEntity,
    QAttribute,
    QValue,
    QPaperThin,
    QPaperAverage,
    QPaperThick,
    QPaperLabel,
    QPrintCmyk,
    QPaperPostpres,
    QPrintBW,
    QPaperPhotoWide,
    QPrintSublimation,
    QPrintWideUVSolvent,
    QPrintOfset,
    QPrintPhoto,
    QPrintPost,
    QPrintBinding,
    QPrintPhotoWide,
    QPaperPhoto,
    QLaminationType,
    QLaminationThickness,
    QLaminationFull,
    QTypePrintCpm,
    sequelize
};
