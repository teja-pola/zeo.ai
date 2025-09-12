import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, MessageCircle, User, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LanguageOption = { code: string; label: string };

const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'ur', label: 'اردو' },
];

const INCLUDED_CODES = LANGUAGES.map(l => l.code).join(',');

function collectTextNodes(root: ParentNode, skipSelector: string): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node: Node) => {
      const text = (node as Text).nodeValue ?? '';
      if (!text.trim()) return NodeFilter.FILTER_REJECT;
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (
        parent.closest(skipSelector) ||
        ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName) ||
        parent.getAttribute('aria-hidden') === 'true'
      ) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  } as unknown as NodeFilter);
  const nodes: Text[] = [];
  let current: Node | null = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}

async function translateViaApi(targetLang: string, texts: string[]): Promise<string[] | null> {
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetLang, texts }),
      credentials: 'same-origin',
    });
    if (!res.ok) return null;
    const data = await res.json();
    const translations = (data && (data.translations ?? data)) as unknown;
    if (Array.isArray(translations) && translations.every(t => typeof t === 'string')) {
      return translations as string[];
    }
    return null;
  } catch {
    return null;
  }
}

const SideNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={24} />, path: '/community?tab=feed', tooltip: 'Go to Home Feed' },
    { id: 'community', label: 'Community', icon: <Users size={24} />, path: '/community', tooltip: 'View Community & Connect' },
    { id: 'explore', label: 'Explore', icon: <TrendingUp size={24} />, path: '/community?tab=explore', tooltip: 'Discover Trending Posts & People' },
    { id: 'chats', label: 'Chats', icon: <MessageCircle size={24} />, path: '/chats', tooltip: 'Open Messages & Chats' },
    { id: 'profile', label: 'Profile', icon: <User size={24} />, path: '/profile', tooltip: 'View Your Profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/community?tab=feed' && (location.pathname === '/' || (location.pathname === '/community' && location.search.includes('tab=feed')))) return true;
    if (path === '/community?tab=explore' && location.pathname === '/community' && location.search.includes('tab=explore')) return true;
    if (path !== '/' && !path.includes('?') && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Translate widget states & refs
  const [openTranslate, setOpenTranslate] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageOption>(LANGUAGES[0]);
  const originals = useRef<WeakMap<Text, string>>(new WeakMap());
  const managed = useRef<Set<Text>>(new Set());
  const skipSelector = useMemo(() => '[data-no-translate], #translate-widget, .notranslate', []);
  const googleInitRef = useRef(false);
  const googleScriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const nodes = collectTextNodes(document.body, skipSelector);
    for (const n of nodes) {
      if (!originals.current.has(n)) originals.current.set(n, n.nodeValue ?? '');
      managed.current.add(n);
    }
    const mo = new MutationObserver(() => {
      const fresh = collectTextNodes(document.body, skipSelector);
      for (const n of fresh) {
        if (!originals.current.has(n)) originals.current.set(n, n.nodeValue ?? '');
        managed.current.add(n);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, [skipSelector]);

  const ensureGoogleElement = () => {
    if (!document.getElementById('google_translate_element')) {
      const host = document.createElement('div');
      host.id = 'google_translate_element';
      host.style.position = 'fixed';
      host.style.left = '-9999px';
      host.style.bottom = '0';
      host.setAttribute('aria-hidden', 'true');
      document.body.appendChild(host);
    }
    if (window.google?.translate?.TranslateElement && !googleInitRef.current) {
      try {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: INCLUDED_CODES, autoDisplay: false },
          'google_translate_element'
        );
        googleInitRef.current = true;
        return true;
      } catch {}
    }
    if (!googleScriptRef.current && !window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit = () => {
        try {
          new window.google!.translate!.TranslateElement(
            { pageLanguage: 'en', includedLanguages: INCLUDED_CODES, autoDisplay: false },
            'google_translate_element'
          );
          googleInitRef.current = true;
        } catch {}
      };
      const s = document.createElement('script');
      s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
      googleScriptRef.current = s;
    }
    return !!(window.google?.translate?.TranslateElement || googleScriptRef.current);
  };

  const tryGoogleTranslate = (langCode: string) => {
    if (!window.google?.translate?.TranslateElement) return false;
    if (!ensureGoogleElement()) return false;
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (!combo) return false;
    combo.value = langCode;
    combo.dispatchEvent(new Event('change'));
    return true;
  };

  const tryGoogleWithRetry = async (langCode: string) => {
    for (let i = 0; i < 6; i++) {
      if (tryGoogleTranslate(langCode)) return true;
      await new Promise(r => setTimeout(r, 300));
    }
    return false;
  };

  const restore = () => {
    for (const node of managed.current) {
      const o = originals.current.get(node);
      if (typeof o === 'string') node.nodeValue = o;
    }
  };

  const apply = (translations: string[]) => {
    const nodes = Array.from(managed.current);
    for (let i = 0; i < nodes.length && i < translations.length; i++) {
      nodes[i].nodeValue = translations[i];
    }
  };

  const handleSelect = async (lang: LanguageOption) => {
    setCurrentLang(lang);
    setOpenTranslate(false);
    if (lang.code === 'en') {
      restore();
      // Reset google combo to blank to revert to English properly
      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (combo) {
        combo.value = '';
        combo.dispatchEvent(new Event('change'));
      }
      document.body.classList.remove('translated-ltr', 'translated-rtl');
      const frames = document.querySelectorAll('.skiptranslate');
      frames.forEach(f => f.remove());
      return;
    }
    ensureGoogleElement();
    const removeBanner = () => {
      const selectors = [
        '.goog-te-banner-frame.skiptranslate',
        '.VIpgJd-ZVi9od-ORHb',
        '.VIpgJd-ZVi9od-ORHb-OEVmcd',
        '.skiptranslate > iframe',
      ];
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          if (el.parentElement) el.parentElement.removeChild(el);
        });
      });
      document.body.style.top = '0px';
    };
    // Remove banner repeatedly for 5 seconds
    let tries = 0;
    const iv = setInterval(() => {
      removeBanner();
      if (++tries > 16) clearInterval(iv);
    }, 300);
    if (await tryGoogleWithRetry(lang.code)) return;
    const nodes = Array.from(managed.current);
    const texts = nodes.map(n => originals.current.get(n) ?? n.nodeValue ?? '');
    const t = await translateViaApi(lang.code, texts);
    if (t) apply(t);
  };

  return (
    <motion.nav
      className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-lg border-r border-[#D2E4D3] shadow-lg z-40 flex flex-col py-6"
      initial={{ x: -80 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Logo/Brand */}
      <div className="mb-8 px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#345E2C] to-[#256d63] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#345E2C]">ZEO</h1>
            <p className="text-xs text-[#256d63]">Mental Health</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-2 flex-1 px-4">
        {navItems.map(item => (
          <div key={item.id} className="relative group">
            <motion.button
              onClick={() => navigate(item.path)}
              className={`relative w-full h-12 rounded-xl flex items-center gap-3 px-4 transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-[#345E2C] text-white shadow-lg'
                  : 'text-[#345E2C] hover:bg-[#D2E4D3] hover:text-[#256d63]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={item.tooltip}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
              {isActive(item.path) && (
                <motion.div
                  className="absolute -left-1 top-1/2 w-1 h-6 bg-[#85B8CB] rounded-r-full"
                  layoutId="activeIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          </div>
        ))}
      </div>

      {/* Bottom section - could add settings or logout */}
      <div className="mt-auto px-4">
        <div className="flex items-center gap-3 p-3 bg-[#F8FAF8] rounded-xl mb-3">
          <div className="w-8 h-8 bg-[#A996E6] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div>
            <p className="text-sm font-medium text-[#345E2C]">Online</p>
            <p className="text-xs text-[#256d63]">Ready to help</p>
          </div>
        </div>
        <div className="mt-3 relative">
          <Button
            variant="outline"
            size="sm"
            aria-haspopup="menu"
            aria-expanded={openTranslate}
            aria-controls="translate-menu"
            onClick={() => setOpenTranslate(v => !v)}
            className="w-full flex items-center space-x-3 bg-white/80 backdrop-blur-lg border border-[#D2E4D3] shadow-lg text-gray-900 rounded-md px-4 py-3 font-medium"
          >
            <span aria-hidden="true">🌐</span>
            <span className="text-sm">{currentLang.label}</span>
            <svg
              className={`w-4 h-4 transition-transform ${openTranslate ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
            </svg>
            <span className="sr-only">Toggle language menu</span>
          </Button>

          <AnimatePresence>
            {openTranslate && (
              <motion.ul
                id="translate-menu"
                role="menu"
                aria-label="Select language"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 4, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="absolute left-0 bottom-full mb-2 w-48 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg"
              >
                {LANGUAGES.map(l => {
                  const active = l.code === currentLang.code;
                  return (
                    <li key={l.code} role="none">
                      <button
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => handleSelect(l)}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800 ${
                          active ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {l.label}
                      </button>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default SideNavbar;
