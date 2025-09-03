export const TAVUS_CONFIG = {
  API_KEY: import.meta.env.VITE_TAVUS_API_KEY || 'b07b29d892fc4933b215db1d5ab07da3',
  API_BASE_URL: import.meta.env.VITE_TAVUS_API_URL || 'https://tavusapi.com/v2',
  REPLICA_ID: import.meta.env.VITE_TAVUS_REPLICA_ID || 'r6ae5b6efc9d',
  DEFAULT_PERSONA_ID: import.meta.env.VITE_TAVUS_DEFAULT_PERSONA_ID
};
