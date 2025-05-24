const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GroupMember = sequelize.define('GroupMember', {
  user_id: DataTypes.INTEGER,
  group_id: DataTypes.INTEGER,
  is_admin: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = GroupMember;
