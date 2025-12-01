import { TAVUS_CONFIG } from '@/config/tavus';
import { api, handleApiError } from '@/utils/api';

export interface Replica {
  replica_id: string;
  replica_name: string;
  thumbnail_video_url: string;
  training_progress: string;
  status: string;
  created_at: string;
  updated_at: string;
  error_message: string | null;
}

export interface Conversation {
  id: string;
  created_at: string;
  status: string;
  conversation_url: string;
  // Add other fields as needed
}

export interface WebSocketMessage {
  type: 'message' | 'status' | 'error' | 'info';
  content: string;
  timestamp: string;
  data?: any;
}

export interface ConversationResponse {
  conversation_url: string;
  id: string;
  websocket_url?: string;
  status?: 'connecting' | 'connected' | 'disconnected' | 'error';
  last_activity?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

// Helper function to create consistent error objects
const createApiError = (error: unknown, defaultMessage: string): ApiError => {
  if (error && typeof error === 'object' && 'message' in error) {
    return {
      message: (error as { message: string }).message,
      status: 'status' in error ? (error as { status: number }).status : undefined,
      details: error
    };
  }
  return {
    message: defaultMessage,
    details: error
  };
};

export const tavusService = {
  async getReplica(): Promise<Replica> {
    try {
      const response = await api.get<Replica>(`/tavus/replica`);
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch replica');
    }
  },

  async listConversations(): Promise<Conversation[]> {
    try {
      const response = await api.get<{ conversations: Conversation[] }>('/tavus/conversations');
      return response.data.conversations || [];
    } catch (error) {
      throw createApiError(error, 'Failed to list conversations');
    }
  },

  async createConversation(
    personaId?: string, 
    options: {
      timeout?: number;
      onMessage?: (message: WebSocketMessage) => void;
      onStatusChange?: (status: string) => void;
    } = {}
  ): Promise<ConversationResponse> {
    try {
      const payload: any = {
        timeout: options.timeout || 30000
      };

      // Add persona ID if provided or use default from config
      if (personaId) {
        payload.persona_id = personaId;
      } else if (TAVUS_CONFIG.DEFAULT_PERSONA_ID) {
        payload.persona_id = TAVUS_CONFIG.DEFAULT_PERSONA_ID;
      }

      const response = await api.post<ConversationResponse>('/tavus/conversation', payload);
      const conversation = response.data;
      
      // If WebSocket URL is provided and callbacks are set up, initialize WebSocket
      if (conversation.websocket_url && (options.onMessage || options.onStatusChange)) {
        const ws = new WebSocket(conversation.websocket_url);
        
        ws.onopen = () => {
          options.onStatusChange?.('connected');
          options.onMessage?.({
            type: 'status',
            content: 'Connected to conversation',
            timestamp: new Date().toISOString()
          });
        };
        
        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            options.onMessage?.({
              type: 'message',
              content: message.content,
              timestamp: new Date().toISOString(),
              data: message
            });
          } catch (e) {
            console.error('Error parsing WebSocket message:', e);
          }
        };
        
        ws.onclose = () => {
          options.onStatusChange?.('disconnected');
          options.onMessage?.({
            type: 'status',
            content: 'Disconnected from conversation',
            timestamp: new Date().toISOString()
          });
        };
        
        ws.onerror = (error) => {
          options.onStatusChange?.('error');
          options.onMessage?.({
            type: 'error',
            content: 'WebSocket error occurred',
            timestamp: new Date().toISOString(),
            data: error
          });
        };
        
        // Store WebSocket reference for cleanup
        (conversation as any)._websocket = ws;
      }
      
      return conversation;
    } catch (error: any) {
      const apiError = handleApiError(error);
      
      // Add more context to the error if available
      if (error?.response?.data?.details) {
        (apiError as any).details = error.response.data.details;
      }
      
      throw apiError;
    }
  },

  async endConversation(conversationId: string): Promise<void> {
    try {
      await api.post(`/tavus/conversations/${conversationId}/end`);
    } catch (error) {
      throw createApiError(error, 'Failed to end conversation');
    }
  },

      

  // Helper to clean up old conversations
  /**
   * Ends all active conversations except the most recent one
   * @param keepRecent Number of most recent conversations to keep (default: 1)
   */
  async cleanupOldConversations(keepRecent: number = 1): Promise<void> {
    try {
      const conversations = await this.listConversations();
      if (conversations.length <= keepRecent) return;
      
      // Sort by creation date (newest first)
      const sorted = [...conversations]
        .filter(conv => conv.status === 'active')
        .sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      
      // Keep the most recent N, end the rest
      const toEnd = sorted.slice(keepRecent);
      
      console.log(`Cleaning up ${toEnd.length} old conversations, keeping ${keepRecent} most recent`);
      
      await Promise.all(
        toEnd.map(conv => 
          this.endConversation(conv.id)
            .catch(err => 
              console.error(`Failed to end conversation ${conv.id}:`, err)
            )
        )
      );
      
      console.log(`Successfully cleaned up ${toEnd.length} old conversations`);
    } catch (error) {
      console.error('Error cleaning up old conversations:', error);
      throw error;
    }
  }
};
