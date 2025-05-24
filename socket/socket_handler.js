const socketAuth = require('../middleware/socketJWT');
const { Message, GroupMember, User } = require('../model/');

module.exports = (io) => {
  io.use(socketAuth); // apply middleware

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`User ${userId} connected via socket`);

    socket.on('joinGroup', async ({ groupId }) => {
      const isMember = await GroupMember.findOne({
        where: { group_id: groupId, user_id: userId },
      });

      if (!isMember) {
        return socket.emit('error', 'Not a group member');
      }

      socket.join(`group_${groupId}`);
      socket.emit('joinedGroup', groupId);
    });

    socket.on('sendMessage', async ({ groupId, content }) => {
      const isMember = await GroupMember.findOne({
        where: { group_id: groupId, user_id: userId },
      });

      if (!isMember) return;

      const message = await Message.create({
        content,
        group_id: groupId,
        user_id: userId,
      });

      const sender = await User.findByPk(userId, {
        attributes: ['id', 'firstname', 'lastname'],
      });

      io.to(`group_${groupId}`).emit('newMessage', {
        id: message.id,
        content: message.content,
        group_id: groupId,
        user: sender,
        createdAt: message.createdAt,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });
};
