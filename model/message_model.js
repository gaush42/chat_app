const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
  content: DataTypes.TEXT,
  user_id: DataTypes.INTEGER,
  group_id: DataTypes.INTEGER
});

module.exports = Message;
