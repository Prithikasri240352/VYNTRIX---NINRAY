/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bot, Send, Sparkles, Copy, Check, FileDown, BookOpen, AlertCircle } from 'lucide-react';

import { useLanguage } from '../i18n/LanguageContext';

interface ComplianceCopilotViewProps {
  initialQuery?: string;
  isHindi?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  aphClause?: string;
}

export const ComplianceCopilotView: React.FC<ComplianceCopilotViewProps> = ({
  initialQuery,
}) => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      role: 'assistant',
      content:
        'Namaste! I am the Nirnay Compliance Copilot. I can advise you on Approval Process Handbook (APH 2026-2027) norms, explain deficiency remediation paths, calculate cadre ratios (1:2:6), and generate formal affidavits for the Scrutiny Committee (SAC) and Standing Hearing Committee (SHC). How may I assist your institution today?',
      aphClause: 'APH 2026-2027 Gazette w.e.f 28 Nov 2025',
    },
  ]);
  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const quickPrompts = [
    'How do we rectify a Cadre Ratio deficiency (shortfall in Professors)?',
    'What are mandatory norms to introduce AI & Data Science B.Tech?',
    'What is the procedure if Fire NOC is expiring within 30 days?',
    'Draft an Affidavit on ₹ 100 stamp paper for Joint FDR compliance',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Provide intelligent, context-aware AICTE compliance guidance
    setTimeout(() => {
      let reply = '';
      let clause = 'APH 2026-27';

      const lower = q.toLowerCase();
      if (lower.includes('cadre') || lower.includes('professor') || lower.includes('faculty')) {
        clause = 'APH 2026-27 Clause 2.14 & Appendix 7 (Table 7.1)';
        reply = `**Faculty Cadre Ratio Remediation Guidelines (APH 2026-27):**

1. **Mandatory Cadre Proportion:**
   For UG Engineering & Technology programs, the required Faculty-Student Ratio is **1:20**. The cadre ratio among qualified faculty must strictly adhere to **1 Professor : 2 Associate Professors : 6 Assistant Professors**.

2. **Step-by-Step Remediation for SAC / SHC:**
   - Issue immediate newspaper/online advertisement for required Professor positions with qualifications prescribed under AICTE 7th CPC Gazette (Ph.D. degree + minimum 10 years experience + minimum 6 SCI/Scopus publications).
   - In the interim, furnish an **Affidavit (Appendix 4)** affirming completion of selection committee interviews within 60 days.
   - Associate Professors with valid Ph.D. degrees and eligible API scores can be considered for Career Advancement Scheme (CAS) elevation to satisfy cadre proportions.`;
      } else if (lower.includes('fire') || lower.includes('noc')) {
        clause = 'APH 2026-27 Clause 1.6(c) & Table 1.1';
        reply = `**Fire Safety NOC Expiry & Compliance Protocol:**

1. **Statutory Requirement:**
   A valid, unexpired Fire Safety Certificate issued by the Chief Fire Officer / Competent State Authority is non-negotiable for grant of Extension of Approval (EoA) and Increase in Intake.

2. **Expiring Window (<30 Days) Remediation:**
   - If the existing NOC is expiring, the institution must immediately submit:
     a) Official receipt/acknowledgment slip of renewal application submitted to State Fire Services.
     b) Fire drill and internal hydrant test readiness report signed by Principal.
     c) Notarized undertaking promising submission of final renewal certificate within 30 calendar days.
   - With acknowledgment, SAC will issue a **conditional 7-day compliance window** instead of outright referral to the Standing Hearing Committee.`;
      } else if (lower.includes('affidavit') || lower.includes('draft') || lower.includes('stamp')) {
        clause = 'APH 2026-27 Format Affidavit-1 & 4';
        reply = `**Formal Compliance Affidavit Template (On ₹ 100 Non-Judicial Stamp Paper):**

*BEFORE THE SCRUTINY COMMITTEE / MEMBER SECRETARY, AICTE NEW DELHI*

I, [Principal Name / Chairman], son/daughter of [Name], aged [Age] years, resident of [Address], in my capacity as Authorized Signatory of [Institution Name] (PID: [PID Number]), do hereby solemnly affirm and state as under:

1. That the institution has applied for [Extension of Approval / Increase in Intake] for the Academic Year 2026-27 vide Application ID [Application ID].
2. That with reference to the Scrutiny finding regarding [Deficiency Name], we undertake to recruit the shortfall faculty / submit the renewed statutory certificates on or before [Date].
3. That in case of failure to comply with the stipulated APH 2026-27 norms, the Council shall be at liberty to withdraw approval or reduce intake as deemed fit.

*DEPONENT*
*Verified at [City] on this [Day] day of [Month], 2026. Attested by Notary Public.*`;
      } else if (lower.includes('ai') || lower.includes('data science') || lower.includes('emerging')) {
        clause = 'APH 2026-27 Chapter II & Emerging Tech Division';
        reply = `**Norms for Introducing Emerging Tech Courses (AI, DS, Robotics):**

1. **Eligibility Criteria:**
   - Existing technical institutions with >= 50% average enrollment over preceding 3 academic years.
   - NBA accreditation in at least 1 core program OR NAAC score of >= 2.51.
2. **Infrastructure Allocation:**
   - Dedicated Artificial Intelligence / High-Performance Computing Laboratory with minimum 30 GPU-enabled workstations (NVIDIA RTX / Cloud compute clusters).
   - High-speed dedicated internet lease line >= 1 Gbps.
3. **No Additional Land Required:**
   If the proposed course intake fits within the overall sanctioned campus built-up area and approved total intake ceiling, no incremental land is required.`;
      } else {
        clause = 'APH 2026-27 General Regulations';
        reply = `**AICTE Approval Process Guidance:**

Based on your query regarding "${q}", under the AICTE Approval Process Handbook (APH 2026-2027), all applications must fulfill:
1. Contiguous campus land ownership (freehold or 30-year registered government lease).
2. Built-up area according to student intake formulas (Instructional, Administrative, and Amenities).
3. Faculty cadre ratio of 1:2:6 with salaries disbursed via PFMS / direct bank transfer.
4. Joint Security FDR maintained with Member Secretary, AICTE.

Would you like me to generate a specific compliance undertaking or calculate your exact laboratory space requirement?`;
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        aphClause: clause,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
          <Bot className="w-4 h-4 text-amber-600" />
          <span>AICTE Regulatory Copilot</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          APH 2026-27 Compliance Assistant & Affidavit Drafter
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Instant regulatory reasoning, clause lookup, and formal legal undertakings generation for AICTE technical approvals.
        </p>
      </div>

      {/* Quick Prompts Bar */}
      <div className="mt-4">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Common Scrutiny Inquiries:
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 hover:border-amber-300 text-slate-800 text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer text-left"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-2xl rounded-xl p-4 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#0b2545] text-white font-medium rounded-br-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 text-[11px] font-mono text-slate-500">
                    <span className="font-bold text-amber-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>{m.aphClause || 'AICTE APH 2026-27'}</span>
                    </span>
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
              <span>Nirnay Copilot is analyzing APH 2026-27 clauses...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask any AICTE compliance question or request an affidavit draft..."
              className="flex-1 px-4 py-2.5 bg-white text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Submit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
