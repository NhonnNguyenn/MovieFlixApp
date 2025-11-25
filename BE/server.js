const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/config/database');

// Route files
const auth = require('./src/routes/auth');

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware - cho phép Expo kết nối
app.use(cors({
  origin: ['http://localhost:8081', 'exp://localhost:19000', 'http://192.168.1.*:8081'],
  credentials: true
}));

// Mount routers
app.use('/api/auth', auth);

// Basic route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎬 MovieFlix API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Handle undefined routes - SỬA LỖI Ở ĐÂY
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
});