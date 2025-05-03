const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const InvoiceDetails = sequelize.define('InvoiceDetails', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        invoiceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Invoices',
                key: 'id'
            }
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
            defaultValue: 'pending'
        },
        paymentDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
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

    InvoiceDetails.associate = (models) => {
        InvoiceDetails.belongsTo(models.Invoice, {
            foreignKey: 'invoiceId',
            as: 'invoice'
        });
    };

    return InvoiceDetails;
}; 