
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Content = sequelize.define('Content', {
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
    thumbnail: DataTypes.STRING,
    videoUrl: DataTypes.STRING,
    duration: DataTypes.STRING,
    category: DataTypes.STRING,
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'draft',
    },
    visibility: {
        type: DataTypes.STRING,
        defaultValue: 'public',
    },
    trimStart: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    trimEnd: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Content;
