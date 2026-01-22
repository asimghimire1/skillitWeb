const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');
const sessionRoutes = require('./routes/session');
const contentRoutes = require('./routes/content');

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/content', contentRoutes);

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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
