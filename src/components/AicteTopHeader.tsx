/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Lock,
  Search,
  Globe,
  X,
  FileCheck2,
  Calendar,
  Layers,
  PhoneCall,
  Bot,
  UserCheck,
  LogOut,
  ChevronDown,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Menu
} from 'lucide-react';
import { AuthenticatedUser } from './AicteLoginModal';
import { YuktiAnimatedLogo } from './YuktiAnimatedLogo';
import { useLanguage } from '../i18n/LanguageContext';
import { resolveSpeechVoice } from '../utils/speechSynthesis';

export type PortalTab = 'portal' | 'scrutiny' | 'documents' | 'copilot' | 'spoc' | 'directory' | 'institution-workspace';

interface AicteTopHeaderProps {
  currentTab: PortalTab;
  onTabChange: (tab: PortalTab) => void;
  onOpenDirectory: () => void;
  onOpenPublicNotice: () => void;
  currentUser: AuthenticatedUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const AicteTopHeader: React.FC<AicteTopHeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenDirectory,
  onOpenPublicNotice,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const locale = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-US';
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      try {
        setCurrentDateTime(now.toLocaleString(locale, options));
      } catch {
        setCurrentDateTime(now.toLocaleString('en-US', options));
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [language]);

  const handleScreenReader = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const text =
        language === 'hi'
          ? 'निर्णय स्वचालित जांच एवं अनुपालन पोर्टल में आपका स्वागत है'
          : language === 'ta'
          ? 'நிர்ணய் தானியங்கி ஆய்வு மற்றும் இணக்க தளத்திற்கு நல்வரவு'
          : 'Welcome to Nirnay Automated Scrutiny & Compliance Assistant';

