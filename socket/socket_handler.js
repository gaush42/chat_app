const { Message, User } = require('../model/');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join-group', ({ groupId }) => {
      socket.join(`group-${groupId}`);
    });

    socket.on('send-message', async ({ groupId, userId, content }) => {
      const message = await Message.create({ content, GroupId: groupId, UserId: userId });
      const fullMessage = await Message.findByPk(message.id, { include: [User] });
      io.to(`group-${groupId}`).emit('new-message', fullMessage);
    });
  });
};
