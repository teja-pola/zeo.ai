import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, AlertCircle, Video, MapPin, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  age: number;
  course: string;
  year: string;
  studentId: string;
}

interface BookingRequest {
  id: string;
  student: Student;
  requestedDate: string;
  requestedTime: string;
  duration: number;
  sessionType: string;
  problemDescription: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rescheduled' | 'cancelled';
  createdAt: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  sessionMode: 'online' | 'offline';
  location?: string;
}

const CounsellorBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rescheduled'>('all');

  useEffect(() => {
    // Mock data for booking requests
    const mockBookings: BookingRequest[] = [
      {
        id: '1',
        student: {
          id: 'std1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567',
          avatar: 'https://images.unsplash.com/photo-1484399172022-72a90b12e3c1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fGdpcmx8ZW58MHx8MHx8fDA%3D',
          age: 20,
          course: 'Computer Science',
          year: '2nd Year',
          studentId: 'CS2024001'
        },
        requestedDate: '2024-01-15',
        requestedTime: '14:00',
        duration: 60,
        sessionType: 'Individual Counseling',
        problemDescription: 'Experiencing severe anxiety and panic attacks during exams. Having trouble sleeping and concentrating on studies. Need coping strategies and stress management techniques. This has been affecting my academic performance significantly and I feel overwhelmed.',
        notes: 'First session - requires detailed assessment',
        status: 'pending',
        createdAt: '2024-01-10T10:30:00Z',
        urgencyLevel: 'high',
        sessionMode: 'online'
      },
      {
        id: '2',
        student: {
          id: 'std2',
          name: 'Michael Chen',
          email: 'michael.chen@email.com',
          phone: '+1 (555) 987-6543',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          age: 22,
          course: 'Business Administration',
          year: '4th Year',
          studentId: 'BA2021045'
        },
        requestedDate: '2024-01-16',
        requestedTime: '10:30',
        duration: 45,
        sessionType: 'Career Guidance',
        problemDescription: 'Confused about career path after graduation. Feeling pressure from family to pursue traditional career but interested in entrepreneurship. Need guidance on making the right choice and building confidence in my decisions.',
        notes: 'Student has good academic record but lacks confidence',
        status: 'pending',
        createdAt: '2024-01-11T09:15:00Z',
        urgencyLevel: 'medium',
        sessionMode: 'offline',
        location: 'Counseling Center - Room 201'
      },
      {
        id: '3',
        student: {
          id: 'std3',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@email.com',
          phone: '+1 (555) 456-7890',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
          age: 19,
          course: 'Psychology',
          year: '1st Year',
          studentId: 'PSY2023078'
        },
        requestedDate: '2024-01-17',
        requestedTime: '16:00',
        duration: 60,
        sessionType: 'Personal Development',
        problemDescription: 'Struggling with homesickness and difficulty making friends. Feeling isolated and lonely in new environment. Need help with social skills and adjustment to college life. Missing family and having trouble adapting.',
        notes: 'Student prefers video call over phone',
        status: 'accepted',
        createdAt: '2024-01-12T14:20:00Z',
        urgencyLevel: 'medium',
        sessionMode: 'online'
      },
      {
        id: '4',
        student: {
          id: 'std4',
          name: 'David Kumar',
          email: 'david.kumar@email.com',
          phone: '+1 (555) 321-9876',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
          age: 21,
          course: 'Engineering',
          year: '3rd Year',
          studentId: 'ENG2022156'
        },
        requestedDate: '2024-01-18',
        requestedTime: '11:00',
        duration: 60,
        sessionType: 'Academic Support',
        problemDescription: 'Struggling with time management and procrastination. Multiple project deadlines causing stress and affecting sleep patterns. Need strategies for better organization and productivity. Feeling overwhelmed with coursework.',
        status: 'pending',
        createdAt: '2024-01-13T15:45:00Z',
        urgencyLevel: 'high',
        sessionMode: 'offline',
        location: 'Counseling Center - Room 105'
      },
      {
        id: '5',
        student: {
          id: 'std5',
          name: 'Lisa Wang',
          email: 'lisa.wang@email.com',
          phone: '+1 (555) 654-3210',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
          age: 23,
          course: 'Medicine',
          year: '5th Year',
          studentId: 'MED2020089'
        },
        requestedDate: '2024-01-19',
        requestedTime: '13:30',
        duration: 45,
        sessionType: 'Stress Management',
        problemDescription: 'Experiencing burnout from intensive medical studies. Need help with work-life balance and stress reduction techniques. Feeling exhausted and losing motivation for studies.',
        notes: 'Recommended by academic advisor',
        status: 'rescheduled',
        createdAt: '2024-01-14T11:20:00Z',
        urgencyLevel: 'medium',
        sessionMode: 'online'
      }
    ];
    setBookings(mockBookings);
  }, []);

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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 ml-[17%]">
      <DashboardSidebar />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-[#3e5d32]">Bookings</h1>
          <p className="text-gray-600 mt-1">Manage student session requests and bookings</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b">
        <div className="px-6">
          <div className="flex space-x-8">
            {[
              { key: 'all', label: 'All Bookings', count: bookings.length },
              { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
              { key: 'accepted', label: 'Accepted', count: bookings.filter(b => b.status === 'accepted').length },
              { key: 'rescheduled', label: 'Rescheduled', count: bookings.filter(b => b.status === 'rescheduled').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-[#3e5d32] text-[#3e5d32]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Bookings List */}
        <div className="w-1/2 bg-white border-r overflow-y-auto">
          <div className="p-6">
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedBooking?.id === booking.id 
                      ? 'border-[#3e5d32] bg-[#3e5d32]/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {booking.student.avatar ? (
                          <img 
                            src={booking.student.avatar} 
                            alt={booking.student.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-[#3e5d32] rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {booking.student.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getUrgencyColor(booking.urgencyLevel)}`}></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.student.name}</h3>
                        <p className="text-sm text-gray-600">{booking.sessionType}</p>
                        <p className="text-xs text-gray-500">{booking.student.course} - {booking.student.year}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        {booking.sessionMode === 'online' ? <Video className="h-3 w-3 mr-1" /> : <MapPin className="h-3 w-3 mr-1" />}
                        <span>{booking.sessionMode}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(booking.requestedDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(booking.requestedTime)}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    <p className="line-clamp-2">
                      {booking.problemDescription.length > 100 ? booking.problemDescription.substring(0, 100) + '...' : booking.problemDescription}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="w-1/2 bg-gray-50 overflow-y-auto">
          {selectedBooking ? (
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    {selectedBooking.student.avatar ? (
                      <img 
                        src={selectedBooking.student.avatar} 
                        alt={selectedBooking.student.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#3e5d32] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xl">
                          {selectedBooking.student.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${getUrgencyColor(selectedBooking.urgencyLevel)}`}></div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedBooking.student.name}</h2>
                    <p className="text-gray-600">{selectedBooking.sessionType}</p>
                    <p className="text-sm text-gray-500">{selectedBooking.student.age} years • {selectedBooking.student.course} - {selectedBooking.student.year}</p>
                    <p className="text-xs text-gray-400">Student ID: {selectedBooking.student.studentId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requested Date</label>
                    <p className="text-gray-900">{formatDate(selectedBooking.requestedDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requested Time</label>
                    <p className="text-gray-900">{formatTime(selectedBooking.requestedTime)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <p className="text-gray-900">{selectedBooking.duration} minutes</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Mode</label>
                    <div className="flex items-center space-x-2">
                      {selectedBooking.sessionMode === 'online' ? <Video className="h-4 w-4 text-blue-500" /> : <MapPin className="h-4 w-4 text-green-500" />}
                      <span className="text-gray-900 capitalize">{selectedBooking.sessionMode}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getUrgencyColor(selectedBooking.urgencyLevel)}`}></div>
                      <span className="text-gray-900 capitalize">{selectedBooking.urgencyLevel}</span>
                    </div>
                  </div>
                </div>

                {selectedBooking.location && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <p className="text-gray-900">{selectedBooking.location}</p>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-900">{selectedBooking.student.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-900">{selectedBooking.student.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Problem Description</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="h-5 w-5 text-gray-500 mt-0.5" />
                      <p className="text-gray-900 leading-relaxed">{selectedBooking.problemDescription}</p>
                    </div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-900">{selectedBooking.notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedBooking.status === 'pending' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleBookingAction(selectedBooking.id, 'accept')}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Accept Booking</span>
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
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="h-5 w-5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Select a Booking</h3>
                <p>Choose a booking from the list to view detailed information</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounsellorBookings;

