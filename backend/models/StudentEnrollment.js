const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentEnrollment = sequelize.define('StudentEnrollment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'enrolled', // enrolled, completed, cancelled
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'free', // free, paid, bid
    },
    amountPaid: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    bidId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    joinedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = StudentEnrollment;
