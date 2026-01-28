const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        // Types: 'bid_received', 'bid_accepted', 'bid_rejected', 'counter_offer', 'counter_accepted', 'counter_rejected'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    relatedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // Can be bidId, sessionId, or contentId
    },
    relatedType: {
        type: DataTypes.STRING,
        allowNull: true,
        // 'bid', 'session', 'content'
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    metadata: {
        type: DataTypes.TEXT,
        allowNull: true,
        // JSON string for additional data
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Notification;
