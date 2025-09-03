import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  Star, 
  MessageSquare, 
  CalendarPlus,
  ArrowRight,
  Heart,
  MapPin,
  Phone,
  Video,
  CheckCircle
} from 'lucide-react';
import StudentSidebar from '@/components/StudentSidebar';

// Mock data for student sessions
const mockStudentSessions = [
  {
    id: 1,
    counsellorName: 'Dr. Sarah Johnson',
    counsellorTitle: 'Licensed Clinical Psychologist',
    counsellorImage: 'https://media.istockphoto.com/id/2193010762/photo/smiling-woman-girl-student-holding-using-tabled-pad-standing-isolated-over-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=43i3nvkFMQm5ICaVX9RxB8jAcmEFSMb68iTAjON_jgg=',
    date: '2024-01-20',
    time: '2:00 PM',
    duration: 45,
    rating: 5,
    problems: ['Anxiety', 'Stress Management'],
    notes: 'Discussed breathing techniques and coping strategies for exam stress. Made significant progress.',
    sessionType: 'Video Call',
    status: 'Completed'
  },
  {
    id: 2,
    counsellorName: 'Michael Chen',
    counsellorTitle: 'Student Counsellor',
    counsellorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    date: '2024-01-18',
    time: '10:30 AM',
    duration: 30,
    rating: 4,
    problems: ['Academic Pressure', 'Time Management'],
    notes: 'Worked on creating a study schedule and managing academic workload effectively.',
    sessionType: 'Phone Call',
    status: 'Completed'
  },
  {
    id: 3,
    counsellorName: 'Dr. Emily Rodriguez',
    counsellorTitle: 'Licensed Professional Counselor',
    counsellorImage: 'https://plus.unsplash.com/premium_photo-1670282393309-70fd7f8eb1ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2lybHxlbnwwfHwwfHx8MA%3D%3D',
    date: '2024-01-15',
    time: '4:15 PM',
    duration: 50,
    rating: 5,
    problems: ['Depression', 'Self-Esteem'],
    notes: 'Explored self-worth and practiced positive affirmations. Homework assigned for daily journaling.',
    sessionType: 'Video Call',
    status: 'Completed'
  },
  {
    id: 4,
    counsellorName: 'Dr. James Wilson',
    counsellorTitle: 'Behavioral Therapist',
    counsellorImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    date: '2024-01-25',
    time: '3:00 PM',
    duration: 45,
    rating: null,
    problems: ['Follow-up Session', 'Anxiety'],
    notes: '',
    sessionType: 'Video Call',
    status: 'Upcoming'
  }
];

// Mock data for counsellors (for booking functionality)
const mockCounsellors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'Licensed Clinical Psychologist',
    specializations: ['Anxiety', 'Depression', 'Stress Management'],
    introduction: 'Experienced in cognitive behavioral therapy with a focus on helping students overcome academic and personal challenges.',
    availableSlots: [
      { id: 1, date: '2025-09-05', time: '10:00 AM', duration: 45 },
      { id: 2, date: '2025-09-05', time: '2:00 PM', duration: 45 },
      { id: 3, date: '2025-09-06', time: '11:00 AM', duration: 45 },
      { id: 4, date: '2025-09-07', time: '3:00 PM', duration: 45 },
    ],
    languages: ['English', 'French'],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Student Counsellor',
    specializations: ['Academic Stress', 'Career Guidance', 'Mindfulness'],
    introduction: 'Focus on helping students develop coping strategies and achieve academic success through evidence-based approaches.',
    availableSlots: [
      { id: 5, date: '2025-09-05', time: '9:00 AM', duration: 30 },
      { id: 6, date: '2025-09-05', time: '1:00 PM', duration: 30 },
      { id: 7, date: '2025-09-06', time: '10:00 AM', duration: 30 },
    ],
    languages: ['English', 'Mandarin'],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    title: 'Licensed Professional Counselor',
    specializations: ['Depression', 'Trauma', 'Self-Esteem'],
    introduction: 'Experienced in trauma-informed care and helping students build resilience and emotional well-being.',
    availableSlots: [
      { id: 8, date: '2025-09-05', time: '11:00 AM', duration: 30 },
      { id: 9, date: '2025-09-06', time: '2:00 PM', duration: 30 },
      { id: 10, date: '2025-09-07', time: '9:00 AM', duration: 30 },
    ],
    languages: ['English', 'Spanish'],
    rating: 4.8,
    image: 'https://plus.unsplash.com/premium_photo-1670282393309-70fd7f8eb1ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2lybHxlbnwwfHwwfHx8MA%3D%3D',
  },
];

const availableDates = [
  '2025-09-05',
  '2025-09-06',
  '2025-09-07',
  '2025-09-08',
  '2025-09-09',
];

