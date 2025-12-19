// FORCE dotenv to load .env from this folder
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transcribeRoutes = require('./routes/transcribeRoutes');

// Connect MongoDB
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', transcribeRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

module.exports = app;
