/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Play,
  RefreshCw,
  Search,
  X,
  Building2,
  FileCheck2,
  Bot,
  Send,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { InstitutionApplication, AuthenticatedUser } from '../../types/aicte';
import { YuktiAnimatedLogo } from '../YuktiAnimatedLogo';
import { useLanguage } from '../../i18n/LanguageContext';
import { SupportedLanguage } from '../../i18n/translations';
import { resolveSpeechVoice } from '../../utils/speechSynthesis';

export type QueueSection =
  | 'all'
  | 'new_submissions'
  | 'pending_reviews'
  | 'awaiting_verification'
  | 'clarification_requested'
  | 'resubmissions'
  | 'incomplete_expired'
  | 'inconsistent_anomalous'
  | 'completed_approved';

interface YuktiOfficerExtensionProps {
  currentUser: AuthenticatedUser;
  institutions: InstitutionApplication[];
  onSelectInstitution: (institution: InstitutionApplication) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  externalNotification: string | null;
  onClearExternalNotification: () => void;
}

export const YuktiOfficerExtension: React.FC<YuktiOfficerExtensionProps> = ({
  currentUser,
  institutions,
  onSelectInstitution,
  isOpen,
  onClose,
  onOpen,
  externalNotification,
  onClearExternalNotification
}) => {
  // Enforce Officer-Only Security
  if (currentUser.type !== 'officer') {
    return null;
  }

  const { language, setLanguage, t, translateStatus, supportedLanguages } = useLanguage();

  // Extension Internal States:
  // 1. isQueueRevealed: false = Minimal Neutral Interface; true = Verification Queue Revealed
  const [isQueueRevealed, setIsQueueRevealed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'assistant'>('queue');
  const [activeSection, setActiveSection] = useState<QueueSection>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Audio / Speech Synthesis States
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [, setLastSpokenText] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Chat/Assistant States for AICTE Service Desk Copilot
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'ai' | 'user'; text: string; timestamp: string }>>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Namaste Officer. I am Nirnay, your Service Desk & Regulatory Intelligence Assistant for Southern Regional Office (SRO Chennai). How can I assist your scrutiny today?',
      timestamp: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatTyping, setIsChatTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Reset revealed queue state when extension closes to enforce Private by Default policy
  useEffect(() => {
    if (!isOpen) {
      setIsQueueRevealed(false);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    }
  }, [isOpen]);

  // Compute live verification metrics from actual authorized institutions records
  const queueData = useMemo(() => {
    let newSubmissionsCount = 0;
    let pendingReviewsCount = 0;
    let awaitingVerificationDocsTotal = 0;
    let clarificationRequestedCount = 0;
    let resubmissionsCount = 0;
    let incompleteExpiredDocsTotal = 0;
    let inconsistentDocsTotal = 0;
    let completedApprovedCount = 0;

    const items = institutions.map((inst) => {
      let instNewDocs = 0;
      let instAwaitingDocs = 0;
      let instVerifiedDocs = 0;
      let instAttentionDocs = 0;
      let instInconsistentDocs = 0;
      let instExpiredDocs = 0;

      inst.documents.forEach((d) => {
        if (
          d.status === 'Verified against an authorised source' ||
          d.status === 'Issuer-confirmed' ||
          d.status === 'Matched to an authorised record'
        ) {
          instVerifiedDocs++;
        } else if (
          d.status === 'Incomplete' ||
          d.status === 'AI-checked only' ||
          d.status === 'Requires human review'
        ) {
          instAwaitingDocs++;
          awaitingVerificationDocsTotal++;
          if (d.status === 'Incomplete') {
            instExpiredDocs++;
            incompleteExpiredDocsTotal++;
          }
        } else if (
          d.status === 'Potential anomaly' ||
          d.status === 'Inconsistent' ||
          d.status === 'Expired' ||
          d.status === 'Unable to verify'
        ) {
          instAttentionDocs++;
          if (d.status === 'Expired') {
            instExpiredDocs++;
            incompleteExpiredDocsTotal++;
          }
          if (d.status === 'Inconsistent' || d.status === 'Potential anomaly') {
            instInconsistentDocs++;
            inconsistentDocsTotal++;
          }
        }

        if (d.version > 1 || d.uploadDate.includes('2026')) {
          instNewDocs++;
        }
      });

      if (instNewDocs > 0) newSubmissionsCount++;
      if (inst.overallStatus === 'Under Automated Scrutiny' || inst.overallStatus === 'Draft') pendingReviewsCount++;
      if (inst.overallStatus === 'Clarification Required' || inst.overallStatus === 'Deficiency Issued') clarificationRequestedCount++;
      if (inst.previousSubmissions && inst.previousSubmissions.length > 0) resubmissionsCount++;
      if (inst.overallStatus === 'Approved / Compliant') completedApprovedCount++;

      return {
        institution: inst,
        id: inst.id,
        name: inst.institutionName,
        shortName: inst.shortName,
        pid: inst.pid,
        district: inst.district,
        appId: inst.applicationId,
        academicYear: inst.academicYear,
        submissionDate: inst.documents[0]?.uploadDate || '2026-02-14',
        submissionTime: '10:30 AM',
        newDocsCount: instNewDocs,
        awaitingDocsCount: instAwaitingDocs,
        verifiedDocsCount: instVerifiedDocs,
        attentionDocsCount: instAttentionDocs,
        expiredDocsCount: instExpiredDocs,
        inconsistentDocsCount: instInconsistentDocs,
        status: inst.overallStatus,
        lastUpdated: inst.lastUpdatedDate
      };
    });

    return {
      items,
      newSubmissionsCount,
      pendingReviewsCount,
      awaitingVerificationDocsTotal,
      clarificationRequestedCount,
      resubmissionsCount,
      incompleteExpiredDocsTotal,
      inconsistentDocsTotal,
      completedApprovedCount
    };
  }, [institutions]);

  // Filter queue items based on active section and search query
  const filteredQueueItems = useMemo(() => {
    return queueData.items.filter((item) => {
      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.pid.toLowerCase().includes(query) ||
        item.appId.toLowerCase().includes(query) ||
        item.district.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Section match
      if (activeSection === 'new_submissions') return item.newDocsCount > 0;
      if (activeSection === 'pending_reviews') return item.status === 'Under Automated Scrutiny' || item.status === 'Draft';
      if (activeSection === 'awaiting_verification') return item.awaitingDocsCount > 0;
      if (activeSection === 'clarification_requested') return item.status === 'Clarification Required' || item.status === 'Deficiency Issued';
      if (activeSection === 'resubmissions') return !!(item.institution.previousSubmissions && item.institution.previousSubmissions.length > 0);
      if (activeSection === 'incomplete_expired') return item.expiredDocsCount > 0;
      if (activeSection === 'inconsistent_anomalous') return item.inconsistentDocsCount > 0;
      if (activeSection === 'completed_approved') return item.status === 'Approved / Compliant';

      return true;
    });
  }, [queueData, activeSection, searchQuery]);

  // Speech Synthesis Helper with Graceful Voice Fallback
  const speakText = (text: string, langToSpeak: SupportedLanguage = language) => {
    if (!window.speechSynthesis || isVoiceMuted) return;

    try {
      window.speechSynthesis.cancel();
      const resolution = resolveSpeechVoice(langToSpeak);

      if (resolution.isFallback && resolution.warningNotice) {
        setVoiceNotice(resolution.warningNotice);
      } else {
        setVoiceNotice(null);
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      if (resolution.voice) {
        utterance.voice = resolution.voice;
      }
      utterance.lang =
        resolution.effectiveLanguage === 'hi'
          ? 'hi-IN'
          : resolution.effectiveLanguage === 'ta'
          ? 'ta-IN'
          : 'en-IN';

      utterance.onstart = () => {
        setIsSpeaking(true);
        setAutoplayBlocked(false);
      };

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setLastSpokenText(text);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech error:', err);
      setIsSpeaking(false);
    }
  };

  const handleStopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // One-time session login voice briefing
  useEffect(() => {
    const sessionKey = `nirnay_officer_briefed_${currentUser.id}_session`;
    const alreadyBriefed = sessionStorage.getItem(sessionKey);

    if (!alreadyBriefed) {
      let script = '';
      if (language === 'hi') {
        script = `निर्णय सर्विस डेस्क में आपका स्वागत है, अधिकारी ${currentUser.name}। आपके सत्यापन कार्यक्षेत्र में अद्यतन विवरण तैयार हैं। कृपया सत्यापन कतार देखने के लिए क्लिक करें।`;
      } else if (language === 'ta') {
        script = `நிர்ணய் சேவை மையத்திற்கு நல்வரவு, அதிகாரி ${currentUser.name}. சரிபார்ப்பு விவரங்கள் தயாராக உள்ளன. வரிசையைக் காண கிளிக் செய்யவும்.`;
      } else {
        script = `Welcome to Nirnay Service Desk, Officer ${currentUser.name}. Your verification workspace is ready with authorized updates. Click View Verification Queue to review pending submissions.`;
      }

      setLastSpokenText(script);
      try {
        speakText(script, language);
        sessionStorage.setItem(sessionKey, 'true');
      } catch {
        setAutoplayBlocked(true);
      }
    }
  }, [currentUser.id, language]);

  // Handle Play Voice Briefing
  const handlePlayBriefing = () => {
    let script = '';
    const pendingTotal = queueData.pendingReviewsCount + queueData.clarificationRequestedCount;

    if (language === 'hi') {
      script = `एआईसीटीई सर्विस डेस्क ब्रीफिंग: आपके पास ${pendingTotal} लंबित ईओए आवेदन हैं, और ${queueData.awaitingVerificationDocsTotal} दस्तावेज़ सत्यापन की प्रतीक्षा कर रहे हैं।`;
    } else if (language === 'ta') {
      script = `ஏஐசிடிஇ பணி சுருக்கம்: ${pendingTotal} விண்ணப்பங்கள் மற்றும் ${queueData.awaitingVerificationDocsTotal} ஆவணங்கள் சரிபார்ப்புக்காக நிலுவையில் உள்ளன.`;
    } else {
      script = `AICTE Service Desk Briefing: You have ${pendingTotal} pending EOA applications across authorized technical institutions, with ${queueData.awaitingVerificationDocsTotal} documents awaiting statutory verification.`;
    }

    speakText(script, language);
  };

  // Speak specific college status
  const handleSpeakCollege = (item: (typeof queueData.items)[0]) => {
    let speech = '';
    if (language === 'hi') {
      speech = `${item.name} की स्थिति: आवेदन संख्या ${item.appId}। कुल ${item.awaitingDocsCount} दस्तावेज़ सत्यापन के लिए लंबित हैं।`;
    } else if (language === 'ta') {
      speech = `${item.name} சரிபார்ப்பு நிலை: விண்ணப்ப எண் ${item.appId}. ${item.awaitingDocsCount} ஆவணங்கள் நிலுவையில் உள்ளன.`;
    } else {
      speech = `Status report for ${item.name}. Application ID ${item.appId}. ${item.verifiedDocsCount} documents verified, ${item.awaitingDocsCount} awaiting verification, and ${item.attentionDocsCount} requiring attention. Status: ${item.status}.`;
    }

    speakText(speech, language);
  };

  // Test voice
  const handleTestVoice = () => {
    const testMsg =
      language === 'hi'
        ? 'यह एआईसीटीई सर्विस डेस्क ध्वनि प्रणाली का परीक्षण संदेश है।'
        : language === 'ta'
        ? 'இது ஏஐசிடிஇ சேவை மைய குரல் எச்சரிக்கை சோதனை அறிவிப்பு.'
        : 'This is a test announcement from the AICTE Service Desk Voice System.';
    speakText(testMsg, language);
  };

  // Refresh summary
  const handleRefreshSummary = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      handlePlayBriefing();
    }, 500);
  };

  // Handle sending chat message to AICTE Service Desk Assistant
  const handleSendChatMessage = (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user' as const,
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('fire') || q.includes('noc')) {
        reply = language === 'hi'
          ? 'एआईसीटीई ए.पी.एच. 2026-27 खंड 4.2 एवं तमिलनाडु अग्निशमन सेवा (TNFRS) नियमों के अनुसार:\n• प्रत्येक संस्थान के पास चालू सत्र 2026-27 हेतु वैध अग्निशमन एनओसी होना अनिवार्य है।\n• तमिलनाडु में जारीकर्ता प्राधिकारी प्रभागीय अग्निशमन अधिकारी (DFO) हैं।'
          : language === 'ta'
          ? 'ஏஐசிடிஇ விதிகள் 2026-27 மற்றும் தமிழ்நாடு தீயணைப்புத் துறை (TNFRS) விதிகளின்படி:\n• ஒவ்வொரு தொழில்நுட்பக் கல்லூரியும் கல்வியாண்டு 2026-27 க்கான செல்லுபடியாகும் தீயணைப்பு தடையில்லாச் சான்றிதழை வைத்திருக்க வேண்டும்.'
          : 'According to AICTE APH 2026-27 Clause 4.2 & Tamil Nadu Fire and Rescue Services (TNFRS) rules:\n• Every technical institution must hold a valid Fire NOC covering the academic session (AY 2026-27).\n• In Tamil Nadu, the issuing authority is the Divisional Fire Officer (DFO).\n• If renewal is underway, formal inspection fee receipt and station acknowledgment must be deposited before final committee approval.';
      } else if (q.includes('land') || q.includes('area') || q.includes('carpet')) {
        reply = language === 'hi'
          ? 'एआईसीटीई ए.पी.एच. अध्याय IV के अंतर्गत:\n• मेट्रो/शहरी क्षेत्रों में न्यूनतम 4.0 एकड़ निरंतर भूमि आवश्यक है।\n• ग्रामीण परिसरों हेतु 7.5 एकड़ निरंतर भूमि अनिवार्य है।'
          : language === 'ta'
          ? 'ஏஐசிடிஇ விதிமுறைகள் அத்தியாயம் IV இன் கீழ்:\n• நகர்ப்புற பொறியியல் கல்லூரிகளுக்கு குறைந்தபட்சம் 4.0 ஏக்கர் தொடர்ச்சியான நிலம் தேவை.\n• ஊரகப் பகுதி வளாகங்களுக்கு 7.5 ஏக்கர் நிலம் கட்டாயமாகும்.'
          : 'Under AICTE APH 2024–27 Chapter IV:\n• Engineering institutions in Metro/Urban clusters require a minimum of 4.0 contiguous acres (2.5 acres in Mega Cities with permissible FSI).\n• Rural engineering campuses require 7.5 contiguous acres.\n• Carpet area norms prescribe 66 sq.m for standard instructional classrooms and 88 sq.m for core laboratory workshops.';
      } else if (q.includes('cadre') || q.includes('sfr') || q.includes('faculty')) {
        reply = language === 'hi'
          ? 'संकाय संवर्ग एवं अनुपात मानक:\n• छात्र-संकाय अनुपात (SFR) 1:20 है।\n• संवर्ग अनुपात 1 प्रोफेसर : 2 एसोसिएट प्रोफेसर : 6 असिस्टेंट प्रोफेसर है।'
          : language === 'ta'
          ? 'பேராசிரியர் விகித விதிமுறைகள்:\n• மாணவர்-ஆசிரியர் விகிதம் 1:20 ஆகும்.\n• ஆசிரியர் விகிதம் 1 பேராசிரியர் : 2 இணை பேராசிரியர் : 6 உதவி பேராசிரியர் ஆக இருக்க வேண்டும்.'
          : 'Faculty Cadre & Ratio Norms (APH 2024–27 Chapter VII):\n• Student-to-Faculty Ratio (SFR) is 1:20 for Undergraduate Engineering & Technology (1:15 for NBA-accredited branches).\n• Cadre ratio must adhere to 1 Professor : 2 Associate Professors : 6 Assistant Professors.\n• The Principal / Director must possess an earned Ph.D with a minimum of 15 years research/teaching experience.';
      } else {
        reply = language === 'hi'
          ? 'मैंने आपके प्रश्न का संदर्भ आधिकारिक एआईसीटीई अनुमोदन प्रक्रिया पुस्तिका (APH 2026-27) से लिया है। आप भूमि मानकों, संरचनात्मक स्थिरता, या एसपीओसी नोटिस संबंधी प्रश्न पूछ सकते हैं।'
          : language === 'ta'
          ? 'ஏஐசிடிஇ ஒப்புதல் செயல்முறை கையேடு (APH 2026-27) அடிப்படையில் உங்கள் வினா ஆய்வு செய்யப்பட்டது. நிலம், தீயணைப்புச் சான்று அல்லது பேராசிரியர்கள் குறித்து மேலும் கேட்கலாம்.'
          : 'I have cross-referenced your query against the official AICTE Approval Process Handbook (APH 2026-27) for the Southern Region (Tamil Nadu). You can ask about land titles, structural certificates, cadre ratios, or draft SPOC notices.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsChatTyping(false);
    }, 550);
  };

  return (
    <>
      {/* 1. Closed State Floating Launcher Button (Middle-Right Edge) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          aria-label={t('extensionTitle')}
          title={`${t('extensionTitle')} · ${t('queueTitle')}`}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#082245] hover:bg-[#0b2d5c] text-white p-3 rounded-l-2xl shadow-2xl border-l-2 border-y-2 border-amber-400/80 transition-transform hover:scale-105 active:scale-95 flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <div className="relative">
            <YuktiAnimatedLogo size="sm" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-amber-300 writing-vertical select-none font-['Poppins']">
            Nirnay Desk
          </span>
        </button>
      )}

      {/* Generic Non-Confidential Toast when closed */}
      {!isOpen && externalNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#082245] text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-500/50 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5 max-w-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 flex items-center justify-center text-amber-300 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Nirnay Update</div>
              <div className="text-[11px] text-slate-300 leading-snug">
                {externalNotification}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                onOpen();
                onClearExternalNotification();
              }}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer"
            >
              Open
            </button>
            <button
              onClick={onClearExternalNotification}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 2. Opened State Extension Panel (Fixed Right Drawer with Responsive Full Width on Mobile) */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] md:w-[620px] bg-slate-950 text-slate-100 shadow-2xl border-l border-slate-800 flex flex-col font-['Poppins'] animate-in slide-in-from-right-10 duration-200">
          {/* Extension Header */}
          <header className="bg-[#082245] px-4 sm:px-5 py-3.5 border-b border-blue-900/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <YuktiAnimatedLogo size="sm" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                    {t('extensionTitle')}
                  </h3>
                  <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    {t('extensionSroBadge')}
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{t('extensionSubtitle')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onClose}
                aria-label="Close Extension"
                title="Close Extension (Conceals details)"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Autoplay Warning Banner if audio was blocked */}
          {autoplayBlocked && (
            <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-amber-300 text-xs flex items-center justify-between gap-2">
              <span>{t('voiceAutoplayNotice')}</span>
              <button
                onClick={handlePlayBriefing}
                className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-bold text-[11px] rounded"
              >
                {t('btnPlayAudio')}
              </button>
            </div>
          )}

          {/* Voice Fallback Notice Banner (e.g. Tamil speech engine missing) */}
          {voiceNotice && (
            <div className="bg-blue-950/90 border-b border-blue-800 px-4 py-2 text-blue-200 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">{voiceNotice}</span>
              </div>
              <button
                onClick={() => setVoiceNotice(null)}
                className="text-slate-400 hover:text-white p-0.5"
              >
                ✕
              </button>
            </div>
          )}

          {/* Top Voice & Language Control Bar */}
          <div className="bg-slate-900/90 px-3 sm:px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">{t('voiceTitle')}:</span>
              {/* Central 3-Language Selector Inside Extension */}
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-md p-0.5 text-[10px]">
                {supportedLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-1.5 py-0.5 rounded font-semibold transition cursor-pointer ${
                      language === l.code ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {l.nativeLabel}
                  </button>
                ))}
              </div>

              {isSpeaking ? (
                <button
                  onClick={handleStopSpeech}
                  className="px-2 py-1 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <VolumeX className="w-3 h-3 text-rose-400" />
                  <span>{t('btnStopVoice')}</span>
                </button>
              ) : (
                <button
                  onClick={handlePlayBriefing}
                  className="px-2 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                  title="Play Voice Briefing"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{t('btnVoiceBriefing')}</span>
                </button>
              )}

              <button
                onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                className={`p-1 rounded border text-[10px] cursor-pointer ${
                  isVoiceMuted ? 'bg-rose-950 text-rose-400 border-rose-800' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title={isVoiceMuted ? t('tooltipUnmuteVoice') : t('tooltipMuteVoice')}
              >
                {isVoiceMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </button>

              <button
                onClick={handleTestVoice}
                className="px-1.5 py-1 text-[10px] text-slate-400 hover:text-white cursor-pointer"
                title="Test Voice Synthesizer"
              >
                {t('btnTestVoice')}
              </button>
            </div>

            <button
              onClick={handleRefreshSummary}
              disabled={isRefreshing}
              className="p-1 text-slate-400 hover:text-white cursor-pointer ml-auto"
              title={t('btnRefreshSummary')}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>

          {/* Mode Switcher Tabs inside Extension */}
          <div className="flex border-b border-slate-800 bg-slate-900/60 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('queue')}
              className={`flex-1 py-2.5 text-center border-b-2 transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'queue'
                  ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{t('queueTitle')}</span>
              {isQueueRevealed && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex-1 py-2.5 text-center border-b-2 transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'assistant'
                  ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>AICTE Service Desk</span>
            </button>
          </div>

          {/* MAIN BODY: Verification Queue Tab */}
          {activeTab === 'queue' && (
            <div className="flex-1 overflow-y-auto flex flex-col">
              {/* STATE A: Minimal Neutral Interface (Private by Default) */}
              {!isQueueRevealed ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center space-y-5 animate-in fade-in">
                  <div className="w-16 h-16 rounded-3xl bg-blue-950/80 border-2 border-blue-800/80 flex items-center justify-center text-blue-400 shadow-xl">
                    <Shield className="w-8 h-8 text-blue-400" />
                  </div>

                  <div className="space-y-1.5 max-w-sm">
                    <h4 className="text-base font-bold text-white">
                      {t('extensionReadyHeadline')}
                    </h4>
                    <p className="text-sm font-medium text-slate-300">
                      {t('extensionReadySubtext')}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {t('extensionPrivacyNote')}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setIsQueueRevealed(true)}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-lg shadow-blue-600/30 transition-transform active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-white" />
                      <span>{t('btnViewQueue')}</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-4 border-t border-slate-900">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Protected under AICTE Officer Privacy Policy (EAL4+)</span>
                  </div>
                </div>
              ) : (
                /* STATE B: Protected Verification Queue Revealed */
                <div className="flex-1 flex flex-col p-3 sm:p-4 space-y-4 animate-in fade-in">
                  {/* Top Bar with Hide Action & Search */}
                  <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {t('queueTitle')}
                      </span>
                    </div>

                    <button
                      onClick={() => setIsQueueRevealed(false)}
                      className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      title={t('btnHideQueue')}
                    >
                      <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('btnHideQueue')}</span>
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('searchQueuePlaceholder')}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* 8 Section Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                    <button
                      onClick={() => setActiveSection('all')}
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                        activeSection === 'all' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('secAll')} ({queueData.items.length})
                    </button>
                    <button
                      onClick={() => setActiveSection('new_submissions')}
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                        activeSection === 'new_submissions' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('secNewSubmissions')} ({queueData.newSubmissionsCount})
                    </button>
                    <button
                      onClick={() => setActiveSection('pending_reviews')}
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                        activeSection === 'pending_reviews' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('secPendingReviews')} ({queueData.pendingReviewsCount})
                    </button>
                    <button
                      onClick={() => setActiveSection('awaiting_verification')}
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                        activeSection === 'awaiting_verification' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('secAwaitingDocs')} ({queueData.awaitingVerificationDocsTotal})
                    </button>
                    <button
                      onClick={() => setActiveSection('clarification_requested')}
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                        activeSection === 'clarification_requested' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('secClarificationReq')} ({queueData.clarificationRequestedCount})
                    </button>
                    <button
                      onClick={() => setActiveSection('resubmissions')}
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                        activeSection === 'resubmissions' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('secResubmissions')} ({queueData.resubmissionsCount})
                    </button>
                    <button
                      onClick={() => setActiveSection('incomplete_expired')}
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                        activeSection === 'incomplete_expired' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('secIncompleteExpired')} ({queueData.incompleteExpiredDocsTotal})
                    </button>
                    <button
                      onClick={() => setActiveSection('inconsistent_anomalous')}
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                        activeSection === 'inconsistent_anomalous' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('secAnomalies')} ({queueData.inconsistentDocsTotal})
                    </button>
                    <button
                      onClick={() => setActiveSection('completed_approved')}
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                        activeSection === 'completed_approved' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('secCompleted')} ({queueData.completedApprovedCount})
                    </button>
                  </div>

                  {/* Institution Application Cards List */}
                  <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                    {filteredQueueItems.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400 italic">
                        {t('emptyDirectory')}
                      </div>
                    ) : (
                      filteredQueueItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-xs line-clamp-1">
                                  {item.name}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                PID: {item.pid} · {item.district}, TN · AY {item.academicYear}
                              </div>
                            </div>

                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
                                item.status === 'Approved / Compliant'
                                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                  : item.status === 'Clarification Required'
                                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                                  : item.status === 'Deficiency Issued'
                                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                                  : 'bg-blue-950 text-blue-300 border-blue-800'
                              }`}
                            >
                              {translateStatus(item.status)}
                            </span>
                          </div>

                          {/* Distinct Document Counts Matrix */}
                          <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-950/70 rounded-lg text-center text-[10px]">
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase">{t('statNew')}</span>
                              <span className="font-mono font-bold text-blue-400">{item.newDocsCount}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase">{t('statAwaiting')}</span>
                              <span className="font-mono font-bold text-amber-300">{item.awaitingDocsCount}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase">{t('statVerified')}</span>
                              <span className="font-mono font-bold text-emerald-400">{item.verifiedDocsCount}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase">{t('statAttention')}</span>
                              <span className="font-mono font-bold text-rose-400">{item.attentionDocsCount}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="text-[10px] text-slate-400 font-mono">
                              App: {item.appId}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSpeakCollege(item)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-medium flex items-center gap-1 transition cursor-pointer"
                                title="Listen to college workload"
                              >
                                <Volume2 className="w-3 h-3" />
                                <span>{t('btnListen')}</span>
                              </button>

                              <button
                                onClick={() => {
                                  onSelectInstitution(item.institution);
                                  onClose();
                                }}
                                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer shadow-xs"
                              >
                                <Eye className="w-3 h-3" />
                                <span>{t('btnInspect')}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MAIN BODY: AICTE Service Desk Assistant Chat Tab */}
          {activeTab === 'assistant' && (
            <div className="flex-1 overflow-hidden flex flex-col p-3 sm:p-4">
              {/* Context Header */}
              <div className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">AICTE Service Desk</span>
                    <span className="text-[10px] text-slate-400">Southern Regional Office (Chennai)</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Regulatory Guide
                </span>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line ${
                        m.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 font-mono px-1">
                      {m.timestamp}
                    </span>
                  </div>
                ))}
                {isChatTyping && (
                  <div className="text-xs text-slate-400 italic flex items-center gap-1.5 p-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>Nirnay Assistant checking APH regulations...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex gap-1.5 overflow-x-auto py-2 no-scrollbar">
                <button
                  onClick={() => handleSendChatMessage('Check Land & Built-up Norms for Tamil Nadu')}
                  className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 whitespace-nowrap cursor-pointer"
                >
                  {t('promptLand')}
                </button>
                <button
                  onClick={() => handleSendChatMessage('Verify Fire NOC Rules (Tamil Nadu TNFRS)')}
                  className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 whitespace-nowrap cursor-pointer"
                >
                  {t('promptFire')}
                </button>
                <button
                  onClick={() => handleSendChatMessage('Explain SFR Cadre Ratio 1:2:6')}
                  className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 whitespace-nowrap cursor-pointer"
                >
                  {t('promptCadre')}
                </button>
                <button
                  onClick={() => handleSendChatMessage('Check Joint FDR Requirements')}
                  className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 whitespace-nowrap cursor-pointer"
                >
                  {t('promptFdr')}
                </button>
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="flex gap-2 pt-2 border-t border-slate-800"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t('askCopilotPlaceholder')}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};
