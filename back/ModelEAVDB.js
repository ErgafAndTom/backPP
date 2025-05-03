const {Sequelize, Model, DataTypes, Op} = require('sequelize');
const sequelize2 = new Sequelize('PrintPeaksDB', 'root', 'Kv14061992', {
    host: '127.0.0.1',
    // host: '192.168.0.100',
    dialect: 'mysql',
    logging: false,
    /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});
const optionsForModel = {
    timestamps: false,
    // createdAt: false,
    // updatedAt: false
    // paranoid: true
}

const Entity = sequelize2.define('entity', {
    Entity_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Entity_Name: {
        type: DataTypes.STRING
    }
}, optionsForModel);
const Attribute = sequelize2.define('attribute', {
    Attribute_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Attribute_Name: {
        type: DataTypes.STRING
    }
}, optionsForModel);
const Value = sequelize2.define('value', {
    Value_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Value: {
        type: DataTypes.STRING
    },
    Entity_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Entity,
            key: 'Entity_ID'
        }
    },
    Attribute_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: Attribute,
            key: 'Attribute_ID'
        }
    }
}, optionsForModel);

Entity.hasMany(Value, { foreignKey: 'Entity_ID' });
Value.belongsTo(Entity, { foreignKey: 'Entity_ID' });

Attribute.hasMany(Value, { foreignKey: 'Attribute_ID' });
Value.belongsTo(Attribute, { foreignKey: 'Attribute_ID' });

// module.exports = {
//     Entity,
//     Attribute,
//     Value,
//     sequelize2,
//     Op
// }