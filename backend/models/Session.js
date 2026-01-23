
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bidId: DataTypes.INTEGER,
    skillId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    learnerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    title: DataTypes.STRING,
    scheduledDate: DataTypes.DATEONLY,
    scheduledTime: DataTypes.STRING,
    duration: {
        type: DataTypes.INTEGER,
        defaultValue: 60,
    },
    sessionType: {
        type: DataTypes.STRING,
        defaultValue: 'online',
    },
    price: DataTypes.FLOAT,
    status: {
        type: DataTypes.STRING,
        defaultValue: 'scheduled',
    },
    meetingLink: DataTypes.STRING,
    location: DataTypes.STRING,
    notes: DataTypes.TEXT,
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Session;
