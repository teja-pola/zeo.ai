import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { TavusProvider } from "./contexts/TavusContext";
import Navigation from "./components/Navigation";
import Landing from "./pages/Landing";
import Session from "./pages/Session";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import StudentLogin from "./pages/StudentLogin";
import CounsellorLogin from "./pages/CounsellorLogin";
import Roll from './pages/Roll';
import NotFound from './pages/NotFound';
import Signup from "./pages/Signup";
import CounsellorSignup from './pages/CounsellorSignup';
import StudentSignup from './pages/StudentSignup';
import Resources from "./pages/Resources";
import Community from "./pages/Community";
import Chats from "./pages/Chats";
import "./i18n";
import ChatWidget from "./components/ChatWidget";
import CounsellorBookings from "./pages/CounsellorBookings";
import StudentSessions from "./pages/StudentSessions";
import EmergencyWidget from "./components/EmergencyWidget";



const queryClient = new QueryClient();

// ✅ Layout with Navigation
const MainLayout = () => (
  <div className="min-h-screen">
    <Navigation />
    <div className="h-16" /> {/* Spacer to prevent content from being hidden behind fixed navbar */}
    <Outlet />
  </div>
);

// ✅ Layout without Navigation
const AuthLayout = () => (
  <div className="min-h-screen">
    <Outlet />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TavusProvider>
          <Routes>
            {/* Routes with navbar */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            {/* Routes without navbar */}
            <Route element={<AuthLayout />}>
            <Route path="/session" element={<Session />} />
            <Route path="/community" element={<Community />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/resources" element={<Resources />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/student" element={<StudentLogin />} />
              <Route path="/login/counsellor" element={<CounsellorLogin />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/counsellor" element={<CounsellorSignup />} />
              <Route path="/signup/student" element={<StudentSignup />} />
              <Route path="/role" element={<Roll />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/sessions" element={<CounsellorBookings />} />
              <Route path="/student/sessions" element={<StudentSessions />} />
            </Route>
          </Routes>
          <ChatWidget />
          <EmergencyWidget />
        </TavusProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
