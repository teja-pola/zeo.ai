const mongoose = require('mongoose');

const counsellorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  specialization: {
    type: String,
    default: 'Clinical Psychologist & Mental Health Specialist'
  },
  qualifications: {
    type: String,
    default: 'M.A. Psychology, Ph.D. Clinical Psychology'
  },
  experience: {
    type: String,
    default: '8+ years experience'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  phone: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  languages: {
    type: [String],
    default: []
  },
  bio: {
    type: String,
    default: ''
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  weekSessions: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  averageDuration: {
    type: Number,
    default: 0
  },
  activeDays: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Counsellor', counsellorSchema);