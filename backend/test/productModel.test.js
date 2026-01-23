const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  email: DataTypes.STRING,
  fullname: DataTypes.STRING,
  password: DataTypes.STRING,
  role: DataTypes.STRING,
});