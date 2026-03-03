const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

async function migrate() {
  try {
    await sequelize.getQueryInterface().addColumn('Users', 'reset_token', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    console.log('Added reset_token column');
  } catch (e) {
    console.log('reset_token column:', e.message);
  }

  try {
    await sequelize.getQueryInterface().addColumn('Users', 'reset_token_expiry', {
      type: DataTypes.DATE,
      allowNull: true,
    });
    console.log('Added reset_token_expiry column');
  } catch (e) {
    console.log('reset_token_expiry column:', e.message);
  }

  process.exit(0);
}

migrate();
