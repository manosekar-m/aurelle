"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, LANGUAGES, translations, LanguageInfo } from "@/data/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  languages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
  languages: LANGUAGES,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("aurelle_language") as Language | null;
      if (stored && ["en", "fr", "it", "es", "de"].includes(stored)) {
        setLanguageState(stored);
      }
    } catch {
      // localStorage may not be available
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("aurelle_language", lang);
    } catch {
      // localStorage may not be available
    }
  };

  const activeTranslations = translations[language] || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: activeTranslations,
        languages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

