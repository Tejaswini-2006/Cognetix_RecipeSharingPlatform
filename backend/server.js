const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Initialize MongoDB connection
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root & Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'RecipeHub API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('RecipeHub Backend API is live. Navigate to /api/recipes or /api/auth.');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[RecipeHub Server]: Listening on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
  // Keep server alive or close gracefully
});

module.exports = app;
