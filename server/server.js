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

// Tavus API client with increased timeout and better error handling
const tavusApi = axios.create({
  baseURL: config.tavusApiUrl,
  timeout: 120000, // Increased to 2 minutes for Tavus API
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': config.tavusApiKey
  }
});

// Add request interceptor for logging
const requestInterceptor = tavusApi.interceptors.request.use(
  config => {
    console.log(`Tavus API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('Tavus API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
const responseInterceptor = tavusApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Log the error
    console.error('Tavus API Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

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

// End conversation endpoint
app.post('/api/tavus/conversations/:id/end', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await tavusApi.post(`/conversations/${id}/end`);
    
    // Clear the active conversation if it matches the one being ended
    if (activeConversation && activeConversation.id === id) {
      console.log('Cleared active conversation:', id);
      activeConversation = null;
    }
    
    res.json({ 
      success: true,
      message: 'Conversation ended successfully'
    });
  } catch (error) {
    console.error('Error ending conversation:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to end conversation',
      details: error.message 
    });
  }
});

// Get active conversation
app.get('/api/tavus/conversation/active', authenticate, async (req, res) => {
  res.json({ 
    active: !!activeConversation,
    conversation: activeConversation 
  });
});

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
// In-memory store// Store active conversations with a maximum of 1 active conversation
let activeConversation = null;
const activeConversations = new Map();
const MAX_CONCURRENT_CONVERSATIONS = 1;
const MAX_CONVERSATIONS = 5; // Maximum concurrent conversations

// Clean up old conversations
const cleanupOldConversations = async () => {
  try {
    if (activeConversation) return;
    if (activeConversations.size <= MAX_CONVERSATIONS) return;
    
    console.log(`Hit concurrent conversation limit (${activeConversations.size}), cleaning up...`);
    
    // Sort conversations by last activity time
    const sorted = Array.from(activeConversations.entries())
      .sort((a, b) => a[1].lastActivity - b[1].lastActivity);
    
    // End the oldest active conversation
    const [oldestId] = sorted[0];
    console.log(`Ending oldest active conversation: ${oldestId}`);
    
    try {
      await tavusApi.post(`/conversations/${oldestId}/end`);
      console.log(`Successfully ended conversation: ${oldestId}`);
    } catch (err) {
      console.error(`Error ending conversation ${oldestId}:`, err.message);
    } finally {
      activeConversations.delete(oldestId);
    }
  } catch (error) {
    console.error('Error in cleanupOldConversations:', error);
  }
};

app.post('/api/tavus/conversation', authenticate, async (req, res) => {
  try {
    const { personaId } = req.body;
    const payload = { replica_id: config.replicaId };
    
    // Clean up old conversations if we're at the limit
    if (activeConversations.size >= MAX_CONVERSATIONS) {
      await cleanupOldConversations();
    }
    
    if (personaId) {
      payload.persona_id = personaId;
    } else if (config.defaultPersonaId) {
      payload.persona_id = config.defaultPersonaId;
    }

    console.log('Creating new conversation with payload:', JSON.stringify(payload, null, 2));
    
    // Check if there's already an active conversation
    if (activeConversation) {
      console.log('Found existing active conversation, ending it first...');
      try {
        await tavusApi.post(`/conversations/${activeConversation.id}/end`);
        console.log('Successfully ended previous conversation:', activeConversation.id);
      } catch (endError) {
        console.error('Error ending previous conversation:', endError.message);
        // Continue anyway to start a new one
      }
    }

    try {
      console.log('Creating new conversation with payload:', { replica_id: config.replicaId });
      console.log('Attempting to create new conversation...');
      const response = await tavusApi.post('/conversations', payload);
      const conversation = response.data;
      
      // Store the active conversation
      activeConversation = {
        id: conversation.id,
        createdAt: new Date(),
        lastActivity: Date.now()
      };
      
      console.log('Successfully created conversation:', conversation.id);
      res.json({
        ...conversation,
        isNewConversation: true
      });
    } catch (error) {
      // If not a concurrent conversation limit error, rethrow
      if (error.response?.status !== 400 || 
          !(error.response?.data?.message?.includes('maximum concurrent conversations') ||
            error.response?.data?.details?.message?.includes('maximum concurrent conversations'))) {
        throw error;
      }
      
      console.log('Hit concurrent conversation limit, attempting to clean up old conversations...');
      
      // Get all conversations with pagination
      let allConversations = [];
      let page = 1;
      const pageSize = 50;
      let hasMore = true;
      
      while (hasMore) {
        const response = await tavusApi.get('/conversations', {
          params: {
            page,
            page_size: pageSize,
            status: 'active' // Only get active conversations
          }
        });
        
        let pageConversations = [];
        if (Array.isArray(response.data)) {
          pageConversations = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          pageConversations = response.data.data;
        }
        
        allConversations = [...allConversations, ...pageConversations];
        
        // If we got fewer conversations than requested, we've reached the end
        if (pageConversations.length < pageSize) {
          hasMore = false;
        } else {
          page++;
        }
      }
      
      console.log(`Found ${allConversations.length} total active conversations`);
      
      if (allConversations.length === 0) {
        console.log('No active conversations found to end');
        throw new Error('No active conversations to end');
      }
      
      // Sort by creation date (oldest first)
      const sortedConversations = [...allConversations].sort((a, b) => {
        return new Date(a.created_at || a.createdAt || 0) - new Date(b.created_at || b.createdAt || 0);
      });
      
      // Try to find a conversation that's been inactive for a while
      const now = Date.now();
      const oneHourAgo = now - (60 * 60 * 1000); // 1 hour in milliseconds
      
      // First try to find an inactive conversation
      const inactiveConversation = sortedConversations.find(conv => {
        const lastActivity = conv.last_activity || conv.lastActivity;
        return lastActivity && new Date(lastActivity).getTime() < oneHourAgo;
      });
      
      // If no inactive conversation found, just take the oldest one
      const conversationToEnd = inactiveConversation || sortedConversations[0];
      
      if (!conversationToEnd) {
        throw new Error('No conversations available to end');
      }
      
      const conversationId = conversationToEnd.conversation_id || conversationToEnd.id;
      
      if (!conversationId) {
        console.error('No valid conversation ID found for conversation:', conversationToEnd);
        throw new Error('No valid conversation ID found');
      }
      
      console.log(`Ending conversation (ID: ${conversationId}, Created: ${conversationToEnd.created_at || conversationToEnd.createdAt})`);
      
      try {
        await tavusApi.post(`/conversations/${conversationId}/end`);
        console.log(`Successfully ended conversation: ${conversationId}`);
        
        // Wait for the conversation to fully end
        console.log('Waiting for conversation to fully terminate...');
        await new Promise(resolve => setTimeout(resolve, 5000)); // Increased wait time
      } catch (endError) {
        console.error(`Failed to end conversation ${conversationId}:`, endError.message);
        // Continue anyway, as the conversation might already be ending
      }
      
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
