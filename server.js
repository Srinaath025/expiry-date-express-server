require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const setupSwagger = require('./src/config/swagger');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middlewares
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

const normalizeOrigin = (url) => url.replace(/\/$/, '');

const allowedOrigins = [
  normalizeOrigin(clientUrl),
  'http://localhost:5173',
  'http://localhost:5001'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const normalizedOrigin = normalizeOrigin(origin);
    const isAllowed = allowedOrigins.some(allowed => normalizeOrigin(allowed) === normalizedOrigin);
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Required for HttpOnly cookie to be sent
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setup Swagger UI Documentation
setupSwagger(app);

// API Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Expiry Date Manager Express Server is running',
    status: 'OK',
    swaggerDocs: 'http://localhost:' + PORT + '/api-docs'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
