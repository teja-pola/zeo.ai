import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, UserPlus, TrendingUp, Sparkles, Users } from 'lucide-react';

interface CuratedPost {
  id: number;
  authorName: string;
  handle: string;
  role: 'Student' | 'Counsellor';
  profilePic: string;
  postText: string;
  postImage?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  hashtags: string[];
  isVerified?: boolean;
  category: 'trending' | 'inspirational' | 'educational' | 'community';
}

interface SuggestedFriend {
  id: number;
  fullName: string;
  username: string;
  role: 'Student' | 'Counsellor';
  bio: string;
  profilePic: string;
  mutualConnections: number;
  reason: string;
  isFollowing: boolean;
}

const curatedPosts: CuratedPost[] = [
  {
    id: 1,
    authorName: "Dr. Sarah Mitchell",
    handle: "@dr_sarah_mental",
    role: "Counsellor",
    profilePic: "https://randomuser.me/api/portraits/women/20.jpg",
    postText: "🌟 Daily Reminder: Your mental health journey is unique to you. What works for others might not work for you, and that's perfectly okay. Be patient with yourself as you discover what helps you thrive. #MentalHealthAwareness #SelfCompassion",
    postImage: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=500&q=80",
    timestamp: "3h ago",
    likes: 234,
    comments: 45,
    shares: 67,
    hashtags: ["#MentalHealthAwareness", "#SelfCompassion", "#Wellness"],
    isVerified: true,
    category: "inspirational"
  },
  {
    id: 2,
    authorName: "Alex Chen",
    handle: "@alex_mindful_student",
    role: "Student",
    profilePic: "https://randomuser.me/api/portraits/men/25.jpg",
    postText: "Just completed my first week of the '5-minute morning meditation' challenge! 🧘‍♂️ Already feeling more centered before classes. Small steps, big changes! Who else is trying mindfulness practices?",
    postImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=500&q=80",
    timestamp: "5h ago",
    likes: 156,
    comments: 28,
    shares: 34,
    hashtags: ["#Meditation", "#StudentLife", "#Mindfulness"],
    category: "trending"
  },
  {
    id: 3,
    authorName: "Dr. Priya Wellness",
    handle: "@dr_priya_wellness",
    role: "Counsellor",
    profilePic: "https://randomuser.me/api/portraits/women/30.jpg",
    postText: "📚 Study Break Tip: The 20-20-20 rule isn't just for your eyes! Every 20 minutes, take 20 seconds to do 20 deep breaths. Your mind will thank you for the reset. #StudyTips #MentalWellness",
    timestamp: "1h ago",
    likes: 189,
    comments: 32,
    shares: 45,
    hashtags: ["#StudyTips", "#MentalWellness", "#StudentSupport"],
    isVerified: true,
    category: "educational"
  },
  {
    id: 4,
    authorName: "Maya Patel",
    handle: "@maya_resilient",
    role: "Student",
    profilePic: "https://randomuser.me/api/portraits/women/35.jpg",
    postText: "Sharing my anxiety management toolkit that's been game-changing: ✨ Journaling before bed ✨ Progressive muscle relaxation ✨ Talking to trusted friends ✨ Professional counseling when needed. What's in your toolkit?",
    postImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=500&q=80",
    timestamp: "7h ago",
    likes: 298,
    comments: 67,
    shares: 89,
    hashtags: ["#AnxietySupport", "#MentalHealthTools", "#Community"],
    category: "community"
  }
];

const suggestedFriends: SuggestedFriend[] = [
  {
    id: 1,
    fullName: "Emma Rodriguez",
    username: "@emma_psych_student",
    role: "Student",
    bio: "Psychology major passionate about peer support and mental health advocacy",
    profilePic: "https://randomuser.me/api/portraits/women/40.jpg",
    mutualConnections: 5,
    reason: "Studies Psychology • Similar interests",
    isFollowing: false
  },
  {
    id: 2,
    fullName: "Dr. James Wilson",
    username: "@dr_james_therapy",
    role: "Counsellor",
    bio: "Licensed therapist specializing in cognitive behavioral therapy for young adults",
    profilePic: "https://randomuser.me/api/portraits/men/45.jpg",
    mutualConnections: 8,
    reason: "Followed by people you know • CBT specialist",
    isFollowing: false
  },
  {
    id: 3,
    fullName: "Sophia Kim",
    username: "@sophia_wellness",
    role: "Student",
    bio: "Wellness blogger sharing authentic mental health journey and self-care tips",
    profilePic: "https://randomuser.me/api/portraits/women/50.jpg",
    mutualConnections: 3,
    reason: "Active in mental health discussions",
    isFollowing: false
  }
];

