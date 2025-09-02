import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTavus } from '@/contexts/TavusContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MessageSquare, Play, AlertCircle, Sparkles, Heart, Shield, Users, BookOpen, Star, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const features = [
  { icon: Heart, title: "Emotional Intelligence", description: "Our AI understands and responds to your emotions in real-time." },
  { icon: Users, title: "Peer Support", description: "Connect with others who understand what you're going through." },
  { icon: BookOpen, title: "Resources", description: "Access a library of mental health resources and exercises." },
  { icon: Shield, title: "Privacy First", description: "Your conversations are always private and secure." }
];

const coreFeatures = [
  { title: "Real-time Emotion Recognition", description: "Our AI understands your emotions as you interact." },
  { title: "3D Lifelike Avatar", description: "Experience engaging conversations with a realistic avatar." },
  { title: "Personalized Recommendations", description: "Receive advice and resources tailored to your mental state." },
  { title: "24/7 Availability", description: "Access support anytime, anywhere." }
];

const testimonials = [
  { name: "Riya Sharma", feedback: "Zeo.ai helped me understand my emotions better. The AI feels truly empathetic.", avatar: "https://randomuser.me/api/portraits/women/68.jpg", rating: 5 },
  { name: "Ankit Verma", feedback: "Connecting with peers and AI support in one platform is amazing!", avatar: "https://randomuser.me/api/portraits/men/45.jpg", rating: 4 },
  { name: "Neha Singh", feedback: "I love the personalized mental health recommendations. Very helpful.", avatar: "https://randomuser.me/api/portraits/women/56.jpg", rating: 5 },
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size={48} /></div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zeo-surface to-background overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-zeo-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-zeo-secondary/5 rounded-full blur-3xl" />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-zeo-primary/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative flex flex-col items-center">
        <motion.div className="w-full max-w-3xl mx-auto text-center space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-zeo-primary/10 border border-zeo-primary/20 mx-auto" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Sparkles className="w-4 h-4 text-zeo-primary" />
            <span className="text-sm font-medium text-zeo-primary">AI-Powered Mental Health Companion</span>
          </motion.div>
          <motion.h1 className="text-4xl lg:text-6xl font-extrabold leading-tight" variants={fadeInUp}>
            Meet <span className="text-zeo-primary">zeo.ai</span><br />Your <span className="text-zeo-primary">24/7 AI</span> Companion
          </motion.h1>
        </motion.div>

        {/* Centered Video + Floating Cards */}
        <div className="relative flex flex-col justify-center items-center w-full mt-9 mb-5">
          {/* Floating Cards */}
          {/* Keep your original floating cards UI exactly */}
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
          <motion.div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ minHeight: 250 }}>
            {replica?.thumbnail_video_url ? (
              <video src={replica.thumbnail_video_url} autoPlay loop muted playsInline className="w-full h-auto object-cover" style={{ maxHeight: 480 }} />
            ) : (
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <span className="text-white">AI Companion</span>
              </div>
            )}
          </motion.div>

          <motion.div className="w-full max-w-3xl mx-auto text-center space-y-6 mt-8" variants={fadeInUp}>
            <motion.p className="text-xl text-muted-foreground leading-relaxed" variants={fadeInUp}>
              Experience personalized mental health support through real-time emotion recognition and empathetic AI conversations with a lifelike 3D avatar companion.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={fadeInUp}>
              <Button onClick={handleStartSession} className="bg-zeo-primary hover:bg-zeo-primary/90 text-white px-8 py-6 text-base font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 group">
                <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Start Session
              </Button>
              <Button variant="outline" className="border-zeo-primary text-zeo-primary hover:bg-zeo-primary/10 px-8 py-6 text-base font-medium rounded-xl transition-all duration-300 group">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div className="mt-32" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Your Mental Health, Our Priority</h2>
            <p className="text-muted-foreground text-lg">Experience the future of mental health support with our AI-powered companion</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} className="group p-6 rounded-xl bg-white/5 border border-white/5 hover:border-zeo-primary/20 transition-all duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }}>
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

        {/* Core Features Section */}
        <motion.div className="mt-32" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreFeatures.map((feature, index) => (
              <motion.div key={feature.title} className="p-6 rounded-xl bg-white/5 border border-white/5 hover:border-zeo-primary/20 transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }}>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-zeo-primary to-zeo-secondary flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div className="mt-32 px-4 max-w-6xl mx-auto" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-8">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <motion.div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/5 shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1, duration: 0.5 }} whileHover={{ scale: 1.03 }}>
                <div className="flex items-center mb-4">
                  <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h4 className="font-semibold">{test.name}</h4>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < test.rating ? "text-yellow-400" : "text-gray-400"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{test.feedback}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ============ NEW SECTIONS START HERE ============ */}

       {/* Pricing Section (Bigger Cards) */}
