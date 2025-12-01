import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  MessageCircle, 
  BookOpen, 
  Settings, 
  LogOut,
  User,
  CalendarCheck,
  Bell,
  Video
} from 'lucide-react';
import TranslateWidget from './translate';

interface User {
  fullName: string;
  email: string;
}

interface NavigationItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  isSpecial?: boolean;
}

const CounsellorSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [newBookingsCount, setNewBookingsCount] = useState(3);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  const handleNavigation = (item: any) => {
    if (item.isSpecial && item.path === '#bookings') {
      navigate('/counsellor/bookings');
      setNewBookingsCount(0); // Clear notification badge
    } else {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const navigationItems: NavigationItem[] = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Video, label: 'Session', path: '/session' },
    { icon: Calendar, label: 'Appointments', path: '/sessions' },
    { icon: MessageCircle, label: 'Community', path: '/community' },
    { icon: BookOpen, label: 'Resources', path: '/resources' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-[15%] h-screen bg-[#3e5d32] flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="pt-8 pb-6 px-6 flex justify-center">
        <img 
          src="/logo.png" 
          alt="ZEO Logo" 
          className="h-12 w-auto"
        />
      </div>

      {/* Navigation Buttons */}
      <nav className="flex-1 px-2 flex flex-col justify-center items-center">
        <div className="w-full space-y-2 flex flex-col items-center">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            const isBookingButton = item.isSpecial && item.path === '#bookings';
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item)}
                className={`w-[80%] flex items-center pl-8 space-x-2 px-3 py-3 text-center text-white font-medium transition-all duration-200 rounded-lg relative ${
                  isActive 
                    ? 'bg-white/10 text-white' 
                    : item.isSpecial 
                    ? 'bg-[#345E2C]/20 hover:bg-[#345E2C]/30'
                    : 'hover:bg-white/5 hover:text-white/90'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
                {isBookingButton && newBookingsCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {newBookingsCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Card Section */}
      <div className="p-8">
        <div className="bg-white/5 rounded-lg p-4 space-y-2">
          {/* User Info */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'C'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-xl truncate">
                {user?.fullName || 'Counsellor'}
              </p>
            </div>
          </div>

          {/* Translate */}
          <div className="mt-2">
            <TranslateWidget inline />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-[#c03325] hover:bg-[#a02820] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 mt-4"
          >
            <LogOut className="h-3 w-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounsellorSidebar;