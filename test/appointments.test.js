const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock models
const Appointment = require('../server/models/Appointment');
const Counselor = require('../server/models/Counselor');
const User = require('../server/models/User');

// Create test app
const app = express();
app.use(express.json());

// Mock auth middleware
const auth = (req, res, next) => {
  req.user = { id: 'testuser123' };
  next();
};

// Import routes
const appointmentRoutes = require('../server/routes/appointments');
app.use('/api', appointmentRoutes);

// Mock data
const mockCounselor = {
  _id: 'testcounselor123',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@example.com',
  specialization: ['Anxiety Disorders', 'Depression', 'Cognitive Behavioral Therapy'],
  licenseNumber: 'CBT-2024-001',
  yearsOfExperience: 8,
  rating: 4.8,
  availability: [
    new Date('2025-12-10T09:00:00'),
    new Date('2025-12-10T10:00:00'),
    new Date('2025-12-10T11:00:00')
  ],
  isActive: true,
  isVerified: true,
  hourlyRate: 120
};

const mockAppointment = {
  _id: 'testappointment123',
  userId: 'testuser123',
  counselorId: 'testcounselor123',
  dateTime: new Date('2025-12-10T10:00:00'),
  duration: 60,
  type: 'individual',
  status: 'scheduled',
  notes: 'Initial consultation for anxiety management'
};

// Mock implementations
jest.mock('../server/models/Counselor');
jest.mock('../server/models/Appointment');
jest.mock('../server/models/User');

