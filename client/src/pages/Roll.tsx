import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Roll = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-zeo-primary/10 via-zeo-secondary/5 to-zeo-neutral/10">
      {/* Floating particles effect */}
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
      <div className="glass-strong glow-soft rounded-3xl p-6 sm:p-8 w-full max-w-md z-10 backdrop-blur-xl shadow-2xl border border-white/20 relative my-4 sm:my-0">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-zeo-primary-glow/30 blur-xl hidden sm:block"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-zeo-secondary-glow/30 blur-xl hidden sm:block"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Welcome to ZEO</h1>
            <p className="text-foreground/80 text-sm sm:text-base">Please select your role to continue</p>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <Link to="/signup/counsellor" className="block">
              <Button
                className="w-full glass bg-zeo-primary hover:bg-zeo-primary/80 text-zeo-primary-foreground border-0 transition-all duration-300 hover:scale-[1.02] hover:glow h-16 text-lg"
              >
                I'm a Counsellor
              </Button>
            </Link>
            
            <Link to="/signup/student" className="block">
              <Button
                className="w-full glass bg-zeo-secondary hover:bg-zeo-secondary/80 text-zeo-secondary-foreground border-0 transition-all duration-300 hover:scale-[1.02] hover:glow h-16 text-lg"
              >
                I'm a Student
              </Button>
            </Link>
          </div>
          
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-foreground/80">
              Already have an account?{" "}
              <Link 
                to="/" 
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

export default Roll;