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

// List active conversations
app.get('/api/tavus/conversations', authenticate, async (req, res) => {
  try {
    console.log('Fetching active conversations...');
    const response = await tavusApi.get('/conversations');
    
    // Ensure we return an array of conversations
    let conversations = [];
    if (Array.isArray(response.data)) {
      conversations = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      conversations = response.data.data;
    }
    
    console.log('Active conversations:', JSON.stringify(conversations, null, 2));
    res.json(conversations);
  } catch (error) {
    console.error('Error listing conversations:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    res.status(error.response?.status || 500).json({
      message: 'Failed to list conversations',
      code: 'CONVERSATION_LIST_ERROR',
      details: error.response?.data || error.message
    });
  }
});

// End a specific conversation
app.post('/api/tavus/conversations/:conversationId/end', authenticate, async (req, res) => {
  const { conversationId } = req.params;
  console.log(`Attempting to end conversation: ${conversationId}`);
  
  try {
    const response = await tavusApi.post(`/conversations/${conversationId}/end`);
    console.log(`Successfully ended conversation: ${conversationId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error ending conversation:', {
      conversationId,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    // If we get a 404, the conversation might already be ended
    if (error.response?.status === 404) {
      return res.status(200).json({
        message: 'Conversation already ended or does not exist',
        code: 'CONVERSATION_ALREADY_ENDED'
      });
    }
    
    res.status(error.response?.status || 500).json({
      message: 'Failed to end conversation',
      code: 'CONVERSATION_END_ERROR',
      details: error.response?.data || error.message
    });
  }
});

// Create conversation with automatic cleanup if needed
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
    
    // First attempt to create conversation
    try {
      console.log('Attempting to create new conversation...');
      const response = await tavusApi.post('/conversations', payload);
      console.log('Successfully created conversation:', response.data?.id);
      return res.json(response.data);
    } catch (error) {
      // If not a concurrent conversation limit error, rethrow
      if (error.response?.status !== 400 || 
          !(error.response?.data?.message?.includes('maximum concurrent conversations') ||
            error.response?.data?.details?.message?.includes('maximum concurrent conversations'))) {
        throw error;
      }
      
      console.log('Hit concurrent conversation limit, attempting to clean up old conversations...');
      
      // Get all conversations
      const response = await tavusApi.get('/conversations');
      let conversations = [];
      
      // Handle different response formats
      if (Array.isArray(response.data)) {
        conversations = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        conversations = response.data.data;
      }
      
      console.log(`Found ${conversations.length} total conversations`);
      
      // Find and end the oldest active conversation
      const activeConversations = conversations
        .filter(conv => conv.status === 'active')
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      
      if (activeConversations.length === 0) {
        console.log('No active conversations found to end');
        throw new Error('No active conversations to end');
      }
      
      const oldestActive = activeConversations[0];
      const conversationId = oldestActive.conversation_id || oldestActive.id;
      
      if (!conversationId) {
        throw new Error('No valid conversation ID found');
      }
      
      console.log(`Ending oldest active conversation: ${conversationId}`);
      await tavusApi.post(`/conversations/${conversationId}/end`);
      console.log(`Successfully ended conversation: ${conversationId}`);
      
      // Wait for the conversation to fully end
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Retry creating the conversation
      console.log('Retrying conversation creation after cleanup...');
      const retryResponse = await tavusApi.post('/conversations', payload);
      console.log('Successfully created new conversation after cleanup');
      return res.json(retryResponse.data);
    }
  } catch (error) {
    console.error('Error in conversation creation:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || 'Failed to create conversation';
    
    res.status(statusCode).json({
      message: errorMessage,
      code: 'CONVERSATION_CREATION_ERROR',
      details: error.response?.data || error.message
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
