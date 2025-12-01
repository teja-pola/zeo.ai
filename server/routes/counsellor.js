const express = require('express');
const router = express.Router();
const Counsellor = require('../models/Counsellor');

// Get counsellor profile by ID
router.get('/profile/:id', async (req, res) => {
  try {
    const counsellor = await Counsellor.findById(req.params.id).select('-password');
    
    if (!counsellor) {
      return res.status(404).json({ message: 'Counsellor not found' });
    }

    // Return profile data with additional fields
    const profileData = {
      fullName: counsellor.fullName,
      email: counsellor.email,
      profilePicture: counsellor.profilePicture || null,
      specialization: counsellor.specialization || 'Clinical Psychologist & Mental Health Specialist',
      qualifications: counsellor.qualifications || 'M.A. Psychology, Ph.D. Clinical Psychology',
      experience: counsellor.experience || '8+ years experience',
      isAvailable: counsellor.isAvailable !== false,
      phone: counsellor.phone,
      department: counsellor.department,
      languages: counsellor.languages,
      bio: counsellor.bio
    };

    res.json(profileData);
  } catch (error) {
    console.error('Error fetching counsellor profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get counsellor statistics by ID
router.get('/stats/:id', async (req, res) => {
  try {
    const counsellor = await Counsellor.findById(req.params.id);
    
    if (!counsellor) {
      return res.status(404).json({ message: 'Counsellor not found' });
    }

    // Mock statistics - in real implementation, these would come from session/appointment collections
    const stats = {
      totalSessions: counsellor.totalSessions || 156,
      weekSessions: counsellor.weekSessions || 12,
      averageRating: counsellor.averageRating || 4.8,
      averageDuration: counsellor.averageDuration || 45,
      activeDays: counsellor.activeDays || 89
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching counsellor stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get counsellor testimonials by ID
router.get('/testimonials/:id', async (req, res) => {
  try {
    // Mock testimonials - in real implementation, these would come from a testimonials collection
    const testimonials = [
      {
        id: '1',
        clientInitials: 'A.M.',
        feedback: 'Amazing counsellor! Really helped me through difficult times. Highly recommend.',
        date: '2024-01-15',
        rating: 5
      },
      {
        id: '2', 
        clientInitials: 'J.D.',
        feedback: 'Professional and empathetic. Made me feel comfortable sharing my thoughts.',
        date: '2024-01-12',
        rating: 5
      },
      {
        id: '3',
        clientInitials: 'S.K.',
        feedback: 'Great listener and provides practical advice. Sessions are very helpful.',
        date: '2024-01-10',
        rating: 4
      }
    ];

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching counsellor testimonials:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get counsellor recent sessions by ID
router.get('/sessions/:id', async (req, res) => {
  try {
    // Mock sessions - in real implementation, these would come from a sessions collection
    const sessions = [
      {
        id: '1',
        date: '2024-01-15',
        duration: 50,
        mood: 'Improved',
        topics: ['Anxiety', 'Work Stress']
      },
      {
        id: '2',
        date: '2024-01-14', 
        duration: 40,
        mood: 'Stable',
        topics: ['Relationships', 'Communication']
      },
      {
        id: '3',
        date: '2024-01-13',
        duration: 45,
        mood: 'Better',
        topics: ['Depression', 'Self-care']
      }
    ];

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching counsellor sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update counsellor profile
router.put('/profile/:id', async (req, res) => {
  try {
    const {
      specialization,
      qualifications,
      experience,
      isAvailable,
      phone,
      department,
      languages,
      bio,
      profilePicture
    } = req.body;

    const counsellor = await Counsellor.findByIdAndUpdate(
      req.params.id,
      {
        specialization,
        qualifications,
        experience,
        isAvailable,
        phone,
        department,
        languages,
        bio,
        profilePicture
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!counsellor) {
      return res.status(404).json({ message: 'Counsellor not found' });
    }

    res.json(counsellor);
  } catch (error) {
    console.error('Error updating counsellor profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
