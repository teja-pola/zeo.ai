export const TAVUS_CONFIG = {
  API_KEY: import.meta.env.VITE_TAVUS_API_KEY || '3577b60a8a304da6b8574d5f1a467af4',
  API_BASE_URL: import.meta.env.VITE_TAVUS_API_URL || 'https://tavusapi.com/v2',
  REPLICA_ID: import.meta.env.VITE_TAVUS_REPLICA_ID || 'r6ae5b6efc9d',
  DEFAULT_PERSONA_ID: import.meta.env.VITE_TAVUS_DEFAULT_PERSONA_ID
};
