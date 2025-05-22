const User = require('./user_model');
const Message = require('./message_model');
const Group = require('./group_model');
const GroupMember = require('./group_member_model');

// Existing associations
User.hasMany(Message, { foreignKey: 'userId', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'userId' });

// New associations
User.belongsToMany(Group, { through: GroupMember, foreignKey: 'userId' });
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'groupId' });

Group.belongsTo(User, { as: 'admin', foreignKey: 'adminId' }); // Admin reference

module.exports = {
  User,
  Message,
  Group,
  GroupMember
};
