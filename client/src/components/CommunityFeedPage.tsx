import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Flag, Camera, Smile, Hash, Users, TrendingUp, Plus } from 'lucide-react';

interface Post {
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
  isAnonymous?: boolean;
  reactions: {
    heart: number;
    care: number;
    cheer: number;
  };
}

const samplePosts: Post[] = [
  {
    id: 1,
    authorName: "Dr. Ritu Verma",
    handle: "@dr_ritu_verma",
    role: "Counsellor",
    profilePic: "https://randomuser.me/api/portraits/women/65.jpg",
    postText: "Remember to take breaks while studying to avoid burnout! Your mental health is just as important as your grades. 🌱",
    postImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    timestamp: "5h ago",
    likes: 43,
    comments: 7,
    shares: 12,
    hashtags: ["#selfcare", "#studentlife", "#mentalhealth"],
    reactions: { heart: 25, care: 12, cheer: 6 }
  },
  {
    id: 2,
    authorName: "Ananya Sharma",
    handle: "@ananya_sharma",
    role: "Student",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
    postText: "Just finished my first meditation session! Feeling so much calmer before my exam tomorrow. Anyone else find meditation helpful for anxiety?",
    timestamp: "2h ago",
    likes: 27,
    comments: 15,
    shares: 3,
    hashtags: ["#meditation", "#anxiety", "#examstress"],
    reactions: { heart: 15, care: 8, cheer: 4 }
  },
  {
    id: 3,
    authorName: "Anonymous Student",
    handle: "@anonymous",
    role: "Student",
    profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
    postText: "Struggling with imposter syndrome in my engineering program. Sometimes I feel like I don't belong here. Anyone else feel this way?",
    timestamp: "1h ago",
    likes: 34,
    comments: 22,
    shares: 5,
    hashtags: ["#impostersyndrome", "#engineering", "#support"],
    isAnonymous: true,
    reactions: { heart: 20, care: 10, cheer: 4 }
  },
  {
    id: 4,
    authorName: "Dr. Priya Nair",
    handle: "@dr_priya_nair",
    role: "Counsellor",
    profilePic: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80",
    postText: "Quick reminder: It's okay to not be okay. Seeking help is a sign of strength, not weakness. Our community is here to support you! 💙",
    timestamp: "30m ago",
    likes: 67,
    comments: 12,
    shares: 18,
    hashtags: ["#mentalhealth", "#support", "#strength"],
    reactions: { heart: 40, care: 20, cheer: 7 }
  }
];

