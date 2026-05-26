import { createContext, useContext, useState, useEffect, useCallback } from "react";
import translations, { LANGUAGES } from "../i18n/translations";

const LanguageContext = createContext();

const STORAGE_KEY = "toilet_finder_lang";

/**
 * Language Provider — manages i18n state across the app.
 */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    // Read from localStorage or detect browser language
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;

    // Auto-detect from browser
    const browserLang = navigator.language?.toLowerCase() || "";
    if (browserLang.startsWith("ru")) return "ru";
    if (browserLang.startsWith("en")) return "en";
    return "uz"; // Default
  });

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  /**
   * Get translated string by key
   */
  const t = useCallback(
    (key, fallback) => {
      return translations[lang]?.[key] || translations.uz?.[key] || fallback || key;
    },
    [lang]
  );

  const switchLanguage = useCallback((code) => {
    if (translations[code]) {
      setLang(code);
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        t,
        switchLanguage,
        languages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access language context
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}