export default function StudentSessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(mockStudentSessions);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'my-sessions' | 'book-session'>('my-sessions');
  
  // Booking states
  const [selectedCounsellor, setSelectedCounsellor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [bookingDetails, setBookingDetails] = useState({
    sessionType: 'Video Call',
    problems: '',
    additionalNotes: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
    
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [selectedDate]);

  const completedSessions = sessions.filter(session => session.status === 'Completed');
  const upcomingSessions = sessions.filter(session => session.status === 'Upcoming');
  const totalHours = completedSessions.reduce((total, session) => total + session.duration, 0);
  const averageRating = completedSessions.length > 0 
    ? completedSessions.reduce((sum, session) => sum + (session.rating || 0), 0) / completedSessions.length 
    : 0;

  const handleCounsellorSelect = (counsellor: any) => {
    setSelectedCounsellor(counsellor);
    setBookingStep(2);
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    setBookingStep(3);
  };

  const handleBookingConfirm = () => {
    console.log('Booking confirmed:', {
      counsellor: selectedCounsellor,
      slot: selectedSlot,
      details: bookingDetails,
    });
    setBookingStep(4);
  };

  const resetBooking = () => {
    setSelectedCounsellor(null);
    setSelectedSlot(null);
    setBookingStep(1);
    setBookingDetails({
      sessionType: 'Video Call',
      problems: '',
      additionalNotes: ''
    });
    
    // Switch back to sessions tab
    setActiveTab('my-sessions');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zeo-surface via-background to-zeo-surface">
      <StudentSidebar />
      <div className="ml-[15%] w-[84%] p-6">
        <div className="container mx-auto space-y-8">
          {/* Header */}
          <motion.div
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold">
                <span className="gradient-text">Appointments</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Track your counselling sessions and book new appointments
              </p>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <button
              onClick={() => setActiveTab('my-sessions')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'my-sessions'
                  ? 'bg-[#345E2C] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              My Sessions
            </button>
            <button
              onClick={() => setActiveTab('book-session')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'book-session'
                  ? 'bg-[#345E2C] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarPlus className="w-4 h-4 inline mr-2" />
              Book a Session
            </button>
          </motion.div>

          {/* Tab Content */}
          {activeTab === 'my-sessions' ? (
            <div className="space-y-8">
              {/* Stats Overview */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glass border-border/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                        <p className="text-2xl font-bold">{completedSessions.length}</p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[#345E2C]/20 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-[#345E2C]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-border/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                        <p className="text-2xl font-bold">{Math.floor(totalHours / 60)}h {totalHours % 60}m</p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-border/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                        <p className="text-2xl font-bold">{averageRating.toFixed(1)}/5</p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <Star className="w-6 h-6 text-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-border/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                        <p className="text-2xl font-bold">{upcomingSessions.length}</p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Session History */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass border-border/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      Session History
                    </CardTitle>
                    <CardDescription>Your completed counselling sessions</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid gap-4 p-6">
                      {completedSessions.map((session, index) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-[#345E2C]/30">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                  <img 
                                    src={session.counsellorImage} 
                                    alt={session.counsellorName}
                                    className="w-16 h-16 rounded-full object-cover"
                                  />
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{session.counsellorName}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{session.counsellorTitle}</p>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {session.date}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {session.time} ({session.duration}m)
                                      </span>
                                      <span className="flex items-center gap-1">
                                        {session.sessionType === 'Video Call' ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                                        {session.sessionType}
                                      </span>
                                    </div>

                                    <div className="mb-3">
                                      <h4 className="text-sm font-medium text-gray-700 mb-2">Problems Discussed:</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {session.problems.map((problem, idx) => (
                                          <Badge key={idx} variant="outline" className="border-[#345E2C] text-[#345E2C]">
                                            {problem}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>

                                    {session.notes && (
                                      <div className="mb-3">
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">Session Notes:</h4>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                          {session.notes}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="text-right ml-4">
                                  <div className="mb-2">
                                    {renderStars(session.rating)}
                                  </div>
                                  <Badge className="bg-green-100 text-green-800">
                                    {session.status}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {completedSessions.length === 0 && (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-medium text-muted-foreground mb-2">No sessions yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Start your wellness journey by booking your first session with a professional counsellor.
                        </p>
                        <Button 
                          onClick={() => setActiveTab('book-session')}
                          className="bg-[#345E2C] hover:bg-[#2a4a24] text-white rounded-full"
                        >
                          <CalendarPlus className="w-4 h-4 mr-2" />
                          Book Your First Session
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Book a Session with a Counsellor</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Connect with professional counsellors for confidential support. 
                  Choose from available time slots that fit your schedule.
                </p>
              </div>
              
              <Card className="glass border-border/20">
                <CardHeader>
                  <CardTitle>Available Counsellors</CardTitle>
                  <CardDescription>Select a counsellor to book your session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockCounsellors.map((counsellor) => (
                      <motion.div
                        key={counsellor.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                        onClick={() => handleCounsellorSelect(counsellor)}
                      >
                        <div className="p-6">
                          <div className="flex items-start">
                            <img 
                              src={counsellor.image} 
                              alt={counsellor.name} 
                              className="w-20 h-20 rounded-full object-cover mr-6"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900">{counsellor.name}</h3>
                                  <p className="text-[#345E2C] font-medium">{counsellor.title}</p>
                                </div>
                                <Badge variant="secondary" className="bg-[#D2E4D3] text-[#345E2C]">
                                  ★ {counsellor.rating}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mt-3">{counsellor.introduction}</p>
                              
                              <div className="mt-4">
                                <div className="flex flex-wrap gap-2">
                                  {counsellor.specializations.map((spec: string, idx: number) => (
                                    <Badge key={idx} variant="outline" className="border-[#345E2C] text-[#345E2C]">
                                      {spec}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mt-4 flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>Speaks {counsellor.languages.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Next available slots:</span>
                              <Button 
                                className="bg-[#345E2C] hover:bg-[#2a4a24] text-white rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCounsellorSelect(counsellor);
                                }}
                              >
                                View Availability
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

