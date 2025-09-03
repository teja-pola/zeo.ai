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

export interface ConversationResponse {
  conversation_url: string;
  id?: string; // Make id optional for backward compatibility
}

export interface ApiError {
  message: string;
  status?: number;
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
      const response = await api.get<Conversation[]>('/tavus/conversations');
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to list conversations');
    }
  },

  async endConversation(conversationId: string): Promise<void> {
    try {
      await api.post(`/tavus/conversations/${conversationId}/end`);
    } catch (error) {
      throw createApiError(error, 'Failed to end conversation');
    }
  },

  async createConversation(personaId?: string): Promise<ConversationResponse> {
    try {
      const payload: { persona_id?: string } = {};
      
      if (personaId) {
        payload.persona_id = personaId;
      } else if (TAVUS_CONFIG.DEFAULT_PERSONA_ID) {
        payload.persona_id = TAVUS_CONFIG.DEFAULT_PERSONA_ID;
      }

      const response = await api.post<ConversationResponse>(
        '/tavus/conversation',
        { personaId } // Send personaId directly, let server handle the rest
      );
      
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to create conversation');
    }
  },

  // Helper to clean up old conversations
  async cleanupOldConversations(): Promise<void> {
    try {
      const conversations = await this.listConversations();
      if (conversations.length > 0) {
        // End all conversations except the most recent one
        const activeConversations = conversations
          .filter(c => c.status === 'active')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        // Keep the most recent conversation active, end the rest
        for (let i = 1; i < activeConversations.length; i++) {
          await this.endConversation(activeConversations[i].id);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old conversations:', error);
      // Don't throw, as this is a background cleanup operation
    }
  }
};
