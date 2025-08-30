import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTavus } from '@/contexts/TavusContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MessageSquare, Play, AlertCircle, Sparkles, Heart, Shield, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: Heart,
    title: "Emotional Intelligence",
    description: "Our AI understands and responds to your emotions in real-time."
  },
  {
    icon: Users,
    title: "Peer Support",
    description: "Connect with others who understand what you're going through."
  },
  {
    icon: BookOpen,
    title: "Resources",
    description: "Access a library of mental health resources and exercises."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your conversations are always private and secure."
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const { replica, loading, error, createConversation } = useTavus();

  const handleStartSession = async () => {
    try {
      const { conversation_url } = await createConversation();
      navigate(`/session?url=${encodeURIComponent(conversation_url)}`);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zeo-surface to-background overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-zeo-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-zeo-secondary/5 rounded-full blur-3xl" />
        
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-zeo-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative flex flex-col items-center">
        {/* Hero Texts */}
        <motion.div 
          className="w-full max-w-3xl mx-auto text-center space-y-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div 
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-zeo-primary/10 border border-zeo-primary/20 mx-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Sparkles className="w-4 h-4 text-zeo-primary" />
            <span className="text-sm font-medium text-zeo-primary">
              AI-Powered Mental Health Companion
            </span>
          </motion.div>

          <motion.h1 
            className="text-4xl lg:text-6xl font-extrabold leading-tight"
            variants={fadeInUp}
          >
            Meet <span className="text-zeo-primary">zeo.ai</span>
            <br />
            Your  <span className="text-zeo-primary">24/7 AI </span>Companion
          </motion.h1>

         
        </motion.div>

        {/* Centered Video with floating feature cards */}
        <div className="relative flex flex-col justify-center items-center w-full mt-9 mb-5">
          {/* Floating feature cards */}
          <motion.div className="hidden md:block absolute -top-10 -left-10 z-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <div className="p-4 rounded-2xl glass-strong shadow-lg w-56">
              <Heart className="w-6 h-6 text-pink-500 mb-2" />
              <div className="font-semibold mb-1">Emotional Intelligence</div>
              <div className="text-xs text-muted-foreground">Understands and responds to your emotions in real-time.</div>
            </div>
          </motion.div>
          <motion.div className="hidden md:block absolute -top-10 -right-10 z-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="p-4 rounded-2xl glass-strong shadow-lg w-56">
              <Shield className="w-6 h-6 text-blue-500 mb-2" />
              <div className="font-semibold mb-1">Privacy First</div>
              <div className="text-xs text-muted-foreground">Your conversations are always private and secure.</div>
            </div>
          </motion.div>
          <motion.div className="hidden md:block absolute -bottom-10 -left-10 z-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <div className="p-4 rounded-2xl glass-strong shadow-lg w-56">
              <Users className="w-6 h-6 text-green-500 mb-2" />
              <div className="font-semibold mb-1">Peer Support</div>
              <div className="text-xs text-muted-foreground">Connect with others who understand you.</div>
            </div>
          </motion.div>
          <motion.div className="hidden md:block absolute -bottom-10 -right-10 z-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="p-4 rounded-2xl glass-strong shadow-lg w-56">
              <BookOpen className="w-6 h-6 text-yellow-500 mb-2" />
              <div className="font-semibold mb-1">Resources</div>
              <div className="text-xs text-muted-foreground">Access a library of mental health resources.</div>
            </div>
          </motion.div>
          {/* Centered Video */}
          <motion.div 
            className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20  w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ minHeight: 250 }}
          >
            {replica?.thumbnail_video_url ? (
              <video
                src={replica.thumbnail_video_url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover"
                style={{ maxHeight: 480 }}
              />
            ) : (
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <span className="text-white">AI Companion</span>
              </div>
            )}
          </motion.div>
          <motion.div 
            className="w-full max-w-3xl mx-auto text-center space-y-6 mt-8"
            variants={fadeInUp}
          >
          <motion.p 
            className="text-xl text-muted-foreground leading-relaxed"
            variants={fadeInUp}
          >
            Experience personalized mental health support through real-time emotion recognition 
            and empathetic AI conversations with a lifelike 3D avatar companion.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4  justify-center"
            variants={fadeInUp}
          >
            <Button 
              onClick={handleStartSession}
              className="bg-zeo-primary hover:bg-zeo-primary/90 text-white px-8 py-6 text-base font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 group"
            >
              <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Start Session
            </Button>
            <Button
              variant="outline"
              className="border-zeo-primary text-zeo-primary hover:bg-zeo-primary/10 px-8 py-6 text-base font-medium rounded-xl transition-all duration-300 group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div 
          className="mt-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Your Mental Health, Our Priority
            </h2>
            <p className="text-muted-foreground text-lg">
              Experience the future of mental health support with our AI-powered companion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="group p-6 rounded-xl bg-white/5 border border-white/5 hover:border-zeo-primary/20 transition-all duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-zeo-primary to-zeo-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-32 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} ZEO AI. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
