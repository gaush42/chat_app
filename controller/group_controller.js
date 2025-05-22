const { Group, GroupMember } = require('../models');

exports.createGroup = async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ message: 'Group name and userId are required' });
    }

    const group = await Group.create({ name, adminId: userId });
    await GroupMember.create({ groupId: group.id, userId });

    res.status(201).json({ message: 'Group created successfully', group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create group' });
  }
};
exports.joinGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    if (!groupId || !userId) {
      return res.status(400).json({ message: 'groupId and userId are required' });
    }

    const alreadyMember = await GroupMember.findOne({ where: { groupId, userId } });
    if (alreadyMember) {
      return res.status(400).json({ message: 'User already a member of the group' });
    }

    await GroupMember.create({ groupId, userId });
    res.status(200).json({ message: 'Joined group successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to join group' });
  }
};
exports.listGroups = async (req, res) => {
  try {
    const groups = await Group.findAll({
      include: {
        model: User,
        as: 'admin',
        attributes: ['id', 'fullname'],
      }
    });

    res.status(200).json({ groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list groups' });
  }
};
exports.removeMember = async (req, res) => {
  try {
    const { groupId, memberId, adminId } = req.body;

    // Optional: validate if adminId is really the group admin
    const group = await Group.findByPk(groupId);
    if (group.adminId !== adminId) {
      return res.status(403).json({ message: 'Only admin can remove members' });
    }

    if (adminId === memberId) {
      return res.status(400).json({ message: 'Admin cannot remove themselves' });
    }

    await GroupMember.destroy({ where: { groupId, userId: memberId } });
    res.status(200).json({ message: 'Member removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove member' });
  }
};
exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { adminId } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group || group.adminId !== adminId) {
      return res.status(403).json({ message: 'Only admin can delete the group' });
    }

    await Group.destroy({ where: { id: groupId } }); // Also deletes members if cascade set
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete group' });
  }
};