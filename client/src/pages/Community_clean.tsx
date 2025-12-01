import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, MoreHorizontal, Search, UserPlus, 
  TrendingUp, Image, Smile 
} from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';

const Community: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showFeed, setShowFeed] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [msgUser, setMsgUser] = useState<any>(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const [groupTarget, setGroupTarget] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, user: 'Dr. Sarah Johnson', message: 'Thanks for connecting!', time: '2 min ago', unread: true },
    { id: 2, user: 'Alex Kumar', message: 'Hope you\'re doing well', time: '1 hour ago', unread: true },
    { id: 3, user: 'Maya Patel', message: 'Great post about meditation!', time: '3 hours ago', unread: false }
  ]);
  const [newPost, setNewPost] = useState({ content: '', tags: '' });
  const [selectedChat, setSelectedChat] = useState<any>(null);
  
  // Generate 9 chat users with realistic data and random profile pictures
  const chatUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      online: true,
      lastMessage: "Hey, how are you doing?",
      timestamp: "2m",
      unread: true
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      online: false,
      lastMessage: "Thanks for the support!",
      timestamp: "5m",
      unread: false
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      online: true,
      lastMessage: "Let's catch up soon",
      timestamp: "1h",
      unread: true
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      online: true,
      lastMessage: "Hope you're feeling better",
      timestamp: "3h",
      unread: false
    },
    {
      id: 5,
      name: "Lisa Thompson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      online: false,
      lastMessage: "Great session today!",
      timestamp: "1d",
      unread: false
    },
    {
      id: 6,
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      online: true,
      lastMessage: "Looking forward to our chat",
      timestamp: "2d",
      unread: true
    },
    {
      id: 7,
      name: "Rachel Green",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      online: false,
      lastMessage: "Take care of yourself",
      timestamp: "1w",
      unread: false
    },
    {
      id: 8,
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      online: true,
      lastMessage: "You're doing amazing!",
      timestamp: "2w",
      unread: false
    },
    {
      id: 9,
      name: "Maria Garcia",
      avatar: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face",
      online: false,
      lastMessage: "See you next week!",
      timestamp: "3w",
      unread: false
    }
  ];

  // Sample feed posts
  const feedPosts = [
    {
      id: 1,
      author: {
        name: "Dr. Sarah Johnson",
        username: "@dr_sarah_j",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        verified: true
      },
      content: "Mental health tip: Taking 5 minutes for deep breathing can significantly reduce stress levels. Remember, small steps lead to big changes. 🌱",
      timestamp: "2h",
      likes: 24,
      comments: 8,
      shares: 3,
      tags: ["#mentalhealth", "#wellness"]
    },
    {
      id: 2,
      author: {
        name: "Alex Kumar",
        username: "@alex_wellness",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        verified: false
      },
      content: "Just finished my first therapy session and feeling hopeful! To anyone considering it - you're not alone in this journey. 💪",
      timestamp: "4h",
      likes: 45,
      comments: 12,
      shares: 7,
      tags: ["#therapy", "#mentalhealth"]
    },
    {
      id: 3,
      author: {
        name: "Maya Patel",
        username: "@maya_mindful",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        verified: false
      },
      content: "Sharing my daily meditation routine that has helped me manage anxiety. Would love to hear what works for you! 🧘‍♀️",
      timestamp: "6h",
      likes: 18,
      comments: 5,
      shares: 2,
      tags: ["#meditation", "#anxiety"]
    }
  ];

  // Trending topics
  const trendingTopics = [
    { tag: "#MentalHealthAwareness", posts: "2.1K posts" },
    { tag: "#SelfCare", posts: "1.8K posts" },
    { tag: "#TherapyJourney", posts: "956 posts" },
    { tag: "#Mindfulness", posts: "743 posts" },
    { tag: "#AnxietySupport", posts: "621 posts" }
  ];

  // Follow suggestions
  const followSuggestions = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      username: "@dr_sarah_mh",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      bio: "Licensed therapist specializing in anxiety and depression. Here to help! 🌟",
      followers: "2.3k",
      verified: true
    },
    {
      id: 2,
      name: "Alex Kumar",
      username: "@alex_wellness",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Mental health advocate sharing daily mindfulness tips and personal journey",
      followers: "1.8k",
      verified: false
    },
    {
      id: 3,
      name: "Maya Patel",
      username: "@maya_mindful",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "Meditation instructor | Helping others find inner peace through mindfulness",
      followers: "3.1k",
      verified: true
    },
    {
      id: 4,
      name: "Community Support",
      username: "@zeo_support",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Official Zeo.ai support account. We're here for you 24/7! 💙",
      followers: "12.5k",
      verified: true
    }
  ];

  // Handler for creating new post
  const handleCreatePost = () => {
    if (newPost.content.trim()) {
      const post = {
        id: feedPosts.length + 1,
        author: {
          name: "You",
          username: "@your_username",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          verified: false
        },
        content: newPost.content,
        timestamp: "now",
        likes: 0,
        comments: 0,
        shares: 0,
        tags: newPost.tags.split(' ').filter(tag => tag.startsWith('#'))
      };
      
      setNewPost({ content: '', tags: '' });
    }
  };

  // Mock messaging modal component
  const MessagingModal = ({ open, onClose, user }: any) => {
    if (!open || !user) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
              <h2 className="text-lg font-bold">{user.name}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-500 text-center">Chat with {user.name}</p>
          </div>
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 p-2 border rounded-lg"
            />
            <button className="px-4 py-2 bg-zeo-primary text-white rounded-lg">Send</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zeo-surface via-background to-zeo-surface flex">
      {/* Dashboard Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content Area */}
      <div className="ml-[19%] flex-1 flex">
        {/* Chat Panel */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-zeo-primary">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedChat(user)}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat?.id === user.id ? 'bg-zeo-primary/10' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">{user.name}</h3>
                      <span className="text-xs text-gray-500">{user.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{user.lastMessage}</p>
                  </div>
                  {user.unread && (
                    <div className="w-2 h-2 bg-zeo-primary rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feed Section - Middle */}
        <div className="flex-1 px-6 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-zeo-primary mb-2">Community</h1>
            <p className="text-base text-muted-foreground">Connect and share with your mental health community</p>
          </div>

          {/* Twitter-style Create Post */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-4 mb-4 hover:shadow-xl transition-all duration-300 hover:bg-white/95 w-full">
            <div className="flex space-x-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                alt="Your avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-zeo-primary/20 flex-shrink-0"
              />
              <div className="flex-1">
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="What's happening in your mental health journey?"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zeo-primary/30 focus:border-zeo-primary resize-none text-sm"
                  rows={2}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-500 hover:text-zeo-primary transition-colors">
                      <Image className="h-6 w-6" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-zeo-primary transition-colors">
                      <Smile className="h-6 w-6" />
                    </button>
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.content.trim()}
                    className="px-6 py-1 bg-zeo-primary text-white rounded-full text-sm font-semibold hover:bg-zeo-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-4">
            {feedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-4 hover:shadow-xl transition-all duration-300 hover:bg-white/95 w-full"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-zeo-primary/20 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-zeo-primary text-sm truncate">{post.author.name}</h3>
                        {post.author.verified && (
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">{post.author.username} · {post.timestamp}</p>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-zeo-primary transition-colors flex-shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                {/* Post Content */}
                <p className="text-gray-800 mb-3 leading-relaxed text-sm font-medium">{post.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-zeo-primary/10 text-zeo-primary rounded-full text-xs font-medium hover:bg-zeo-primary/20 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-muted-foreground hover:text-red-500 transition-colors group">
                      <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-xs">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 transition-colors group">
                      <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-xs">{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-muted-foreground hover:text-green-500 transition-colors group">
                      <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-xs">{post.shares}</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => setSelectedChat(post.author)}
                    className="px-2 py-1 bg-zeo-primary/10 text-zeo-primary rounded-full text-xs font-semibold hover:bg-zeo-primary hover:text-white transition-all duration-200"
                  >
                    Message
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 p-4 space-y-4 flex-shrink-0">
          {/* Search Box - Smaller */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zeo-primary h-4 w-4" />
              <input
                type="text"
                placeholder="Search community..."
                className="w-full pl-10 pr-3 py-2 border border-zeo-primary/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-zeo-primary/30 focus:border-zeo-primary bg-white/50 text-sm"
              />
            </div>
          </div>

          {/* Follow Suggestions - Compact */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 p-4">
            <h3 className="text-lg font-bold text-zeo-primary mb-4 flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-zeo-primary" />
              Who to follow
            </h3>
            <div className="space-y-3">
              {followSuggestions.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-zeo-primary/5 transition-colors">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover cursor-pointer ring-1 ring-zeo-primary/20 hover:ring-zeo-primary/40 transition-all flex-shrink-0"
                      onClick={() => setSelectedChat(user)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <h4 className="font-bold text-zeo-primary text-sm truncate cursor-pointer hover:text-zeo-primary/80 transition-colors" onClick={() => setSelectedChat(user)}>{user.name}</h4>
                        {user.verified && (
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user.username}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedChat(user)}
                    className="bg-zeo-primary/10 text-zeo-primary px-3 py-1 rounded-full text-xs font-bold hover:bg-zeo-primary hover:text-white transition-all duration-200"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Section - Aligned with Feed */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20 p-4">
            <h3 className="text-lg font-bold text-zeo-primary mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-zeo-primary" />
              Trending
            </h3>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="hover:bg-zeo-primary/5 p-3 rounded-lg cursor-pointer transition-all duration-200 group">
                  <p className="font-bold text-zeo-primary group-hover:text-zeo-primary/80 transition-colors text-sm">{topic.tag}</p>
                  <p className="text-xs text-muted-foreground font-semibold">{topic.posts}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messaging Modal */}
      {selectedChat && (
        <MessagingModal 
          open={true} 
          onClose={() => setSelectedChat(null)} 
          user={selectedChat} 
        />
      )}
    </div>
  );
};

export default Community;
