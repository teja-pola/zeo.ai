const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Counselor = require('../models/Counselor');

// Get all counselors
router.get('/counselors', async (req, res) => {
  try {
    const counselors = await Counselor.find({ isActive: true })
      .select('-password')
      .sort({ rating: -1 });
    
    res.json(counselors);
  } catch (error) {
    console.error('Error fetching counselors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's appointments
router.get('/appointments/user', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id })
      .populate('counselorId', 'name specialization rating')
      .sort({ dateTime: -1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Schedule new appointment
router.post('/appointments', auth, async (req, res) => {
  try {
    const { counselorId, dateTime, duration, type, notes } = req.body;
    
    // Validate input
    if (!counselorId || !dateTime || !duration || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if counselor exists and is active
    const counselor = await Counselor.findById(counselorId);
    if (!counselor || !counselor.isActive) {
      return res.status(404).json({ message: 'Counselor not found or inactive' });
    }

    // Check for time conflicts
    const appointmentDate = new Date(dateTime);
    const existingAppointment = await Appointment.findOne({
      counselorId,
      dateTime: {
        $gte: new Date(appointmentDate.getTime() - duration * 60000),
        $lte: new Date(appointmentDate.getTime() + duration * 60000)
      },
      status: 'scheduled'
    });

    if (existingAppointment) {
      return res.status(409).json({ message: 'Time slot is already booked' });
    }

    // Check if user already has an appointment at this time
    const userConflict = await Appointment.findOne({
      userId: req.user.id,
      dateTime: {
        $gte: new Date(appointmentDate.getTime() - duration * 60000),
        $lte: new Date(appointmentDate.getTime() + duration * 60000)
      },
      status: 'scheduled'
    });

    if (userConflict) {
      return res.status(409).json({ message: 'You already have an appointment at this time' });
    }

    // Create appointment
    const appointment = new Appointment({
      userId: req.user.id,
      counselorId,
      dateTime: appointmentDate,
      duration,
      type,
      notes: notes || '',
      status: 'scheduled'
    });

    await appointment.save();
    
    // Populate counselor details before sending response
    await appointment.populate('counselorId', 'name specialization rating');
    
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel appointment
router.put('/appointments/:id/cancel', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status !== 'scheduled') {
      return res.status(400).json({ message: 'Appointment cannot be cancelled' });
    }

    // Check if appointment is at least 24 hours in the future
    const appointmentDate = new Date(appointment.dateTime);
    const now = new Date();
    const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24) {
      return res.status(400).json({ message: 'Appointments must be cancelled at least 24 hours in advance' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get counselor availability
router.get('/counselors/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const counselor = await Counselor.findById(id);
    if (!counselor) {
      return res.status(404).json({ message: 'Counselor not found' });
    }

    // Get existing appointments for this counselor on the specified date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      counselorId: id,
      dateTime: { $gte: startOfDay, $lte: endOfDay },
      status: 'scheduled'
    });

    // Filter counselor's availability to exclude booked slots
    const availableSlots = counselor.availability.filter(slot => {
      const slotTime = new Date(slot);
      return !existingAppointments.some(apt => {
        const aptTime = new Date(apt.dateTime);
        return Math.abs(slotTime.getTime() - aptTime.getTime()) < apt.duration * 60000;
      });
    });

    res.json({ availability: availableSlots });
  } catch (error) {
    console.error('Error fetching counselor availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete appointment (for counselors)
router.put('/appointments/:id/complete', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      counselorId: req.user.id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status !== 'scheduled') {
      return res.status(400).json({ message: 'Appointment cannot be completed' });
    }

    appointment.status = 'completed';
    await appointment.save();

    res.json({ message: 'Appointment completed successfully' });
  } catch (error) {
    console.error('Error completing appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;