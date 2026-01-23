const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();



const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const sessionRoutes = require('./routes/session');
const statsRoutes = require('./routes/stats');


const app = express();


const createUploadsFolder = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  const imagesDir = path.join(uploadsDir, 'images');
  const avatarsDir = path.join(uploadsDir, 'avatars');
  const skillsDir = path.join(uploadsDir, 'skills');


  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✓ Created /uploads directory');
  }


  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('✓ Created /uploads/images directory');
  }


  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
    console.log('✓ Created /uploads/avatars directory');
  }


  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
    console.log('✓ Created /uploads/skills directory');
  }


  const gitkeepPath = path.join(imagesDir, '.gitkeep');
  if (!fs.existsSync(gitkeepPath)) {
    fs.writeFileSync(gitkeepPath, '');
  }
};


app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' http://localhost:*; connect-src 'self' http://localhost:*");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static Files - Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});


createUploadsFolder();



// Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/posts', require('./routes/posts'));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Backend server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Uploads Info Route
app.get('/api/uploads/info', (req, res) => {
  const uploadsDir = path.join(__dirname, 'uploads');
  res.json({
    uploadsPath: uploadsDir,
    publicPath: '/uploads',
    folders: {
      images: '/uploads/images',
      avatars: '/uploads/avatars',
      skills: '/uploads/skills'
    }
  });
});

// ==================== ERROR HANDLING ====================

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { error: err.stack })
  });
});


const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const sequelize = require('./config/database');

sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log('\n' + '='.repeat(50));
      console.log('Backend Server Started Successfully');
      console.log('='.repeat(50));
      console.log(`Server running on: http://${HOST}:${PORT}`);
      console.log(`Uploads folder: /uploads`);
      console.log(`Images folder: /uploads/images`);
      console.log(`Avatars folder: /uploads/avatars`);
      console.log(`Skills folder: /uploads/skills`);
      console.log(`API Health: http://${HOST}:${PORT}/api/health`);
      console.log('='.repeat(50) + '\n');
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
    process.exit(1);
  });

module.exports = app;
