const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentContent = sequelize.define('StudentContent', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    contentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'free', // free, paid, bid
    },
    amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    bidId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Reference to bid if joined via bidding
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active', // active, expired, refunded
    },
    progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Watch progress percentage
    },
    lastWatchedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['studentId', 'contentId']
        }
    ]
});

module.exports = StudentContent;
