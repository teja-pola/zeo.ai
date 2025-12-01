const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');

// Mock the Resource and UserInteraction models
const mockResources = [
  {
    _id: new mongoose.Types.ObjectId(),
    title: 'Understanding Anxiety: A Comprehensive Guide',
    description: 'Learn about anxiety disorders, their symptoms, and effective coping strategies.',
    category: 'anxiety',
    type: 'article',
    url: 'https://example.com/anxiety-guide',
    author: 'Dr. Sarah Johnson',
    tags: ['anxiety', 'mental health', 'coping'],
    rating: { average: 4.5, count: 10 },
    engagement: { likes: 245, bookmarks: 89, shares: 34 },
    isActive: true,
    isFeatured: true,
    createdAt: new Date('2025-12-01T10:00:00Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    title: '10-Minute Mindfulness Meditation',
    description: 'A guided meditation session to help reduce stress and improve focus.',
    category: 'mindfulness',
    type: 'video',
    url: 'https://example.com/meditation-video',
    author: 'Mindful Living',
    duration: '10:00',
    tags: ['meditation', 'mindfulness', 'stress'],
    rating: { average: 4.8, count: 25 },
    engagement: { likes: 432, bookmarks: 156, shares: 67 },
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2025-12-02T14:30:00Z')
  }
];

// Mock models
jest.mock('../../server/models/Resource', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  distinct: jest.fn(),
  countDocuments: jest.fn(),
  updateOne: jest.fn()
}));

jest.mock('../../server/models/UserInteraction', () => ({
  findOne: jest.fn(),
  deleteOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([])
    })
  })
}));

const Resource = require('../../server/models/Resource');
const UserInteraction = require('../../server/models/UserInteraction');

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Mock authentication middleware
  app.use((req, res, next) => {
    req.user = { id: 'test-user-id' };
    next();
  });
  
  const resourcesRouter = require('../../server/routes/resources');
  app.use('/api', resourcesRouter);
  
  return app;
};

