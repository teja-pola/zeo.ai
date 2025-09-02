import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  BookOpen,
  Video,
  Lightbulb,
  HelpCircle,
  ChevronRight,
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
  link?: string;
};

// ✅ Translations dictionary
const translations: Record<
  string,
  Record<ResourceTab, Resource[]>
> = {
  en: {
    articles: [
      { title: "Mindfulness Basics", description: "Learn the fundamentals of mindfulness." },
      { title: "Coping with Stress", description: "Techniques to manage stress effectively." },
    ],
    guides: [
      { title: "Getting Started with ZEO", description: "Step-by-step onboarding guide." },
      { title: "Daily Wellness Routine", description: "Practical steps to structure your day." },
    ],
    videos: [
      { title: "10-Min Meditation", description: "Short mindfulness video for beginners." },
      { title: "Better Sleep Habits", description: "Tips and tricks for healthy sleep." },
    ],
    tools: [
      { title: "Mood Tracker", description: "Log your emotions and monitor trends." },
      { title: "Daily Journal", description: "Reflect on your thoughts and activities." },
    ],
    faq: [
      { title: "How to reset password?", description: "Go to Settings > Account > Reset Password." },
      { title: "Is ZEO free?", description: "Core features are free, premium tools may require subscription." },
    ],
  },
  fr: {
    articles: [
      { title: "Bases de la pleine conscience", description: "Apprenez les bases de la pleine conscience." },
      { title: "Faire face au stress", description: "Techniques pour gérer efficacement le stress." },
    ],
    guides: [
      { title: "Commencer avec ZEO", description: "Guide d'intégration étape par étape." },
      { title: "Routine quotidienne de bien-être", description: "Étapes pratiques pour structurer votre journée." },
    ],
    videos: [
      { title: "Méditation de 10 min", description: "Vidéo de pleine conscience pour débutants." },
      { title: "Meilleures habitudes de sommeil", description: "Conseils et astuces pour un sommeil sain." },
    ],
    tools: [
      { title: "Suivi de l’humeur", description: "Enregistrez vos émotions et suivez les tendances." },
      { title: "Journal quotidien", description: "Réfléchissez à vos pensées et activités." },
    ],
    faq: [
      { title: "Comment réinitialiser le mot de passe ?", description: "Allez dans Paramètres > Compte > Réinitialiser le mot de passe." },
      { title: "ZEO est-il gratuit ?", description: "Les fonctionnalités de base sont gratuites, certains outils premium nécessitent un abonnement." },
    ],
  },
  es: {
    articles: [
      { title: "Conceptos básicos de la atención plena", description: "Aprende los fundamentos de la atención plena." },
      { title: "Cómo afrontar el estrés", description: "Técnicas para gestionar el estrés de manera efectiva." },
    ],
    guides: [
      { title: "Comenzando con ZEO", description: "Guía paso a paso para empezar." },
      { title: "Rutina diaria de bienestar", description: "Pasos prácticos para estructurar tu día." },
    ],
    videos: [
      { title: "Meditación de 10 minutos", description: "Video corto de atención plena para principiantes." },
      { title: "Mejores hábitos de sueño", description: "Consejos y trucos para un sueño saludable." },
    ],
    tools: [
      { title: "Registro de estado de ánimo", description: "Registra tus emociones y monitorea tendencias." },
      { title: "Diario diario", description: "Reflexiona sobre tus pensamientos y actividades." },
    ],
    faq: [
      { title: "¿Cómo restablecer la contraseña?", description: "Ve a Configuración > Cuenta > Restablecer contraseña." },
      { title: "¿ZEO es gratis?", description: "Las funciones principales son gratuitas, algunas herramientas premium requieren suscripción." },
    ],
  },
  de: {
    articles: [
      { title: "Achtsamkeitsgrundlagen", description: "Lerne die Grundlagen der Achtsamkeit." },
      { title: "Umgang mit Stress", description: "Techniken zur effektiven Stressbewältigung." },
    ],
    guides: [
      { title: "Erste Schritte mit ZEO", description: "Schritt-für-Schritt-Einführung." },
      { title: "Tägliche Wellness-Routine", description: "Praktische Schritte zur Strukturierung deines Tages." },
    ],
    videos: [
      { title: "10-minütige Meditation", description: "Kurzes Achtsamkeitsvideo für Anfänger." },
      { title: "Bessere Schlafgewohnheiten", description: "Tipps und Tricks für gesunden Schlaf." },
    ],
    tools: [
      { title: "Stimmungstracker", description: "Protokolliere deine Emotionen und verfolge Trends." },
      { title: "Tagesjournal", description: "Reflektiere über deine Gedanken und Aktivitäten." },
    ],
    faq: [
      { title: "Wie Passwort zurücksetzen?", description: "Gehe zu Einstellungen > Konto > Passwort zurücksetzen." },
      { title: "Ist ZEO kostenlos?", description: "Kernfunktionen sind kostenlos, Premium-Tools erfordern ein Abonnement." },
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
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
    { code: "de", label: "Deutsch" },
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
                  {activeTab === tab.id && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
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
                    activeTab === tab.id
                      ? "bg-zeo-primary text-white"
                      : "bg-muted text-muted-foreground"
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
            className="p-4 md:p-8 max-w-3xl mx-auto space-y-8"
          >
            {/* Header with Language Selector */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h2>
                <p className="text-muted-foreground">
                  {activeTab === "articles" && "Explore insightful articles."}
                  {activeTab === "guides" && "Step-by-step guides to help you."}
                  {activeTab === "videos" && "Watch tutorials and mindfulness sessions."}
                  {activeTab === "tools" && "Use tools to improve well-being."}
                  {activeTab === "faq" && "Find answers to common questions."}
                </p>
              </div>

              {/* Language Dropdown */}
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

            {/* Resources Grid */}
            <div className="grid gap-6">
              {translations[lang][activeTab].map((res, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{res.title}</CardTitle>
                    <CardDescription>{res.description}</CardDescription>
                  </CardHeader>
                  {res.link && (
                    <CardContent>
                      <Button variant="outline" size="sm">
                        Visit
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