const ExploreSection: React.FC = () => {
  const [followingUsers, setFollowingUsers] = useState<Set<number>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const handleFollow = (userId: number) => {
    setFollowingUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trending': return <TrendingUp size={16} className="text-[#A996E6]" />;
      case 'inspirational': return <Sparkles size={16} className="text-[#85B8CB]" />;
      case 'educational': return <Users size={16} className="text-[#345E2C]" />;
      case 'community': return <Heart size={16} className="text-[#256d63]" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Trending Posts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-[#D2E4D3]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[#A996E6] to-[#85B8CB] rounded-full flex items-center justify-center">
            <TrendingUp className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#345E2C]">Trending in Community</h2>
            <p className="text-[#256d63]">Popular posts from mental health advocates</p>
          </div>
        </div>

        <div className="grid gap-6">
          {curatedPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 rounded-2xl p-6 shadow-md border border-[#D2E4D3] hover:shadow-lg transition-all duration-200"
            >
              {/* Post Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img
                    src={post.profilePic}
                    alt={post.authorName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D2E4D3]"
                  />
                  {post.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#85B8CB] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#345E2C]">{post.authorName}</span>
                    <span className="text-sm text-[#256d63]">{post.handle}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        post.role === 'Student'
                          ? 'bg-[#3e5d32] text-white'
                          : 'bg-[#256d63] text-white'
                      }`}
                    >
                      {post.role}
                    </span>
                    <span className="text-sm text-[#256d63]">•</span>
                    <span className="text-sm text-[#256d63]">{post.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {getCategoryIcon(post.category)}
                    <span className="text-xs text-[#256d63] capitalize">{post.category}</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-[#345E2C] leading-relaxed mb-4">{post.postText}</p>
              
              {post.postImage && (
                <img
                  src={post.postImage}
                  alt="Post content"
                  className="w-full rounded-xl max-h-80 object-cover mb-4"
                />
              )}

              {/* Hashtags */}
              <div className="flex gap-2 flex-wrap mb-4">
                {post.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[#A996E6] text-sm font-medium hover:underline cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#D2E4D3]">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      likedPosts.has(post.id)
                        ? 'bg-red-100 text-red-600'
                        : 'hover:bg-[#D2E4D3] text-[#256d63]'
                    }`}
                  >
                    <Heart
                      size={18}
                      fill={likedPosts.has(post.id) ? 'currentColor' : 'none'}
                    />
                    <span className="font-medium">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[#D2E4D3] text-[#256d63] transition-all">
                    <MessageCircle size={18} />
                    <span className="font-medium">{post.comments}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[#D2E4D3] text-[#256d63] transition-all">
                    <Share2 size={18} />
                    <span className="font-medium">{post.shares}</span>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>

      {/* Friend Suggestions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-[#D2E4D3]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[#345E2C] to-[#256d63] rounded-full flex items-center justify-center">
            <UserPlus className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#345E2C]">Suggested Connections</h2>
            <p className="text-[#256d63]">People you might want to connect with</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedFriends.map((friend) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 rounded-2xl p-6 shadow-md border border-[#D2E4D3] hover:shadow-lg transition-all duration-200"
            >
              <div className="text-center">
                <img
                  src={friend.profilePic}
                  alt={friend.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D2E4D3] mx-auto mb-4"
                />
                <h3 className="font-bold text-[#345E2C] mb-1">{friend.fullName}</h3>
                <p className="text-sm text-[#256d63] mb-2">{friend.username}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                    friend.role === 'Student'
                      ? 'bg-[#3e5d32] text-white'
                      : 'bg-[#256d63] text-white'
                  }`}
                >
                  {friend.role}
                </span>
                <p className="text-sm text-[#345E2C] mb-3 line-clamp-2">{friend.bio}</p>
                <p className="text-xs text-[#A996E6] mb-4">{friend.reason}</p>
                {friend.mutualConnections > 0 && (
                  <p className="text-xs text-[#256d63] mb-4">
                    {friend.mutualConnections} mutual connections
                  </p>
                )}
                <button
                  onClick={() => handleFollow(friend.id)}
                  className={`w-full py-2 px-4 rounded-full font-semibold transition-all ${
                    followingUsers.has(friend.id)
                      ? 'bg-[#D2E4D3] text-[#345E2C] hover:bg-[#345E2C] hover:text-white'
                      : 'bg-[#345E2C] text-white hover:bg-[#256d63]'
                  }`}
                >
                  {followingUsers.has(friend.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ExploreSection;
