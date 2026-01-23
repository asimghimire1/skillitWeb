
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bid = sequelize.define('Bid', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    skillId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    learnerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    proposedPrice: DataTypes.FLOAT,
    proposedDate: DataTypes.DATEONLY,
    proposedTime: DataTypes.STRING,
    sessionType: {
        type: DataTypes.STRING,
        defaultValue: 'online',
    },
    message: DataTypes.TEXT,
    skillSwap: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    skillSwapDetails: DataTypes.STRING,
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
    },
    counterOffer: DataTypes.STRING,
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Bid;
