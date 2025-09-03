import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const StudentSignup = () => {
  const navigate = useNavigate();
  
  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (!consent) {
      toast({
        title: "Error",
        description: "You must agree to the privacy policy and terms of service",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for submission
      const formData = {
        fullName,
        email,
        password,
        phone,
        gender,
        dateOfBirth,
        university,
        department,
        yearOfStudy,
        preferredLanguage,
        consent
      };
      
      // Send data to backend
      const response = await fetch('http://localhost:3001/api/signup/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store user data in localStorage for dashboard access
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userType', 'student');
        localStorage.setItem('token', data.token);
        
        toast({
          title: "Success",
          description: "Student account created successfully!",
        });
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        title: "Error",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 hidden sm:block">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-zeo-primary-glow/20"
            style={{
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Glass morphism card */}
      <div className="glass-strong glow-soft rounded-3xl p-6 sm:p-8 w-full max-w-2xl z-10 backdrop-blur-xl shadow-2xl border border-white/20 relative my-4 sm:my-0">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-zeo-primary-glow/30 blur-xl hidden sm:block"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-zeo-secondary-glow/30 blur-xl hidden sm:block"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Student Registration</h1>
            <p className="text-foreground/80 text-sm sm:text-base">Join our platform to get support</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Personal Information Section */}
            <div className="border-b border-zeo-primary/20 pb-4">
              <h2 className="text-lg font-semibold mb-4 text-zeo-primary">Personal Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="glass border-0 focus:ring-2 focus:ring-zeo-primary/50 focus:ring-offset-0 focus:ring-offset-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="email" className="text-foreground">Email Address (University Email Preferred) *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass border-0 focus:ring-2 focus:ring-zeo-primary/50 focus:ring-offset-0 focus:ring-offset-transparent"
                  placeholder="Enter your university email"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass border-0 focus:ring-2 focus:ring-zeo-primary/50 focus:ring-offset-0 focus:ring-offset-transparent"
                    placeholder="Create a password"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass border-0 focus:ring-2 focus:ring-zeo-primary/50 focus:ring-offset-0 focus:ring-offset-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="phone" className="text-foreground">Phone Number (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="glass border-0 focus:ring-2 focus:ring-zeo-primary/50 focus:ring-offset-0 focus:ring-offset-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-foreground">Gender (optional)</Label>
                  <Select onValueChange={setGender} value={gender}>
                    <SelectTrigger className="glass border-0 focus:ring-2 focus:ring-zeo-primary/50">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-foreground">Date of Birth / Age</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal glass border-0",
                          !dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateOfBirth}
                        onSelect={setDateOfBirth}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            {/* Academic Information Section */}
            <div className="border-b border-zeo-primary/20 pb-4">
              <h2 className="text-lg font-semibold mb-4 text-zeo-primary">Academic Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="university" className="text-foreground">University / College Name *</Label>
                <Input
                  id="university"
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="glass border-0 focus:ring-2 focus:ring-zeo-primary/50 focus:ring-offset-0 focus:ring-offset-transparent"
                  placeholder="Enter your university/college name"
                  required
                />
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="department" className="text-foreground">Department / Faculty *</Label>
                <Input
                  id="department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="glass border-0 focus:ring-2 focus:ring-zeo-primary/50 focus:ring-offset-0 focus:ring-offset-transparent"
                  placeholder="Enter your department/faculty"
                  required
                />
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="yearOfStudy" className="text-foreground">Year of Study *</Label>
                <Select onValueChange={setYearOfStudy} value={yearOfStudy}>
                  <SelectTrigger className="glass border-0 focus:ring-2 focus:ring-zeo-primary/50">
                    <SelectValue placeholder="Select your year of study" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st-year">1st Year</SelectItem>
                    <SelectItem value="2nd-year">2nd Year</SelectItem>
                    <SelectItem value="3rd-year">3rd Year</SelectItem>
                    <SelectItem value="4th-year">4th Year</SelectItem>
                    <SelectItem value="final-year">Final Year</SelectItem>
                    <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="preferredLanguage" className="text-foreground">Preferred Language *</Label>
                <Select onValueChange={setPreferredLanguage} value={preferredLanguage}>
                  <SelectTrigger className="glass border-0 focus:ring-2 focus:ring-zeo-primary/50">
                    <SelectValue placeholder="Select your preferred language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Consent Section */}
            <div className="border-b border-zeo-primary/20 pb-4">
              <h2 className="text-lg font-semibold mb-4 text-zeo-primary">Consent</h2>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="consent" className="text-foreground text-sm">
                  I agree to the privacy policy and terms of service *
                </Label>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full glass bg-zeo-primary hover:bg-zeo-primary/80 text-zeo-primary-foreground border-0 transition-all duration-300 hover:scale-[1.02] hover:glow"
              disabled={!consent || loading}
            >
              {loading ? "Creating Account..." : "Create Student Account"}
            </Button>
          </form>
          
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-foreground/80">
              Already have an account?{" "}
              <Link 
                to="/login/student" 
                className="text-zeo-primary font-medium hover:underline transition-all duration-300 hover:text-zeo-primary/80"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;