import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CrmState, Translations } from "./types";
import FoydalanuvchiPanel from "./components/FoydalanuvchiPanel";
import StaffPanel from "./components/StaffPanel";
import AdminPanel from "./components/AdminPanel";
import AboutPage from "./components/AboutPage";
import Effects from "./components/Effects";
import { ChefHat, RefreshCw, AlertCircle } from "lucide-react";

export default function App() {
  const [state, setState] = useState<CrmState | null>(null);
  const [activePanel, setActivePanel] = useState<'user' | 'staff' | 'admin' | 'about'>('user');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, string>>({});
  const [translatingContent, setTranslatingContent] = useState(false);

  // Fetch state on mount with versioning & caching
  const fetchState = async () => {
    try {
      const response = await fetch("/api/state");
      const data = await response.json();
      
      let serverState: CrmState | null = null;
      if (data.success && data.state) {
        serverState = data.state;
      }

      // Check localStorage cached state
      const localStateStr = localStorage.getItem("lazzat_crm_state");
      let localState: CrmState | null = null;
      if (localStateStr) {
        try {
          localState = JSON.parse(localStateStr);
        } catch (err) {
          console.error("Failed to parse local state:", err);
        }
      }

      let finalState: CrmState;

      if (serverState && localState) {
        const serverTime = serverState.config?.lastUpdated || 0;
        const localTime = localState.config?.lastUpdated || 0;

        if (localTime > serverTime) {
          // Local is newer: use local state and sync to server
          finalState = localState;
          console.log("Local state is newer. Syncing to server...");
          await fetch("/api/state/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(localState),
          });
        } else {
          // Server is newer or equal: use server, sync to local
          finalState = serverState;
          localStorage.setItem("lazzat_crm_state", JSON.stringify(serverState));
        }
      } else if (serverState) {
        finalState = serverState;
        localStorage.setItem("lazzat_crm_state", JSON.stringify(serverState));
      } else if (localState) {
        finalState = localState;
      } else {
        setError("Ma'lumotlar bazasini yuklashda xatolik yuz berdi.");
        setLoading(false);
        return;
      }

      // Respect persistently saved language from localStorage if present
      const savedLang = localStorage.getItem("lazzat_crm_lang");
      if (savedLang && finalState.config) {
        finalState.config.activeLang = savedLang;
      }

      setState(finalState);
      applyTheme(finalState.config.theme);
    } catch (e) {
      console.error("Error fetching/syncing state:", e);
      // Failover to local cache if offline
      const localStateStr = localStorage.getItem("lazzat_crm_state");
      if (localStateStr) {
        try {
          const finalState = JSON.parse(localStateStr);
          setState(finalState);
          applyTheme(finalState.config.theme);
        } catch (err) {
          setError("Server bilan aloqa o'rnatib bo'lmadi.");
        }
      } else {
        setError("Server bilan aloqa o'rnatib bo'lmadi.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Log user visit on mount
  const logVisit = async () => {
    try {
      await fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "Kirish", user: "Mehmon (Mobil)" }),
      });
    } catch (e) {
      console.error("Error logging visit:", e);
    }
  };

  useEffect(() => {
    fetchState();
    logVisit();
  }, []);

  // Set document title dynamically based on custom branding
  useEffect(() => {
    if (state) {
      const siteName = (state.config as any).logoText || state.footer?.restaurantName || "EVOS Fast Food";
      document.title = `${siteName} - Raqamli Aqlli Menyu`;
    }
  }, [state]);

  // Real-time synchronization using Server-Sent Events (SSE)
  useEffect(() => {
    const eventSource = new EventSource("/api/events");

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === "state_update" && parsed.state) {
          setState(parsed.state);
          localStorage.setItem("lazzat_crm_state", JSON.stringify(parsed.state));
        }
      } catch (err) {
        console.error("Failed to parse SSE state update:", err);
      }
    };

    eventSource.onerror = (err) => {
      // EventSource automatically reconnects, log is purely informative
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Dynamically translate all backend-supplied text (menu items, categories, descriptions, footer details, booklet)
  useEffect(() => {
    if (!state) return;
    const activeLang = state.config.activeLang || "uz";

    // If active language is Uzbek, we use original names directly without translation cache queries
    if (activeLang === "uz") {
      setDynamicTranslations({});
      return;
    }

    const fetchAllDynamicTranslations = async () => {
      setTranslatingContent(true);
      const textsToTranslate: string[] = [];

      // Collect items from menu
      state.menu.forEach((item) => {
        if (item.name) textsToTranslate.push(item.name);
        if (item.description) textsToTranslate.push(item.description);
        if (item.category) textsToTranslate.push(item.category);
      });

      // Collect booklet details
      if (state.booklet.title) textsToTranslate.push(state.booklet.title);
      state.booklet.pages.forEach((page) => {
        if (page) textsToTranslate.push(page);
      });

      // Collect Cafe information
      if (state.about?.text) textsToTranslate.push(state.about.text);
      if (state.about?.address) textsToTranslate.push(state.about.address);

      // Collect general restaurant footer metadata
      if (state.footer?.restaurantName) textsToTranslate.push(state.footer.restaurantName);
      if (state.footer?.restaurantDesc) textsToTranslate.push(state.footer.restaurantDesc);
      if (state.footer?.copyrightText) textsToTranslate.push(state.footer.copyrightText);

      // Collect footer link names
      state.footer?.links?.forEach((link) => {
        if (link.name) textsToTranslate.push(link.name);
      });

      // Filter empty and duplicate strings
      const uniqueTexts = Array.from(new Set(textsToTranslate.filter(Boolean).map(t => t.trim())));

      // Load client-side translation cache
      let localCache: Record<string, Record<string, string>> = {};
      try {
        const stored = localStorage.getItem("lazzat_translations_cache");
        if (stored) {
          localCache = JSON.parse(stored);
        }
      } catch (err) {
        console.error("Failed to parse local translations cache:", err);
      }

      const results: Record<string, string> = {};
      const missingTexts: string[] = [];

      uniqueTexts.forEach((text) => {
        if (localCache[text] && localCache[text][activeLang]) {
          results[text] = localCache[text][activeLang];
        } else {
          missingTexts.push(text);
        }
      });

      if (missingTexts.length > 0) {
        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              texts: missingTexts,
              targetLang: activeLang
            })
          });
          const data = await res.json();
          if (data.success && data.translations) {
            // Save newly fetched translations to local cache
            Object.entries(data.translations).forEach(([original, translated]) => {
              if (original && typeof translated === "string") {
                if (!localCache[original]) {
                  localCache[original] = {};
                }
                localCache[original][activeLang] = translated;
                results[original] = translated;
              }
            });
            try {
              localStorage.setItem("lazzat_translations_cache", JSON.stringify(localCache));
            } catch (err) {
              console.error("Failed to save local translations cache:", err);
            }
          } else {
            console.warn("Translation API warning/fallback used:", data.message || "Unknown error");
            // Fallback to original text for missing ones so we don't break
            missingTexts.forEach((t) => {
              results[t] = t;
            });
          }
        } catch (err) {
          console.error("Failed fetching dynamic translation payload from /api/translate:", err);
          // Fallback to original text on total network/server failure
          missingTexts.forEach((t) => {
            results[t] = t;
          });
        }
      }

      setDynamicTranslations(results);
      setTranslatingContent(false);
    };

    // Debounce state updates slightly to prevent layout flickering
    const delayDebounce = setTimeout(() => {
      fetchAllDynamicTranslations();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [
    state?.config?.activeLang,
    state?.menu,
    state?.booklet,
    state?.about?.text,
    state?.footer?.restaurantName
  ]);

  // Translate all DOM elements with data-i18n attributes in real-time
  useEffect(() => {
    if (state) {
      const lang = state.config.activeLang || "uz";
      const dict = state.translations[lang] || state.translations["uz"];
      if (dict) {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
          const key = el.getAttribute("data-i18n");
          if (key && (dict as any)[key]) {
            el.textContent = (dict as any)[key];
          }
        });
      }
    }
  }, [state?.config?.activeLang, state?.translations]);

  // Guarantee theme class synchronization with the state config
  useEffect(() => {
    if (state?.config?.theme) {
      applyTheme(state.config.theme);
    }
  }, [state?.config?.theme]);

  // Update backend and local state securely with timestamps
  const handleUpdateState = async (updatedFields: Partial<CrmState>) => {
    if (!state) return;
    
    const lastUpdated = Date.now();
    const updatedConfig = {
      ...(updatedFields.config || state.config),
      lastUpdated
    };

    const newState = { 
      ...state, 
      ...updatedFields,
      config: updatedConfig
    };

    // Optimistic local update
    setState(newState);
    localStorage.setItem("lazzat_crm_state", JSON.stringify(newState));

    try {
      const response = await fetch("/api/state/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedFields,
          config: updatedConfig
        }),
      });
      const data = await response.json();
      if (!data.success) {
        console.error("Failed to sync state to server:", data.message);
      }
    } catch (e) {
      console.error("Failed to connect to server to save state:", e);
    }
  };

  // Helper: Detect if hex color is dark
  const isDarkColor = (hex: string): boolean => {
    if (!hex || !hex.startsWith("#")) return true;
    const c = hex.substring(1);
    if (c.length === 3) {
      const r = parseInt(c[0] + c[0], 16);
      const g = parseInt(c[1] + c[1], 16);
      const b = parseInt(c[2] + c[2], 16);
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 128;
    }
    if (c.length === 6) {
      const rgb = parseInt(c, 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 128;
    }
    return true;
  };

  // Helper: Theme applier
  const applyTheme = (theme: 'light' | 'dark') => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  };

  // Set Theme Wrapper
  const handleSetTheme = async (theme: 'light' | 'dark') => {
    if (!state) return;
    applyTheme(theme);
    
    let updatedBgValue = state.config.backgroundValue;
    if (state.config.backgroundType === "color") {
      const isCurrentDark = isDarkColor(state.config.backgroundValue);
      if (theme === "dark" && !isCurrentDark) {
        updatedBgValue = "#09090b";
      } else if (theme === "light" && isCurrentDark) {
        updatedBgValue = "#f3f4f6";
      }
    }

    const updatedConfig = { 
      ...state.config, 
      theme,
      backgroundValue: updatedBgValue
    };
    await handleUpdateState({ config: updatedConfig });
  };

  // Set Language Wrapper
  const handleSetLang = async (lang: string) => {
    if (!state) return;
    localStorage.setItem("lazzat_crm_lang", lang);
    const updatedConfig = { ...state.config, activeLang: lang as any };
    await handleUpdateState({ config: updatedConfig });
  };

  if (loading) {
    let loadingBrand = "EVOS Fast Food";
    try {
      const cached = localStorage.getItem("lazzat_crm_state");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.config?.logoText) {
          loadingBrand = parsed.config.logoText;
        } else if (parsed?.footer?.restaurantName) {
          loadingBrand = parsed.footer.restaurantName;
        }
      }
    } catch (e) {}

    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
          <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-400">
            {loadingBrand} Yuklanmoqda...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !state) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-lg font-bold">Xatolik yuz berdi</h2>
          <p className="text-sm text-zinc-400">{error || "Tizim yuklanishida xatolik."}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError("");
              fetchState();
            }}
            className="px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl hover:bg-amber-600 transition-colors"
          >
            Qayta yuklash 🔄
          </button>
        </div>
      </div>
    );
  }

  // Get active translations
  const activeLang = state.config.activeLang || "uz";
  const t: Translations = state.translations[activeLang] || state.translations["uz"];

  // Background Styles Calculation
  const bgType = state.config.backgroundType;
  const bgValue = state.config.backgroundValue;

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden font-sans text-zinc-800 dark:text-zinc-100 transition-colors duration-200 ${state.config.theme === "dark" ? "dark" : ""}`}>
      
      {/* 1. DYNAMIC BACKGROUND CONTAINER */}
      <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        {bgType === "color" && (
          <div className="w-full h-full" style={{ backgroundColor: bgValue }} />
        )}

        {bgType === "image" && (
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url(${bgValue})` }}
          >
            <div className="w-full h-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xs" />
          </div>
        )}

        {bgType === "gif" && (
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url(${bgValue})` }}
          >
            <div className="w-full h-full bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xs" />
          </div>
        )}

        {bgType === "video" && (
          <div className="relative w-full h-full">
            <video
              src={bgValue}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-30 dark:opacity-20"
            />
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xs" />
          </div>
        )}
      </div>

      {/* 2. DYNAMIC FLOATING PARTICLES EFFECTS */}
      <Effects active={state.config.effectsEnabled} />

      {/* 3. MULTI-PANEL VIEW MANAGER */}
      <AnimatePresence mode="wait">
        {activePanel === "user" && (
          <motion.div
            key="user"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            <FoydalanuvchiPanel
              state={state}
              t={t}
              onPanelChange={setActivePanel}
              onSetTheme={handleSetTheme}
              onSetLang={handleSetLang}
              dynamicTranslations={dynamicTranslations}
            />
          </motion.div>
        )}

        {activePanel === "staff" && (
          <motion.div
            key="staff"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            <StaffPanel
              state={state}
              t={t}
              onUpdateState={handleUpdateState}
              onBackToMenu={() => setActivePanel("user")}
            />
          </motion.div>
        )}

        {activePanel === "admin" && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            <AdminPanel
              state={state}
              t={t}
              onUpdateState={handleUpdateState}
              onBackToMenu={() => setActivePanel("user")}
            />
          </motion.div>
        )}

        {activePanel === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            <AboutPage
              state={state}
              t={t}
              onBackToMenu={() => setActivePanel("user")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
