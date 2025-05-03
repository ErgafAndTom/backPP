const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PaymentDetails = sequelize.define('PaymentDetails', {
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
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING,
            defaultValue: 'UAH'
        },
        paymentDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: false
        },
        transactionId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
            defaultValue: 'pending'
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

    PaymentDetails.associate = (models) => {
        PaymentDetails.belongsTo(models.Invoice, {
            foreignKey: 'invoiceId',
            as: 'invoice'
        });
    };

    return PaymentDetails;
}; 