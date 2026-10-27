/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Building2,
  FileCheck2,
  Clock,
  ChevronDown,
  ChevronUp,
  Radio,
  Eye,
  Send,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { InstitutionApplication, AuthenticatedUser } from '../../types/aicte';

interface OfficerVoiceBriefingPanelProps {
  currentUser: AuthenticatedUser;
  institutions: InstitutionApplication[];
  onSelectInstitution: (institution: InstitutionApplication) => void;
}

export type BriefingLanguage = 'en' | 'hi' | 'ta';

export const OfficerVoiceBriefingPanel: React.FC<OfficerVoiceBriefingPanelProps> = ({
  currentUser,
  institutions,
  onSelectInstitution
}) => {
  // Only accessible to authenticated AICTE officers
  if (currentUser.type !== 'officer') {
    return null;
  }

  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<BriefingLanguage>('en');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [lastSpokenText, setLastSpokenText] = useState<string>('');
  const [latestNotification, setLatestNotification] = useState<{
    id: string;
    text: string;
    collegeName: string;
    timestamp: string;
    appId: string;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedCollegeForSpeech, setSelectedCollegeForSpeech] = useState<string>('');

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Compute live backend metrics across all institutions
  const summaryMetrics = useMemo(() => {
    let totalApplications = institutions.length;
    let pendingApplications = 0;
    let awaitingInitialScrutiny = 0;
    let awaitingClarification = 0;
    let completedOrApproved = 0;

    let totalDocs = 0;
    let newDocs = 0;
    let awaitingVerificationDocs = 0;
    let verifiedDocs = 0;
    let flaggedDocs = 0;

    const collegeBreakdown = institutions.map((inst) => {
      let instNewDocs = 0;
      let instAwaiting = 0;
      let instVerified = 0;
      let instFlagged = 0;

      inst.documents.forEach((d) => {
        totalDocs++;
        // Classify documents
        if (d.status === 'Verified against an authorised source' || d.status === 'Issuer-confirmed' || d.status === 'Matched to an authorised record') {
          instVerified++;
          verifiedDocs++;
        } else if (d.status === 'Incomplete' || d.status === 'AI-checked only' || d.status === 'Requires human review') {
          instAwaiting++;
          awaitingVerificationDocs++;
        } else if (d.status === 'Potential anomaly' || d.status === 'Inconsistent' || d.status === 'Expired' || d.status === 'Unable to verify') {
          instFlagged++;
          flaggedDocs++;
        }

        // New docs submitted in latest version
        if (d.version > 1 || d.uploadDate.includes('2026')) {
          instNewDocs++;
          newDocs++;
        }
      });

      if (inst.overallStatus === 'Under Automated Scrutiny' || inst.overallStatus === 'Draft') {
        awaitingInitialScrutiny++;
        pendingApplications++;
      } else if (inst.overallStatus === 'Clarification Required' || inst.overallStatus === 'Deficiency Issued') {
        awaitingClarification++;
        pendingApplications++;
      } else if (inst.overallStatus === 'Approved / Compliant') {
        completedOrApproved++;
      }

      return {
        institution: inst,
        id: inst.id,
        name: inst.institutionName,
        shortName: inst.shortName,
        pid: inst.pid,
        appId: inst.applicationId,
        academicYear: inst.academicYear,
        totalDocs: inst.documents.length,
        newDocs: instNewDocs,
        awaitingDocs: instAwaiting,
        verifiedDocs: instVerified,
        flaggedDocs: instFlagged,
        status: inst.overallStatus,
        lastUpdated: inst.lastUpdatedDate,
        submissionDate: inst.documents[0]?.uploadDate || '2026-02-14'
      };
    });

    return {
      totalApplications,
      pendingApplications,
      awaitingInitialScrutiny,
      awaitingClarification,
      completedOrApproved,
      totalCollegesCount: institutions.length,
      totalDocs,
      newDocs,
      awaitingVerificationDocs,
      verifiedDocs,
      flaggedDocs,
      collegeBreakdown
    };
  }, [institutions]);

  // Construct Dynamic Briefing Text based on selected language
  const getBriefingScript = (lang: BriefingLanguage): string => {
    const { pendingApplications, totalCollegesCount, awaitingVerificationDocs, newDocs } = summaryMetrics;

    if (lang === 'hi') {
      if (pendingApplications === 0) {
        return `निर्णय पोर्टल में आपका स्वागत है, अधिकारी ${currentUser.name}। वर्तमान में सभी ईओए सत्यापन कार्य पूर्ण हैं।`;
      }
      return `निर्णय पोर्टल में आपका स्वागत है, अधिकारी ${currentUser.name}। आपके पास ${totalCollegesCount} कॉलेजों से ${pendingApplications} लंबित ईओए आवेदन हैं। ${newDocs} नए दस्तावेज़ प्राप्त हुए हैं, और ${awaitingVerificationDocs} दस्तावेज़ सत्यापन की प्रतीक्षा कर रहे हैं। कृपया सत्यापन कतार की समीक्षा करें।`;
    }

    if (lang === 'ta') {
      if (pendingApplications === 0) {
        return `நிர்ணய் போர்ட்டலுக்கு நல்வரவு, அதிகாரி ${currentUser.name}. தற்பொழுது அனைத்து சரிபார்ப்பு பணிகளும் நிறைவடைந்துள்ளன.`;
      }
      return `நிர்ணய் போர்ட்டலுக்கு நல்வரவு, அதிகாரி ${currentUser.name}. ${totalCollegesCount} கல்லூரிகளிலிருந்து ${pendingApplications} விண்ணப்பங்கள் நிலுவையில் உள்ளன. ${newDocs} புதிய ஆவணங்கள் சமர்ப்பிக்கப்பட்டுள்ளன, மேலும் ${awaitingVerificationDocs} ஆவணங்கள் சரிபார்ப்புக்காக காத்திருக்கின்றன.`;
    }

    // Default English
    if (pendingApplications === 0) {
      return `Welcome to Nirnay, Officer ${currentUser.name}. All EOA submissions are currently up to date with zero pending verifications.`;
    }
    return `Welcome to Nirnay, Officer ${currentUser.name}. You have ${pendingApplications} pending EOA applications from ${totalCollegesCount} colleges. ${newDocs} new document submissions have arrived, and ${awaitingVerificationDocs} documents are awaiting statutory verification. Please review the pending verification queue.`;
  };

  // Safe Speak Function using Browser SpeechSynthesis
  const speakText = (text: string, lang: BriefingLanguage = selectedLanguage) => {
    if (!window.speechSynthesis) {
      console.warn('SpeechSynthesis is unavailable in this environment.');
      return;
    }

    if (isVoiceMuted) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any active speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Assign matching language voice code
      if (lang === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (lang === 'ta') {
        utterance.lang = 'ta-IN';
      } else {
        utterance.lang = 'en-IN';
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setAutoplayBlocked(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis event:', e);
        setIsSpeaking(false);
        if (e.error === 'not-allowed') {
          setAutoplayBlocked(true);
        }
      };

      speechRef.current = utterance;
      setLastSpokenText(text);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis execution error:', err);
      setAutoplayBlocked(true);
    }
  };

  const handleStopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // ONE-TIME Automatic Login Briefing per officer session
  useEffect(() => {
    const sessionKey = `nirnay_officer_briefed_${currentUser.id}_2026`;
    const alreadyBriefed = sessionStorage.getItem(sessionKey);

    if (!alreadyBriefed) {
      const script = getBriefingScript(selectedLanguage);
      setLastSpokenText(script);

      // Attempt automatic speech
      try {
        speakText(script, selectedLanguage);
        sessionStorage.setItem(sessionKey, 'true');
      } catch (err) {
        setAutoplayBlocked(true);
      }
    }
  }, [currentUser.id]);

  // Handler: Manual Briefing Play
  const handlePlayBriefing = () => {
    const script = getBriefingScript(selectedLanguage);
    speakText(script, selectedLanguage);
  };

  // Handler: Replay Last Alert
  const handleReplayLast = () => {
    if (lastSpokenText) {
      speakText(lastSpokenText, selectedLanguage);
    } else {
      handlePlayBriefing();
    }
  };

  // Handler: Test Voice
  const handleTestVoice = () => {
    const testMsg =
      selectedLanguage === 'hi'
        ? 'यह निर्णय ध्वनि प्रणाली का परीक्षण संदेश है।'
        : selectedLanguage === 'ta'
        ? 'இது நிர்ணய் குரல் எச்சரிக்கை சோதனை அறிவிப்பு.'
        : 'This is a test notification from the Nirnay Officer Voice Alert System.';
    speakText(testMsg, selectedLanguage);
  };

  // Handler: Refresh Summary from backend
  const handleRefreshSummary = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const refreshedScript = getBriefingScript(selectedLanguage);
      speakText(refreshedScript, selectedLanguage);
    }, 600);
  };

  // Handler: Listen to Specific College Status
  const handleSpeakCollegeStatus = (college: (typeof summaryMetrics.collegeBreakdown)[0]) => {
    setSelectedCollegeForSpeech(college.id);
    let announcement = '';

    if (selectedLanguage === 'hi') {
      announcement = `${college.name} के लिए स्थिति रिपोर्ट। आवेदन संख्या ${college.appId}। कुल ${college.totalDocs} दस्तावेज़ जमा किए गए हैं, ${college.awaitingDocs} सत्यापन के लिए लंबित हैं, और ${college.flaggedDocs} पर स्पष्टीकरण आवश्यक है।`;
    } else if (selectedLanguage === 'ta') {
      announcement = `${college.name} சரிபார்ப்பு நிலை. விண்ணப்ப எண் ${college.appId}. மொத்தம் ${college.totalDocs} ஆவணங்கள் சமர்ப்பிக்கப்பட்டுள்ளன, ${college.awaitingDocs} சரிபார்ப்புக்காக நிலுவையில் உள்ளன.`;
    } else {
      announcement = `Status report for ${college.name}. Application ID ${college.appId}. ${college.totalDocs} documents have been submitted: ${college.verifiedDocs} verified, ${college.awaitingDocs} awaiting verification, and ${college.flaggedDocs} flagged for review. Overall status: ${college.status}.`;
    }

    setLatestNotification({
      id: `notif-${Date.now()}`,
      text: announcement,
      collegeName: college.name,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      appId: college.appId
    });

    speakText(announcement, selectedLanguage);
  };

  // Handler: Simulate Live Incoming Submission
  const handleSimulateNewSubmission = (college = summaryMetrics.collegeBreakdown[0]) => {
    if (!college) return;

    const notifText = `New submission received from ${college.name}. Application ID ${college.appId}. ${college.totalDocs} documents submitted, ${college.awaitingDocs} documents awaiting statutory verification.`;

    setLatestNotification({
      id: `notif-${Date.now()}`,
      text: notifText,
      collegeName: college.name,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      appId: college.appId
    });

    speakText(notifText, selectedLanguage);
  };

  return (
    <section className="bg-slate-900 border-b border-slate-800 text-slate-100 shadow-lg relative z-20">
      {/* Autoplay Warning Banner if browser blocked initial speech */}
      {autoplayBlocked && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 sm:px-8 py-2 text-amber-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              Your daily EOA verification briefing is ready. Browser autoplay requires a click to start audio.
            </span>
          </div>
          <button
            onClick={handlePlayBriefing}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-md shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Voice Briefing</span>
          </button>
        </div>
      )}

      {/* Main Top Control Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Officer Title & Live Voice State */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-inner">
            <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white tracking-wide">
                AICTE Officer Voice Briefing & Verification Queue
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                Authorised Terminal
              </span>
              {isSpeaking ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1 animate-pulse">
                  <Volume2 className="w-3 h-3 text-blue-400" />
                  <span>Speaking...</span>
                </span>
              ) : isVoiceMuted ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                  <VolumeX className="w-3 h-3 text-rose-400" />
                  <span>Audio Muted</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  Voice Ready
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
              <span>{summaryMetrics.pendingApplications} Pending Applications</span>
              <span>·</span>
              <span className="text-amber-400 font-semibold">{summaryMetrics.awaitingVerificationDocs} Docs Awaiting Scrutiny</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">{summaryMetrics.verifiedDocs} Verified</span>
            </div>
          </div>
        </div>

        {/* Right: Audio Control Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Selector for Voice */}
          <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-0.5 text-[11px]">
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-2 py-1 rounded font-medium transition cursor-pointer ${
                selectedLanguage === 'en' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="English Voice"
            >
              EN
            </button>
            <button
              onClick={() => setSelectedLanguage('hi')}
              className={`px-2 py-1 rounded font-medium transition cursor-pointer ${
                selectedLanguage === 'hi' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Hindi Voice (हिन्दी)"
            >
              हिन्दी
            </button>
            <button
              onClick={() => setSelectedLanguage('ta')}
              className={`px-2 py-1 rounded font-medium transition cursor-pointer ${
                selectedLanguage === 'ta' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Tamil Voice (தமிழ்)"
            >
              தமிழ்
            </button>
          </div>

          {/* Play / Stop Voice Briefing */}
          {isSpeaking ? (
            <button
              onClick={handleStopSpeech}
              className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              <span>Stop Speech</span>
            </button>
          ) : (
            <button
              onClick={handlePlayBriefing}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer active:scale-95"
              title="Listen to complete pending EOA workload briefing"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Voice Briefing</span>
            </button>
          )}

          {/* Replay Last Alert */}
          <button
            onClick={handleReplayLast}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Repeat last voice alert"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Replay Briefing</span>
          </button>

          {/* Mute Toggle */}
          <button
            onClick={() => setIsVoiceMuted(!isVoiceMuted)}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              isVoiceMuted
                ? 'bg-rose-950/80 border-rose-800 text-rose-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={isVoiceMuted ? 'Unmute Voice Alerts' : 'Mute Voice Alerts'}
          >
            {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Test Voice */}
          <button
            onClick={handleTestVoice}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition cursor-pointer"
            title="Test voice synthesizer output"
          >
            Test Voice
          </button>

          {/* Refresh Summary */}
          <button
            onClick={handleRefreshSummary}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer disabled:opacity-50"
            title="Refresh backend counts before briefing"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          {/* Simulate New Submission */}
          <button
            onClick={() => handleSimulateNewSubmission()}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Simulate a new incoming EOA submission and listen to alert"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Simulate Alert</span>
          </button>

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white transition cursor-pointer"
            title={isExpanded ? 'Collapse Summary Table' : 'Expand College-Wise Summary Table'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Visual Live Alert Banner (Never hidden by muting speech) */}
      {latestNotification && (
        <div className="bg-blue-950/80 border-t border-b border-blue-800/80 px-4 sm:px-8 py-2 text-xs text-blue-200 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span className="font-semibold text-white">Live Notification:</span>
            <span>{latestNotification.text}</span>
            <span className="text-[10px] text-slate-400 font-mono">({latestNotification.timestamp})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => speakText(latestNotification.text, selectedLanguage)}
              className="text-xs text-amber-300 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
            <button
              onClick={() => setLatestNotification(null)}
              className="text-slate-400 hover:text-white ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Expandable College-Wise Pending Verification Summary Table */}
      {isExpanded && (
        <div className="border-t border-slate-800 bg-slate-950/70 p-4 sm:px-8 animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-blue-400" />
                  <span>College-Wise Pending Verification Summary (Real Backend Records)</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Separately tracks newly submitted files, documents awaiting verification, and completed decisions per Tamil Nadu institution.
                </p>
              </div>

              {/* Status Categorization Pills */}
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Initial Review: {summaryMetrics.awaitingInitialScrutiny}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Clarification Required: {summaryMetrics.awaitingClarification}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Completed / Compliant: {summaryMetrics.completedOrApproved}
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xs">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Institution & PID</th>
                    <th className="py-2.5 px-3">Application ID</th>
                    <th className="py-2.5 px-3 text-center">New Docs</th>
                    <th className="py-2.5 px-3 text-center">Awaiting Verify</th>
                    <th className="py-2.5 px-3 text-center">Verified</th>
                    <th className="py-2.5 px-3 text-center">Flagged / Anomaly</th>
                    <th className="py-2.5 px-3">Application Status</th>
                    <th className="py-2.5 px-3 text-right">Voice & Inspection Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {summaryMetrics.collegeBreakdown.map((item) => {
                    const isRowSpeaking = isSpeaking && selectedCollegeForSpeech === item.id;

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-800/50 transition-colors ${
                          isRowSpeaking ? 'bg-blue-950/40 ring-1 ring-blue-500/50' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-white line-clamp-1">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            PID: {item.pid} · {item.institution.district}, TN
                          </div>
                        </td>

                        <td className="py-2.5 px-3 font-mono text-slate-300 text-[11px]">
                          <div>{item.appId}</div>
                          <div className="text-[10px] text-slate-500">AY {item.academicYear}</div>
                        </td>

                        <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-400">
                          {item.newDocs}
                        </td>

                        <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-300">
                          {item.awaitingDocs}
                        </td>

                        <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-400">
                          {item.verifiedDocs}
                        </td>

                        <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-400">
                          {item.flaggedDocs}
                        </td>

                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border inline-block whitespace-nowrap ${
                              item.status === 'Approved / Compliant'
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                : item.status === 'Clarification Required'
                                ? 'bg-amber-950 text-amber-300 border-amber-800'
                                : item.status === 'Deficiency Issued'
                                ? 'bg-rose-950 text-rose-300 border-rose-800'
                                : 'bg-blue-950 text-blue-300 border-blue-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSpeakCollegeStatus(item)}
                              className={`p-1.5 rounded-lg border text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                                isRowSpeaking
                                  ? 'bg-blue-600 text-white border-blue-500'
                                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                              }`}
                              title={`Listen to voice announcement for ${item.name}`}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline text-[10px]">Listen</span>
                            </button>

                            <button
                              onClick={() => onSelectInstitution(item.institution)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-xs"
                              title="Open complete institutional verification workspace"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Inspect</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
