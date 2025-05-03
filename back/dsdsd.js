const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('PrintPeaksDB', 'root', 'Kv14061992', {
    host: '127.0.0.1',
    // host: '192.168.0.100',
    // dialect: 'mysql',
    dialect: 'mysql',
    logging: false,
    /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});

// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('database', 'username', 'password', {
//     host: '127.0.0.1',
//     dialect: 'mysql' // або інша база даних, яку ви використовуєте
// });



const Binding = sequelize.define('Binding', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price_1_10: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    price_11_100: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    price_51_500: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    price_500_1000: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    price_1000_plus: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'bindings',
    timestamps: false
});

// Synchronizing with the database
sequelize.sync().then(() => {
    console.log('Таблиця Binding створена успішно');
}).catch((error) => {
    console.error('Помилка при створенні таблиці:', error);
});