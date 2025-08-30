import { api } from '@/utils/api';
import { Replica, ConversationResponse, ApiError } from '@/services/tavusService';

export const tavusApi = {
  async getReplica(): Promise<Replica> {
    try {
      const response = await api.get('/tavus/replica');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async createConversation(personaId?: string): Promise<ConversationResponse> {
    try {
      const response = await api.post('/tavus/conversation', { personaId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  private handleError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        details: error.response.data
      };
    }
    return {
      message: error.message || 'An unknown error occurred',
      details: error
    };
  }
};
