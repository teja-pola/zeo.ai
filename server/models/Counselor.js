const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const counselorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  specialization: [{
    type: String,
    required: true,
    enum: [
      'Anxiety Disorders',
      'Depression',
      'PTSD',
      'Relationship Counseling',
      'Family Therapy',
      'Cognitive Behavioral Therapy',
      'Dialectical Behavior Therapy',
      'Mindfulness-Based Therapy',
      'Trauma Therapy',
      'Addiction Counseling',
      'Grief Counseling',
      'Stress Management',
      'Self-Esteem Issues',
      'LGBTQ+ Issues',
      'Career Counseling',
      'Academic Stress',
      'Eating Disorders',
      'Sleep Disorders',
      'Anger Management',
      'Social Anxiety'
    ]
  }],
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  profilePicture: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  availability: [{
    type: Date,
    required: true
  }],
  workingHours: {
    monday: { start: String, end: String, isWorking: Boolean },
    tuesday: { start: String, end: String, isWorking: Boolean },
    wednesday: { start: String, end: String, isWorking: Boolean },
    thursday: { start: String, end: String, isWorking: Boolean },
    friday: { start: String, end: String, isWorking: Boolean },
    saturday: { start: String, end: String, isWorking: Boolean },
    sunday: { start: String, end: String, isWorking: Boolean }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  languages: [{
    type: String,
    trim: true
  }],
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
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

// Indexes for efficient querying
counselorSchema.index({ email: 1 });
counselorSchema.index({ specialization: 1 });
counselorSchema.index({ rating: -1 });
counselorSchema.index({ isActive: 1, isVerified: 1 });
counselorSchema.index({ 'workingHours.isWorking': 1 });

// Pre-save middleware to hash password
counselorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update the updatedAt field
counselorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to compare password
counselorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add availability slot
counselorSchema.methods.addAvailability = function(dateTime) {
  if (!this.availability.includes(dateTime)) {
    this.availability.push(dateTime);
    this.availability.sort((a, b) => new Date(a) - new Date(b));
  }
};

// Method to remove availability slot
counselorSchema.methods.removeAvailability = function(dateTime) {
  this.availability = this.availability.filter(slot => 
    new Date(slot).getTime() !== new Date(dateTime).getTime()
  );
};

// Method to check if counselor is available at specific time
counselorSchema.methods.isAvailable = function(dateTime) {
  return this.availability.some(slot => 
    new Date(slot).getTime() === new Date(dateTime).getTime()
  );
};

// Method to update rating
counselorSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating * this.totalRatings;
  this.totalRatings += 1;
  this.rating = (totalRating + newRating) / this.totalRatings;
};

// Method to get working hours for specific day
counselorSchema.methods.getWorkingHoursForDay = function(day) {
  const dayHours = this.workingHours[day.toLowerCase()];
  return dayHours && dayHours.isWorking ? dayHours : null;
};

// Method to check if counselor is working on specific day
counselorSchema.methods.isWorkingOnDay = function(date) {
  const day = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const workingHours = this.getWorkingHoursForDay(day);
  return workingHours !== null;
};

// Static method to get available counselors
counselorSchema.statics.getAvailableCounselors = function() {
  return this.find({ isActive: true, isVerified: true })
    .select('-password')
    .sort({ rating: -1 });
};

// Static method to get counselors by specialization
counselorSchema.statics.getCounselorsBySpecialization = function(specialization) {
  return this.find({
    specialization: { $in: [specialization] },
    isActive: true,
    isVerified: true
  })
  .select('-password')
  .sort({ rating: -1 });
};

// Static method to get top-rated counselors
counselorSchema.statics.getTopRatedCounselors = function(limit = 10) {
  return this.find({ isActive: true, isVerified: true })
    .select('-password')
    .sort({ rating: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Counselor', counselorSchema);