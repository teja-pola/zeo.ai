const express = require('express');
const router = express.Router();
const Counsellor = require('../models/Counsellor');
const Student = require('../models/Student');

// Counsellor signup
router.post('/counsellor', async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      professionalTitle,
      qualifications,
      yearsOfExperience,
      specializations,
      languages,
      affiliation,
      availability,
      consent
    } = req.body;

    // Check if counsellor already exists
    const existingCounsellor = await Counsellor.findOne({ email });
    if (existingCounsellor) {
      return res.status(400).json({ message: 'Counsellor with this email already exists' });
    }

    // Create new counsellor
    const counsellor = new Counsellor({
      fullName,
      email,
      password, // In a real app, this should be hashed
      phone,
      gender,
      dateOfBirth,
      professionalTitle,
      qualifications,
      yearsOfExperience,
      specializations: specializations.split(',').map(s => s.trim()),
      languages: languages.split(',').map(l => l.trim()),
      affiliation,
      availability,
      consent
    });

    // Save counsellor to database
    const savedCounsellor = await counsellor.save();
    
    // Remove password from response
    const { password: _, ...counsellorData } = savedCounsellor.toObject();
    
    res.status(201).json({
      message: 'Counsellor registered successfully',
      user: counsellorData,
      token: 'mock-jwt-token-' + savedCounsellor._id
    });
  } catch (error) {
    console.error('Error registering counsellor:', error);
    res.status(500).json({ message: 'Server error during counsellor registration' });
  }
});

// Student signup
router.post('/student', async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      university,
      department,
      yearOfStudy,
      preferredLanguage,
      consent
    } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    // Create new student
    const student = new Student({
      fullName,
      email,
      password, // In a real app, this should be hashed
      phone,
      gender,
      dateOfBirth,
      university,
      department,
      yearOfStudy,
      preferredLanguage,
      consent
    });

    // Save student to database
    const savedStudent = await student.save();
    
    // Remove password from response
    const { password: _, ...studentData } = savedStudent.toObject();
    
    res.status(201).json({
      message: 'Student registered successfully',
      user: studentData,
      token: 'mock-jwt-token-' + savedStudent._id
    });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ message: 'Server error during student registration' });
  }
});

module.exports = router;