<motion.div className="mt-32 px-4 max-w-6xl mx-auto  rounded-3xl p-12"
  initial={{ opacity: 0, y: 50 }} 
  whileInView={{ opacity: 1, y: 0 }} 
  viewport={{ once: true }} 
  transition={{ duration: 0.6 }}
>
  <div className="text-center max-w-3xl mx-auto mb-16">
    <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-Black">Pricing Plans</h2>
    <p className="text-black text-lg">Flexible plans for individuals and teams</p>
  </div>
  
  <div className="grid md:grid-cols-3 gap-8">
    {[
      { title: "Basic", price: "$0/mo", features: ["AI Chat Access", "Emotion Recognition", "Limited Resources"] },
      { title: "Pro", price: "$19/mo", features: ["All Basic Features", "Unlimited Resources", "Priority Support"] },
      { title: "Enterprise", price: "$49/mo", features: ["All Pro Features", "Team Management", "Custom Integrations"] },
    ].map((plan, idx) => (
      <motion.div key={idx} 
        className="p-10 rounded-3xl bg-[#2F4F28] border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ delay: idx * 0.1, duration: 0.5 }}
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-400">{plan.title}</h3>
        <p className="text-3xl md:text-4xl font-extrabold mb-8 text-white">{plan.price}</p>
        
        <ul className="mb-8 space-y-4 text-base text-white/90">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center gap-3">
              <Check className="w-6 h-6 text-yellow-300" /> {f}
            </li>
          ))}
        </ul>

        <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-[#345E2C] py-4 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all">
          Choose Plan
        </Button>
      </motion.div>
    ))}
  </div>
</motion.div>


       {/* FAQ Section (Improved Questions) */}
<motion.div className="mt-32 px-4 max-w-4xl mx-auto" 
  initial={{ opacity: 0, y: 50 }} 
  whileInView={{ opacity: 1, y: 0 }} 
  viewport={{ once: true }} 
  transition={{ duration: 0.6 }}
>
  <div className="text-center max-w-3xl mx-auto mb-16">
    <h2 className="text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
    <p className="text-muted-foreground text-lg">Answers to common questions about Zeo.ai</p>
  </div>
  {[
    { 
      q: "What makes Zeo.ai different from other mental health apps?", 
      a: "Zeo.ai uses real-time emotion recognition and a lifelike 3D AI avatar to provide personalized guidance, unlike traditional apps that rely on static surveys." 
    },
    { 
      q: "Can I access my conversations across devices?", 
      a: "Yes, all your sessions and progress sync seamlessly across mobile and desktop so you can pick up anytime, anywhere." 
    },
    { 
      q: "How does Zeo.ai protect my personal data?", 
      a: "All conversations are fully encrypted, and we never share your personal information with third parties. Privacy is our top priority." 
    },
    { 
      q: "Is there a limit on how many sessions I can have?", 
      a: "Basic users have access to a limited number of sessions, while Pro and Enterprise users enjoy unlimited AI interactions and peer support." 
    },
    { 
      q: "How quickly can I expect personalized recommendations?", 
      a: "Zeo.ai provides real-time suggestions based on your current mood and emotional state during every interaction." 
    },
    { 
      q: "Can teams or organizations use Zeo.ai for wellness programs?", 
      a: "Yes, our Enterprise plan supports team management, organizational analytics, and customized AI integration for group wellness programs." 
    },
  ].map((item, idx) => (
    <motion.div key={idx} className="mb-4 p-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
      <details className="group">
        <summary className="flex justify-between items-center font-semibold text-base">
          {item.q}
          <span className="transition-transform group-open:rotate-180">▼</span>
        </summary>
        <p className="mt-2 text-base text-muted-foreground">{item.a}</p>
      </details>
    </motion.div>
  ))}
</motion.div>


        

      </div>

     {/* Footer */}
