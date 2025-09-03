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

  async endConversation(conversationId: string): Promise<void> {
    try {
      await api.post(`/tavus/conversations/${conversationId}/end`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createConversation(personaId?: string): Promise<ConversationResponse> {
    try {
      const response = await api.post('/tavus/conversation', { personaId });
      return response.data;
    } catch (error) {
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
    if (error.response) {
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        details: error.response.data
      };
    }
    return {
      message: error?.message || 'An unknown error occurred',
      details: error
    };
  }
}

export const tavusApi = new TavusApi();
