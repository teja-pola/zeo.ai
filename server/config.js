require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  tavusApiKey: process.env.TAVUS_API_KEY || '338a5ddaa6bf4ddaac012ed0138f6476',
  tavusApiUrl: process.env.TAVUS_API_URL || 'https://tavusapi.com/v2',
  replicaId: process.env.TAVUS_REPLICA_ID || 'r6ae5b6efc9d',
  defaultPersonaId: process.env.TAVUS_DEFAULT_PERSONA_ID,
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};
