/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  BookOpen,
  HelpCircle,
  Phone,
  Video,
  AlertTriangle,
  Calendar,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  X,
  Send,
  Building2
} from 'lucide-react';
import { FAQS_LIST } from '../data/portalAnnouncements';

import { useLanguage } from '../i18n/LanguageContext';

interface PortalHeroViewProps {
  onLaunchScrutiny: () => void;
  onOpenDirectory: () => void;
  onOpenPublicNotice: () => void;
  onOpenSpoc: () => void;
  isHindi?: boolean;
}

export const PortalHeroView: React.FC<PortalHeroViewProps> = ({
  onLaunchScrutiny,
  onOpenDirectory,
  onOpenPublicNotice,
  onOpenSpoc,
}) => {
  const { language, t } = useLanguage();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [videoConnected, setVideoConnected] = useState(false);

  return (
    <div className="w-full">
      {/* Hero Banner with Official AICTE Headquarters Building */}
      <div className="relative w-full overflow-hidden bg-slate-900 border-b border-slate-200">
        <div className="h-44 sm:h-64 lg:h-80 w-full relative">
          <img
            src="/assets/aistudio/image_01364d7e_01364d7e.png"
            alt="AICTE Headquarters Nelson Mandela Marg New Delhi"
            className="w-full h-full object-cover object-center filter brightness-85"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-6 w-full text-white">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-500/90 text-slate-950 font-bold text-xs rounded-sm mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Statutory Scrutiny & Approval System</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    {language === 'hi'
                      ? 'निर्णय — आवेदन सत्यापन एवं अनुपालन मंच (2026-2027)'
                      : language === 'ta'
                      ? 'நிர்ணய் — விண்ணப்ப சரிபார்ப்பு மற்றும் இணக்க தளம் (2026-2027)'
                      : 'Nirnay — Application Validation & Compliance Platform'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mt-1">
                    {language === 'hi'
                      ? 'तकनीकी संस्थानों हेतु एआई-सहायक स्वचालित जांच, त्वरित ए.पी.एच. 2026-27 मानक सत्यापन, छेड़छाड़-रोधी दस्तावेज़ सत्यापन एवं विसंगति निवारण।'
                      : language === 'ta'
                      ? 'தொழில்நுட்பக் கல்லூரிகளுக்கான ஏஐ தானியங்கி ஆய்வு, உடனடி ஏ.பி.ஹெச் விதிமுறைகள் சரிபார்ப்பு மற்றும் குறைபாடு பகுப்பாய்வு.'
                      : 'AI-assisted automated scrutiny for technical institutions, instant APH 2026-27 norm validation, tamper-evident document verification, and explainable deficiency triage.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onLaunchScrutiny}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-lg flex items-center gap-2 transition-transform transform active:scale-95 cursor-pointer"
                  >
                    <span>Launch Automated Scrutiny Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Approval Process 2026-2027 Sky-Blue Section matching image_a1aa6913_a1aa6913.png */}
      <section className="relative py-10 px-4 sm:px-8 bg-gradient-to-b from-[#bfe4fd] via-[#d7efff] to-white border-b border-sky-200">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d3b66] tracking-tight">
              Approval Process 2026-2027
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              (w.e.f 28th Nov, 2025)
            </p>
          </div>

          {/* Two-Column Grid matching official screenshot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column Box (Col 1-7) */}
            <div className="lg:col-span-7 bg-white/80 backdrop-blur-xs p-5 sm:p-7 rounded-xl border-2 border-amber-400/80 shadow-md space-y-4">
              {/* Item 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  AICTE Approved Universities/Institutions
                </span>
                <button
                  onClick={onOpenDirectory}
                  className="px-5 py-2 bg-[#ffaa00] hover:bg-[#e69900] text-slate-950 font-bold text-xs rounded-full shadow-xs transition-colors whitespace-nowrap cursor-pointer text-center"
                >
                  Click Here
                </button>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Public Notice for Approval Process 2026-27
                </span>
                <button
                  onClick={onOpenPublicNotice}
                  className="px-5 py-2 bg-[#ffaa00] hover:bg-[#e69900] text-slate-950 font-bold text-xs rounded-full shadow-xs transition-colors whitespace-nowrap cursor-pointer text-center"
                >
                  Click Here
                </button>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Corrigendum / Addendum for Approval Process 2026-27:
                </span>
                <button
                  onClick={() => setActiveModal('corrigendum')}
                  className="px-5 py-2 bg-[#ffaa00] hover:bg-[#e69900] text-slate-950 font-bold text-xs rounded-full shadow-xs transition-colors whitespace-nowrap cursor-pointer text-center"
                >
                  To Download Click Here
                </button>
              </div>

              {/* Item 4 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Approval Process Handbook (APH) and Guidelines/Information :
                </span>
                <button
                  onClick={() => setActiveModal('aph')}
                  className="px-5 py-2 bg-[#ffaa00] hover:bg-[#e69900] text-slate-950 font-bold text-xs rounded-full shadow-xs transition-colors whitespace-nowrap cursor-pointer text-center"
                >
                  To Download APH Click Here
                </button>
              </div>

              {/* Item 5 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Centralized Support System for Approval Queries :
                </span>
                <button
                  onClick={() => setActiveModal('support')}
                  className="px-5 py-2 bg-[#ffaa00] hover:bg-[#e69900] text-slate-950 font-bold text-xs rounded-full shadow-xs transition-colors whitespace-nowrap cursor-pointer text-center"
                >
                  Click Here
                </button>
              </div>

              {/* Item 6 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Frequently Asked Questions(FAQs) :
                </span>
                <button
                  onClick={() => setActiveModal('faqs')}
                  className="px-5 py-2 bg-[#ffaa00] hover:bg-[#e69900] text-slate-950 font-bold text-xs rounded-full shadow-xs transition-colors whitespace-nowrap cursor-pointer text-center"
                >
                  Click Here
                </button>
              </div>

              {/* Item 7 - Helpline */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Helpline for Technical Queries :
                </span>
                <button
                  onClick={onOpenSpoc}
                  className="px-4 py-2 bg-[#ffaa00] hover:bg-[#e69900] text-slate-950 font-bold text-xs rounded-full shadow-xs transition-colors whitespace-nowrap cursor-pointer font-mono"
                >
                  (011)29581333, 29581338, 29581342
                </button>
              </div>

              {/* Item 8 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Information Regarding an Unapproved Institution:
                </span>
                <button
                  onClick={() => setActiveModal('unapproved')}
                  className="px-5 py-2 bg-[#ffaa00] hover:bg-[#e69900] text-slate-950 font-bold text-xs rounded-full shadow-xs transition-colors whitespace-nowrap cursor-pointer text-center"
                >
                  Click Here
                </button>
              </div>
            </div>

            {/* Right Column Box (Col 8-12) */}
            <div className="lg:col-span-5 bg-white/80 backdrop-blur-xs p-5 sm:p-7 rounded-xl border-2 border-amber-400/80 shadow-md space-y-7">
              {/* Box A: Video Facilitation */}
              <div className="text-center">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2">
                  Information Facilitation Center For Live Video Conferencing (Technical Support) :
                </h3>
                <button
                  onClick={() => setActiveModal('video')}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#ffaa00] hover:bg-[#e69900] text-slate-950 font-bold text-xs rounded-full shadow-xs transition-colors cursor-pointer"
                >
                  Click Here to Know More
                </button>
              </div>

              {/* Box B: List of Unapproved Institution */}
              <div className="text-center pt-4 border-t border-slate-200">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2">
                  List of Unapproved Institution:
                </h3>
                <button
                  onClick={() => setActiveModal('unapproved')}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#ffaa00] hover:bg-[#e69900] text-slate-950 font-bold text-xs rounded-full shadow-xs transition-colors cursor-pointer"
                >
                  Click Here to Know More
                </button>
              </div>

              {/* Box C: Revised Academic Calendar 2026-27 */}
              <div className="text-center pt-4 border-t border-slate-200">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2">
                  Revised Academic Calendar 2026-27:
                </h3>
                <button
                  onClick={() => setActiveModal('calendar')}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#ffaa00] hover:bg-[#e69900] text-slate-950 font-bold text-xs rounded-full shadow-xs transition-colors cursor-pointer"
                >
                  Click Here to Know More
                </button>
              </div>

              {/* Nirnay Automation Quick Action */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-center">
                <div className="text-xs font-bold text-amber-950 mb-1">
                  Want to validate an application automatically?
                </div>
                <p className="text-[11px] text-amber-800 mb-3">
                  Nirnay Scrutiny Engine automatically checks land, built-up area, cadre ratio 1:2:6, FDR, and fire NOCs.
                </p>
                <button
                  onClick={onLaunchScrutiny}
                  className="w-full py-2 bg-[#0b2545] hover:bg-[#133966] text-amber-300 font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Run Scrutiny Verification</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Interactive Modals for Portal Actions --- */}

      {/* 1. Corrigendum Modal */}
      {activeModal === 'corrigendum' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Corrigendum / Addendum — Approval Process 2026-27</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="font-bold text-slate-900">Corrigendum-1 (Dated 15-Jun-2026): FSI/FAR in Metro Areas</div>
                <p className="mt-1 text-slate-600">
                  Institutions situated in Tier-1 Mega Cities with Floor Area Ratio (FAR) &gt;= 2.0 may avail vertical floor relaxation subject to structural fire escape compliance.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="font-bold text-slate-900">Addendum-2 (Dated 22-Aug-2026): Joint FDR Extension Window</div>
                <p className="mt-1 text-slate-600">
                  Institutions completing 10 years of unblemished approval may convert physical FDR into auto-renewing Electronic Bank Guarantee (e-BG).
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded">Close</button>
              <button
                onClick={() => {
                  alert('Downloading Corrigendum_Addendum_APH_2026_27.pdf (Signed Copy)');
                  setActiveModal(null);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-amber-500 text-slate-950 rounded flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official Gazette</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. APH Handbook Modal */}
      {activeModal === 'aph' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 p-6 animate-in fade-in max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Approval Process Handbook (APH) 2026-2027</h3>
                <p className="text-[11px] text-slate-500">Government of India · All India Council for Technical Education</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Chapter I: New Technical Institution</span>
                  <p className="text-[11px] text-slate-600 mt-1">Application process, eligibility of Trust/Society, Land title, Joint FDR, and Essential NOCs.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Chapter II: Extension of Approval (EoA)</span>
                  <p className="text-[11px] text-slate-600 mt-1">Annual renewal, intake expansion, starting new programs in AI/Robotics, OCI/NRI quota.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Appendix 4: Norms for Land & Space</span>
                  <p className="text-[11px] text-slate-600 mt-1">Land requirements by city classification, instructional vs administrative area formulas.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Appendix 7: Faculty Cadre & Student Ratio</span>
                  <p className="text-[11px] text-slate-600 mt-1">Cadre ratio 1:2:6 (Prof:Assoc:Asst), 7th CPC salary structure, and Principal qualification norms.</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px]">
                <strong>AI Scrutiny Note:</strong> Nirnay Automated Scrutiny Engine automatically enforces the quantitative rules from Appendix 4 and Appendix 7 against any application in real-time.
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded">Close</button>
              <button
                onClick={() => {
                  alert('Approval Process Handbook 2026-27 (Complete 240-page PDF) download initiated.');
                  setActiveModal(null);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-amber-500 text-slate-950 rounded flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Complete APH (18.4 MB)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Centralized Support System / Query Ticket Modal */}
      {activeModal === 'support' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Centralized Support System — Raise Scrutiny Query</h3>
              <button onClick={() => { setActiveModal(null); setTicketSubmitted(false); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            {ticketSubmitted ? (
              <div className="py-8 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Grievance Ticket Logged Successfully</h4>
                <p className="text-xs text-slate-600 mt-1">Ticket Reference: <span className="font-mono font-bold text-amber-700">AICTE-GRV-2026-8941</span></p>
                <p className="text-xs text-slate-500 mt-0.5">Assigned to: Advisor (Approval Bureau), New Delhi. SLA: 48 Hours.</p>
                <button
                  onClick={() => { setActiveModal(null); setTicketSubmitted(false); }}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setTicketSubmitted(true); }} className="py-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Permanent Institute ID (PID)</label>
                  <input type="text" defaultValue="1-429810441" className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500" required />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Query Subject / Deficiency Reference</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500">
                    <option>Cadre Ratio Shortfall Clarification</option>
                    <option>Fire Safety NOC Renewal Acknowledgment</option>
                    <option>Joint FDR Verification Lien Status</option>
                    <option>Land Title Mutation & Sub-Registrar Registry</option>
                    <option>Technical Portal Login / DSC Issues</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Detailed Explanation & Justification</label>
                  <textarea rows={3} defaultValue="We have submitted the Fire NOC renewal challan and request temporary scrutiny clearance." className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500" />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-amber-500 text-slate-950 rounded flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Query to Approval Bureau</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. FAQs Modal */}
      {activeModal === 'faqs' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Frequently Asked Questions (FAQs) — APH 2026-27</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-3">
              {FAQS_LIST.map((faq, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-2 pl-6 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Unapproved Institutions Caution Registry Modal */}
      {activeModal === 'unapproved' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">Public Advisory: Unapproved Technical Institutions</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-700">
              <p className="text-red-800 bg-red-50 p-3 rounded border border-red-200">
                <strong>Statutory Notice:</strong> Under AICTE Act 1987 Section 10(k), conducting technical degree/diploma courses without prior AICTE approval is illegal. Degrees issued by unapproved entities are invalid for employment and higher studies.
              </p>
              <div className="border border-slate-200 rounded overflow-hidden">
                <div className="bg-slate-100 p-2 font-bold text-[11px] text-slate-700">Sample Registry of Flagged Unapproved Entities</div>
                <div className="divide-y divide-slate-200 text-[11px]">
                  <div className="p-2 flex justify-between">
                    <span>Institute of Advanced Studies (Unregistered)</span>
                    <span className="text-red-700 font-bold">Show Cause Issued</span>
                  </div>
                  <div className="p-2 flex justify-between">
                    <span>National Cyber Technical Academy</span>
                    <span className="text-red-700 font-bold">Public Notice Barred</span>
                  </div>
                  <div className="p-2 flex justify-between">
                    <span>Global Engineering Skills Institute</span>
                    <span className="text-red-700 font-bold">Defunct / No Approval</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded">Close</button>
              <button
                onClick={() => {
                  alert('Redirecting to Grievance cell to report unauthorized institution.');
                  setActiveModal(null);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-red-600 text-white rounded"
              >
                Lodge Complaint Against Unapproved Entity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Video Facilitation Modal */}
      {activeModal === 'video' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 p-6 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Virtual Information Facilitation Center</h3>
              <button onClick={() => { setActiveModal(null); setVideoConnected(false); }} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-6">
              {videoConnected ? (
                <div className="space-y-3">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center animate-pulse">
                    <Video className="w-10 h-10" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Virtual Facilitator Connected</h4>
                  <p className="text-xs text-slate-600">You are in Session #7712 with Technical Officer: <br /><strong>Er. Mohit Sharma (e-Gov Support)</strong></p>
                  <p className="text-[11px] text-slate-500">Audio/Video Channel Active · Audio encryption 256-bit</p>
                  <button
                    onClick={() => setVideoConnected(false)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded"
                  >
                    Disconnect Facilitation Call
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Video className="w-12 h-12 text-[#0b2545] mx-auto" />
                  <h4 className="font-bold text-slate-900 text-sm">Join Live Video Consultation Desk</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    AICTE Technical Support officers provide live 1-on-1 video assistance for DSC setup, APH document uploads, and deficiency hearing questions.
                  </p>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700 text-[11px]">
                    Operating Hours: Monday – Friday (10:00 AM – 05:30 PM IST)
                  </div>
                  <button
                    onClick={() => setVideoConnected(true)}
                    className="w-full py-2.5 bg-[#ffaa00] hover:bg-[#e69900] text-slate-950 font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Enter Live Video Waiting Room
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Academic Calendar Modal */}
      {activeModal === 'calendar' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Revised Academic Calendar 2026-2027</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                <div>
                  <span className="font-bold text-slate-900">Last Date for Online Application (EoA & New)</span>
                  <p className="text-[11px] text-slate-500">Submission on National Approval Portal</p>
                </div>
                <span className="font-mono font-bold text-amber-700">15 Jan, 2027</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                <div>
                  <span className="font-bold text-slate-900">First Scrutiny Committee (SAC) Meetings</span>
                  <p className="text-[11px] text-slate-500">Automated deficiency triage & online evaluation</p>
                </div>
                <span className="font-mono font-bold text-amber-700">15 Feb, 2027</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                <div>
                  <span className="font-bold text-slate-900">Standing Hearing Committee (SHC) Window</span>
                  <p className="text-[11px] text-slate-500">For institutions rectifying flagged deficiencies</p>
                </div>
                <span className="font-mono font-bold text-amber-700">25 Mar, 2027</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex justify-between">
                <div>
                  <span className="font-bold text-slate-900">Final Grant of Approval Orders (EoA Gazette)</span>
                  <p className="text-[11px] text-slate-500">Official dispatch of approval letters</p>
                </div>
                <span className="font-mono font-bold text-emerald-700">30 Apr, 2027</span>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
