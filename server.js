const express = require('express');
const sequelize = require('./config/db');
const userRoutes = require('./routes/user_routes');

require("dotenv").config();
const app = express()

app.use(express.json())
const PORT = process.env.PORT || 3000

// Mount route handlers under '/api' base path
app.use('/api', userRoutes)

// Serve static files from 'view' directory
app.use(express.static('view'))

sequelize.sync()
  .then(() => {
    console.log('✅ Database connected and synced');
    // Start the Express server after database sync
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect/sync database:', err);
    process.exit(1);
});