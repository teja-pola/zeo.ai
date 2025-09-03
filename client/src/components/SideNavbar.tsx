import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, MessageCircle, User, Compass, TrendingUp } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  tooltip: string;
}

const SideNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home size={24} />,
      path: '/community?tab=feed',
      tooltip: 'Go to Home Feed'
    },
    {
      id: 'community',
      label: 'Community',
      icon: <Users size={24} />,
      path: '/community',
      tooltip: 'View Community & Connect'
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: <TrendingUp size={24} />,
      path: '/community?tab=explore',
      tooltip: 'Discover Trending Posts & People'
    },
    {
      id: 'chats',
      label: 'Chats',
      icon: <MessageCircle size={24} />,
      path: '/chats',
      tooltip: 'Open Messages & Chats'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User size={24} />,
      path: '/profile',
      tooltip: 'View Your Profile'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/community?tab=feed' && (location.pathname === '/' || (location.pathname === '/community' && location.search.includes('tab=feed')))) return true;
    if (path === '/community?tab=explore' && location.pathname === '/community' && location.search.includes('tab=explore')) return true;
    if (path !== '/' && !path.includes('?') && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.nav
      className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-lg border-r border-[#D2E4D3] shadow-lg z-40 flex flex-col py-6"
      initial={{ x: -80 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Logo/Brand */}
      <div className="mb-8 px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#345E2C] to-[#256d63] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#345E2C]">ZEO</h1>
            <p className="text-xs text-[#256d63]">Mental Health</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-2 flex-1 px-4">
        {navItems.map((item) => (
          <div key={item.id} className="relative group">
            <motion.button
              onClick={() => {
                if (item.path.includes('?tab=')) {
                  navigate(item.path);
                } else {
                  navigate(item.path);
                }
              }}
              className={`relative w-full h-12 rounded-xl flex items-center gap-3 px-4 transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-[#345E2C] text-white shadow-lg'
                  : 'text-[#345E2C] hover:bg-[#D2E4D3] hover:text-[#256d63]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={item.tooltip}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
              
              {/* Active indicator */}
              {isActive(item.path) && (
                <motion.div
                  className="absolute -left-1 top-1/2 w-1 h-6 bg-[#85B8CB] rounded-r-full"
                  layoutId="activeIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>

          </div>
        ))}
      </div>

      {/* Bottom section - could add settings or logout */}
      <div className="mt-auto px-4">
        <div className="flex items-center gap-3 p-3 bg-[#F8FAF8] rounded-xl">
          <div className="w-8 h-8 bg-[#A996E6] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div>
            <p className="text-sm font-medium text-[#345E2C]">Online</p>
            <p className="text-xs text-[#256d63]">Ready to help</p>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default SideNavbar;