const CommunityFeedPage: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [warning, setWarning] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<Post | null>(null);
  const [activeReaction, setActiveReaction] = useState<{[key: number]: string}>({});
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [feedFilter, setFeedFilter] = useState<'following' | 'famous'>('following');

  const MODERATION_KEYWORDS = ['suicide', 'self-harm', 'kill myself', 'hopeless', 'end it all'];
  const TRENDING_TAGS = ['#mentalhealth', '#selfcare', '#anxiety', '#meditation', '#support', '#studentlife'];

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
    setWarning('');
    
    for (const word of MODERATION_KEYWORDS) {
      if (e.target.value.toLowerCase().includes(word)) {
        setWarning('⚠️ If you are in crisis, please reach out to a professional or helpline immediately. You are not alone.');
        return;
      }
    }
  };

  const filteredPosts = (() => {
    let posts = samplePosts;
    
    // Filter by feed type
    if (feedFilter === 'famous') {
      posts = posts.filter(p => p.likes > 30); // Famous posts have more likes
    } else {
      posts = posts.filter(p => p.likes <= 30); // Following posts are more personal
    }
    
    // Filter by selected tag
    if (selectedTag) {
      posts = posts.filter(p => p.hashtags.includes(selectedTag));
    }
    
    return posts;
  })();

  const handleReaction = (postId: number, reactionType: string) => {
    setActiveReaction(prev => ({
      ...prev,
      [postId]: prev[postId] === reactionType ? '' : reactionType
    }));
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

  const createPost = () => {
    if (postText.trim()) {
      setShowNewPost(false);
      setPostText('');
      setPostImage('');
      setAnonymous(false);
      setWarning('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Feed Header */}
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-lg border border-[#D2E4D3] p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[#345E2C] to-[#256d63] rounded-full flex items-center justify-center">
            <Users className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#345E2C]">Community Feed</h2>
            <p className="text-sm text-[#256d63]">Share your thoughts and connect with others</p>
          </div>
        </div>

        {/* Following and Famous Filter Buttons */}
        <div className="flex gap-4 mb-6 px-2">
          <button
            onClick={() => setFeedFilter('following')}
            className={`flex-1 py-3 px-6 rounded-2xl font-semibold text-center transition-all duration-200 ${
              feedFilter === 'following'
                ? 'bg-gradient-to-r from-[#345E2C] to-[#256d63] text-white shadow-lg'
                : 'bg-[#D2E4D3] text-[#345E2C] hover:bg-[#A996E6] hover:text-white'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setFeedFilter('famous')}
            className={`flex-1 py-3 px-6 rounded-2xl font-semibold text-center transition-all duration-200 ${
              feedFilter === 'famous'
                ? 'bg-gradient-to-r from-[#345E2C] to-[#256d63] text-white shadow-lg'
                : 'bg-[#D2E4D3] text-[#345E2C] hover:bg-[#A996E6] hover:text-white'
            }`}
          >
            Famous
          </button>
        </div>

        {/* Trending Tags */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-[#A996E6]" />
            <span className="text-sm font-medium text-[#345E2C]">Trending Topics</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTag === tag
                    ? 'bg-[#345E2C] text-white shadow-lg'
                    : 'bg-[#D2E4D3] text-[#345E2C] hover:bg-[#A996E6] hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* New Post Section */}
        <div>
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="w-full bg-gradient-to-r from-[#345E2C] to-[#256d63] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            {showNewPost ? 'Cancel Post' : 'Share Your Thoughts'}
          </button>

          <AnimatePresence>
            {showNewPost && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-white/80 rounded-2xl p-6 shadow-lg border border-[#D2E4D3]"
              >
                <textarea
                  value={postText}
                  onChange={handlePostChange}
                  placeholder="What's on your mind? Share your thoughts, experiences, or ask for support... #hashtag"
                  className="w-full h-32 resize-none rounded-xl border border-[#D2E4D3] p-4 focus:outline-none focus:ring-2 focus:ring-[#345E2C] focus:border-transparent"
                  maxLength={500}
                />
                
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#D2E4D3] rounded-full text-[#345E2C] hover:bg-[#A996E6] hover:text-white transition-all">
                    <Camera size={16} />
                    Add Image
                  </button>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={() => setAnonymous(!anonymous)}
                      className="w-4 h-4 accent-[#A996E6]"
                    />
                    <span className="text-sm text-[#345E2C]">Post anonymously</span>
                  </label>
                  
                  <button
                    onClick={createPost}
                    disabled={!postText.trim()}
                    className="ml-auto bg-[#85B8CB] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#345E2C] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
                
                {warning && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                  >
                    {warning}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-[#D2E4D3] hover:shadow-xl transition-all duration-200"
          >
            {/* Post Header */}
            <div className="flex items-start gap-4 mb-4">
              <img
                src={post.profilePic}
                alt={post.isAnonymous ? 'Anonymous user' : post.authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#D2E4D3]"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-[#345E2C]">
                    {post.isAnonymous ? 'Anonymous Student' : post.authorName}
                  </span>
                  {!post.isAnonymous && (
                    <span className="text-sm text-[#256d63]">{post.handle}</span>
                  )}
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
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className="text-[#A996E6] text-sm font-medium hover:text-[#345E2C] hover:underline transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
            
            {/* Reactions & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#D2E4D3]">
              <div className="flex items-center gap-4">
                {/* Reaction buttons */}
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    likedPosts.has(post.id)
                      ? 'bg-red-100 text-red-600'
                      : 'hover:bg-[#D2E4D3] text-[#256d63]'
                  }`}
                >
                  <Heart size={18} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
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
              
              <button
                onClick={() => {
                  setReportTarget(post);
                  setReportOpen(true);
                }}
                className="p-2 rounded-full hover:bg-red-100 text-[#256d63] hover:text-red-600 transition-all"
                aria-label="Report post"
              >
                <Flag size={16} />
              </button>
            </div>
          </motion.article>
        ))}
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-[#D2E4D3]">
            <Hash size={48} className="mx-auto text-[#D2E4D3] mb-4" />
            <p className="text-[#345E2C] text-lg">No posts found for this topic yet.</p>
            <p className="text-[#256d63] text-sm mt-2">Be the first to share something!</p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {reportOpen && reportTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReportOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#345E2C] mb-4">Report Post</h3>
              <p className="text-[#256d63] mb-6">
                Are you sure you want to report this post by{' '}
                <span className="font-semibold">
                  {reportTarget.isAnonymous ? 'Anonymous Student' : reportTarget.authorName}
                </span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setReportOpen(false);
                    setReportTarget(null);
                  }}
                  className="flex-1 bg-[#A996E6] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#345E2C] transition-all"
                >
                  Report
                </button>
                <button
                  onClick={() => setReportOpen(false)}
                  className="flex-1 bg-[#D2E4D3] text-[#345E2C] px-4 py-3 rounded-xl font-semibold hover:bg-[#345E2C] hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityFeedPage;
