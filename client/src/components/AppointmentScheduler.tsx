import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppointmentScheduler.css';

interface Appointment {
  id: string;
  userId: string;
  counselorId: string;
  dateTime: string;
  duration: number;
  type: 'individual' | 'group' | 'emergency';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface Counselor {
  id: string;
  name: string;
  specialization: string[];
  availability: string[];
  rating: number;
}

const AppointmentScheduler: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<'individual' | 'group' | 'emergency'>('individual');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchCounselors();
    fetchUserAppointments();
  }, []);

  const fetchCounselors = async () => {
    try {
      const response = await axios.get('/api/counselors');
      setCounselors(response.data);
    } catch (error) {
      console.error('Error fetching counselors:', error);
      setError('Failed to load counselors');
    }
  };

  const fetchUserAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments/user');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleScheduleAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const appointmentData = {
        counselorId: selectedCounselor,
        dateTime: `${selectedDate}T${selectedTime}`,
        duration: appointmentType === 'emergency' ? 30 : 60,
        type: appointmentType,
        notes: notes.trim()
      };

      const response = await axios.post('/api/appointments', appointmentData);
      setAppointments([...appointments, response.data]);
      setSuccess('Appointment scheduled successfully!');
      
      // Reset form
      setSelectedCounselor('');
      setSelectedDate('');
      setSelectedTime('');
      setAppointmentType('individual');
      setNotes('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/cancel`);
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      ));
      setSuccess('Appointment cancelled successfully!');
    } catch (error) {
      setError('Failed to cancel appointment');
    }
  };

  const getAvailableTimeSlots = (counselorId: string) => {
    const counselor = counselors.find(c => c.id === counselorId);
    if (!counselor) return [];
    
    return counselor.availability.filter(slot => {
      const slotDate = new Date(slot);
      const selectedDateObj = new Date(selectedDate);
      return slotDate.toDateString() === selectedDateObj.toDateString();
    });
  };

  return (
    <div className="appointment-scheduler">
      <div className="scheduler-header">
        <h2>Mental Health Appointment Scheduler</h2>
        <p>Book confidential sessions with licensed counselors</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="scheduler-content">
        <div className="booking-form">
          <h3>Schedule New Appointment</h3>
          <form onSubmit={handleScheduleAppointment}>
            <div className="form-group">
              <label htmlFor="counselor">Select Counselor:</label>
              <select
                id="counselor"
                value={selectedCounselor}
                onChange={(e) => setSelectedCounselor(e.target.value)}
                required
              >
                <option value="">Choose a counselor</option>
                {counselors.map(counselor => (
                  <option key={counselor.id} value={counselor.id}>
                    {counselor.name} - {counselor.specialization.join(', ')} (⭐{counselor.rating})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time:</label>
              <select
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                disabled={!selectedCounselor || !selectedDate}
              >
                <option value="">Choose time slot</option>
                {getAvailableTimeSlots(selectedCounselor).map(slot => (
                  <option key={slot} value={new Date(slot).toTimeString().slice(0, 5)}>
                    {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">Appointment Type:</label>
              <select
                id="type"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value as 'individual' | 'group' | 'emergency')}
              >
                <option value="individual">Individual Session (60 min)</option>
                <option value="group">Group Session (60 min)</option>
                <option value="emergency">Emergency Session (30 min)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (Optional):</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share any specific concerns or topics you'd like to discuss..."
                rows={3}
              />
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
          </form>
        </div>

        <div className="appointments-list">
          <h3>Your Appointments</h3>
          {appointments.length === 0 ? (
            <p className="no-appointments">No appointments scheduled yet.</p>
          ) : (
            <div className="appointments-grid">
              {appointments.map(appointment => (
                <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
                  <div className="appointment-header">
                    <span className={`status-badge ${appointment.status}`}>
                      {appointment.status.toUpperCase()}
                    </span>
                    <span className="appointment-type">{appointment.type}</span>
                  </div>
                  <div className="appointment-details">
                    <p><strong>Date:</strong> {new Date(appointment.dateTime).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p><strong>Duration:</strong> {appointment.duration} minutes</p>
                    <p><strong>Counselor:</strong> {counselors.find(c => c.id === appointment.counselorId)?.name || 'Loading...'}</p>
                    {appointment.notes && (
                      <p><strong>Notes:</strong> {appointment.notes}</p>
                    )}
                  </div>
                  {appointment.status === 'scheduled' && (
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;