import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zeo-surface via-background to-zeo-surface">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold gradient-text">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to where you need to be.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="hero" className="group">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          
          <Button 
            variant="glass" 
            onClick={() => window.history.back()}
            className="group"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
