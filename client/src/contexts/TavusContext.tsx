import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Replica, ConversationResponse, Conversation } from '@/services/tavusService';
import { tavusApi } from '@/services/api/tavus';
import { toast } from 'sonner';

interface TavusContextType {
  replica: Replica | null;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  activeConversation: ConversationResponse | null;
  refreshReplica: () => Promise<void>;
  createConversation: (personaId?: string) => Promise<ConversationResponse>;
  endCurrentConversation: () => Promise<boolean>;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

const TavusContext = createContext<TavusContextType | undefined>(undefined);

export const TavusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [replica, setReplica] = useState<Replica | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<ConversationResponse | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'error'
  >('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  const fetchReplica = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tavusApi.getReplica();
      setReplica(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load AI companion';
      setError(errorMessage);
      console.error('Error fetching replica:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchReplica().catch(() => {
      // Error is already handled in fetchReplica
    });
  }, [fetchReplica]);

  const setupWebSocket = useCallback((conversationId: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    setConnectionStatus('connecting');
    
    // In a real implementation, you would get this URL from your server
    const wsUrl = `wss://api.tavus.io/v1/conversations/${conversationId}/ws`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      setConnectionStatus('connected');
      reconnectAttempts.current = 0;
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      setConnectionStatus('disconnected');
      
      // Attempt to reconnect if this wasn't an intentional close
      if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
        reconnectAttempts.current++;
        
        console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
        setTimeout(() => setupWebSocket(conversationId), delay);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
      toast.error('Connection error. Please try again.');
    };
    
    wsRef.current = ws;
    
    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const endCurrentConversation = useCallback(async () => {
    try {
      setLoading(true);
      if (activeConversation?.id) {
        await tavusApi.endConversation(activeConversation.id);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      
      setActiveConversation(null);
      setConnectionStatus('disconnected');
      return true;
    } catch (error) {
      console.error('Error ending conversation:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeConversation]);

  const createConversation = useCallback(async (personaId?: string) => {
    try {
      setLoading(true);
      setError(null);
      setConnectionStatus('connecting');
      
      // End any existing conversation first
      if (activeConversation) {
        await endCurrentConversation();
      }
      
      try {
        // Create new conversation
        const conversation = await tavusApi.createConversation(personaId);
        setActiveConversation(conversation);
        
        // Set up WebSocket connection
        if (conversation?.id) {
          setupWebSocket(conversation.id);
        }
        
        return conversation;
      } catch (error) {
        // If we get a concurrent conversation error, clean up old ones and retry
        if (error?.message?.includes('maximum concurrent conversations') || 
            error?.details?.message?.includes('maximum concurrent conversations')) {
          console.log('Concurrent conversation limit reached, cleaning up old conversations...');
          await tavusApi.cleanupOldConversations();
          return await tavusApi.createConversation(personaId);
        }
        throw error; // Re-throw if it's a different error
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create conversation';
      setError(errorMessage);
      setConnectionStatus('error');
      console.error('Error in createConversation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshReplica = useCallback(async (): Promise<void> => {
    await fetchReplica();
  }, [fetchReplica]);

  // Memoize context value to prevent unnecessary re-renders
  // Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const contextValue = React.useMemo(() => ({
    replica,
    loading,
    error,
    isConnected: connectionStatus === 'connected',
    activeConversation,
    connectionStatus,
    refreshReplica,
    createConversation,
    endCurrentConversation,
  }), [
    replica, 
    loading, 
    error, 
    connectionStatus, 
    activeConversation, 
    refreshReplica, 
    createConversation, 
    endCurrentConversation
  ]);

  return (
    <TavusContext.Provider value={contextValue}>
      {children}
    </TavusContext.Provider>
  );
};

export const useTavus = (): TavusContextType => {
  const context = useContext(TavusContext);
  if (context === undefined) {
    throw new Error('useTavus must be used within a TavusProvider');
  }
  return context;
};

// Error boundary for Tavus-related errors
export class TavusErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Tavus Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <h3 className="font-bold">Something went wrong with the AI Companion</h3>
          <p className="text-sm mt-2">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md text-sm font-medium"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
