const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const config = require('./config');
const connectDB = require('./db/connection');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
// CORS configuration
const allowedOrigins = [
  'http://localhost:8080',  // Vite dev server
  'http://localhost:8081',  // Vite dev server alternative port
  'http://127.0.0.1:8080',  // Alternative localhost
  'http://127.0.0.1:8081',  // Alternative localhost
  'http://192.168.43.252:8080'  // Local network access
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests, please try again later.'
});

// Auth middleware (placeholder - implement proper auth)
const authenticate = (req, res, next) => {
  // TODO: Implement proper authentication
  // For now, just allow all requests
  next();
};

// Tavus API client
const tavusApi = axios.create({
  baseURL: config.tavusApiUrl,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': config.tavusApiKey
  }
});

// Import routes
const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const counsellorRoutes = require('./routes/counsellor');

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/login', loginRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/counsellor', counsellorRoutes);

// Get replica details
app.get('/api/tavus/replica', authenticate, async (req, res) => {
  try {
    const response = await tavusApi.get(`/replicas/${config.replicaId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching replica:', error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Failed to fetch replica',
      details: error.response?.data
    });
  }
});

// Create conversation
app.post('/api/tavus/conversation', authenticate, async (req, res) => {
  try {
    const { personaId } = req.body;
    const payload = { replica_id: config.replicaId };
    
    if (personaId) {
      payload.persona_id = personaId;
    } else if (config.defaultPersonaId) {
      payload.persona_id = config.defaultPersonaId;
    }

    console.log('Creating new conversation with payload:', JSON.stringify(payload, null, 2));
    
    const response = await tavusApi.post('/conversations', payload);
    
    console.log('Successfully created conversation:', response.data?.id);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating conversation:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    // Check for specific error conditions
    if (error.response?.status === 402) {
      return res.status(402).json({
        message: 'API quota exceeded. Please check your Tavus API subscription.',
        code: 'QUOTA_EXCEEDED',
        details: error.response?.data
      });
    }

    // For other errors
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Failed to create conversation',
      code: error.response?.data?.code || 'INTERNAL_SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.response?.data : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

module.exports = app;
