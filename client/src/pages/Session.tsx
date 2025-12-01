import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, Loader2, Mic, MicOff, Video, VideoOff, MessageSquare, Settings, Phone, PhoneOff } from 'lucide-react';
import { useTavus } from '@/contexts/TavusContext';
import { useEffect, useState, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { opacity: 0 }
};

export default function Session() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const conversationUrl = searchParams.get('url');
  const { 
    createConversation, 
    endCurrentConversation, 
    connectionStatus,
    activeConversation
  } = useTavus();
  
  const [loading, setLoading] = useState(!conversationUrl);
  const [error, setError] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    const initConversation = async () => {
      if (conversationUrl) return;
      
      try {
        setLoading(true);
        const { conversation_url } = await createConversation();
        navigate(`/session?url=${encodeURIComponent(conversation_url)}`, { replace: true });
      } catch (err) {
        console.error('Failed to start conversation:', err);
        setError('Failed to initialize video session. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initConversation();
  }, [conversationUrl, createConversation, navigate]);

  const handleEndSession = useCallback(async () => {
    try {
      setIsEnding(true);
      await endCurrentConversation();
      toast.success('Session ended successfully');
      navigate('/');
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Failed to end session. Please try again.');
    } finally {
      setIsEnding(false);
    }
  }, [endCurrentConversation, navigate]);
  
  // Handle browser tab/window close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (connectionStatus === 'connected') {
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // End session when component unmounts
      if (connectionStatus === 'connected') {
        endCurrentConversation().catch(console.error);
      }
    };
  }, [connectionStatus, endCurrentConversation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zeo-surface">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-zeo-primary" />
            <div className="absolute inset-0 bg-gradient-to-r from-zeo-primary to-zeo-secondary rounded-full blur opacity-20"></div>
          </div>
          <motion.h2 
            className="text-2xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Setting up your session...
          </motion.h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            This may take a moment. Please wait.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error || !conversationUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zeo-surface p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Alert variant="destructive" className="relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/10 rounded-full blur-3xl"></div>
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg">Connection Error</AlertTitle>
            <AlertDescription className="mt-2">
              {error || 'Failed to load the conversation. Please check your connection and try again.'}
            </AlertDescription>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                Try Again
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Return Home
              </Button>
            </div>
          </Alert>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zeo-surface flex flex-col">
      {/* Header */}
      <header className="bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Button>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`h-2.5 w-2.5 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              } animate-pulse`}></div>
              <span className="text-sm text-muted-foreground">
                {connectionStatus === 'connected' ? 'Live' : 
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEndSession}
              disabled={isEnding}
              className="flex items-center space-x-1 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              {isEnding ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                  <span>Ending...</span>
                </>
              ) : (
                <>
                  <PhoneOff className="w-3.5 h-3.5 mr-1" />
                  <span>End Session</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
          <div className="relative flex-1 rounded-2xl overflow-hidden bg-black/20 border border-white/10 max-h-[70vh]" >
            {/* Video Container */}
            <div className="absolute inset-0">
              <iframe
                src={conversationUrl}
                className="w-full h-full"
                allow="camera; microphone; fullscreen; display-capture"
                allowFullScreen
                title="AI Conversation"
              />
            </div>

            {/* Overlay Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex justify-center space-x-4">
                
                <Button 
                  variant="destructive" 
                  className="rounded-full px-6 h-12 ml-2 group"
                  onClick={handleEndSession}
                >
                  <PhoneOff className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  End Session
                </Button>
              </div>
            </div>

            {/* Chat Panel */}
            <AnimatePresence>
              {showChat && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute top-4 right-4 bottom-20 w-80 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Chat with ZEO</h3>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <div className="space-y-4">
                      <div className="flex justify-start">
                        <div className="max-w-xs bg-zeo-primary/90 text-white p-3 rounded-2xl rounded-tl-none shadow-sm">
                          <p className="text-sm">Hello! I'm ZEO, your AI companion. How can I help you today?</p>
                          <span className="text-xs text-white/80 block mt-1">Just now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-full py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-zeo-primary/50 focus:border-transparent"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zeo-primary hover:text-zeo-primary/80">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m22 2-7 20-4-9-9-4Z"/>
                          <path d="M22 2 11 13"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && !showChat && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute top-4 right-4 bottom-20 w-80 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden flex flex-col p-4 space-y-4"
                >
                  <h3 className="font-medium">Settings</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Microphone</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zeo-primary/50 focus:border-transparent">
                      <option>Default Microphone</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Camera</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zeo-primary/50 focus:border-transparent">
                      <option>Default Camera</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Speaker</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zeo-primary/50 focus:border-transparent">
                      <option>Default Speaker</option>
                    </select>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      Save Settings
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Connection Status Bar */}
      <div className="bg-white/5 border-t border-white/10 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">Connected</span>
            </div>
            <div className="text-muted-foreground">
              <span className="hidden sm:inline">Connection secured with end-to-end encryption</span>
              <span className="sm:hidden">Secure connection</span>
            </div>
            <div className="text-muted-foreground">
              <button className="hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <path d="M12 17h.01"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
