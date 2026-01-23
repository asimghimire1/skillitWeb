const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('skillit_db', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
