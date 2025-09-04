import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTavus } from '@/contexts/TavusContext';

import DashboardSidebar from '@/components/DashboardSidebar';
import { 
  Calendar, 
  MessageCircle, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Heart, 
  Award, 
  Target, 
  Plus, 
  ChevronRight, 
  Star, 
  Users, 
  BarChart3, 
  Timer, 
  ThumbsUp, 
  Brain, 
  Smile,
  CalendarPlus
} from 'lucide-react';

const moodData = [
  { date: '2024-01-15', mood: 'happy', score: 8 },
  { date: '2024-01-16', mood: 'calm', score: 7 },
  { date: '2024-01-17', mood: 'anxious', score: 4 },
  { date: '2024-01-18', mood: 'happy', score: 9 },
  { date: '2024-01-19', mood: 'calm', score: 8 },
  { date: '2024-01-20', mood: 'excited', score: 9 },
  { date: '2024-01-21', mood: 'happy', score: 8 }
];

const insights = [
  {
    title: "Mood Improvement",
    description: "Your mood scores have improved by 23% this week",
    icon: TrendingUp,
    trend: "positive",
    value: "+23%"
  },
  {
    title: "Session Consistency",
    description: "You've maintained regular sessions for 12 days",
    icon: Target,
    trend: "positive", 
    value: "12 days"
  },
  {
    title: "Stress Management",
    description: "Anxiety episodes decreased by 40% this month",
    icon: Brain,
    trend: "positive",
    value: "-40%"
  }
];

const recentSessions = [
  {
    date: "Today, 2:30 PM",
    duration: "45 min",
    mood: "Calm",
    topics: ["Work stress", "Breathing exercises"]
  },
  {
    date: "Yesterday, 8:15 PM", 
    duration: "32 min",
    mood: "Happy",
    topics: ["Gratitude practice", "Goal setting"]
  },
  {
    date: "Jan 19, 1:45 PM",
    duration: "28 min", 
    mood: "Anxious",
    topics: ["Social anxiety", "Coping strategies"]
  }
];

interface User {
  fullName: string;
  email: string;
  profilePicture?: string;
  specialization?: string;
  qualifications?: string;
  experience?: string;
  isAvailable?: boolean;
  // Add other user properties as needed
}

interface CounsellorStats {
  totalSessions: number;
  weekSessions: number;
  averageRating: number;
  averageDuration: number;
  activeDays: number;
}

interface Testimonial {
  id: string;
  clientInitials: string;
  feedback: string;
  date: string;
  rating: number;
}

