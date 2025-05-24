const User = require('./user_model');
const Group = require('./group_model');
const Message = require('./message_model');
const GroupMember = require('./group_member_model');

// --- Associations ---

// User <-> Group (Many-to-Many) via GroupMember
User.belongsToMany(Group, { through: GroupMember, foreignKey: 'user_id' });
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'group_id' });

GroupMember.belongsTo(User, { foreignKey: 'user_id' });
GroupMember.belongsTo(Group, { foreignKey: 'group_id' });

// Group belongs to a creator (User)
Group.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Group.hasMany(GroupMember, { foreignKey: 'group_id' }); // Add this


// User -> Message (One-to-Many)
User.hasMany(Message, { foreignKey: 'user_id' });
Message.belongsTo(User, { foreignKey: 'user_id' });

// Group -> Message (One-to-Many)
Group.hasMany(Message, { foreignKey: 'group_id' });
Message.belongsTo(Group, { foreignKey: 'group_id' });

module.exports = { User, Group, Message, GroupMember };