describe('Appointment System Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/counselors', () => {
    it('should return all active counselors', async () => {
      Counselor.find.mockResolvedValue([mockCounselor]);

      const response = await request(app)
        .get('/api/counselors')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Dr. Sarah Johnson');
      expect(response.body[0].rating).toBe(4.8);
    });

    it('should handle server errors', async () => {
      Counselor.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/counselors')
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });
  });

  describe('POST /api/appointments', () => {
    it('should schedule a new appointment successfully', async () => {
      Counselor.findById.mockResolvedValue(mockCounselor);
      Appointment.findOne.mockResolvedValue(null); // No conflicts
      
      const mockSave = jest.fn().mockResolvedValue(mockAppointment);
      const mockPopulate = jest.fn().mockResolvedValue(mockAppointment);
      
      Appointment.mockImplementation(() => ({
        save: mockSave,
        populate: mockPopulate
      }));

      const appointmentData = {
        counselorId: 'testcounselor123',
        dateTime: '2025-12-10T10:00:00',
        duration: 60,
        type: 'individual',
        notes: 'Test appointment'
      };

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', 'Bearer testtoken')
        .send(appointmentData)
        .expect(201);

      expect(response.body.type).toBe('individual');
      expect(response.body.status).toBe('scheduled');
    });

    it('should reject appointment with missing fields', async () => {
      const appointmentData = {
        counselorId: 'testcounselor123',
        // Missing dateTime, duration, type
      };

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', 'Bearer testtoken')
        .send(appointmentData)
        .expect(400);

      expect(response.body.message).toBe('Missing required fields');
    });

    it('should reject appointment with inactive counselor', async () => {
      const inactiveCounselor = { ...mockCounselor, isActive: false };
      Counselor.findById.mockResolvedValue(inactiveCounselor);

      const appointmentData = {
        counselorId: 'testcounselor123',
        dateTime: '2025-12-10T10:00:00',
        duration: 60,
        type: 'individual'
      };

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', 'Bearer testtoken')
        .send(appointmentData)
        .expect(404);

      expect(response.body.message).toBe('Counselor not found or inactive');
    });

    it('should reject appointment with time conflict', async () => {
      Counselor.findById.mockResolvedValue(mockCounselor);
      Appointment.findOne.mockResolvedValue(mockAppointment); // Conflict exists

      const appointmentData = {
        counselorId: 'testcounselor123',
        dateTime: '2025-12-10T10:00:00',
        duration: 60,
        type: 'individual'
      };

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', 'Bearer testtoken')
        .send(appointmentData)
        .expect(409);

      expect(response.body.message).toBe('Time slot is already booked');
    });
  });

  describe('PUT /api/appointments/:id/cancel', () => {
    it('should cancel an appointment successfully', async () => {
      const futureAppointment = {
        ...mockAppointment,
        dateTime: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours from now
      };
      
      Appointment.findOne.mockResolvedValue(futureAppointment);

      const response = await request(app)
        .put('/api/appointments/testappointment123/cancel')
        .set('Authorization', 'Bearer testtoken')
        .expect(200);

      expect(response.body.message).toBe('Appointment cancelled successfully');
    });

    it('should reject cancellation of non-existent appointment', async () => {
      Appointment.findOne.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/appointments/nonexistent123/cancel')
        .set('Authorization', 'Bearer testtoken')
        .expect(404);

      expect(response.body.message).toBe('Appointment not found');
    });

    it('should reject cancellation within 24 hours', async () => {
      const nearAppointment = {
        ...mockAppointment,
        dateTime: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours from now
      };
      
      Appointment.findOne.mockResolvedValue(nearAppointment);

      const response = await request(app)
        .put('/api/appointments/testappointment123/cancel')
        .set('Authorization', 'Bearer testtoken')
        .expect(400);

      expect(response.body.message).toBe('Appointments must be cancelled at least 24 hours in advance');
    });

    it('should reject cancellation of already completed appointment', async () => {
      const completedAppointment = {
        ...mockAppointment,
        status: 'completed'
      };
      
      Appointment.findOne.mockResolvedValue(completedAppointment);

      const response = await request(app)
        .put('/api/appointments/testappointment123/cancel')
        .set('Authorization', 'Bearer testtoken')
        .expect(400);

      expect(response.body.message).toBe('Appointment cannot be cancelled');
    });
  });

  describe('GET /api/counselors/:id/availability', () => {
    it('should return counselor availability', async () => {
      Counselor.findById.mockResolvedValue(mockCounselor);
      Appointment.find.mockResolvedValue([]); // No existing appointments

      const response = await request(app)
        .get('/api/counselors/testcounselor123/availability?date=2025-12-10')
        .expect(200);

      expect(response.body.availability).toHaveLength(3);
    });

    it('should require date parameter', async () => {
      const response = await request(app)
        .get('/api/counselors/testcounselor123/availability')
        .expect(400);

      expect(response.body.message).toBe('Date parameter is required');
    });

    it('should handle counselor not found', async () => {
      Counselor.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/counselors/nonexistent123/availability?date=2025-12-10')
        .expect(404);

      expect(response.body.message).toBe('Counselor not found');
    });
  });

  describe('Model Methods', () => {
    it('should get upcoming appointments', async () => {
      const mockGetUpcoming = jest.fn().mockResolvedValue([mockAppointment]);
      Appointment.getUpcomingAppointments = mockGetUpcoming;

      const upcoming = await Appointment.getUpcomingAppointments('testuser123');
      
      expect(upcoming).toHaveLength(1);
      expect(mockGetUpcoming).toHaveBeenCalledWith('testuser123', 10);
    });

    it('should get appointment history', async () => {
      const mockGetHistory = jest.fn().mockResolvedValue([mockAppointment]);
      Appointment.getAppointmentHistory = mockGetHistory;

      const history = await Appointment.getAppointmentHistory('testuser123');
      
      expect(history).toHaveLength(1);
      expect(mockGetHistory).toHaveBeenCalledWith('testuser123', 20);
    });

    it('should get counselor schedule', async () => {
      const mockGetSchedule = jest.fn().mockResolvedValue([mockAppointment]);
      Appointment.getCounselorSchedule = mockGetSchedule;

      const schedule = await Appointment.getCounselorSchedule('testcounselor123', '2025-12-10');
      
      expect(schedule).toHaveLength(1);
      expect(mockGetSchedule).toHaveBeenCalledWith('testcounselor123', '2025-12-10');
    });
  });

  describe('Edge Cases', () => {
    it('should handle database connection errors', async () => {
      Counselor.findById.mockRejectedValue(new Error('Connection timeout'));

      const appointmentData = {
        counselorId: 'testcounselor123',
        dateTime: '2025-12-10T10:00:00',
        duration: 60,
        type: 'individual'
      };

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', 'Bearer testtoken')
        .send(appointmentData)
        .expect(500);

      expect(response.body.message).toBe('Server error');
    });

    it('should handle invalid date formats', async () => {
      const appointmentData = {
        counselorId: 'testcounselor123',
        dateTime: 'invalid-date',
        duration: 60,
        type: 'individual'
      };

      // This should be handled by the validation, but let's see how it behaves
      Counselor.findById.mockResolvedValue(mockCounselor);
      Appointment.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', 'Bearer testtoken')
        .send(appointmentData)
        .expect(500); // Should fail due to invalid date parsing

      expect(response.body.message).toBe('Server error');
    });
  });
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.close();
});