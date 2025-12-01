import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

type LanguageOption = { code: string; label: string };

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage?: string; includedLanguages?: string; autoDisplay?: boolean },
          elementId: string
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

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

export default function TranslateWidget({ inline }: { inline?: boolean }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<LanguageOption>(LANGUAGES[0]);
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
    setCurrent(lang);
    setOpen(false);
    if (lang.code === 'en') {
      restore();
      return;
    }
    ensureGoogleElement();
    // hide Google banner
    const interval = setInterval(() => {
      const b = document.querySelector('.goog-te-banner-frame.skiptranslate');
      if (b?.parentElement) {
        b.parentElement.removeChild(b);
        document.body.style.top = '0px';
        clearInterval(interval);
      }
    }, 300);
    if (await tryGoogleWithRetry(lang.code)) return;
    const nodes = Array.from(managed.current);
    const texts = nodes.map(n => originals.current.get(n) ?? n.nodeValue ?? '');
    const t = await translateViaApi(lang.code, texts);
    if (t) apply(t);
  };

  return (
    <div
      id="translate-widget"
      translate="no"
      data-no-translate
      className={`${inline ? '' : 'fixed bottom-40 left-10 z-50'} notranslate`}
      aria-live="polite"
    >
      <div className="relative">
          <Button
            variant="outline"
            size="sm"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="translate-menu"
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center space-x-3 bg-white/80 backdrop-blur-lg border border-[#D2E4D3] shadow-lg text-gray-900 rounded-md px-4 py-3 font-medium">
            
          <span aria-hidden="true">🌐</span>
          <span className="text-sm">{current.label}</span>
          <svg
            className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
          </svg>
          <span className="sr-only">Toggle language menu</span>
          </Button>

        <AnimatePresence>
          {open && (
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
                const active = l.code === current.code;
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
  );
}