      const utterance = new SpeechSynthesisUtterance(text);
      const { voice } = resolveSpeechVoice(language);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Screen reader audio announcement error:', e);
    }
  };

  const handleNavSelect = (tab: PortalTab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Black Utility Bar matching official AICTE Portal */}
      <div className="bg-slate-950 text-slate-200 text-xs py-1.5 px-3 sm:px-6 md:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Live Time & Screen Reader */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <span className="font-mono tabular-nums text-slate-300">
              {currentDateTime || 'Friday, Oct 23, 2026, 10:07 PM'}
            </span>
            <button
              onClick={handleScreenReader}
              className="hidden sm:inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Click to trigger screen reader announcement"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('screenReaderAccess')}</span>
            </button>
          </div>

          {/* Right: Functional 3-Language Selector, Login / User Profile, Social Links */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Functional Language Selector (English | हिन्दी | தமிழ்) */}
            <div
              className="inline-flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5"
              role="radiogroup"
              aria-label={t('selectLanguage')}
            >
              <Globe className="w-3 h-3 text-amber-400 ml-1.5 mr-1 hidden xs:inline" />
              {supportedLanguages.map((langItem) => {
                const isActive = language === langItem.code;
                return (
                  <button
                    key={langItem.code}
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setLanguage(langItem.code)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    title={`Switch language to ${langItem.label} (${langItem.nativeLabel})`}
                  >
                    {langItem.nativeLabel}
                  </button>
                );
              })}
            </div>

            <div className="h-3 w-px bg-slate-700 hidden sm:block" />

            {/* Web Portal Login / Authenticated Profile Button */}
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={onOpenLogin}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded font-semibold text-[11px] transition-colors cursor-pointer border border-slate-700"
                  title="Click to switch role or account"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="max-w-[110px] sm:max-w-[150px] truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-400 hidden lg:inline">({currentUser.role})</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-1 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                  title={t('signOut')}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-semibold text-[11px] transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>{t('webPortalLogin')}</span>
              </button>
            )}

            {/* Official AICTE Social Media Links with Verified URLs */}
            <div className="hidden lg:flex items-center gap-2 text-slate-400 pl-2 border-l border-slate-800">
              <a
                href="https://www.facebook.com/AICTE.India/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit AICTE on Facebook"
                title="Visit AICTE on Facebook (Official Page)"
                className="hover:text-amber-400 focus:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 rounded p-0.5 transition-colors cursor-pointer"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://x.com/AICTE_INDIA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit AICTE on X"
                title="Visit AICTE on X / Twitter (@AICTE_INDIA)"
                className="hover:text-amber-400 focus:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 rounded p-0.5 transition-colors cursor-pointer text-[12px] font-bold leading-none"
              >
                <span className="font-mono">𝕏</span>
              </a>

              <a
                href="https://www.linkedin.com/company/aicteindia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit AICTE on LinkedIn"
                title="Visit AICTE on LinkedIn (Official Organisation)"
                className="hover:text-amber-400 focus:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 rounded p-0.5 transition-colors cursor-pointer"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.instagram.com/aicte.official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit AICTE on Instagram"
                title="Visit AICTE on Instagram (@aicte.official)"
                className="hover:text-amber-400 focus:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 rounded p-0.5 transition-colors cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.youtube.com/@MediaAICTE"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit AICTE on YouTube"
                title="Visit AICTE on YouTube (@MediaAICTE)"
                className="hover:text-amber-400 focus:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 rounded p-0.5 transition-colors cursor-pointer"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.aicte-india.org/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Official AICTE Website"
                title="Visit Official AICTE Web Portal (aicte-india.org)"
                className="hover:text-amber-400 focus:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 rounded p-0.5 transition-colors cursor-pointer text-slate-300"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              aria-label={isMobileMenuOpen ? t('mobileMenuClose') : t('mobileMenuToggle')}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-amber-400" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand Row with Official AICTE Emblem */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-4">
        <div
          onClick={() => handleNavSelect(currentUser?.type === 'institution' ? 'institution-workspace' : 'directory')}
          className="flex items-center gap-3 sm:gap-3.5 cursor-pointer group flex-1 min-w-0"
          title="Return to Portal Home"
        >
          <div className="flex-shrink-0">
            <YuktiAnimatedLogo size="lg" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] sm:text-[15px] font-semibold text-slate-900 tracking-tight leading-snug group-hover:text-blue-900 transition-colors truncate">
              {t('councilHindi')}
            </div>
            <div className="text-[14px] sm:text-[16px] md:text-[17px] font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-950 transition-colors truncate">
              {t('councilEnglish')}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 flex flex-wrap items-center gap-1 sm:gap-1.5 mt-0.5">
              <span className="truncate">{t('ministrySubtext')}</span>
              <span className="hidden sm:inline">·</span>
              <span className="text-amber-700 font-medium whitespace-nowrap">{t('yuktiScrutinyBadge')}</span>
              {currentUser && (
                <>
                  <span className="hidden md:inline">·</span>
                  <span className="text-emerald-700 font-semibold hidden md:flex items-center gap-1 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{t('loggedInAs')} {currentUser.role}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Search & Status Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors cursor-pointer"
            title="Search AICTE Circulars"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline max-w-[140px] truncate">{t('searchPlaceholder')}</span>
          </button>
          <div className="text-right hidden xl:block">
            <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('approvalSessionActive')}</span>
            </div>
            <div className="text-[10px] text-slate-500">{t('wefDate')}</div>
          </div>
        </div>
      </div>

      {/* Main Deep Blue AICTE Nav Strip with Tabs & Quick Actions (Desktop) */}
      <div className="bg-[#0b2545] text-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <nav className="flex items-center overflow-x-auto no-scrollbar text-xs font-medium">
            {currentUser?.type === 'institution' ? (
              <>
                <button
                  onClick={() => handleNavSelect('institution-workspace')}
                  className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'institution-workspace'
                      ? 'border-amber-400 text-amber-300 font-semibold bg-white/10'
                      : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('tabWorkspace')}</span>
                  <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-xs ml-0.5">
                    AY 2026-27
                  </span>
                </button>

                <button
                  onClick={() => handleNavSelect('portal')}
                  className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'portal'
                      ? 'border-amber-400 text-amber-300 font-semibold bg-white/10'
                      : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t('tabPortal')}</span>
                </button>

                <button
                  onClick={() => handleNavSelect('copilot')}
                  className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'copilot'
                      ? 'border-amber-400 text-amber-300 font-semibold bg-white/10'
                      : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('tabCopilot')}</span>
                </button>

                <button
                  onClick={() => handleNavSelect('documents')}
                  className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'documents'
                      ? 'border-amber-400 text-amber-300 font-semibold bg-white/10'
                      : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>{t('tabDocuments')}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavSelect('directory')}
                  className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'directory'
                      ? 'border-amber-400 text-amber-300 font-semibold bg-white/10'
                      : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('tabDirectory')}</span>
                  <span className="bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-xs ml-0.5">
                    Official
                  </span>
                </button>

                <button
                  onClick={() => handleNavSelect('scrutiny')}
                  className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'scrutiny'
                      ? 'border-amber-400 text-amber-300 font-semibold bg-white/10'
                      : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>{t('tabScrutiny')}</span>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-xs ml-0.5">
                    AI SAC
                  </span>
                </button>

                <button
                  onClick={() => handleNavSelect('portal')}
                  className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'portal'
                      ? 'border-amber-400 text-amber-300 font-semibold bg-white/10'
                      : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t('tabPortal')}</span>
                </button>

                <button
                  onClick={() => handleNavSelect('spoc')}
                  className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'spoc'
                      ? 'border-amber-400 text-amber-300 font-semibold bg-white/10'
                      : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{t('tabSpoc')}</span>
                </button>

                <button
                  onClick={() => handleNavSelect('copilot')}
                  className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'copilot'
                      ? 'border-amber-400 text-amber-300 font-semibold bg-white/10'
                      : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('tabCopilot')}</span>
                </button>

                <button
                  onClick={() => handleNavSelect('documents')}
                  className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'documents'
                      ? 'border-amber-400 text-amber-300 font-semibold bg-white/10'
                      : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>{t('tabDocuments')}</span>
                </button>
              </>
            )}
          </nav>

          {/* Quick Direct Links */}
          <div className="hidden xl:flex items-center gap-4 text-xs text-slate-200">
            <button
              onClick={onOpenDirectory}
              className="hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <span>{t('linkApprovedInstitutions')}</span>
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={onOpenPublicNotice}
              className="hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>{t('linkPublicNotices')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#082245] border-t border-blue-900/60 text-white animate-in slide-in-from-top-3 duration-200 shadow-2xl">
          <div className="px-4 py-4 space-y-3">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider pb-1 border-b border-blue-900/60">
              {t('mobileNavigation')}
            </div>

            <div className="grid grid-cols-1 gap-1">
              {currentUser?.type === 'institution' ? (
                <>
                  <button
                    onClick={() => handleNavSelect('institution-workspace')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                      currentTab === 'institution-workspace' ? 'bg-amber-500 text-slate-950' : 'hover:bg-white/10 text-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4" />
                      <span>{t('tabWorkspace')}</span>
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-600 text-white px-1.5 py-0.5 rounded">AY 2026-27</span>
                  </button>
                  <button
                    onClick={() => handleNavSelect('portal')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      currentTab === 'portal' ? 'bg-amber-500 text-slate-950' : 'hover:bg-white/10 text-slate-100'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>{t('tabPortal')}</span>
                  </button>
                  <button
                    onClick={() => handleNavSelect('copilot')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      currentTab === 'copilot' ? 'bg-amber-500 text-slate-950' : 'hover:bg-white/10 text-slate-100'
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    <span>{t('tabCopilot')}</span>
                  </button>
                  <button
                    onClick={() => handleNavSelect('documents')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      currentTab === 'documents' ? 'bg-amber-500 text-slate-950' : 'hover:bg-white/10 text-slate-100'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>{t('tabDocuments')}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavSelect('directory')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                      currentTab === 'directory' ? 'bg-amber-500 text-slate-950' : 'hover:bg-white/10 text-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      <span>{t('tabDirectory')}</span>
                    </span>
                    <span className="text-[10px] font-mono bg-blue-600 text-white px-1.5 py-0.5 rounded">TN Directory</span>
                  </button>
                  <button
                    onClick={() => handleNavSelect('scrutiny')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      currentTab === 'scrutiny' ? 'bg-amber-500 text-slate-950' : 'hover:bg-white/10 text-slate-100'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>{t('tabScrutiny')}</span>
                  </button>
                  <button
                    onClick={() => handleNavSelect('portal')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      currentTab === 'portal' ? 'bg-amber-500 text-slate-950' : 'hover:bg-white/10 text-slate-100'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>{t('tabPortal')}</span>
                  </button>
                  <button
                    onClick={() => handleNavSelect('spoc')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      currentTab === 'spoc' ? 'bg-amber-500 text-slate-950' : 'hover:bg-white/10 text-slate-100'
                    }`}
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{t('tabSpoc')}</span>
                  </button>
                  <button
                    onClick={() => handleNavSelect('copilot')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      currentTab === 'copilot' ? 'bg-amber-500 text-slate-950' : 'hover:bg-white/10 text-slate-100'
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    <span>{t('tabCopilot')}</span>
                  </button>
                  <button
                    onClick={() => handleNavSelect('documents')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      currentTab === 'documents' ? 'bg-amber-500 text-slate-950' : 'hover:bg-white/10 text-slate-100'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>{t('tabDocuments')}</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Language Switcher & Quick Links */}
            <div className="pt-2 border-t border-blue-900/60 flex flex-col gap-2">
              <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('selectLanguage')}:</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {supportedLanguages.map((langItem) => {
                  const isActive = language === langItem.code;
                  return (
                    <button
                      key={langItem.code}
                      onClick={() => setLanguage(langItem.code)}
                      className={`py-1.5 text-center rounded-lg text-xs font-bold transition ${
                        isActive ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {langItem.nativeLabel}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 text-xs">
                <button
                  onClick={() => {
                    onOpenPublicNotice();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 rounded text-amber-300 font-semibold text-center"
                >
                  {t('linkPublicNotices')}
                </button>
                <a
                  href="https://www.aicte-india.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 rounded text-slate-200 font-semibold text-center"
                >
                  {t('linkAicteWebsite')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">AICTE Approval Knowledge & Circulars Search</h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type keyword: Cadre ratio, Fire NOC, Land norms, ATAL FDP..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                autoFocus
              />
            </div>
            <div className="mt-3 max-h-60 overflow-y-auto space-y-2 text-xs">
              <div
                onClick={() => {
                  handleNavSelect('scrutiny');
                  setShowSearchModal(false);
                }}
                className="p-2.5 bg-slate-50 hover:bg-amber-50 rounded border border-slate-200 cursor-pointer transition-colors"
              >
                <div className="font-semibold text-slate-900">Cadre Ratio 1:2:6 Shortfall Remediation</div>
                <div className="text-[11px] text-slate-500 mt-0.5">APH 2026-27 Clause 2.14 & Appendix 7 for Engineering & Technology</div>
              </div>
              <div
                onClick={() => {
                  handleNavSelect('documents');
                  setShowSearchModal(false);
                }}
                className="p-2.5 bg-slate-50 hover:bg-amber-50 rounded border border-slate-200 cursor-pointer transition-colors"
              >
                <div className="font-semibold text-slate-900">Mandatory Statutory NOCs (Fire, Building Plan, Land Title)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Verification rules, validity windows, and renewal acknowledgment criteria</div>
              </div>
              <div
                onClick={() => {
                  handleNavSelect('copilot');
                  setShowSearchModal(false);
                }}
                className="p-2.5 bg-slate-50 hover:bg-amber-50 rounded border border-slate-200 cursor-pointer transition-colors"
              >
                <div className="font-semibold text-slate-900">Ask Nirnay Compliance Copilot: APH Norms & Affidavits</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Interactive Q&A on land conversion, joint FDR, and new courses</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
