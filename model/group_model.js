const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Group = sequelize.define('Group', {
  name: DataTypes.STRING,
  created_by: DataTypes.INTEGER
});

module.exports = Group;