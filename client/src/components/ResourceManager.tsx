import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Share2, Bookmark, ExternalLink } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'podcast' | 'tool';
  url: string;
  author: string;
  duration?: string;
  tags: string[];
  likes: number;
  bookmarks: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

const ResourceManager: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['all', 'anxiety', 'depression', 'stress', 'mindfulness', 'therapy', 'self-care', 'relationships'];
  const resourceTypes = ['all', 'article', 'video', 'podcast', 'tool'];

  useEffect(() => {
    // Simulate loading resources
    const mockResources: Resource[] = [
      {
        id: '1',
        title: 'Understanding Anxiety: A Comprehensive Guide',
        description: 'Learn about anxiety disorders, their symptoms, and effective coping strategies.',
        category: 'anxiety',
        type: 'article',
        url: 'https://example.com/anxiety-guide',
        author: 'Dr. Sarah Johnson',
        tags: ['anxiety', 'mental health', 'coping'],
        likes: 245,
        bookmarks: 89,
        isLiked: false,
        isBookmarked: false
      },
      {
        id: '2',
        title: '10-Minute Mindfulness Meditation',
        description: 'A guided meditation session to help reduce stress and improve focus.',
        category: 'mindfulness',
        type: 'video',
        url: 'https://example.com/meditation-video',
        author: 'Mindful Living',
        duration: '10:00',
        tags: ['meditation', 'mindfulness', 'stress'],
        likes: 432,
        bookmarks: 156,
        isLiked: true,
        isBookmarked: false
      },
      {
        id: '3',
        title: 'The Science of Happiness Podcast',
        description: 'Exploring the latest research on happiness and well-being.',
        category: 'self-care',
        type: 'podcast',
        url: 'https://example.com/happiness-podcast',
        author: 'Dr. Michael Chen',
        duration: '45:00',
        tags: ['happiness', 'well-being', 'science'],
        likes: 189,
        bookmarks: 67,
        isLiked: false,
        isBookmarked: true
      },
      {
        id: '4',
        title: 'Stress Management Toolkit',
        description: 'Interactive tools and exercises for managing daily stress.',
        category: 'stress',
        type: 'tool',
        url: 'https://example.com/stress-toolkit',
        author: 'Wellness Center',
        tags: ['stress', 'tools', 'exercises'],
        likes: 321,
        bookmarks: 98,
        isLiked: false,
        isBookmarked: false
      }
    ];

    setTimeout(() => {
      setResources(mockResources);
      setFilteredResources(mockResources);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    setFilteredResources(filtered);
  }, [searchTerm, selectedCategory, selectedType, resources]);

  const handleLike = (id: string) => {
    setResources(prev => prev.map(resource =>
      resource.id === id
        ? {
            ...resource,
            isLiked: !resource.isLiked,
            likes: resource.isLiked ? resource.likes - 1 : resource.likes + 1
          }
        : resource
    ));
  };

  const handleBookmark = (id: string) => {
    setResources(prev => prev.map(resource =>
      resource.id === id
        ? {
            ...resource,
            isBookmarked: !resource.isBookmarked,
            bookmarks: resource.isBookmarked ? resource.bookmarks - 1 : resource.bookmarks + 1
          }
        : resource
    ));
  };

  const handleShare = (resource: Resource) => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: resource.url,
      });
    } else {
      navigator.clipboard.writeText(resource.url);
      alert('Link copied to clipboard!');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return '📄';
      case 'video': return '🎥';
      case 'podcast': return '🎧';
      case 'tool': return '🛠️';
      default: return '📚';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mental Health Resources</h1>
        <p className="text-gray-600">Discover curated resources to support your mental health journey</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {resourceTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Filter className="h-4 w-4 mr-1" />
          {filteredResources.length} resources found
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <div key={resource.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getTypeIcon(resource.type)}</span>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {resource.category}
                </span>
              </div>
              {resource.duration && (
                <span className="text-xs text-gray-500">{resource.duration}</span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
            <p className="text-xs text-gray-500 mb-4">by {resource.author}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {resource.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(resource.id)}
                  className={`flex items-center gap-1 text-sm ${resource.isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                >
                  <Heart className={`h-4 w-4 ${resource.isLiked ? 'fill-current' : ''}`} />
                  {resource.likes}
                </button>
                <button
                  onClick={() => handleBookmark(resource.id)}
                  className={`flex items-center gap-1 text-sm ${resource.isBookmarked ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}
                >
                  <Bookmark className={`h-4 w-4 ${resource.isBookmarked ? 'fill-current' : ''}`} />
                  {resource.bookmarks}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(resource)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ResourceManager;