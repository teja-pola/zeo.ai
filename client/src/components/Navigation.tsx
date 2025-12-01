import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Home,
  Video,
  BarChart3,
  Settings,
  Calendar,
  Menu,
  X,
  ArrowRight,
  BookOpen,
  Users,
  User,
  LogIn,
  LogOut
} from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  
  { name: 'Session', href: '/session', icon: Video },
  { name: 'Resources', href: '/resources', icon: BookOpen },
  
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  // No redirect needed; '/session' is the correct route

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50">
      <nav className={`max-w-3xl mx-auto px-6 py-3 rounded-2xl transition-all duration-300 ${
        isScrolled ? 'bg-[#345E2C]/95 shadow-lg' : 'bg-[#345E2C]'
      } mx-4 md:mx-auto`}>
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="ZEO Logo" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 bg-white/1 rounded-full px-2 py-1 relative">
            {/* Animated glass rectangle for active nav item only */}
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <div key={item.name} className="relative flex items-center" style={{ minWidth: 120, justifyContent: 'center' }}>
                  {active && (
                    <motion.div
                      className="absolute inset-0 rounded-full glass-strong -z-10"
                      layoutId="activeNavGlassBar"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                      }}
                    />
                  )}
                  <Link
                    to={item.href}
                    className={
                      `flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 z-10 text-white/90 hover:bg-white/20 hover:text-white relative`
                    }
                    style={{ minWidth: 120, justifyContent: 'center' }}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Login/Logout Buttons */}
          <div className="hidden md:flex items-center gap-2">
            
            <Button 
              className="bg-white text-[#345E2C] hover:bg-gray-100 rounded-full px-4 py-2 text-sm font-medium flex items-center"
              onClick={() => navigate('/role')}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-white/90 hover:text-white focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden mt-4 bg-white/1 rounded-2xl p-4 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-3 rounded-lg text-white/90 hover:bg-white/20 relative overflow-hidden ${
                    isActive(item.href) ? 'glass-strong' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                  style={{transition: 'background 0.3s'}}
                >
                  <AnimatePresence>
                    {isActive(item.href) && (
                      <motion.div 
                        className="absolute inset-0 glass-strong rounded-lg -z-10"
                        layoutId="activeNavGlassMobile"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }}
                      />
                    )}
                  </AnimatePresence>
                  {item.name}
                </Link>
              ))}
              <Button 
                className="w-full mt-2 bg-white text-[#345E2C] hover:bg-gray-100 rounded-lg py-3 font-medium flex items-center justify-center"
                onClick={() => {
                  navigate('/session');
                  setIsOpen(false);
                }}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}