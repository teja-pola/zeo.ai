import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  BookOpen,
  Video,
  Lightbulb,
  HelpCircle,
  ChevronRight,
  Heart,
  MessageCircle,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ResourceTab = "articles" | "guides" | "videos" | "tools" | "faq";

type Resource = {
  title: string;
  description: string;
  author?: string;
  avatar?: string;
  date?: string;
  readingTime?: string;
  steps?: string[];
  difficulty?: string;
  category?: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  link?: string;
  thumbnail?: string;
  duration?: string;
};

const translations: Record<string, Record<ResourceTab, Resource[]>> = {
  en: {
    articles: [
      {
        title: "Mindfulness Basics",
        description:
          "Learn the fundamentals of mindfulness, how to focus on the present, and practical exercises to reduce anxiety.",
        author: "Priya Sharma",
        avatar: "https://i.pravatar.cc/40?img=47",
        date: "Aug 20, 2025",
        readingTime: "5 min read",
        tags: ["Mindfulness", "Focus", "Anxiety"],
        likes: 120,
        comments: 15,
        link: "#",
      },
      {
        title: "Coping with Stress",
        description:
          "Techniques to manage stress effectively, including breathing exercises, journaling, and daily routines.",
        author: "Rahul Verma",
        avatar: "https://i.pravatar.cc/40?img=48",
        date: "Jul 15, 2025",
        readingTime: "7 min read",
        tags: ["Stress", "Wellness", "Self-care"],
        likes: 98,
        comments: 12,
        link: "#",
      },
      {
        title: "Improving Sleep Quality",
        description:
          "Learn habits and strategies to improve your sleep, including sleep hygiene, meditation, and environment optimization.",
        author: "Ananya Iyer",
        avatar: "https://i.pravatar.cc/40?img=49",
        date: "Sep 01, 2025",
        readingTime: "6 min read",
        tags: ["Sleep", "Health", "Routine"],
        likes: 210,
        comments: 25,
        link: "#",
      },
      {
        title: "Building Emotional Resilience",
        description:
          "Practical ways to strengthen your emotional resilience and handle life's challenges with confidence.",
        author: "Amitabh Singh",
        avatar: "https://i.pravatar.cc/40?img=50",
        date: "Aug 28, 2025",
        readingTime: "8 min read",
        tags: ["Resilience", "Mindset", "Growth"],
        likes: 150,
        comments: 20,
        link: "#",
      },
    ],
    guides: [
      {
        title: "Getting Started with ZEO",
        description:
          "Complete onboarding guide to set up ZEO AI for personal mental wellness.",
        author: "Sneha Reddy",
        avatar: "https://i.pravatar.cc/40?img=51",
        date: "Sep 05, 2025",
        readingTime: "10 min read",
        steps: [
          "Sign up and create your account",
          "Set your personal preferences",
          "Explore the AI chat features",
          "Start daily wellness tracking",
        ],
        difficulty: "Easy",
        category: "Onboarding",
        tags: ["Beginner", "Setup", "AI"],
        likes: 85,
        comments: 10,
        link: "#",
      },
      {
        title: "Daily Wellness Routine",
        description:
          "Step-by-step guide to structure your day for optimal mental health.",
        author: "Vikram Patel",
        avatar: "https://i.pravatar.cc/40?img=52",
        date: "Aug 30, 2025",
        readingTime: "12 min read",
        steps: [
          "Morning mindfulness meditation",
          "Daily mood logging",
          "Exercise and nutrition tips",
          "Evening reflection and journaling",
        ],
        difficulty: "Medium",
        category: "Routine",
        tags: ["Wellness", "Routine", "Mindfulness"],
        likes: 95,
        comments: 14,
        link: "#",
      },
      {
        title: "Managing Anxiety Effectively",
        description:
          "Guided steps to identify triggers and implement coping strategies for anxiety.",
        author: "Meera Nair",
        avatar: "https://i.pravatar.cc/40?img=53",
        date: "Sep 02, 2025",
        readingTime: "15 min read",
        steps: [
          "Identify anxiety triggers",
          "Practice breathing exercises",
          "Engage in daily journaling",
          "Use AI prompts for guided relief",
        ],
        difficulty: "Medium",
        category: "Anxiety",
        tags: ["Anxiety", "Coping", "AI Assistance"],
        likes: 112,
        comments: 20,
        link: "#",
      },
    ],
    videos: [
      {
        title: "10-Min Mindfulness Meditation",
        description:
          "Short guided meditation to help you focus and reduce anxiety in just 10 minutes.",
        author: "Arjun Desai",
        avatar: "https://i.pravatar.cc/40?img=54",
        date: "Aug 12, 2025",
        duration: "10:00",
        thumbnail: "data:image/jpeg;base64,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",
        likes: 200,
        comments: 30,
        link: "#",
      },
      {
        title: "Better Sleep Habits",
        description:
          "Tips and tricks for a healthy sleep routine including bedtime practices and environment optimization.",
        author: "Pooja Menon",
        avatar: "https://i.pravatar.cc/40?img=55",
        date: "Jul 28, 2025",
        duration: "08:00",
        thumbnail: "data:image/jpeg;base64,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",
        likes: 180,
        comments: 25,
        link: "#",
      },
      {
        title: "Stress Relief Exercises",
        description:
          "Practical exercises to relieve stress, including breathing, stretching, and short meditations.",
        author: "Rohan Gupta",
        avatar: "https://i.pravatar.cc/40?img=56",
        date: "Sep 03, 2025",
        duration: "12:00",
        thumbnail:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTToFtC7Y9ih8Zz7m86WwWcBh9k1DSRsfLVgw&s",
         likes: 150,
        comments: 18,
        link: "#",
      },
      {
        title: "Evening Yoga Routine",
        description:
          "A calming yoga routine to wind down and improve sleep quality.",
        author: "Lakshmi Pillai",
        avatar: "https://i.pravatar.cc/40?img=57",
        date: "Sep 05, 2025",
        duration: "15:00",
        thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZsrUapcH2IzFUwgYCPsNGcaaU-ot0TpmE9A&s",
        likes: 170,
        comments: 22,
        link: "#",
      },
      {
        title: "Morning Energizing Stretch",
        description: "Quick morning stretches to energize your body and mind.",
        author: "Siddharth Joshi",
        avatar: "https://i.pravatar.cc/40?img=58",
        date: "Sep 07, 2025",
        duration: "05:00",
        thumbnail: "https://i.ytimg.com/vi/sPZAyyNrP3k/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCF874XF41UdJveKuUFWWq9HPbvWQ",
        likes: 190,
        comments: 28,
        link: "#",
      },
    ],
    tools: [
      {
        title: "Mood Tracker",
        description:
          "Log your emotions daily, visualize trends, and monitor your mental well-being over time.",
        link: "#",
      },
      {
        title: "Daily Journal",
        description:
          "Reflect on your thoughts and activities each day to improve self-awareness and mindfulness.",
        link: "#",
      },
      {
        title: "Habit Builder",
        description:
          "Track and build positive habits with reminders and streak tracking for better mental health.",
        link: "#",
      },
      {
        title: "Mindfulness Timer",
        description:
          "Set timers for meditation, breathing exercises, or focus sessions to enhance mindfulness practice.",
        link: "#",
      },
      {
        title: "Gratitude Log",
        description:
          "Record daily gratitudes to cultivate positivity and boost overall mood.",
        link: "#",
      },
    ],
    faq: [
      {
        title: "How do I reset my password?",
        description:
          "To reset your password, navigate to Settings > Account > Reset Password. Follow the on-screen instructions to create a new password.",
      },
      {
        title: "Is ZEO free to use?",
        description:
          "Core features of ZEO are free to use. Premium tools and advanced features may require a subscription.",
      },
      {
        title: "How can I track my mental wellness progress?",
        description:
          "Use tools like Mood Tracker, Daily Journal, and Habit Builder to log your activities, emotions, and habits. Analyze trends over time for better insights.",
      },
      {
        title: "Can I access ZEO on mobile devices?",
        description:
          "Yes! ZEO is fully accessible via web browsers on mobile devices. Mobile apps are also available for enhanced experience.",
      },
      {
        title: "Is my data secure?",
        description:
          "We take your privacy seriously. All personal data is encrypted and securely stored, ensuring confidentiality and protection.",
      },
      {
        title: "How do I contact support?",
        description:
          "You can contact our support team via the Help section in the app or email us at support@zeo.com.",
      },
      {
        title: "Can I share my account with others?",
        description:
          "No, each account is personal. Sharing your login may result in restricted access or data loss.",
      },
      {
        title: "Are there premium features?",
        description:
          "Yes, premium features include advanced analytics, personalized recommendations, and priority support.",
      },
    ],
  },
};