interface RecentSession {
  id: string;
  date: string;
  duration: number;
  mood: string;
  topics: string[];
}

  

  
export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string>('');
  const [averageMood] = useState(7.2);
  const [weeklyGoal] = useState(5);
  const [completedSessions] = useState(3);
  const [currentStreak] = useState(12);
  const [totalSessions] = useState(47);
  const [loading, setLoading] = useState(false);
  const { replica, error, createConversation } = useTavus();
  
  const handleStartSession = async () => {
    try {
      const { conversation_url } = await createConversation();
      navigate(`/session?url=${encodeURIComponent(conversation_url)}`);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };
  // Counsellor-specific data
  const [counsellorStats, setCounsellorStats] = useState<CounsellorStats>({
    totalSessions: 0,
    weekSessions: 0,
    averageRating: 0,
    averageDuration: 0,
    activeDays: 0
  });
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);

  // Fetch counsellor profile and stats from database
  const fetchCounsellorData = async (userId: string) => {
    try {
      setLoading(true);
      console.log('Fetching counsellor data for userId:', userId);
      
      // Fetch counsellor profile
      const profileResponse = await fetch(`http://localhost:3001/api/counsellor/profile/${userId}`);
      console.log('Profile response status:', profileResponse.status);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('Profile data received:', profileData);
        // Update user state with database data
        setUser(prevUser => ({ 
          ...prevUser, 
          ...profileData,
          specialization: profileData.specializations ? profileData.specializations.join(', ') : profileData.specialization,
          experience: profileData.yearsOfExperience ? `${profileData.yearsOfExperience} years` : profileData.experience
        }));
      } else {
        console.error('Profile fetch failed:', await profileResponse.text());
      }
      
      // Fetch counsellor stats
      const statsResponse = await fetch(`http://localhost:3001/api/counsellor/stats/${userId}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setCounsellorStats(statsData);
      }
      
      // Fetch testimonials
      const testimonialsResponse = await fetch(`http://localhost:3001/api/counsellor/testimonials/${userId}`);
      if (testimonialsResponse.ok) {
        const testimonialsData = await testimonialsResponse.json();
        setTestimonials(testimonialsData);
      }
      
      // Fetch recent sessions
      const sessionsResponse = await fetch(`http://localhost:3001/api/counsellor/sessions/${userId}`);
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setRecentSessions(sessionsData);
      }
    } catch (error) {
      console.error('Error fetching counsellor data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const userTypeData = localStorage.getItem('userType');
    
    console.log('Dashboard useEffect - userData:', userData);
    console.log('Dashboard useEffect - userTypeData:', userTypeData);
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('Parsed user:', parsedUser);
      setUser(parsedUser);
      
      // If counsellor, fetch additional data from database
      if (userTypeData === 'counsellor') {
        const userId = parsedUser._id || parsedUser.id;
        console.log('User type is counsellor, userId:', userId);
        console.log('Full user object:', parsedUser);
        if (userId) {
          fetchCounsellorData(userId);
        } else {
          console.error('No user ID found for counsellor');
          console.log('Available user properties:', Object.keys(parsedUser));
        }
      }
    }
    
    if (userTypeData) {
      setUserType(userTypeData);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zeo-surface via-background to-zeo-surface flex">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content - 81% width with left margin for sidebar */}
      <div className="ml-[15%] w-[84%] p-6">
        <div className="container mx-auto space-y-8">
        {/* Conditional Dashboard Content */}
        {userType === 'counsellor' ? (
          // Counsellor Dashboard
          <>
            {/* Counsellor Profile Section */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass border-border/20" style={{backgroundColor: '#D2E4D3'}}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Square Profile Picture */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden" style={{backgroundColor: '#345E2C'}}>
                      <img 
                        src={user?.profilePicture || "/placeholder.svg"} 
                        alt="Counsellor Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const nextEl = target.nextElementSibling as HTMLElement;
                          if (nextEl) nextEl.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-[#345E2C] flex items-center justify-center text-white text-2xl font-bold" style={{display: 'none'}}>
                        {user?.fullName?.charAt(0) || 'C'}
                      </div>
                    </div>
                    
                    {/* Profile Info */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold" style={{color: '#345E2C'}}>
                        {user?.fullName || 'Counsellor Name'}
                      </h2>
                      <p className="text-lg font-medium" style={{color: '#345E2C', opacity: 0.8}}>
                        {user?.specialization || 'Specialization not specified'}
                      </p>
                      <p className="text-sm mt-1" style={{color: '#345E2C', opacity: 0.7}}>
                        {user?.qualifications || 'Qualifications not specified'} {user?.qualifications && user?.experience ? ' • ' : ''} {user?.experience || 'Experience not specified'}
                      </p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium text-white`} style={{backgroundColor: user?.isAvailable !== false ? '#345E2C' : '#6B7280'}}>
                        ● {user?.isAvailable !== false ? 'Available' : 'Unavailable'}
                      </div>
                      <p className="text-xs" style={{color: '#345E2C', opacity: 0.7}}>
                        {user?.isAvailable !== false ? 'Online now' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Counsellor Header */}
            <motion.div
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold">
                  Welcome back, <span className="gradient-text">{user?.fullName || 'Counsellor'}</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  {user?.specialization || 'Your counselling dashboard and session overview'}
                </p>
                {user?.experience && (
                  <p className="text-sm text-muted-foreground">
                    {user.experience} • {user?.qualifications || 'Professional Counsellor'}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                {loading ? (
                  <div className="text-sm text-muted-foreground">Loading profile...</div>
                ) : (
                  <>
                    <Button variant="glass" className="group">
                      <Calendar className="w-4 h-4" />
                      Schedule Session
                    </Button>
                    <Button style={{backgroundColor: '#345E2C'}} className="group text-white hover:opacity-90">
                      <MessageCircle className="w-4 h-4" />
                      Start Session
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Counsellor Stats Overview */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass border-border/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Sessions This Week</p>
                      <p className="text-2xl font-bold">{counsellorStats.weekSessions}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: '#345E2C'}}>
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                      <p className="text-2xl font-bold">{counsellorStats.averageRating}/5</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                      <p className="text-2xl font-bold">{counsellorStats.totalSessions}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
                      <p className="text-2xl font-bold">{counsellorStats.averageDuration}m</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Timer className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Testimonials */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="glass border-border/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ThumbsUp className="w-5 h-5" style={{color: '#345E2C'}} />
                      Client Testimonials
                    </CardTitle>
                    <CardDescription>Recent feedback from your clients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {testimonials.map((testimonial, index) => (
                        <motion.div
                          key={testimonial.id}
                          className="p-4 rounded-lg" style={{backgroundColor: '#D2E4D3'}}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{backgroundColor: '#345E2C'}}>
                              {testimonial.clientInitials}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm" style={{color: '#345E2C'}}>"{testimonial.feedback}"</p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex">
                                  {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Sessions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="glass border-border/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" style={{color: '#345E2C'}} />
                      Recent Sessions
                    </CardTitle>
                    <CardDescription>Your latest counselling sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentSessions.map((session, index) => (
                        <motion.div
                          key={session.id}
                          className="p-4 rounded-lg glass hover:glass-strong transition-all duration-200 cursor-pointer group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{session.date}</p>
                              <p className="text-sm text-muted-foreground">{session.duration}m • {session.mood}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-all" style={{color: '#345E2C'}} />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {session.topics.map((topic, topicIndex) => (
                              <span
                                key={topicIndex}
                                className="px-2 py-1 text-xs rounded-full text-white"
                                style={{backgroundColor: '#345E2C'}}
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        ) : (
          // Student Dashboard (existing)
          <>
            {/* Student Header */}
            <motion.div
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold">
                  Welcome back, <span className="gradient-text">{user?.fullName || 'User'}</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Here's your mental wellness journey overview
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => navigate('/booking')}
                  className="bg-[#345E2C] hover:bg-[#2a4a24] text-white group"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Book Session
                </Button>
                <Button variant="hero" className="group">
                  <MessageCircle className="w-4 h-4" />
                  Start Session
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>

            {/* Student Stats Overview */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass border-border/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Sessions This Week</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Mood</p>
                      <p className="text-2xl font-bold">{averageMood.toFixed(1)}/10</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-emotion-happy/20 flex items-center justify-center">
                      <Smile className="w-6 h-6 text-emotion-happy" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                      <p className="text-2xl font-bold">24.5h</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-zeo-secondary/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-zeo-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Streak Days</p>
                      <p className="text-2xl font-bold">18</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <Award className="w-6 h-6 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mood Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glass border-border/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-zeo-primary" />
                    Mood Tracking
                  </CardTitle>
                  <CardDescription>Your emotional wellbeing over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moodData.map((day, index) => (
                      <motion.div
                        key={day.date}
                        className="flex items-center justify-between p-3 rounded-lg glass"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            day.mood === 'happy' ? 'bg-emotion-happy' :
                            day.mood === 'calm' ? 'bg-emotion-calm' :
                            day.mood === 'anxious' ? 'bg-emotion-anxious' :
                            day.mood === 'excited' ? 'bg-emotion-excited' :
                            'bg-emotion-sad'
                          }`} />
                          <span className="text-sm font-medium capitalize">{day.mood}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-hero"
                              initial={{ width: 0 }}
                              animate={{ width: `${day.score * 10}%` }}
                              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                            />
                          </div>
                          <span className="text-sm font-medium">{day.score}/10</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass border-border/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-400" />
                        Recent Sessions
                      </CardTitle>
                      <CardDescription>Your latest conversations with ZEO</CardDescription>
                    </div>
                    <Button 
                      onClick={() => navigate('/booking')}
                      className="bg-[#345E2C] hover:bg-[#2a4a24] text-white rounded-full flex items-center gap-2"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      Book a Session
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSessions.map((session, index) => (
                      <motion.div
                        key={index}
                        className="p-4 rounded-lg glass hover:glass-strong transition-all duration-200 cursor-pointer group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">{session.date}</p>
                            <p className="text-sm text-muted-foreground">{session.duration} • {session.mood}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-zeo-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {session.topics.map((topic, topicIndex) => (
                            <span
                              key={topicIndex}
                              className="px-2 py-1 text-xs bg-zeo-primary/10 text-zeo-primary rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Empty state with booking prompt */}
                  {recentSessions.length === 0 && (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No sessions yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start your wellness journey by booking your first session with a professional counsellor.
                      </p>
                      <Button 
                        onClick={() => navigate('/booking')}
                        className="bg-[#345E2C] hover:bg-[#2a4a24] text-white rounded-full"
                      >
                        <CalendarPlus className="w-4 h-4 mr-2" />
                        Join Your First Session
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* ZEO Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="glass border-border/20 text-center ">
                <CardContent className="p-6">
                {replica?.thumbnail_video_url ? (
              <video src={replica.thumbnail_video_url} autoPlay loop muted playsInline className="w-full h-auto object-cover rounded-xl pb-4" style={{ maxHeight: 480 }} />
            ) : (
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <span className="text-white">AI Companion</span>
              </div>
            )}
                  <h3 className="font-semibold mb-2">zeo.ai is ready to help</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start a new session to continue your wellness journey
                  </p>
                  <Button variant="hero" className="w-full">
                    <Plus className="w-4 h-4" />
                    New Session
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Insights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="glass border-border/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-zeo-secondary" />
                    Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <motion.div
                        key={insight.title}
                        className="p-3 rounded-lg glass"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            insight.trend === 'positive' ? 'bg-emotion-happy/20' : 'bg-emotion-anxious/20'
                          }`}>
                            <Icon className={`w-4 h-4 ${
                              insight.trend === 'positive' ? 'text-emotion-happy' : 'text-emotion-anxious'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium">{insight.title}</h4>
                              <span className={`text-xs font-semibold ${
                                insight.trend === 'positive' ? 'text-emotion-happy' : 'text-emotion-anxious'
                              }`}>
                                {insight.value}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{insight.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </div>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
