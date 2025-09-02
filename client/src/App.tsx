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
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import CounsellorSignup from "./pages/CounsellorSignup";
import StudentSignup from "./pages/StudentSignup";
import Roll from "./pages/Roll";

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
              <Route path="/session" element={<Session />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* Routes without navbar */}
            <Route element={<AuthLayout />}>
              <Route path="/booking" element={<Booking />} />
            </Route>

            {/* Routes without navbar */}
            <Route element={<AuthLayout />}>
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/counsellor" element={<CounsellorSignup />} />
              <Route path="/signup/student" element={<StudentSignup />} />
              <Route path="/roll" element={<Roll />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TavusProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
