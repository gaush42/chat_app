const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
  content: DataTypes.TEXT,
});

module.exports = Message;