export default function Resources() {
  const [activeTab, setActiveTab] = useState<ResourceTab>("articles");
  const [lang, setLang] = useState("en");

  const tabs: { id: ResourceTab; icon: React.ReactNode; label: string }[] = [
    { id: "articles", icon: <FileText className="h-5 w-5" />, label: "Articles" },
    { id: "guides", icon: <BookOpen className="h-5 w-5" />, label: "Guides" },
    { id: "videos", icon: <Video className="h-5 w-5" />, label: "Videos" },
    { id: "tools", icon: <Lightbulb className="h-5 w-5" />, label: "Tools" },
    { id: "faq", icon: <HelpCircle className="h-5 w-5" />, label: "FAQ" },
  ];

  const languages = [
    { code: "en", label: "English" },
    { code: "te", label: "Telugu" },
    { code: "hi", label: "Hindi" },
    { code: "ta", label: "Tamil" },
    { code: "kn", label: "Kannada" },
    { code: "ml", label: "Malayalam" },
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col border-r bg-card">
          <div className="p-6 pb-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-zeo-primary to-zeo-secondary bg-clip-text text-transparent">
              Resources
            </h1>
            <p className="text-sm text-muted-foreground">Helpful articles, tools & more</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="space-y-1 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-zeo-primary/10 text-zeo-primary font-medium"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <ChevronRight className="ml-auto h-4 w-4" />}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden bg-card border-b">
          <div className="p-4">
            <h1 className="text-xl font-bold">Resources</h1>
            <div className="flex space-x-2 mt-2 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap ${
                    activeTab === tab.id ? "bg-zeo-primary text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <motion.div
            key={activeTab + lang}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-4 md:p-8 max-w-6xl mx-auto space-y-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{tabs.find((t) => t.id === activeTab)?.label}</h2>
                <p className="text-muted-foreground">
                  {activeTab === "articles" &&
                    "Explore insightful and practical articles on mental health."}
                  {activeTab === "guides" &&
                    "Step-by-step guides to improve your mental wellness and daily routines."}
                  {activeTab === "videos" && "Watch tutorials and mindfulness sessions."}
                  {activeTab === "tools" && "Use tools to improve well-being."}
                  {activeTab === "faq" && "Find answers to common questions."}
                </p>
              </div>

              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Resources Grid / List */}
            {activeTab === "videos" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {translations[lang][activeTab].map((res, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow p-0 overflow-hidden">
                    <div className="relative group">
                      <img
                        src={res.thumbnail}
                        alt={res.title}
                        className="w-full h-48 object-cover"
                      />
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-0.5 rounded text-xs z-10">
                        {res.duration}
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 z-10">
                        <Play className="w-12 h-12 text-white drop-shadow-lg" />
                      </span>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <img
                          src={res.avatar}
                          alt={res.author}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <div className="font-semibold">{res.author}</div>
                          <div className="text-xs text-muted-foreground">{res.date}</div>
                        </div>
                      </div>
                      <CardTitle className="text-base font-bold mb-1">{res.title}</CardTitle>
                      <CardDescription className="mb-2">{res.description}</CardDescription>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" /> {res.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" /> {res.comments}
                        </span>
                        <a
                          href={res.link}
                          className="ml-auto flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          Watch <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : activeTab === "tools" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {translations[lang][activeTab].map((res, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{res.title}</CardTitle>
                      <CardDescription>{res.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {res.link && (
                        <Button variant="outline" size="sm">
                          Visit
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {translations[lang][activeTab].map((res, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{res.title}</CardTitle>
                      <CardDescription>{res.description}</CardDescription>
                    </CardHeader>
                    {res.author && (
                      <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <img src={res.avatar} alt={res.author} className="w-12 h-12 rounded-full object-cover" />
                          <div className="flex flex-col">
                            <span className="font-medium">{res.author}</span>
                            <span className="text-sm text-muted-foreground">
                              {res.date} • {res.readingTime} {res.difficulty && `• ${res.difficulty}`}
                            </span>
                            {res.category && <span className="text-xs text-zeo-primary mt-1">{res.category}</span>}
                            {res.steps && (
                              <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                                {res.steps.map((step, i) => (
                                  <li key={i}>{step}</li>
                                ))}
                              </ol>
                            )}
                            {res.tags && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {res.tags.map((tag, i) => (
                                  <span key={i} className="text-xs bg-zeo-primary/20 text-zeo-primary px-2 py-0.5 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-3 md:mt-0">
                          {res.likes !== undefined && (
                            <div className="flex items-center text-sm text-muted-foreground space-x-1">
                              <Heart className="w-4 h-4" /> <span>{res.likes}</span>
                            </div>
                          )}
                          {res.comments !== undefined && (
                            <div className="flex items-center text-sm text-muted-foreground space-x-1">
                              <MessageCircle className="w-4 h-4" /> <span>{res.comments}</span>
                            </div>
                          )}
                          {res.link && (
                            <Button variant="outline" size="sm">
                              Read More
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
