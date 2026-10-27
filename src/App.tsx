/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AicteTopHeader, PortalTab } from './components/AicteTopHeader';
import { RegulatoryTicker } from './components/RegulatoryTicker';
import { PortalHeroView } from './components/PortalHeroView';
import { ScrutinyEngineView } from './components/ScrutinyEngineView';
import { DocumentVerifierView } from './components/DocumentVerifierModal';
import { ComplianceCopilotView } from './components/ComplianceCopilotModal';
import { SpocHearingView } from './components/SpocHearingModal';
import { InitiativesSection } from './components/InitiativesSection';
import { PublicNoticeModal } from './components/PublicNoticeModal';
import { AicteLoginModal, AuthenticatedUser, DEMO_ROLES } from './components/AicteLoginModal';
import { TamilNaduCollegeDirectory } from './components/TamilNaduCollegeDirectory';
import { InstitutionDashboard } from './components/InstitutionDashboard';
import { OfficerInstitutionDetailView } from './components/OfficerInstitutionDetailView';
import { YuktiOfficerExtension } from './components/officer/YuktiOfficerExtension';
import { YuktiFloatingAssistant } from './components/YuktiFloatingAssistant';
import { NirnayAnimatedLogo } from './components/YuktiAnimatedLogo';
import { CallSessionModal } from './components/CallSessionModal';
import { TAMIL_NADU_INSTITUTIONS } from './data/mockInstitutions';
import { InstitutionApplication } from './types/aicte';
import { Phone, Mail, MapPin, KeyRound, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

import { useLanguage } from './i18n/LanguageContext';

export default function App() {
  const { language, t } = useLanguage();

  // Master Tamil Nadu Institutions State
  const [institutions, setInstitutions] = useState<InstitutionApplication[]>(TAMIL_NADU_INSTITUTIONS);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(DEMO_ROLES[0]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<PortalTab>('directory');
  const [selectedInstitutionForOfficer, setSelectedInstitutionForOfficer] = useState<InstitutionApplication | null>(null);

  // Utility bar states
  const [isPublicNoticeOpen, setIsPublicNoticeOpen] = useState(false);
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('');
  const [selectedAppForSpoc, setSelectedAppForSpoc] = useState<InstitutionApplication | undefined>(undefined);

  // WebRTC Live Call Session State
  const [callSession, setCallSession] = useState<{
    isOpen: boolean;
    type: 'audio' | 'video';
    spocName: string;
    spocPhone: string;
    institutionName: string;
  }>({
    isOpen: false,
    type: 'audio',
    spocName: '',
    spocPhone: '',
    institutionName: ''
  });

  // Find institution object for currently logged-in institution user
  const loggedInInstitution: InstitutionApplication = React.useMemo(() => {
    if (currentUser?.type === 'institution') {
      const match = institutions.find(
        (i) => i.pid === currentUser.institutionPid || i.id === currentUser.institutionId
      );
      if (match) return match;
    }
    return institutions[0];
  }, [currentUser, institutions]);

  // When updating an institution (from Officer or Institution view)
  const handleUpdateInstitution = (updated: InstitutionApplication) => {
    setInstitutions((prev) => prev.map((inst) => (inst.id === updated.id ? updated : inst)));
    if (selectedInstitutionForOfficer?.id === updated.id) {
      setSelectedInstitutionForOfficer(updated);
    }
  };

  const handleLaunchScrutiny = () => {
    setCurrentTab('scrutiny');
    setSelectedInstitutionForOfficer(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCopilotWithQuery = (query?: string) => {
    setCopilotInitialQuery(query || '');
    setCurrentTab('copilot');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSpocWithApp = (app: InstitutionApplication) => {
    setSelectedAppForSpoc(app);
    setCurrentTab('spoc');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    sessionStorage.clear();
    setCurrentUser(null);
    setSelectedInstitutionForOfficer(null);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user: AuthenticatedUser) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    if (user.type === 'institution') {
      setCurrentTab('institution-workspace');
      setSelectedInstitutionForOfficer(null);
    } else {
      setCurrentTab('directory');
    }
  };

  const handleInitiateCall = (type: 'audio' | 'video', spocName: string, spocPhone: string, institutionName: string) => {
    setCallSession({
      isOpen: true,
      type,
      spocName,
      spocPhone,
      institutionName
    });
  };

  // Officer Extension & Generic Non-Confidential Real-Time Alert State
  const [isOfficerExtensionOpen, setIsOfficerExtensionOpen] = useState(false);
  const [genericNotification, setGenericNotification] = useState<string | null>(null);

  // Determine active institution for floating Yukti AI (null by default so it shows AICTE Service Desk)
  const activeInstitutionForAssistant =
    currentUser?.type === 'institution'
      ? loggedInInstitution
      : selectedInstitutionForOfficer;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Poppins'] text-slate-800 text-sm overflow-x-hidden">
      {/* Top Header with AICTE Logo, Live Time, Language Selector, and Login trigger */}
      <AicteTopHeader
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setSelectedInstitutionForOfficer(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDirectory={() => {
          setCurrentTab('directory');
          setSelectedInstitutionForOfficer(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPublicNotice={() => setIsPublicNoticeOpen(true)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Seamless Horizontal Regulatory Marquee Ticker */}
      <RegulatoryTicker />

      {/* Authenticated Official Notification Ribbon */}
      {currentUser && (
        <div className="bg-amber-100/95 border-b border-amber-300 px-3 sm:px-6 md:px-8 py-2 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 shadow-2xs">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">
              {t('officialTerminalActive')}:{' '}
              <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.role})
              {currentUser.type === 'institution' && currentUser.institutionPid && (
                <span className="ml-1.5 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[11px] font-semibold border border-blue-200 inline-block">
                  PID: {currentUser.institutionPid} · {currentUser.institutionName}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <span className="text-[11px] font-mono text-amber-800 hidden md:inline">
              {t('secureChannel')}
            </span>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-2.5 py-1 rounded bg-[#0b2545] text-white hover:bg-[#143763] text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span>{t('switchDemoAccount')}</span>
            </button>
          </div>
        </div>
      )}



      {/* Main Viewport Content based on active Tab and Role */}
      <main className="flex-1 w-full">
        {/* If Officer is inspecting a specific college detail view */}
        {currentUser?.type === 'officer' && selectedInstitutionForOfficer ? (
          <OfficerInstitutionDetailView
            institution={selectedInstitutionForOfficer}
            currentUser={currentUser}
            onBack={() => setSelectedInstitutionForOfficer(null)}
            onUpdateInstitution={handleUpdateInstitution}
            onInitiateCall={(type, spocName, spocPhone) =>
              handleInitiateCall(type, spocName, spocPhone, selectedInstitutionForOfficer.institutionName)
            }
          />
        ) : (
          <>
            {/* Institution User View: strictly locked to their own institution */}
            {currentUser?.type === 'institution' && currentTab === 'institution-workspace' && (
              <InstitutionDashboard
                institution={loggedInInstitution}
                onUpdateInstitution={handleUpdateInstitution}
                onOpenCopilot={handleOpenCopilotWithQuery}
                onOpenCallModal={(type) =>
                  handleInitiateCall(
                    type,
                    'Dr. Rajesh Sundaram (AICTE Scrutiny Officer)',
                    '+91 44 2235 0122',
                    'AICTE Southern Regional Office (SRO) Chennai'
                  )
                }
              />
            )}

            {/* Tamil Nadu College Directory (Accessible to Officer or Public) */}
            {currentTab === 'directory' && (
              <TamilNaduCollegeDirectory
                institutions={institutions}
                onSelectInstitution={(inst) => {
                  if (currentUser?.type === 'officer') {
                    setSelectedInstitutionForOfficer(inst);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    // Non-officer inspect view
                    setSelectedInstitutionForOfficer(inst);
                  }
                }}
                onOpenScrutinyForApp={(inst) => {
                  setSelectedInstitutionForOfficer(inst);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isOfficer={currentUser?.type === 'officer'}
              />
            )}

            {/* Portal Overview Tab */}
            {currentTab === 'portal' && (
              <>
                <PortalHeroView
                  onLaunchScrutiny={handleLaunchScrutiny}
                  onOpenDirectory={() => {
                    setCurrentTab('directory');
                    setSelectedInstitutionForOfficer(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenPublicNotice={() => setIsPublicNoticeOpen(true)}
                  onOpenSpoc={() => {
                    setCurrentTab('spoc');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
                <InitiativesSection onLaunchScrutiny={handleLaunchScrutiny} />
              </>
            )}

            {/* Yukti Automated Scrutiny Engine */}
            {currentTab === 'scrutiny' && (
              <ScrutinyEngineView
                onOpenCopilotWithQuery={handleOpenCopilotWithQuery}
                onOpenSpocWithApp={handleOpenSpocWithApp}
              />
            )}

            {/* Document Verifier */}
            {currentTab === 'documents' && <DocumentVerifierView />}

            {/* Compliance Copilot */}
            {currentTab === 'copilot' && (
              <ComplianceCopilotView initialQuery={copilotInitialQuery} />
            )}

            {/* SPOC & Hearing View */}
            {currentTab === 'spoc' && (
              <SpocHearingView initialApp={selectedAppForSpoc} />
            )}
          </>
        )}
      </main>

      {/* If Officer: Yukti AICTE Officer Browser Extension (Private by Default with Protected Queue & Voice Briefing) */}
      {/* If Institution or Public: AICTE Service Desk Floating Assistant */}
      {currentUser?.type === 'officer' ? (
        <YuktiOfficerExtension
          currentUser={currentUser}
          institutions={institutions}
          onSelectInstitution={(inst) => {
            setSelectedInstitutionForOfficer(inst);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isOpen={isOfficerExtensionOpen}
          onOpen={() => setIsOfficerExtensionOpen(true)}
          onClose={() => setIsOfficerExtensionOpen(false)}
          externalNotification={genericNotification}
          onClearExternalNotification={() => setGenericNotification(null)}
        />
      ) : (
        <YuktiFloatingAssistant
          currentInstitution={activeInstitutionForAssistant}
          onSelectInstitution={(inst) => setSelectedInstitutionForOfficer(inst)}
        />
      )}

      {/* Live WebRTC / MediaDevices Audio/Video Call Session Modal */}
      <CallSessionModal
        isOpen={callSession.isOpen}
        type={callSession.type}
        spocName={callSession.spocName}
        spocPhone={callSession.spocPhone}
        institutionName={callSession.institutionName}
        onClose={() => setCallSession((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Unified AICTE Dual-Tab Login Modal */}
      <AicteLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        canDismiss={true}
      />

      {/* Public Notice Modal */}
      <PublicNoticeModal
        isOpen={isPublicNoticeOpen}
        onClose={() => setIsPublicNoticeOpen(false)}
      />

      {/* Official AICTE Footer */}
      <footer className="w-full bg-[#0b2545] text-white pt-10 pb-6 border-t border-slate-700 mt-12 font-['Poppins']">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-700 text-xs">
            {/* Col 1: Nirnay Platform Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <NirnayAnimatedLogo size="md" isInteractive={false} />
                <div>
                  <div className="font-bold text-sm text-amber-300">
                    Nirnay — {t('yuktiScrutinyBadge')}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {t('footerCouncilTitle')}
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {t('portalTitle')} · {t('footerCouncilSub')}
              </p>
              <div className="text-[11px] text-amber-400 font-medium">
                {t('yuktiScrutinyBadge')} · {t('approvalSessionActive')}
              </div>
            </div>

            {/* Col 2: Approval Portals */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300 mb-3">
                {t('footerQuickLinks')}
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <button
                    onClick={() => {
                      setCurrentTab('directory');
                      setSelectedInstitutionForOfficer(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                  >
                    {t('tabDirectory')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentTab('scrutiny');
                      setSelectedInstitutionForOfficer(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                  >
                    {t('tabScrutiny')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsPublicNoticeOpen(true)}
                    className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                  >
                    {t('linkPublicNotices')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentTab('copilot');
                      setSelectedInstitutionForOfficer(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                  >
                    {t('tabCopilot')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Tamil Nadu Zones & SRO */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300 mb-3">
                SRO Chennai Zonal Scrutiny Cells
              </h4>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li>Chennai Metro & Tiruvallur Zone</li>
                <li>Coimbatore & Western Tamil Nadu Zone</li>
                <li>Madurai & Southern Tamil Nadu Zone</li>
                <li>Tiruchirappalli & Central Delta Zone</li>
                <li>Salem & Dharmapuri Technical Cluster</li>
                <li>Tirunelveli & Kanyakumari Engineering Cell</li>
              </ul>
            </div>

            {/* Col 4: Contact & Helpdesk */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300 mb-3">
                {t('footerContactUs')}
              </h4>
              <div className="flex items-start gap-2 text-slate-300 text-[11px]">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t('footerAddress')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">{t('footerPhone')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('footerEmail')}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>
              {t('footerCopyright')}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <span>National Informatics Center (NIC) Compliant</span>
              <span>·</span>
              <span>Tamil Nadu Directorate of Technical Education (DOTE) Synced</span>
              <span>·</span>
              <span>AICTE EAL4+ Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
