const { Group, User, GroupMember, Message } = require('../model');

// 1. Create Group (Creator becomes admin)
exports.createGroup = async (req, res) => {
  try {
    const userId = req.userId
    const { name } = req.body;
    console.log(name)
    console.log('UserID', userId)
    const group = await Group.create({ name, created_by: userId });
    console.log(group)

    await GroupMember.create({
      user_id: userId,
      group_id: group.id,
      is_admin: true,
    });

    res.status(201).json({ group });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group'});
  }
};

// 2. Add Member (admin only)
exports.addMember = async (req, res) => {
  try {
    const { groupId, email } = req.body;

    const isAdmin = await GroupMember.findOne({
      where: { group_id: groupId, user_id: req.userId, is_admin: true },
    });

    if (!isAdmin) return res.status(403).json({ error: 'Admin access required' });

    const user = await User.findOne({where: {email}})
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if the user is already a group member
    const alreadyMember = await GroupMember.findOne({
      where: { group_id: groupId, user_id: user.id },
    });

    if (alreadyMember) {
      return res.status(400).json({ error: 'User is already a group member' });
    }

    await GroupMember.create({ user_id: user.id, group_id: groupId });

    res.json({ message: 'Member added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add member' });
  }
};

// 3. Remove Member (admin only)
exports.removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const isAdmin = await GroupMember.findOne({
      where: { group_id: groupId, user_id: req.userId, is_admin: true },
    });

    if (!isAdmin) return res.status(403).json({ error: 'Admin access required' });

    await GroupMember.destroy({
      where: { group_id: groupId, user_id: userId },
    });

    res.json({ message: 'Member removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

// 4. Make Admin (admin only)
exports.makeAdmin = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const isAdmin = await GroupMember.findOne({
      where: { group_id: groupId, user_id: req.userId, is_admin: true },
    });

    if (!isAdmin) return res.status(403).json({ error: 'Admin access required' });

    await GroupMember.update({ is_admin: true }, {
      where: { group_id: groupId, user_id: userId },
    });

    res.json({ message: 'User promoted to admin' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to promote user' });
  }
};

// 5. Join Group (any user)
exports.joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.userId
    console.log(groupId)
    console.log(userId)

    const exists = await GroupMember.findOne({
      where: { group_id: groupId, user_id: userId },
    });

    if (exists) return res.status(400).json({ error: 'Already a member' });

    await GroupMember.create({ group_id: groupId, user_id: userId });

    res.json({ message: 'Joined group' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join group' });
  }
};

// 6. View Group Info
exports.getGroupInfo = async (req, res) => {
  try {
    console.log("Fetching groupId:", req.params.groupId);
    const group = await Group.findByPk(req.params.groupId, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'fullname'] },
        {
          model: GroupMember,
          include: [{ model: User, attributes: ['id', 'fullname'] }],
        },
      ],
    });

    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.json({ group });
  } catch (err) {
    console.error("❌ Error in getGroupInfo:", err);  // Log the full error
    res.status(500).json({ error: 'Failed to fetch group info' });
  }
};

// 7. Get All Groups User is a Member Of (On login)
exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.userId
    const groups = await Group.findAll({
      include: [{
        model: GroupMember,
        where: { user_id: userId },
      }],
    });

    res.json({ groups });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user groups' });
  }
};

// 8. Get Messages for a Group (only if member)
exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId

    const isMember = await GroupMember.findOne({
      where: { group_id: groupId, user_id: userId },
    });

    if (!isMember) return res.status(403).json({ error: 'Not a group member' });

    const messages = await Message.findAll({
      where: { group_id: groupId },
      include: [{ model: User, attributes: ['id', 'fullname'] }],
      order: [['createdAt', 'ASC']],
    });

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// 9. Send a Message (only if member)
exports.sendMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;
    const userId = req.userId

    const isMember = await GroupMember.findOne({
      where: { group_id: groupId, user_id: userId },
    });

    if (!isMember) return res.status(403).json({ error: 'Not a group member' });

    const message = await Message.create({
      content,
      group_id: groupId,
      user_id: userId,
    });

    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
