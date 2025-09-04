import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Brain, Heart, Shield } from 'lucide-react';

const Roll = () => {
  const navigate = useNavigate();
  
  // Feature items for the left side
  const features = [
    {
      icon: <Brain className="w-6 h-6 text-zeo-primary" />,
      title: "Personalized Support",
      description: "Get matched with the right mental health professional for your needs"
    },
    {
      icon: <Heart className="w-6 h-6 text-zeo-secondary" />,
      title: "Safe Space",
      description: "A judgment-free environment to share and grow"
    },
    {
      icon: <Shield className="w-6 h-6 text-zeo-accent" />,
      title: "Confidential",
      description: "Your privacy and security are our top priority"
    }
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zeo-primary to-[#1a1e23] p-2 md:p-4 overflow-hidden">
      {/* Background gradient - Green and dark for brand vibe */}
      <div className="fixed inset-0 bg-gradient-to-br from-zeo-primary via-[#2e4d2c] to-[#1a1e23]" />
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden opacity-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] rounded-full bg-zeo-primary/40 blur-3xl shadow-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] rounded-full bg-zeo-secondary/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-green-400/10 blur-2xl -translate-x-1/2 -translate-y-1/2" />
      </div>

  <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col lg:flex-row bg-gradient-to-br from-white/40 via-green-100/60 to-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-green-200/30 shadow-xl h-[70vh] max-h-[600px]">
        {/* Left side - Branding and Features */}
  <div className="lg:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-green-900/80 to-[#1a1e23]/80 relative overflow-hidden">
          {/* Back button */}
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-20 flex items-center text-green-100 hover:text-white transition-colors text-base font-semibold drop-shadow"
            style={{backdropFilter:'blur(8px)'}}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <div className="mt-4">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <img 
                src="/logo.png" 
                alt="zeo.ai" 
                className="h-8 w-auto drop-shadow"
              />
            </div>
            <h1 className="text-xl md:text-xl font-bold text-green-100 text-center lg:text-left mb-1 drop-shadow">
              Join our community
            </h1>
            <p className="text-white/40 text-center lg:text-left mb-3 max-w-md mx-auto lg:mx-0 text-base leading-relaxed font-normal drop-shadow-sm text-sm">
              Take the first step towards better mental health 
            </p>
            <div className="space-y-4 max-w-md mx-auto lg:mx-0">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-xl bg-white/50 backdrop-blur-md hover:bg-green-100/60 border border-green-800/90 shadow transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="bg-green-800/40 p-2 rounded-md shadow">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 text-base drop-shadow-sm">{feature.title}</h3>
                    <p className="text-green-900/80 mt-0.5 text-sm font-normal drop-shadow-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-center lg:text-left text-base text-green-100/70 mt-6">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-green-600 font-bold hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
        
        {/* Right side - Role Selection */}
  <div className="lg:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-green-100/60 to-white/40 backdrop-blur-xl overflow-y-auto custom-scrollbar border-l border-green-200/30">
          <div className="max-w-md mx-auto w-full">
            <motion.div 
              className="text-center mb-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-green-900 mb-2 drop-shadow-sm">welcome to <span className="text-green-900">zeo.ai</span></h2>
              <p className="text-green-900/80 text-base font-normal">Select your role to get started</p>
            </motion.div>
            
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link to="/login/student" className="block">
                  <Button
                    className="w-full h-11 text-base font-semibold bg-zeo-primary hover:bg-green-700 text-white rounded-xl transition-all duration-200 shadow border border-green-300/30"
                  >
                    I'm a Student
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/login/counsellor" className="block">
                  <Button
                    className="w-full h-11 text-base font-semibold bg-zeo-primary hover:bg-green-700 text-white rounded-xl transition-all duration-200 shadow border border-green-200/30"
                  >
                    I'm a Counsellor
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
               
              </motion.div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-green-900/70 font-normal">
                By continuing, you agree to our{' '}
                <a href="#" className="text-green-700 font-bold hover:underline">Terms</a>{' '}
                and{' '}
                <a href="#" className="text-green-700 font-bold hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle animation for background */}
      <AnimatePresence>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="fixed rounded-full bg-white/5"
            style={{
              width: Math.random() * 400 + 100 + 'px',
              height: Math.random() * 400 + 100 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 20],
              x: [0, (Math.random() - 0.5) * 20],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Roll;