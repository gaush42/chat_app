const User = require('./user_model');
const Message = require('./message_model');

User.hasMany(Message, {foreignKey: 'userId', onDelete: 'CASCADE'});
Message.belongsTo(User, {foreignKey: 'userId'});

module.exports = { User, Message};

