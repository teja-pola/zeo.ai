// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Tavus Configuration
export const TAVUS_CONFIG = {
  REPLICA_ID: import.meta.env.VITE_TAVUS_REPLICA_ID || 'r6ae5b6efc9d',
  DEFAULT_PERSONA_ID: import.meta.env.VITE_TAVUS_DEFAULT_PERSONA_ID,
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_TAVUS: import.meta.env.VITE_ENABLE_TAVUS !== 'false',
  ENABLE_AUTH: import.meta.env.VITE_ENABLE_AUTH === 'true',
};
