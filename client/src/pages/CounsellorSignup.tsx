import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const CounsellorSignup = () => {
  const navigate = useNavigate();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [languages, setLanguages] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [availability, setAvailability] = useState("");
  const [documents, setDocuments] = useState<FileList | null>(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        description: "You must agree to the privacy policy and code of ethics",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = {
        fullName,
        email,
        password,
        phone,
        gender,
        dateOfBirth,
        professionalTitle,
        qualifications,
        yearsOfExperience: parseInt(yearsOfExperience),
        specializations,
        languages,
        affiliation,
        availability,
        consent,
      };

      const response = await fetch("http://localhost:3001/api/signup/counsellor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userType", "counsellor");
        localStorage.setItem("token", data.token);

        toast({
          title: "Success",
          description: "Counsellor account created successfully!",
        });
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
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-zeo-primary to-[#1a1e23]">
      {/* Glass morphism card */}
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[90vh] flex flex-col z-10 backdrop-blur-xl shadow-2xl border border-white/20 relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-zeo-primary-glow/30 blur-xl hidden sm:block"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-zeo-secondary-glow/30 blur-xl hidden sm:block"></div>

        {/* Header */}
        <div className="p-6 sm:p-8 shrink-0">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Counsellor Registration</h1>
            <p className="text-foreground/80 text-sm sm:text-base">Join our platform to help students</p>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pb-32">
            {/* === Personal Information === */}
            <div className="border-b border-zeo-primary/20 pb-4">
              <h2 className="text-lg font-semibold mb-4 text-zeo-primary">Personal Information</h2>
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="glass border-0 focus:ring-2 focus:ring-zeo-primary/50"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              {/* Email */}
              <div className="space-y-2 mt-4">
                <Label htmlFor="email" className="text-foreground">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass border-0 focus:ring-2 focus:ring-zeo-primary/50"
                  placeholder="Enter your email"
                  required
                />
              </div>
              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              </div>
              {/* Phone */}
              <div className="space-y-2 mt-4">
                <Label htmlFor="phone">Phone Number / Contact Info</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              {/* Gender & DOB */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Gender (optional)</Label>
                  <Select onValueChange={setGender} value={gender}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start glass">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dateOfBirth} onSelect={setDateOfBirth} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* === Professional Information === */}
            <div className="border-b border-zeo-primary/20 pb-4">
              <h2 className="text-lg font-semibold mb-4 text-zeo-primary">Professional Information</h2>
              <div className="space-y-2">
                <Label htmlFor="professionalTitle">Professional Title / Role *</Label>
                <Select onValueChange={setProfessionalTitle} value={professionalTitle}>
                  <SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="psychologist">Psychologist</SelectItem>
                    <SelectItem value="counselor">Counselor</SelectItem>
                    <SelectItem value="psychiatrist">Psychiatrist</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="qualifications">Qualifications *</Label>
                <Textarea id="qualifications" value={qualifications} onChange={(e) => setQualifications(e.target.value)} required />
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                <Input id="yearsOfExperience" type="number" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} required />
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="specializations">Specialization Areas *</Label>
                <Textarea id="specializations" value={specializations} onChange={(e) => setSpecializations(e.target.value)} required />
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="languages">Languages Spoken *</Label>
                <Input id="languages" type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} required />
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="affiliation">Affiliation / Institution</Label>
                <Input id="affiliation" type="text" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} />
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="availability">Availability Schedule</Label>
                <Textarea id="availability" value={availability} onChange={(e) => setAvailability(e.target.value)} />
              </div>
            </div>

            {/* === Documents and Consent === */}
            <div className="border-b border-zeo-primary/20 pb-4">
              <h2 className="text-lg font-semibold mb-4 text-zeo-primary">Documents and Consent</h2>
              <div className="space-y-2">
                <Label htmlFor="documents">Verification Documents Upload</Label>
                <Input id="documents" type="file" onChange={(e) => setDocuments(e.target.files)} multiple />
                <p className="text-xs text-foreground/60">Upload degree, license, and ID documents</p>
              </div>
              <div className="flex items-start mt-4 space-x-2">
                <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(checked as boolean)} className="mt-1" />
                <Label htmlFor="consent" className="text-foreground text-sm">
                  I agree to the privacy policy and code of ethics *
                </Label>
              </div>
            </div>
          </form>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="p-6 sm:p-8 border-t border-white/20 bg-white/70 backdrop-blur-md sticky bottom-0 rounded-b-3xl">
          <Button
            type="submit"
            form="counsellor-form"
            className="w-full glass bg-zeo-primary hover:bg-zeo-primary/80"
            disabled={!consent || loading}
          >
            {loading ? "Creating Account..." : "Create Counsellor Account"}
          </Button>
          <div className="mt-4 text-center">
            <p className="text-xs sm:text-sm text-foreground/80">
              Already have an account?{" "}
              <Link to="/login/counsellor" className="text-zeo-primary font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorSignup;
