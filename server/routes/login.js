const express = require('express');
const router = express.Router();
const Counsellor = require('../models/Counsellor');
const Student = require('../models/Student');

// Student login
router.post('/student', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find student by email in database
    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password (in production, use bcrypt to compare hashed passwords)
    if (student.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Remove password from response
    const { password: _, ...studentData } = student.toObject();
    
    res.status(200).json({
      message: 'Student login successful',
      user: studentData,
      userType: 'student'
    });
  } catch (error) {
    console.error('Error during student login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Counsellor login
router.post('/counsellor', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find counsellor by email in database
    const counsellor = await Counsellor.findOne({ email: email.toLowerCase() });
    if (!counsellor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password (in production, use bcrypt to compare hashed passwords)
    if (counsellor.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Remove password from response
    const { password: _, ...counsellorData } = counsellor.toObject();
    
    res.status(200).json({
      message: 'Counsellor login successful',
      user: counsellorData,
      userType: 'counsellor'
    });
  } catch (error) {
    console.error('Error during counsellor login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Unified login endpoint
router.post('/', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validate input
    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'Email, password, and user type are required' });
    }

    if (!['student', 'counsellor'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Select the appropriate model based on user type
    const Model = userType === 'student' ? Student : Counsellor;
    
    // Find user by email in database
    const user = await Model.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password (in production, use bcrypt to compare hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Remove password from response
    const { password: _, ...userData } = user.toObject();
    
    res.status(200).json({
      message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} login successful`,
      user: userData,
      userType: userType
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
