/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  User,
  Building2,
  CheckCircle2,
  X,
  HelpCircle
} from 'lucide-react';
import { AuthenticatedUser } from '../types/aicte';
export type { AuthenticatedUser };
import { TAMIL_NADU_INSTITUTIONS } from '../data/mockInstitutions';
import { NirnayAnimatedLogo } from './YuktiAnimatedLogo';

export const DEMO_ROLES: AuthenticatedUser[] = [
  {
    type: 'officer',
    id: 'off-1',
    name: 'Dr. V. Sundaram',
    role: 'Verification Officer',
    email: 'officer.sundaram@aicte-india.org',
  },
  {
    type: 'institution',
    id: 'inst-rmk',
    name: 'Dr. K. A. Mohamed Junaid',
    role: 'Institution Authorised Signatory',
    email: 'principal@rmkec.ac.in',
    institutionPid: '1-429810441',
    institutionId: 'tn-app-1',
    institutionName: 'R.M.K. Engineering College (Tiruvallur)',
  },
  {
    type: 'officer',
    id: 'off-2',
    name: 'S. S. Mohanty',
    role: 'Administrator',
    email: 'admin@aicte-india.org',
  },
  {
    type: 'institution',
    id: 'inst-cit',
    name: 'Prof. A. Rajagopal',
    role: 'Institution Authorised Signatory',
    email: 'principal@cit.edu.in',
    institutionPid: '1-429910882',
    institutionId: 'tn-app-2',
    institutionName: 'Coimbatore Institute of Technology (CIT)',
  },
];

export const DEMO_OFFICER_ROLES: AuthenticatedUser[] = DEMO_ROLES.filter((r) => r.type === 'officer');

export const DEMO_INSTITUTION_ROLES: AuthenticatedUser[] = [
  {
    type: 'institution',
    id: 'inst-rmk',
    name: 'Dr. K. A. Mohamed Junaid',
    role: 'Institution Authorised Signatory',
    email: 'principal@rmkec.ac.in',
    institutionPid: '1-429810441',
    institutionId: 'tn-app-1',
    institutionName: 'R.M.K. Engineering College (Tiruvallur)',
  },
  {
    type: 'institution',
    id: 'inst-cit',
    name: 'Dr. A. Rajeswari',
    role: 'Institution Authorised Signatory',
    email: 'principal@cit.edu.in',
    institutionPid: '1-10928341',
    institutionId: 'tn-app-2',
    institutionName: 'Coimbatore Institute of Technology - CIT',
  },
  {
    type: 'institution',
    id: 'inst-ssn',
    name: 'Dr. V. E. Annamalai',
    role: 'Institution Authorised Signatory',
    email: 'principal@ssn.edu.in',
    institutionPid: '1-77821033',
    institutionId: 'tn-app-3',
    institutionName: 'SSN College of Engineering (Kanchipuram)',
  },
];

interface AicteLoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: AuthenticatedUser) => void;
  canDismiss?: boolean;
}

import { useLanguage } from '../i18n/LanguageContext';

