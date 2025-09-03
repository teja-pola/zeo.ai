import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Search, Phone, Video, MoreVertical, Send, Smile, Paperclip } from 'lucide-react';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  role: 'Student' | 'Counsellor';
}

const sampleChats: Chat[] = [
  {
    id: 1,
    name: "Dr. Ritu Verma",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    lastMessage: "How are you feeling today?",
    timestamp: "2m ago",
    unread: 2,
    online: true,
    role: "Counsellor"
  },
  {
    id: 2,
    name: "Ananya Sharma",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    lastMessage: "Thanks for the meditation tips!",
    timestamp: "1h ago",
    unread: 0,
    online: true,
    role: "Student"
  },
  {
    id: 3,
    name: "Support Group - Anxiety",
    avatar: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=100&q=80",
    lastMessage: "New member joined the group",
    timestamp: "3h ago",
    unread: 5,
    online: false,
    role: "Student"
  }
];

const Chats: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = sampleChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D2E4D3] to-[#E8F5E8] flex">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-lg border-r border-[#D2E4D3] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#D2E4D3]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#345E2C] to-[#256d63] rounded-full flex items-center justify-center">
              <MessageCircle className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#345E2C]">Chats</h1>
              <p className="text-sm text-[#256d63]">Connect with your community</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#256d63]" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#D2E4D3] rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-[#345E2C] text-[#345E2C] placeholder-[#256d63]"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b border-[#D2E4D3] cursor-pointer transition-all hover:bg-[#D2E4D3]/50 ${
                selectedChat?.id === chat.id ? 'bg-[#D2E4D3] border-l-4 border-l-[#345E2C]' : ''
              }`}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#345E2C] truncate">{chat.name}</h3>
                    <span className="text-xs text-[#256d63]">{chat.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-[#256d63] truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="bg-[#A996E6] text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white/80 backdrop-blur-lg border-b border-[#D2E4D3] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selectedChat.avatar}
                      alt={selectedChat.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedChat.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#345E2C]">{selectedChat.name}</h2>
                    <p className="text-sm text-[#256d63]">
                      {selectedChat.online ? 'Online' : 'Last seen 2h ago'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-[#D2E4D3] text-[#345E2C] transition-all">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-[#D2E4D3] text-[#345E2C] transition-all">
                    <Video size={20} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-[#D2E4D3] text-[#345E2C] transition-all">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                {/* Sample messages */}
                <div className="flex justify-start">
                  <div className="bg-white/90 rounded-2xl rounded-bl-md p-4 max-w-xs shadow-sm">
                    <p className="text-[#345E2C]">Hi! How are you feeling today?</p>
                    <span className="text-xs text-[#256d63] mt-1 block">2:30 PM</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#345E2C] text-white rounded-2xl rounded-br-md p-4 max-w-xs shadow-sm">
                    <p>I'm doing better, thanks for asking! The meditation really helped.</p>
                    <span className="text-xs text-white/70 mt-1 block">2:32 PM</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="bg-[#D2E4D3] text-[#345E2C] px-4 py-2 rounded-full text-sm">
                    This is a demo chat interface. Real messaging coming soon!
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white/80 backdrop-blur-lg border-t border-[#D2E4D3] p-4">
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-full hover:bg-[#D2E4D3] text-[#345E2C] transition-all">
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 bg-[#D2E4D3] rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-[#345E2C] text-[#345E2C] placeholder-[#256d63]"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#345E2C] hover:text-white text-[#256d63] transition-all">
                    <Smile size={16} />
                  </button>
                </div>
                <button
                  disabled={!message.trim()}
                  className="p-3 bg-[#345E2C] text-white rounded-full hover:bg-[#256d63] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle size={64} className="mx-auto text-[#D2E4D3] mb-4" />
              <h2 className="text-2xl font-bold text-[#345E2C] mb-2">Select a conversation</h2>
              <p className="text-[#256d63]">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
