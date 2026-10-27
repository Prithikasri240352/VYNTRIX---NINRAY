/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, SupportedLanguage, TranslationDictionary } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof TranslationDictionary, fallback?: string) => string;
  translateStatus: (status: string) => string;
  supportedLanguages: Array<{
    code: SupportedLanguage;
    label: string;
    nativeLabel: string;
  }>;
}

const STORAGE_KEY = 'nirnay_preferred_language';

const supportedLanguages: Array<{
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}> = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' }
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'ta')) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // Storage error ignored
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // Ignore
    }
  }, [language]);

  const t = (key: keyof TranslationDictionary, fallback?: string): string => {
    const dict = translations[language] || translations.en;
    if (dict && dict[key]) {
      return dict[key];
    }
    const enDict = translations.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  const translateStatus = (status: string): string => {
    const dict = translations[language] || translations.en;
    switch (status) {
      case 'Verified against an authorised source':
        return dict.statusVerified;
      case 'Issuer-confirmed':
        return dict.statusIssuerConfirmed;
      case 'Matched to an authorised record':
        return dict.statusMatched;
      case 'AI-checked only':
        return dict.statusAiChecked;
      case 'Incomplete':
        return dict.statusIncomplete;
      case 'Expired':
        return dict.statusExpired;
      case 'Inconsistent':
        return dict.statusInconsistent;
      case 'Potential anomaly':
        return dict.statusAnomaly;
      case 'Unable to verify':
        return dict.statusUnableToVerify;
      case 'Requires human review':
        return dict.statusHumanReview;
      case 'Approved / Compliant':
        return dict.statusApproved;
      case 'Under Automated Scrutiny':
        return dict.statusUnderScrutiny;
      case 'Clarification Required':
        return dict.statusClarificationReq;
      case 'Deficiency Issued':
        return dict.statusDeficiencyIssued;
      case 'Draft':
        return dict.statusDraft;
      default:
        return status;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateStatus,
        supportedLanguages
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
