import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface BookingRequest {
  id: string;
  student: Student;
  requestedDate: string;
  requestedTime: string;
  duration: number;
  sessionType: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rescheduled' | 'cancelled';
  createdAt: string;
}

interface SessionBookingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SessionBookingsModal: React.FC<SessionBookingsModalProps> = ({ open, onClose }) => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for booking requests
  useEffect(() => {
    if (open) {
      const mockBookings: BookingRequest[] = [
        {
          id: '1',
          student: {
            id: 'std1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '+1 (555) 123-4567'
          },
          requestedDate: '2024-01-15',
          requestedTime: '14:00',
          duration: 60,
          sessionType: 'Individual Counseling',
          notes: 'Dealing with anxiety and stress management. First session.',
          status: 'pending',
          createdAt: '2024-01-10T10:30:00Z'
        },
        {
          id: '2',
          student: {
            id: 'std2',
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            phone: '+1 (555) 987-6543'
          },
          requestedDate: '2024-01-16',
          requestedTime: '10:30',
          duration: 45,
          sessionType: 'Career Guidance',
          notes: 'Need help with career transition and goal setting.',
          status: 'pending',
          createdAt: '2024-01-11T09:15:00Z'
        },
        {
          id: '3',
          student: {
            id: 'std3',
            name: 'Emily Rodriguez',
            email: 'emily.rodriguez@email.com',
            phone: '+1 (555) 456-7890'
          },
          requestedDate: '2024-01-17',
          requestedTime: '16:00',
          duration: 60,
          sessionType: 'Group Therapy',
          notes: 'Interested in joining the weekly support group.',
          status: 'pending',
          createdAt: '2024-01-12T14:20:00Z'
        }
      ];
      setBookings(mockBookings);
    }
  }, [open]);

  const handleBookingAction = async (bookingId: string, action: 'accept' | 'reschedule' | 'cancel') => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: action === 'accept' ? 'accepted' : action === 'reschedule' ? 'rescheduled' : 'cancelled' }
        : booking
    ));
    
    setLoading(false);
    setSelectedBooking(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rescheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#3e5d32] text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Session Bookings</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* Bookings List */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Pending Requests ({bookings.filter(b => b.status === 'pending').length})
              </h3>
              
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedBooking?.id === booking.id 
                        ? 'border-[#3e5d32] bg-[#3e5d32]/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#3e5d32] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {booking.student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{booking.student.name}</h4>
                          <p className="text-sm text-gray-600">{booking.sessionType}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(booking.requestedDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(booking.requestedTime)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="w-1/2 overflow-y-auto">
            {selectedBooking ? (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Booking Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-[#3e5d32] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {selectedBooking.student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{selectedBooking.student.name}</h4>
                        <p className="text-gray-600">{selectedBooking.sessionType}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <p className="text-gray-900">{formatDate(selectedBooking.requestedDate)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <p className="text-gray-900">{formatTime(selectedBooking.requestedTime)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <p className="text-gray-900">{selectedBooking.duration} minutes</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900">{selectedBooking.student.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900">{selectedBooking.student.phone}</span>
                        </div>
                      </div>
                    </div>

                    {selectedBooking.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <p className="text-gray-900 bg-white p-3 rounded border">{selectedBooking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedBooking.status === 'pending' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleBookingAction(selectedBooking.id, 'accept')}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleBookingAction(selectedBooking.id, 'reschedule')}
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="h-5 w-5" />
                      <span>Reschedule</span>
                    </button>
                    <button
                      onClick={() => handleBookingAction(selectedBooking.id, 'cancel')}
                      disabled={loading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="h-5 w-5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a booking to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionBookingsModal;


