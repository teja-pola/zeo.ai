import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, User, Lock, School } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the backend API to authenticate the student
      const response = await fetch('http://localhost:3001/api/login/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage for session management
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userType', data.userType);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zeo-primary to-[#1a1e23] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white shadow-lg rounded-2xl overflow-hidden border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-[#345E2C] p-3 rounded-full">
                <School className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-[#345E2C]">
              Login as a Student
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your student account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">University Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="university@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-[#345E2C]/30 focus:border-[#345E2C] focus:ring-[#345E2C]"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <button
                    type="button"
                    className="text-sm text-[#345E2C] hover:underline focus:outline-none"
                    onClick={() => alert('Password reset functionality would be implemented here')}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-[#345E2C]/30 focus:border-[#345E2C] focus:ring-[#345E2C]"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#345E2C] hover:bg-[#2a4a24] text-white py-6 rounded-full text-lg font-medium transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col pt-4">
            <div className="relative w-full mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/signup/student" 
                className="text-[#345E2C] font-medium hover:underline focus:outline-none"
              >
                Sign up
              </Link>
            </div>
            
            <div className="mt-2 text-center text-sm text-gray-600">
              Are you a counsellor?{' '}
              <Link 
                to="/login/counsellor" 
                className="text-[#345E2C] font-medium hover:underline focus:outline-none"
              >
                Login as Counsellor
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2025 ZEO AI. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
}