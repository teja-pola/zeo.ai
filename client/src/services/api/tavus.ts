import { api } from '@/utils/api';
import { Replica, Conversation, ConversationResponse, ApiError } from '@/services/tavusService';

class TavusApi {
  async getReplica(): Promise<Replica> {
    try {
      const response = await api.get('/tavus/replica');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async listConversations(): Promise<Conversation[]> {
    try {
      const response = await api.get('/tavus/conversations');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async endConversation(conversationId: string): Promise<{ success: boolean }> {
    try {
      const response = await api.post(`/tavus/conversations/${conversationId}/end`);
      return { success: response.data?.success || false };
    } catch (error) {
      // If the conversation is already ended or doesn't exist, consider it a success
      if (error.response?.status === 404 || error.response?.data?.message?.includes('not found')) {
        return { success: true };
      }
      console.error('Error ending conversation:', error);
      throw this.handleError(error);
    }
  }

  async createConversation(personaId?: string): Promise<ConversationResponse> {
    try {
      // First, end any existing conversation to ensure only one active session
      try {
        const activeConversations = await this.listConversations();
        const active = activeConversations.filter(c => c.status === 'active');
        
        // End all active conversations before starting a new one
        await Promise.all(active.map(conv => this.endConversation(conv.id)));
      } catch (cleanupError) {
        console.warn('Could not clean up existing conversations:', cleanupError);
        // Continue with creation even if cleanup fails
      }
      
      const response = await api.post('/tavus/conversation', { 
        personaId,
        timeout: 60000 // Increased timeout to 60 seconds
      });
      
      if (!response.data?.conversation_url) {
        throw new Error('Invalid response from server: Missing conversation URL');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in createConversation:', {
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response?.data
      });
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Connection timeout. Please check your internet connection and try again.');
      }
      
      throw this.handleError(error);
    }
  }

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
      console.error('Error in cleanupOldConversations:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    console.error('Tavus API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      }
    });

    if (error.response) {
      // Handle specific error cases
      if (error.response.status === 400 && 
          error.response.data?.message?.includes('maximum concurrent conversations')) {
        return {
          message: 'Maximum concurrent conversations reached. Please try again in a moment.',
          status: 400,
          code: 'CONCURRENT_LIMIT_REACHED',
          details: error.response.data
        };
      }

      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        code: error.response.data?.code || 'API_ERROR',
        details: error.response.data
      };
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timed out. Please check your internet connection and try again.',
        code: 'TIMEOUT',
        details: error
      };
    }

    if (error.message === 'Network Error') {
      return {
        message: 'Unable to connect to the server. Please check your internet connection.',
        code: 'NETWORK_ERROR',
        details: error
      };
    }

    return {
      message: error?.message || 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      details: error
    };
  }
}

export const tavusApi = new TavusApi();
