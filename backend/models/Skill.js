
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Skill = sequelize.define('Skill', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    priceMin: DataTypes.FLOAT,
    priceMax: DataTypes.FLOAT,
    duration: DataTypes.INTEGER,
    level: DataTypes.STRING,
    skillType: {
        type: DataTypes.STRING,
        defaultValue: 'online',
    },
    thumbnail: DataTypes.STRING,
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    totalReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    totalSessions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Skill;
