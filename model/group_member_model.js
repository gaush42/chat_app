const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GroupMember = sequelize.define('GroupMember', {
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = GroupMember;
