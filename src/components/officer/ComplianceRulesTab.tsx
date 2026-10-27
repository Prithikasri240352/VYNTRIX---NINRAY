/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { EOA_CHECKLIST_RULES, EoaChecklistRule } from '../../data/eoaChecklistRules';
import { InstitutionApplication } from '../../types/aicte';

interface ComplianceRulesTabProps {
  institution: InstitutionApplication;
  onOpenClarificationModal: (docId?: string, query?: string) => void;
}

export const ComplianceRulesTab: React.FC<ComplianceRulesTabProps> = ({
  institution,
  onOpenClarificationModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedReqType, setSelectedReqType] = useState<string>('All');

  const categories = [
    'All',
    'Legal & Affidavits',
    'Statutory Approvals & NOCs',
    'Land & Building Norms',
    'Faculty & Academic',
    'Finance & FDR',
    'Environment & Safety'
  ];

  const filteredRules = EOA_CHECKLIST_RULES.filter((rule) => {
    const matchesSearch =
      rule.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.aphClauseRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || rule.category === selectedCategory;
    const matchesReq = selectedReqType === 'All' || rule.requirementType === selectedReqType;
    return matchesSearch && matchesCat && matchesReq;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                AICTE Approval Process Handbook (APH 2024–2027)
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/80">
                Annexure 2 Baseline
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Dynamic EOA Regulatory Compliance Checklist
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Official regulatory criteria governing Extension of Approval (EOA) for technical institutions in Tamil Nadu. Differentiates mandatory submissions, conditional requirements (e.g., Structural Stability for buildings &gt;30 years, Joint FDR for self-financing), and statutory scrutiny checkpoints.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by clause, title, or norm..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>

            <select
              value={selectedReqType}
              onChange={(e) => setSelectedReqType(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Requirement Types</option>
              <option value="Mandatory">Mandatory Only</option>
              <option value="Conditionally Required">Conditionally Required</option>
              <option value="Supporting Evidence">Supporting Evidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => {
          const isMandatory = rule.requirementType === 'Mandatory';

          return (
            <div
              key={rule.id}
              className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-semibold text-blue-400">
                      {rule.aphClauseRef}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {rule.documentName}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border flex-shrink-0 ${
                      isMandatory
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                        : 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                    }`}
                  >
                    {rule.requirementType}
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider mb-1">
                    Condition of Applicability:
                  </span>
                  {rule.applicabilityCondition}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rule.description}
                </p>

                {/* Key Checklist Points */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Key Scrutiny Checkpoints:
                  </span>
                  <ul className="space-y-1">
                    {rule.keyVerificationPoints.map((pt, pidx) => (
                      <li key={pidx} className="text-[11px] text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">
                  Category: {rule.category}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenClarificationModal(undefined, `Regarding ${rule.documentName} (${rule.aphClauseRef}): Please clarify compliance.`)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                >
                  Clarification Query
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
