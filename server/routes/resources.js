const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Resource Schema
const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['anxiety', 'depression', 'stress', 'mindfulness', 'therapy', 'self-care', 'relationships', 'general']
  },
  type: {
    type: String,
    required: true,
    enum: ['article', 'video', 'podcast', 'tool', 'app', 'book']
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  authorCredentials: {
    type: String,
    trim: true,
    maxlength: 200
  },
  duration: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  thumbnail: {
    type: String,
    trim: true
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  engagement: {
    likes: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ar']
  },
  targetAudience: {
    type: String,
    enum: ['all', 'teenagers', 'adults', 'seniors', 'professionals', 'students'],
    default: 'all'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
resourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Resource = mongoose.model('Resource', resourceSchema);

// User interaction schema for likes and bookmarks
const userInteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Resource'
  },
  interactionType: {
    type: String,
    required: true,
    enum: ['like', 'bookmark', 'share', 'view']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);

// Get all resources with filtering and pagination
router.get('/resources', async (req, res) => {
  try {
    const {
      category,
      type,
      difficulty,
      language,
      targetAudience,
      search,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category && category !== 'all') filter.category = category;
    if (type && type !== 'all') filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (language) filter.language = language;
    if (targetAudience) filter.targetAudience = targetAudience;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute queries
    const [resources, total] = await Promise.all([
      Resource.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Resource.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resources'
    });
  }
});

// Get featured resources
router.get('/resources/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const resources = await Resource.find({ isActive: true, isFeatured: true })
      .sort({ 'rating.average': -1, 'engagement.likes': -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('Error fetching featured resources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured resources'
    });
  }
});

// Get resource by ID
router.get('/resources/:id', async (req, res) => {
  try {
    const resource = await Resource.findOne({ _id: req.params.id, isActive: true }).lean();
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resource'
    });
  }
});

// Get resource categories
router.get('/resources/meta/categories', async (req, res) => {
  try {
    const categories = await Resource.distinct('category', { isActive: true });
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// Get resource types
router.get('/resources/meta/types', async (req, res) => {
  try {
    const types = await Resource.distinct('type', { isActive: true });
    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    console.error('Error fetching types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch types'
    });
  }
});

// User interaction (like, bookmark, share)
router.post('/resources/:id/interact', async (req, res) => {
  try {
    const { interactionType } = req.body;
    const { id } = req.params;
    const userId = req.user?.id; // This would come from auth middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    if (!['like', 'bookmark', 'share'].includes(interactionType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid interaction type'
      });
    }

    // Check if interaction already exists
    const existingInteraction = await UserInteraction.findOne({
      userId,
      resourceId: id,
      interactionType
    });

    if (existingInteraction) {
      // Remove interaction
      await UserInteraction.deleteOne({ _id: existingInteraction._id });
      
      // Update resource engagement
      const updateField = interactionType === 'like' ? 'engagement.likes' :
                         interactionType === 'bookmark' ? 'engagement.bookmarks' :
                         'engagement.shares';
      
      await Resource.updateOne(
        { _id: id },
        { $inc: { [updateField]: -1 } }
      );

      res.json({
        success: true,
        message: 'Interaction removed',
        interacted: false
      });
    } else {
      // Add interaction
      await UserInteraction.create({
        userId,
        resourceId: id,
        interactionType
      });

      // Update resource engagement
      const updateField = interactionType === 'like' ? 'engagement.likes' :
                         interactionType === 'bookmark' ? 'engagement.bookmarks' :
                         'engagement.shares';
      
      await Resource.updateOne(
        { _id: id },
        { $inc: { [updateField]: 1 } }
      );

      res.json({
        success: true,
        message: 'Interaction added',
        interacted: true
      });
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to handle interaction'
    });
  }
});

// Get user's interactions
router.get('/resources/user/interactions', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const interactions = await UserInteraction.find({ userId })
      .populate('resourceId', 'title description category type')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: interactions
    });
  } catch (error) {
    console.error('Error fetching user interactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user interactions'
    });
  }
});

// Submit resource rating
router.post('/resources/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    // This would need a separate Rating model in a real implementation
    // For now, we'll just update the resource's average rating
    const resource = await Resource.findById(id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    // Simple rating update (in production, you'd want to track individual ratings)
    const newRatingCount = resource.rating.count + 1;
    const newAverageRating = ((resource.rating.average * resource.rating.count) + rating) / newRatingCount;

    await Resource.updateOne(
      { _id: id },
      {
        $set: {
          'rating.average': Math.round(newAverageRating * 10) / 10,
          'rating.count': newRatingCount
        }
      }
    );

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit rating'
    });
  }
});

module.exports = router;