const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counselor',
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    enum: [30, 60, 90, 120],
    default: 60
  },
  type: {
    type: String,
    required: true,
    enum: ['individual', 'group', 'emergency', 'follow-up'],
    default: 'individual'
  },
  status: {
    type: String,
    required: true,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  sessionNotes: {
    type: String,
    trim: true,
    maxlength: 5000,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: 2000,
    default: ''
  },
  reminderSent: {
    type: Boolean,
    default: false
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
appointmentSchema.index({ userId: 1, dateTime: -1 });
appointmentSchema.index({ counselorId: 1, dateTime: 1 });
appointmentSchema.index({ dateTime: 1, status: 1 });
appointmentSchema.index({ status: 1, createdAt: -1 });

// Virtual for checking if appointment is in the past
appointmentSchema.virtual('isPast').get(function() {
  return this.dateTime < new Date();
});

// Virtual for checking if appointment can be cancelled
appointmentSchema.virtual('canCancel').get(function() {
  if (this.status !== 'scheduled') return false;
  const hoursUntilAppointment = (this.dateTime.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntilAppointment >= 24;
});

// Virtual for formatted duration
appointmentSchema.virtual('formattedDuration').get(function() {
  return `${this.duration} minutes`;
});

// Pre-save middleware to update the updatedAt field
appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get upcoming appointments
appointmentSchema.statics.getUpcomingAppointments = function(userId, limit = 10) {
  return this.find({
    userId,
    dateTime: { $gte: new Date() },
    status: 'scheduled'
  })
  .populate('counselorId', 'name specialization')
  .sort({ dateTime: 1 })
  .limit(limit);
};

// Static method to get appointment history
appointmentSchema.statics.getAppointmentHistory = function(userId, limit = 20) {
  return this.find({
    userId,
    status: { $in: ['completed', 'cancelled'] }
  })
  .populate('counselorId', 'name specialization')
  .sort({ dateTime: -1 })
  .limit(limit);
};

// Static method to get counselor's schedule for a specific date
appointmentSchema.statics.getCounselorSchedule = function(counselorId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return this.find({
    counselorId,
    dateTime: { $gte: startOfDay, $lte: endOfDay },
    status: 'scheduled'
  })
  .populate('userId', 'username email')
  .sort({ dateTime: 1 });
};

// Static method to send appointment reminders
appointmentSchema.statics.sendReminders = function() {
  const now = new Date();
  const reminderTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
  
  return this.find({
    dateTime: {
      $gte: reminderTime,
      $lt: new Date(reminderTime.getTime() + 60 * 60 * 1000) // Within next hour
    },
    status: 'scheduled',
    reminderSent: false
  })
  .populate('userId', 'email username')
  .populate('counselorId', 'name');
};

module.exports = mongoose.model('Appointment', appointmentSchema);