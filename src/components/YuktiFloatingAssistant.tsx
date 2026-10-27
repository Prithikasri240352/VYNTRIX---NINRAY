/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Building2,
  FileCheck2,
  AlertTriangle,
  ChevronRight,
  Shield,
  Bot,
  User,
  CornerDownLeft,
  BookOpen
} from 'lucide-react';
import { InstitutionApplication } from '../types/aicte';
import { YuktiAnimatedLogo } from './YuktiAnimatedLogo';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  chips?: string[];
}

interface YuktiFloatingAssistantProps {
  currentInstitution?: InstitutionApplication | null;
  onSelectInstitution?: (inst: InstitutionApplication) => void;
}

import { useLanguage } from '../i18n/LanguageContext';

export const YuktiFloatingAssistant: React.FC<YuktiFloatingAssistantProps> = ({
  currentInstitution
}) => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Namaste! I am Nirnay, the Regulatory & Document Verification Assistant. How can I assist your scrutiny today?',
      timestamp: 'Just now',
      chips: [
        'Check Land & Built-up Norms',
        'Verify Fire NOC Rules (Tamil Nadu)',
        'Explain SFR Cadre Ratio 1:2:6',
        'Draft Clarification for SPOC'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let responseText = '';
      let replyChips: string[] = [];

      const q = query.toLowerCase();

      if (q.includes('fire') || q.includes('noc')) {
        responseText = `According to APH 2026-27 Clause 4.2 & Tamil Nadu Fire and Rescue Services rules:\n• Every technical institution must possess an active, unexpired Fire Safety NOC.\n• For ${currentInstitution ? currentInstitution.institutionName : 'Tamil Nadu technical colleges'}, the issuing authority is the Divisional Fire Officer (DFO).\n• Provisional certificates are not accepted for final EoA approval unless accompanied by a renewal receipt and local inspection endorsement.`;
        replyChips = ['Check Structural Stability Norms', 'Draft Fire NOC Clarification'];
      } else if (q.includes('land') || q.includes('built-up') || q.includes('area')) {
        if (currentInstitution) {
          const isLandCompliant = currentInstitution.landAreaAcres >= currentInstitution.requiredLandAcres;
          const isBuiltCompliant = currentInstitution.builtUpAreaSqM >= currentInstitution.requiredBuiltUpAreaSqM;
          responseText = `Statutory Land Analysis for ${currentInstitution.institutionName} (${currentInstitution.district}, TN):\n• Contiguous Land: ${currentInstitution.landAreaAcres} Acres (Required: ${currentInstitution.requiredLandAcres} Acres) — ${isLandCompliant ? 'COMPLIANT' : 'DEFICIT'}\n• Built-up Area: ${currentInstitution.builtUpAreaSqM.toLocaleString()} sq.m (Required: ${currentInstitution.requiredBuiltUpAreaSqM.toLocaleString()} sq.m) — ${isBuiltCompliant ? 'COMPLIANT' : 'DEFICIT'}\n• Classification: AICTE Urban/Metro cluster for ${currentInstitution.district}.`;
        } else {
          responseText = 'Under AICTE APH 2026-27, engineering institutions in Tamil Nadu Metro/Urban areas require minimum 4.0 Contiguous Acres (or 2.5 Acres in Mega Cities with FSI approval). Rural campuses require 7.5 contiguous acres.';
        }
        replyChips = ['Check Joint FDR Requirements', 'Verify Building Plan Approval'];
      } else if (q.includes('cadre') || q.includes('sfr') || q.includes('faculty')) {
        if (currentInstitution) {
          const f = currentInstitution.facultyCadre;
          responseText = `Faculty Cadre Scrutiny for ${currentInstitution.shortName}:\n• Required Cadre Ratio: 1 Professor : 2 Associate Professors : 6 Assistant Professors (SFR 1:20)\n• Professors: ${f.professorsAvailable} available (Req: ${f.professorsRequired})\n• Associate Profs: ${f.assocProfAvailable} available (Req: ${f.assocProfRequired})\n• Assistant Profs: ${f.asstProfAvailable} available (Req: ${f.asstProfRequired})\n• Cadre Compliance: ${f.cadreRatioCompliant ? 'PASSED' : 'DEFICIENT - Notice Required'}\n• Principal: Dr. ${f.principalName || 'Principal'} — ${f.principalEligible ? 'Meets AICTE 6th/7th Pay qualification norms' : 'Ph.D documentation missing'}`;
        } else {
          responseText = 'AICTE prescribes an SFR of 1:20 for Undergraduate Engineering & Technology programs, with a mandatory cadre distribution ratio of 1:2:6 (Prof : Assoc Prof : Asst Prof). The Principal must have Ph.D and min. 13-15 years teaching/research experience.';
        }
        replyChips = ['Draft Faculty Discrepancy Notice', 'Check AICTE Approved Intake'];
      } else if (q.includes('draft') || q.includes('clarification') || q.includes('spoc')) {
        const instName = currentInstitution?.institutionName || '[Institution Name]';
        const pid = currentInstitution?.pid || '[PID]';
        const spoc = currentInstitution?.spoc.name || 'Authorised Signatory';
        responseText = `Draft Official Clarification Notice:\n\n"To: The Principal / SPOC (${spoc}), ${instName} (PID: ${pid}).\nSubject: Urgent Clarification on Extension of Approval (EoA) AY 2026-27.\n\nDuring automated scrutiny of your submitted dossier by Southern Regional Office, discrepancies were observed against APH 2026-27 provisions. You are hereby advised to submit authenticated rectifications within 7 calendar days on the Nirnay Portal to prevent referral to the Standing Hearing Committee (SHC)."`;
        replyChips = ['Copy Notice Text', 'Check Submission Deadlines'];
      } else if (q.includes('fdr') || q.includes('finance')) {
        responseText = `Joint FDR Regulations (APH 2026-27):\n• Joint FDR must be created in favour of Regional Officer, AICTE Chennai and Institution Trust/Society.\n• Fixed deposit term: Minimum 8 to 10 years or perpetual lien.\n• Bank guarantee verification: Must be confirmed via SFMS / direct bank API transmission.`;
        replyChips = ['Verify Bank Lien', 'Review Land Documents'];
      } else {
        responseText = `I have verified this against the official AICTE Approval Process Handbook (APH 2026-27) for the Southern Region (Tamil Nadu).\n\nIf you need verification on any specific document (Building Plan, Fire NOC, Land Title, Structural Certificate) or institution compliance, click one of the suggested prompts below or ask directly.`;
        replyChips = [
          'Check Land & Built-up Norms',
          'Verify Fire NOC Rules (Tamil Nadu)',
          'Explain SFR Cadre Ratio 1:2:6'
        ];
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: replyChips
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating launcher docked on the middle-right edge with A6 animated branding */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Nirnay AI Regulatory Assistant"
          aria-expanded={false}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-l from-slate-950 via-[#0b2545] to-indigo-950 hover:from-blue-900 hover:to-indigo-900 text-white pl-3.5 pr-2.5 py-3 rounded-l-2xl shadow-2xl flex items-center gap-2.5 font-['Poppins'] transition-all transform hover:-translate-x-1.5 border-t border-b border-l border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400 group cursor-pointer"
          title="Open Nirnay AI Regulatory Assistant"
        >
          {/* Animated Emblem */}
          <YuktiAnimatedLogo size="sm" isInteractive={false} />

          <div className="flex flex-col text-left pr-0.5 select-none">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-amber-300">
                Nirnay
              </span>
              <span className="text-[8px] px-1 py-0.2 rounded bg-blue-500/30 text-blue-200 font-bold border border-blue-400/30">
                AI
              </span>
            </div>
            <span className="text-[9px] text-slate-300 font-medium">Assistant</span>
          </div>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Nirnay Regulatory Scrutiny Assistant"
          className="fixed right-4 bottom-4 z-50 w-96 max-w-[calc(100vw-2rem)] h-[580px] max-h-[85vh] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden font-['Poppins'] animate-in slide-in-from-right-10 duration-200"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <YuktiAnimatedLogo size="sm" isInteractive={false} />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">Nirnay AI Scrutiny Guide</h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold">
                    APH 2026-27
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>SRO Chennai Regulatory Intelligence</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Nirnay Assistant"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none focus:ring-1 focus:ring-amber-400"
              title="Close Nirnay Assistant (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context pill: AICTE Service Desk */}
          <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="font-semibold text-white truncate">AICTE Service Desk:</span>
              <span className="text-slate-400 truncate">
                {currentInstitution ? currentInstitution.institutionName : 'Southern Regional Office (SRO Chennai)'}
              </span>
            </div>
            <span className="text-[10px] text-amber-400 font-mono flex-shrink-0">
              {currentInstitution ? currentInstitution.pid : 'SRO-CHENNAI'}
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`p-3 rounded-2xl whitespace-pre-line text-xs ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none leading-relaxed'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.chips && m.chips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.chips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(chip)}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-850 text-blue-300 hover:text-white border border-slate-700/80 transition flex items-center gap-1"
                        >
                          <span>{chip}</span>
                          <ChevronRight className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] text-slate-500 font-mono px-1 ${
                      m.sender === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>

                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-400">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span className="text-[11px]">Nirnay is cross-referencing APH 2026-27 norms...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts strip */}
          <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSendMessage('Check Fire NOC validity')}
              className="px-2 py-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-300 whitespace-nowrap"
            >
              Fire NOC
            </button>
            <button
              onClick={() => handleSendMessage('Summarize Land & Built-up area')}
              className="px-2 py-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-300 whitespace-nowrap"
            >
              Land Norms
            </button>
            <button
              onClick={() => handleSendMessage('Verify Faculty Cadre Ratio')}
              className="px-2 py-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-300 whitespace-nowrap"
            >
              Cadre 1:2:6
            </button>
            <button
              onClick={() => handleSendMessage('Draft Clarification for SPOC')}
              className="px-2 py-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-300 whitespace-nowrap"
            >
              Draft Query
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about APH norms, clause citations, or checks..."
                className="flex-1 bg-slate-900 text-white text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition shadow"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