export const AicteLoginModal: React.FC<AicteLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  canDismiss = true,
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'officer' | 'institution'>('officer');
  const [email, setEmail] = useState('officer.sundaram@aicte-india.org');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTabSwitch = (tab: 'officer' | 'institution') => {
    setActiveTab(tab);
    if (tab === 'officer') {
      setEmail('officer.sundaram@aicte-india.org');
    } else {
      setEmail('principal@rmkec.ac.in');
    }
  };

  const handleSelectDemoOfficer = (officer: AuthenticatedUser) => {
    setEmail(officer.email);
    setPassword('AictePass2026!#');
    setIsSubmitting(true);
    setLoginFeedback(`Authenticating ${officer.name} (${officer.role})...`);

    setTimeout(() => {
      setIsSubmitting(false);
      setLoginFeedback(null);
      onLoginSuccess(officer);
      if (onClose) onClose();
    }, 600);
  };

  const handleSelectDemoInstitution = (inst: AuthenticatedUser) => {
    setEmail(inst.email);
    setPassword('InstPass2026!#');
    setIsSubmitting(true);
    setLoginFeedback(`Signing in to ${inst.institutionName}...`);

    setTimeout(() => {
      setIsSubmitting(false);
      setLoginFeedback(null);
      onLoginSuccess(inst);
      if (onClose) onClose();
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginFeedback('Verifying credentials against AICTE SRO Gateway...');

    setTimeout(() => {
      setIsSubmitting(false);
      setLoginFeedback(null);

      if (activeTab === 'institution') {
        const matchingInst =
          DEMO_INSTITUTION_ROLES.find(
            (i) => i.email.toLowerCase() === email.trim().toLowerCase() || i.institutionPid === email.trim()
          ) || {
            type: 'institution' as const,
            id: `inst-${Date.now()}`,
            name: 'Institution Authorised Signatory',
            role: 'Institution Authorised Signatory' as const,
            email: email.trim(),
            institutionPid: '1-429810441',
            institutionId: 'tn-app-1',
            institutionName: 'R.M.K. Engineering College',
          };
        onLoginSuccess(matchingInst);
      } else {
        const matchingOfficer =
          DEMO_OFFICER_ROLES.find(
            (o) => o.email.toLowerCase() === email.trim().toLowerCase()
          ) || {
            type: 'officer' as const,
            id: `off-${Date.now()}`,
            name: email.split('@')[0].replace('.', ' '),
            role: 'Verification Officer' as const,
            email: email.trim(),
          };
        onLoginSuccess(matchingOfficer);
      }

      if (onClose) onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto font-poppins">
      {/* Background photo approximately 70% visually prominent with restrained blue overlay */}
      <div className="fixed inset-0 bg-slate-950/40">
        <img
          src="/assets/aistudio/image_01364d7e_01364d7e.png"
          alt="AICTE Headquarters Building"
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#082245]/85 via-[#082245]/55 to-[#082245]/75" />
      </div>

      {/* Main Login Card matching user reference image_0bba7bea.png */}
      <div className="relative w-full max-w-[440px] max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/90 my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Dismiss Button */}
        {canDismiss && onClose && (
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-20 text-white/80 hover:text-white p-1 rounded-full bg-black/25 hover:bg-black/50 transition-colors cursor-pointer"
            title="Continue browsing as Guest"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Top Header Card */}
        <div className="bg-[#082245] px-5 sm:px-6 pt-5 pb-4 text-center text-white border-b-4 border-amber-500 relative shrink-0">
          {/* Custom Nirnay Emblem */}
          <div className="mx-auto mb-2.5 flex items-center justify-center">
            <NirnayAnimatedLogo size="lg" isInteractive={false} />
          </div>

          {/* Amber Kicker */}
          <div className="inline-block px-3 py-0.5 bg-[#ff9900] text-slate-950 font-extrabold text-[10px] rounded-full uppercase tracking-wider shadow-xs mb-1.5">
            NIRNAY VERIFICATION PORTAL
          </div>

          {/* Main Title */}
          <h2 className="text-[15px] sm:text-[17px] font-extrabold tracking-tight text-white leading-snug">
            {language === 'hi'
              ? 'निर्णय — आवेदन सत्यापन एवं अनुपालन सहायक'
              : language === 'ta'
              ? 'நிர்ணய் — விண்ணப்ப சரிபார்ப்பு மற்றும் இணக்கத் துணை'
              : 'Nirnay — Application Verification & Compliance Assistant'}
          </h2>

          <p className="text-xs font-medium text-amber-300 mt-1">
            {language === 'hi'
              ? 'अधिकृत अधिकारियों एवं संस्थानों हेतु सुरक्षित प्रवेश'
              : language === 'ta'
              ? 'அங்கீகரிக்கப்பட்ட அதிகாரிகள் மற்றும் கல்லூரிகளுக்கான அணுகல்'
              : 'Secure Access for Authorised Officials & Institutions'}
          </p>
          <p className="text-[10px] text-slate-300 mt-0.5">
            Tamil Nadu Technical Institutions · EOA Scrutiny 2026-27
          </p>

          {/* Two Clearly Visible Unified Login Tabs */}
          <div className="grid grid-cols-2 gap-1.5 mt-3 p-1 bg-black/30 rounded-lg">
            <button
              type="button"
              onClick={() => handleTabSwitch('institution')}
              className={`py-1.5 px-2 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 truncate ${
                activeTab === 'institution'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {language === 'hi' ? 'संस्थान लॉगिन' : language === 'ta' ? 'கல்லூரி உள்நுழைவு' : 'Institution Login'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('officer')}
              className={`py-1.5 px-2 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 truncate ${
                activeTab === 'officer'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {language === 'hi' ? 'अधिकारी लॉगिन' : language === 'ta' ? 'அதிகாரி உள்நுழைவு' : 'AICTE Officer Login'}
              </span>
            </button>
          </div>
        </div>

        {/* Form Body with internal scroll */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {loginFeedback ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
              <div className="text-xs font-bold text-slate-900">{loginFeedback}</div>
              <p className="text-[11px] text-slate-500">Redirecting to dedicated portal workspace...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Field 1: Identifier */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {activeTab === 'institution'
                    ? 'AICTE PERMANENT ID (PID) / OFFICIAL INSTITUTION EMAIL'
                    : 'OFFICIAL EMAIL / AUTHORIZED REVIEWER ID'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      activeTab === 'institution'
                        ? 'e.g. 1-429810441 or principal@rmkec.ac.in'
                        : 'e.g. officer.sundaram@aicte-india.org'
                    }
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#082245] focus:bg-white transition-all text-xs"
                    required
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert('Temporary demo passkey reset link sent to registered email.')
                    }
                    className="text-[11px] font-semibold text-blue-700 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter authorized passkey"
                    className="w-full pl-9 pr-9 py-2 bg-slate-50/70 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#082245] focus:bg-white transition-all text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Remember checkbox & TLS notice */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberTerminal}
                    onChange={(e) => setRememberTerminal(e.target.checked)}
                    className="rounded text-[#082245] focus:ring-[#082245] w-3.5 h-3.5 accent-[#082245]"
                  />
                  <span className="text-[11px] font-medium text-slate-700">Remember this terminal</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  TLS 1.3 / EAL4+
                </span>
              </div>

              {/* Submit Button matching screenshot */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#082245] hover:bg-[#0c2f5e] text-white font-bold text-xs rounded-lg shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 group"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>
                  {activeTab === 'institution'
                    ? 'Sign In to Institution Workspace →'
                    : 'Sign In as Authorised Official →'}
                </span>
              </button>
            </form>
          )}

          {/* Quick Demo Roles Section matching bottom of screenshot */}
          <div className="pt-3 border-t border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {activeTab === 'institution'
                ? 'SELECT DEMO TN INSTITUTION (ONE-CLICK SIGN IN)'
                : 'SELECT DEMO ROLE (ONE-CLICK SIGN IN)'}
            </div>

            {activeTab === 'officer' ? (
              <div className="space-y-1.5">
                {DEMO_OFFICER_ROLES.map((officer) => (
                  <button
                    key={officer.email}
                    type="button"
                    onClick={() => handleSelectDemoOfficer(officer)}
                    className="w-full p-2 text-left rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/60 bg-white transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900">
                        {officer.name} ({officer.role})
                      </div>
                      <div className="text-[10.5px] font-mono text-slate-500">
                        {officer.email}
                      </div>
                    </div>

                    <div className="p-1 rounded-md bg-slate-100 group-hover:bg-amber-200 text-slate-600 group-hover:text-amber-900 transition-colors">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {DEMO_INSTITUTION_ROLES.map((inst) => (
                  <button
                    key={inst.institutionPid}
                    type="button"
                    onClick={() => handleSelectDemoInstitution(inst)}
                    className="w-full p-2 text-left rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/60 bg-white transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900">
                        {inst.institutionName}
                      </div>
                      <div className="text-[10.5px] font-mono text-slate-500">
                        PID: {inst.institutionPid} · {inst.email}
                      </div>
                    </div>

                    <div className="p-1 rounded-md bg-slate-100 group-hover:bg-amber-200 text-slate-600 group-hover:text-amber-900 transition-colors">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {canDismiss && onClose && (
              <div className="text-center pt-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[11px] text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Continue browsing Tamil Nadu directory as Guest Observer →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
