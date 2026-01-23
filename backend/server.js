const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');
const sessionRoutes = require('./routes/session');
const contentRoutes = require('./routes/content');
const studentsRoutes = require('./routes/students');
const bidsRoutes = require('./routes/bids');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' http://localhost:5173 http://localhost:5174 http://localhost:5175 http://localhost:5000; connect-src 'self' http://localhost:5173 http://localhost:5174 http://localhost:5175 http://localhost:5000");
  next();
});

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/posts', require('./routes/posts'));
app.use('/api/students', studentsRoutes);
app.use('/api/bids', bidsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});


const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
