const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Invoice = sequelize.define('Invoice', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Orders',
                key: 'id'
            }
        },
        invoiceNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        invoiceDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        // Інформація про постачальника
        supplierId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Contractors',
                key: 'id'
            }
        },
        supplierName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Інформація про покупця
        buyerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Contractors',
                key: 'id'
            }
        },
        buyerName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // Інформація про товари/послуги
        items: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            get() {
                const rawValue = this.getDataValue('items');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('items', JSON.stringify(value));
            }
        },
        totalSum: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
        }
    });

    Invoice.associate = (models) => {
        Invoice.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'creator'
        });
        Invoice.belongsTo(models.Contractor, {
            foreignKey: 'supplierId',
            as: 'supplier'
        });
        Invoice.belongsTo(models.Contractor, {
            foreignKey: 'buyerId',
            as: 'buyer'
        });
        Invoice.belongsTo(models.Order, {
            foreignKey: 'orderId',
            as: 'order'
        });
        Invoice.hasMany(models.PaymentDetails, {
            foreignKey: 'invoiceId',
            as: 'payments',
            onDelete: 'CASCADE'
        });
    };

    return Invoice;
}; 