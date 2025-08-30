import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Replica, ConversationResponse } from '@/services/tavusService';
import { tavusApi } from '@/services/api/tavus';

interface TavusContextType {
  replica: Replica | null;
  loading: boolean;
  error: string | null;
  refreshReplica: () => Promise<void>;
  createConversation: (personaId?: string) => Promise<ConversationResponse>;
}

const TavusContext = createContext<TavusContextType | undefined>(undefined);

export const TavusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [replica, setReplica] = useState<Replica | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const createConversation = useCallback(async (personaId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tavusApi.createConversation(personaId);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create conversation';
      setError(errorMessage);
      console.error('Error creating conversation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshReplica = useCallback(async () => {
    return fetchReplica();
  }, [fetchReplica]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    replica,
    loading,
    error,
    refreshReplica,
    createConversation,
  }), [replica, loading, error, refreshReplica, createConversation]);

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
