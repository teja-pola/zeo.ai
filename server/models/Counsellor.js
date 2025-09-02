const mongoose = require('mongoose');

const counsellorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  dateOfBirth: {
    type: Date
  },
  professionalTitle: {
    type: String,
    required: true,
    enum: ['psychologist', 'counselor', 'psychiatrist', 'mentor', 'other']
  },
  qualifications: {
    type: String,
    required: true
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0
  },
  specializations: {
    type: [String],
    required: true
  },
  languages: {
    type: [String],
    required: true
  },
  affiliation: {
    type: String
  },
  availability: {
    type: String
  },
  documents: {
    type: [String] // Store file paths or URLs
  },
  consent: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Counsellor', counsellorSchema);