import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { chatApi } from '@/utils/api';
import ChatBotIcon from '../../../ChatBot.png';

type ChatMessage = { role: 'user' | 'assistant'; text: string; timestamp: number };
// Typewriter effect hook
function useTypewriter({
  text,
  loadingText = "Thinking...",
  active,
}: {
  text: string;
  loadingText?: string;
  active: boolean;
}) {
  const [displayed, setDisplayed] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (active && loading) {
      // Animate loading text ("Thinking...")
      let i = 0;
      intervalId = setInterval(() => {
        setDisplayed(loadingText.substring(0, i + 1));
        i = (i + 1) % (loadingText.length + 1);
      }, 100);
    } else if (!loading && text) {
      // Animate actual reply typing
      let idx = 0;
      setDisplayed("");
      intervalId = setInterval(() => {
        setDisplayed((prev) => text.substring(0, idx + 1));
        idx++;
        if (idx > text.length) clearInterval(intervalId);
      }, 20);
    }

    return () => clearInterval(intervalId);
  }, [active, loading, text, loadingText]);

  // Toggle loading when 'active' changes
  useEffect(() => {
    if (!active) setLoading(false);
    else setLoading(true);
  }, [active]);

  return [displayed, setLoading] as [string, (value: boolean) => void];
}

function TypewriterLoadingText() {
  // Usage example: show only the loading animation "Thinking..."
  const [text] = useTypewriter({ text: "", active: true });

  return <p className="text-sm whitespace-pre-wrap break-words">{text}</p>;
}

export { useTypewriter, TypewriterLoadingText };



export default function ChatWidget() {
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: "Hello! I'm ZEO, your AI companion. How can I help you today?", timestamp: Date.now() }
  ]);

  const canSend = useMemo(() => chatInput.trim().length > 0 && !isSending, [chatInput, isSending]);

  useEffect(() => {
    if (showChat && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showChat, messages]);

  const lastAssistantMsgIdx = messages.map(m => m.role).lastIndexOf('assistant');
  const lastAssistantMsg = messages[lastAssistantMsgIdx];
  const [typewriterText, setTypewriterLoading] = useTypewriter({
    text: lastAssistantMsg?.text || '',
    active: isSending,
  });

  useEffect(() => {
    if (!isSending) setTypewriterLoading(false);
  }, [isSending]);


  const sendMessage = async () => {
    if (!canSend) return;
    const userText = chatInput.trim();
    setChatInput('');
    setIsSending(true);
    setMessages((prev) => [...prev, { role: 'user', text: userText, timestamp: Date.now() }]);
    try {
      const { data } = await chatApi.post('/chat', { message: userText });
      const reply: string = data?.reply ?? 'No reply';
      setMessages((prev) => [...prev, { role: 'assistant', text: reply, timestamp: Date.now() }]);
    } catch (err: any) {
      const friendly = err?.response?.data?.error || err?.message || 'Failed to send message';
      setMessages((prev) => [...prev, { role: 'assistant', text: `Error: ${friendly}`, timestamp: Date.now() }]);
    } finally {
      setIsSending(false);
    }
  };
 
  return (
  <div className="fixed bottom-32 right-12 z-50">
      <Button 
        variant="secondary" 
        size="icon"
        onClick={() => setShowChat(!showChat)}
        className={`rounded-full w-15 h-15 shadow-lg transition-transform duration-200 hover:scale-150 ${
          showChat ? 'bg-zeo-primary/20 text-zeo-primary' : ''
        }`}
        aria-label="Toggle chat"
      >
        <img src={ChatBotIcon} alt="Chat Icon" className="w-12 h-12" />
      </Button>

      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute bottom-16 right-0 w-85 md:w-[22rem] lg:w-[28rem] max-h-[62vh] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">Chat with zeo.ai</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-800 max-h-[60vh]">
              <div className="space-y-4">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-gray-200 text-gray-900 rounded-tr-none dark:bg-gray-700 dark:text-white' : 'bg-zeo-primary/90 text-white rounded-tl-none'}`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{m.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="relative">
                <input
                  type="text"
                  placeholder={isSending ? 'Sending...' : 'Type a message...'}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-full py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-zeo-primary/50 focus:border-transparent"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                  disabled={isSending}
                />
                <button
                  aria-label="Send message"
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 ${canSend ? 'text-zeo-primary hover:text-zeo-primary/80' : 'text-gray-400 cursor-not-allowed'}`}
                  onClick={sendMessage}
                  disabled={!canSend}
                >
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
    </div>
  );
}