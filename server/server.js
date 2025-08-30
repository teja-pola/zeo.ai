const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const config = require('./config');

const app = express();

// Middleware
// CORS configuration
const allowedOrigins = [
  'http://localhost:8080',  // Vite dev server
  'http://127.0.0.1:8080',  // Alternative localhost
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

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get replica details
app.get('/api/tavus/replica', apiLimiter, authenticate, async (req, res) => {
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
app.post('/api/tavus/conversation', apiLimiter, authenticate, async (req, res) => {
  try {
    const { personaId } = req.body;
    const payload = { replica_id: config.replicaId };
    
    if (personaId) {
      payload.persona_id = personaId;
    } else if (config.defaultPersonaId) {
      payload.persona_id = config.defaultPersonaId;
    }

    const response = await tavusApi.post('/conversations', payload);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating conversation:', error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Failed to create conversation',
      details: error.response?.data
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