<footer className="bg-[#345E2C]/95 text-white py-12">
  <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between gap-8">

    {/* Company Info */}
    <div className="md:w-1/3 space-y-2">
      <h3 className="text-lg font-bold">ZEO AI</h3>
      <p className="text-sm text-gray-300 leading-snug">
        AI-powered mental health companion providing emotional support, resources, and peer connections anytime, anywhere.
      </p>
      <div className="flex space-x-3 mt-1">
        {/* Social Icons */}
        <a href="#" className="text-gray-300 hover:text-zeo-primary transition-colors">
          {/* LinkedIn Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0zM7.08 20.45H3.54v-9.01h3.54v9.01zm-1.77-10.33c-1.13 0-2.04-.92-2.04-2.05a2.05 2.05 0 1 1 4.09 0c0 1.13-.91 2.05-2.05 2.05zm14.52 10.33h-3.53v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.84 1.25-1.84 2.55v4.91h-3.53v-9h3.39v1.23h.05c.47-.88 1.61-1.8 3.31-1.8 3.54 0 4.19 2.33 4.19 5.36v4.21z"/></svg>
        </a>
        <a href="#" className="text-gray-300 hover:text-zeo-primary transition-colors">
          {/* Twitter Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.56a9.83 9.83 0 0 1-2.83.78 4.93 4.93 0 0 0 2.17-2.72 9.86 9.86 0 0 1-3.12 1.19 4.92 4.92 0 0 0-8.38 4.48A13.94 13.94 0 0 1 1.64 3.16a4.92 4.92 0 0 0 1.52 6.57A4.9 4.9 0 0 1 .96 9v.06a4.93 4.93 0 0 0 3.95 4.83 4.93 4.93 0 0 1-2.22.08 4.93 4.93 0 0 0 4.6 3.42 9.87 9.87 0 0 1-6.1 2.1c-.39 0-.77-.02-1.15-.07a13.94 13.94 0 0 0 7.55 2.21c9.05 0 14-7.5 14-14 0-.21-.01-.42-.02-.63A9.93 9.93 0 0 0 24 4.56z"/></svg>
        </a>
        <a href="#" className="text-gray-300 hover:text-zeo-primary transition-colors">
          {/* GitHub Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 2.87 8.15 6.84 9.49.5.09.68-.22.68-.48v-1.72c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.39.2 2.42.1 2.67.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .26.18.57.69.48a10 10 0 0 0 6.85-9.48c0-5.5-4.46-9.96-9.96-9.96z"/></svg>
        </a>
      </div>
    </div>

    {/* Quick Links */}
    <div className="md:w-2/2 space-y-2">
      <h4 className="text-base font-semibold">Quick Links</h4>
      <ul className="space-y-1 text-sm text-gray-300">
        <li><a href="#" className="hover:text-zeo-primary transition-colors">About Us</a></li>
        <li><a href="#" className="hover:text-zeo-primary transition-colors">Features</a></li>
        <li><a href="#" className="hover:text-zeo-primary transition-colors">Pricing</a></li>
        <li><a href="#" className="hover:text-zeo-primary transition-colors">Blog</a></li>
        <li><a href="#" className="hover:text-zeo-primary transition-colors">Contact</a></li>
      </ul>
    </div>

    {/* Newsletter */}
    <div className="md:w-1/3 space-y-2">
      <h4 className="text-base font-semibold">Newsletter</h4>
      <p className="text-sm text-gray-300">Subscribe for updates & mental health tips.</p>
      <form className="flex gap-2 mt-1">
        <input 
          type="email" 
          placeholder="Your email" 
          className="flex-1 px-3 py-2 rounded-md border border-gray-600 bg-white text-black text-sm placeholder-gray-400 focus:outline-none focus:border-zeo-primary"
        />
        <Button className="bg-white px-4 py-2 text-sm rounded-md hover:bg-zeo-primary/90">Subscribe</Button>
      </form>
    </div>

  </div>

  {/* Footer Bottom */}
  <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-xs">
    © {new Date().getFullYear()} ZEO AI. All rights reserved.  
    <span className="mx-1">|</span>
    <a href="#" className="hover:text-zeo-primary transition-colors">Privacy</a>
    <span className="mx-1">|</span>
    <a href="#" className="hover:text-zeo-primary transition-colors">Terms</a>
    <span className="mx-1">|</span>
    <a href="#" className="hover:text-zeo-primary transition-colors">Contact</a>
  </div>
</footer>



    </div>
  );
}
