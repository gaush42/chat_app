const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})
module.exports = Message;