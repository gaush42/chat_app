const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/db');
const userRoutes = require('./routes/user_routes');
const groupRoutes = require('./routes/group_routes')
const socketHandler = require('./socket/socket_handler'); // your socket logic here
require("dotenv").config();

const app = express();
const server = http.createServer(app); // ⬅️ create raw HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow from frontend; configure as needed
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

// Mount route handlers under '/api' base path
app.use('/api', userRoutes);
app.use('/api', groupRoutes);


// Serve static files
app.use(express.static('view'));

// Attach your Socket.IO event handlers
socketHandler(io); // ⬅️ sets up socket events like connection, message, etc.

sequelize.sync()
  .then(() => {
    console.log('✅ Database connected and synced');
    server.listen(PORT, () => { // ⬅️ listen on raw HTTP server
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect/sync database:', err);
    process.exit(1);
  });
