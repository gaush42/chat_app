const User = require('./user_model');
const Group = require('./group_model');
const Message = require('./message_model');
const GroupMember = require('./group_member_model');

// Associations
User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember});

User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

module.exports = { User, Group, Message, GroupMember };