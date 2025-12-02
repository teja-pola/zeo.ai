import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Heart, Share } from 'lucide-react';

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  category: 'support' | 'general' | 'resources';
}

export const CommunityWidget: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Mock community posts
    const mockPosts: CommunityPost[] = [
      {
        id: '1',
        author: 'Anonymous User',
        content: 'Today was a tough day, but I managed to practice mindfulness for 10 minutes. Small wins matter!',
        timestamp: new Date(Date.now() - 3600000),
        likes: 12,
        comments: 3,
        category: 'support'
      },
      {
        id: '2',
        author: 'Support Buddy',
        content: 'Remember: You are not alone in this journey. We are here to support each other.',
        timestamp: new Date(Date.now() - 7200000),
        likes: 24,
        comments: 7,
        category: 'general'
      }
    ];
    setPosts(mockPosts);
  }, []);

  if (!isExpanded) {
    return (
      <div className="fixed bottom-20 right-4">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <Users size={20} />
          <span className="text-sm">Community</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl w-96 h-96 flex flex-col z-40">
      <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2">
          <Users size={20} />
          Community Support
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="hover:bg-green-700 p-1 rounded"
        >
          ✕
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Recent Posts</h4>
          {posts.map(post => (
            <div key={post.id} className="border rounded-lg p-3 mb-3 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm">{post.author}</span>
                <span className="text-xs text-gray-500">
                  {post.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <button className="flex items-center gap-1 hover:text-red-500">
                  <Heart size={14} />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500">
                  <MessageCircle size={14} />
                  {post.comments}
                </button>
                <button className="flex items-center gap-1 hover:text-green-500">
                  <Share size={14} />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t">
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
          Share Your Story
        </button>
      </div>
    </div>
  );
};