describe('Resource Management API', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('GET /api/resources', () => {
    it('should fetch all resources with default pagination', async () => {
      Resource.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockResources)
          })
        })
      });
      Resource.countDocuments.mockResolvedValue(2);

      const response = await request(app)
        .get('/api/resources')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should filter resources by category', async () => {
      const filteredResources = mockResources.filter(r => r.category === 'anxiety');
      
      Resource.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(filteredResources)
          })
        })
      });
      Resource.countDocuments.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/resources?category=anxiety')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].category).toBe('anxiety');
    });

    it('should filter resources by type', async () => {
      const filteredResources = mockResources.filter(r => r.type === 'video');
      
      Resource.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(filteredResources)
          })
        })
      });
      Resource.countDocuments.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/resources?type=video')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].type).toBe('video');
    });

    it('should search resources by title and description', async () => {
      const searchResults = mockResources.filter(r => 
        r.title.toLowerCase().includes('anxiety') ||
        r.description.toLowerCase().includes('anxiety')
      );
      
      Resource.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(searchResults)
          })
        })
      });
      Resource.countDocuments.mockResolvedValue(1);

      const response = await request(app)
        .get('/api/resources?search=anxiety')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].title.toLowerCase()).toContain('anxiety');
    });

    it('should handle pagination parameters', async () => {
      Resource.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockResources)
          })
        })
      });
      Resource.countDocuments.mockResolvedValue(10);

      const response = await request(app)
        .get('/api/resources?page=2&limit=5')
        .expect(200);

      expect(response.body.pagination.page).toBe(2);
      expect(response.body.pagination.limit).toBe(5);
      expect(Resource.find).toHaveBeenCalledWith(expect.objectContaining({ isActive: true }));
    });
  });

  describe('GET /api/resources/featured', () => {
    it('should fetch featured resources', async () => {
      const featuredResources = mockResources.filter(r => r.isFeatured);
      
      Resource.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(featuredResources)
        })
      });

      const response = await request(app)
        .get('/api/resources/featured')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(r => r.isFeatured)).toBe(true);
    });

    it('should limit featured resources based on query parameter', async () => {
      Resource.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([mockResources[0]])
        })
      });

      const response = await request(app)
        .get('/api/resources/featured?limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/resources/:id', () => {
    it('should fetch resource by ID', async () => {
      const resource = mockResources[0];
      Resource.findOne.mockResolvedValue(resource);

      const response = await request(app)
        .get(`/api/resources/${resource._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id.toString()).toBe(resource._id.toString());
      expect(response.body.data.title).toBe(resource.title);
    });

    it('should return 404 for non-existent resource', async () => {
      Resource.findOne.mockResolvedValue(null);
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/resources/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Resource not found');
    });
  });

  describe('GET /api/resources/meta/categories', () => {
    it('should fetch distinct categories', async () => {
      const categories = ['anxiety', 'depression', 'stress', 'mindfulness'];
      Resource.distinct.mockResolvedValue(categories);

      const response = await request(app)
        .get('/api/resources/meta/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(categories);
    });
  });

  describe('GET /api/resources/meta/types', () => {
    it('should fetch distinct resource types', async () => {
      const types = ['article', 'video', 'podcast', 'tool'];
      Resource.distinct.mockResolvedValue(types);

      const response = await request(app)
        .get('/api/resources/meta/types')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(types);
    });
  });

  describe('POST /api/resources/:id/interact', () => {
    it('should add a like interaction', async () => {
      UserInteraction.findOne.mockResolvedValue(null);
      UserInteraction.create.mockResolvedValue({});
      Resource.updateOne.mockResolvedValue({ acknowledged: true });

      const resource = mockResources[0];
      const response = await request(app)
        .post(`/api/resources/${resource._id}/interact`)
        .send({ interactionType: 'like' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.interacted).toBe(true);
      expect(UserInteraction.create).toHaveBeenCalledWith(expect.objectContaining({
        interactionType: 'like'
      }));
    });

    it('should remove an existing interaction', async () => {
      UserInteraction.findOne.mockResolvedValue({ _id: 'interaction-id' });
      UserInteraction.deleteOne.mockResolvedValue({});
      Resource.updateOne.mockResolvedValue({ acknowledged: true });

      const resource = mockResources[0];
      const response = await request(app)
        .post(`/api/resources/${resource._id}/interact`)
        .send({ interactionType: 'bookmark' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.interacted).toBe(false);
      expect(UserInteraction.deleteOne).toHaveBeenCalled();
    });

    it('should return 400 for invalid interaction type', async () => {
      const resource = mockResources[0];
      const response = await request(app)
        .post(`/api/resources/${resource._id}/interact`)
        .send({ interactionType: 'invalid' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid interaction type');
    });
  });

  describe('GET /api/resources/user/interactions', () => {
    it('should fetch user interactions', async () => {
      const mockInteractions = [
        {
          _id: new mongoose.Types.ObjectId(),
          userId: 'test-user-id',
          resourceId: mockResources[0]._id,
          interactionType: 'like',
          createdAt: new Date()
        }
      ];
      
      UserInteraction.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockInteractions)
        })
      });

      const response = await request(app)
        .get('/api/resources/user/interactions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockInteractions);
    });
  });

  describe('POST /api/resources/:id/rate', () => {
    it('should submit a rating for a resource', async () => {
      Resource.findById.mockResolvedValue(mockResources[0]);
      Resource.updateOne.mockResolvedValue({ acknowledged: true });

      const resource = mockResources[0];
      const response = await request(app)
        .post(`/api/resources/${resource._id}/rate`)
        .send({ rating: 5 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Resource.updateOne).toHaveBeenCalledWith(
        { _id: resource._id },
        expect.objectContaining({
          $set: expect.objectContaining({
            'rating.average': expect.any(Number),
            'rating.count': expect.any(Number)
          })
        })
      );
    });

    it('should return 400 for invalid rating value', async () => {
      const resource = mockResources[0];
      const response = await request(app)
        .post(`/api/resources/${resource._id}/rate`)
        .send({ rating: 6 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Rating must be between 1 and 5');
    });

    it('should return 404 for non-existent resource', async () => {
      Resource.findById.mockResolvedValue(null);
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post(`/api/resources/${nonExistentId}/rate`)
        .send({ rating: 4 })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Resource not found');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      Resource.find.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/resources')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Failed to fetch resources');
    });

    it('should handle invalid ObjectId formats', async () => {
      const response = await request(app)
        .get('/api/resources/invalid-id')
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });
});