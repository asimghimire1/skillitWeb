
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
    fileUrl: DataTypes.STRING,
    duration: DataTypes.STRING,
    category: DataTypes.STRING,
    type: {
        type: DataTypes.STRING,
        defaultValue: 'video', // video, course, tutorial
    },
    tags: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('tags');
            if (!rawValue) return [];
            try {
                return JSON.parse(rawValue);
            } catch (e) {
                return [];
            }
        },
        set(value) {
            this.setDataValue('tags', JSON.stringify(value || []));
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    allowBidding: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    minBidPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
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
    enrollments: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Content;
