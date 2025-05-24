const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

module.exports = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authorization token missing'));
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    socket.userId = decoded.userId; // attach the user ID from payload
    next();
  } catch (err) {
    return next(new Error('Invalid or expired token'));
  }
};
