module.exports = (sequelize, DataTypes) => {
    const Contractor = sequelize.define("Contractor", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'id',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        bankName: {
            type: DataTypes.STRING,
        },
        iban: {
            type: DataTypes.STRING,
        },
        edrpou: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            // validate: {
            //     isEmail: true,
            // },
        },
        phone: {
            type: DataTypes.STRING,
        },
        taxSystem: {
            type: DataTypes.STRING,
        },
        pdv: {
            type: DataTypes.STRING,
        },
        comment: {
            type: DataTypes.TEXT,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    Contractor.associate = (models) => {
        Contractor.belongsTo(models.User, { foreignKey: 'userId' });
        Contractor.hasMany(models.Invoice, { 
            foreignKey: 'supplierId',
            as: 'supplierInvoices'
        });
        Contractor.hasMany(models.Invoice, { 
            foreignKey: 'buyerId',
            as: 'buyerInvoices'
        });
    };

    return Contractor;
};
