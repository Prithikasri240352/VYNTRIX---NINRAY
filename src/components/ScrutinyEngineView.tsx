/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InstitutionApplication, DeficiencyItem } from '../types/aicte';
import { SAMPLE_APPLICATIONS } from '../data/mockInstitutions';
import { generateScrutinyPdf } from '../utils/pdfGenerator';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  PhoneCall,
  Sliders,
  ExternalLink,
  Bot,
  Building,
  Users,
  Landmark,
  FileCheck
} from 'lucide-react';

import { useLanguage } from '../i18n/LanguageContext';

interface ScrutinyEngineViewProps {
  onOpenCopilotWithQuery?: (query: string) => void;
  onOpenSpocWithApp?: (app: InstitutionApplication) => void;
  isHindi?: boolean;
}

export const ScrutinyEngineView: React.FC<ScrutinyEngineViewProps> = ({
  onOpenCopilotWithQuery,
  onOpenSpocWithApp,
}) => {
  const { language, t } = useLanguage();
  const [applications, setApplications] = useState<InstitutionApplication[]>(SAMPLE_APPLICATIONS);
  const [selectedAppId, setSelectedAppId] = useState<string>(SAMPLE_APPLICATIONS[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'Critical' | 'Major' | 'Minor'>('all');
  const [showPlayground, setShowPlayground] = useState(false);
  const [rectifyModalDef, setRectifyModalDef] = useState<DeficiencyItem | null>(null);
  const [rectificationText, setRectificationText] = useState('');
  const [rectificationSuccess, setRectificationSuccess] = useState(false);

  const currentApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const scanSteps = [
    'Parsing Institutional Application & Statutory Affidavits...',
    'Evaluating Contiguous Land Norms & Permissible FSI (Appendix 4)...',
    'Calculating Faculty Cadre Ratio 1:2:6 & Student Projections...',
    'Verifying Joint FDR & Endowment Lien with State Directorate...',
    'Performing Tamper-Detection & Digital Signature Checks on Fire NOC...',
    'Synthesizing Deficiency Triage Matrix against APH 2026-27...',
  ];

  const handleRunScan = () => {
    setIsScanning(true);
    setScanStep(0);

    const interval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsScanning(false);
          return prev;
        }
      });
    }, 450);
  };

  const handleResolveDeficiency = (defId: string) => {
    const updated = applications.map((app) => {
      if (app.id === currentApp.id) {
        const newDefs = app.deficiencies.map((d) =>
          d.id === defId ? { ...d, isResolved: true } : d
        );
        const resolvedCount = newDefs.filter((d) => d.isResolved).length;
        const total = newDefs.length;
        const newScore = total === 0 ? 100 : Math.round(app.complianceScore + ((100 - app.complianceScore) * (resolvedCount / total)));
        const allResolved = newDefs.every((d) => d.isResolved);

        return {
          ...app,
          deficiencies: newDefs,
          complianceScore: Math.min(100, newScore),
          overallStatus: (allResolved ? 'Approved / Compliant' : app.overallStatus) as any,
        };
      }
      return app;
    });

    setApplications(updated);
    setRectificationSuccess(true);
    setTimeout(() => {
      setRectificationSuccess(false);
      setRectifyModalDef(null);
      setRectificationText('');
    }, 1200);
  };

  const handlePlaygroundChange = (field: string, val: number) => {
    const updated = applications.map((app) => {
      if (app.id === currentApp.id) {
        const copy = { ...app };
        if (field === 'land') copy.landAreaAcres = val;
        if (field === 'builtUp') copy.builtUpAreaSqM = val;
        if (field === 'fdr') copy.jointFdrAmountLakhs = val;
        if (field === 'professors') {
          copy.facultyCadre = {
            ...copy.facultyCadre,
            professorsAvailable: val,
            cadreRatioCompliant: val >= copy.facultyCadre.professorsRequired,
          };
        }

        // Recalculate score
        let score = 100;
        if (copy.landAreaAcres < copy.requiredLandAcres) score -= 25;
        if (copy.builtUpAreaSqM < copy.requiredBuiltUpAreaSqM) score -= 20;
        if (copy.jointFdrAmountLakhs < copy.requiredJointFdrLakhs) score -= 15;
        if (!copy.facultyCadre.cadreRatioCompliant) score -= 20;

        copy.complianceScore = Math.max(20, score);
        copy.overallStatus = score >= 90 ? 'Approved / Compliant' : score >= 65 ? 'Deficiency Issued' : 'Referred to SHC';
        return copy;
      }
      return app;
    });

    setApplications(updated);
  };

  const filteredDeficiencies = currentApp.deficiencies.filter((d) => {
    if (severityFilter === 'all') return true;
    return d.severity === severityFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Title & Pipeline Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AICTE Service Desk — Regulatory Scrutiny & Committee Automation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            AICTE Service Desk — Automated Scrutiny Workbench (SAC & EVC)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Validating institutional records against statutory norms of AICTE Approval Process Handbook (APH 2026-27).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowPlayground(!showPlayground)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showPlayground
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showPlayground ? 'Hide Norm Simulator' : 'Simulate Norm Adjustments'}</span>
          </button>

          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="px-4 py-2 bg-[#ffaa00] hover:bg-[#e69900] disabled:bg-slate-300 text-slate-950 font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Running Scan...' : 'Re-Run Automated Scrutiny'}</span>
          </button>

          <button
            onClick={() => generateScrutinyPdf(currentApp)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Official PDF Scrutiny Sheet</span>
          </button>
        </div>
      </div>

      {/* Real-time Scanning Progress Banner */}
      {isScanning && (
        <div className="my-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-950 mb-2">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span>Scrutiny Pipeline Active: Step {scanStep + 1} of {scanSteps.length}</span>
            </span>
            <span className="font-mono tabular-nums">{Math.round(((scanStep + 1) / scanSteps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-amber-200/80 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-amber-900 mt-2 font-mono">
            ▶ {scanSteps[scanStep]}
          </p>
        </div>
      )}

      {/* Application Selector Tabs */}
      <div className="mt-6">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Select Institution Application for Evaluation:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {applications.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              className={`p-3.5 text-left rounded-xl border transition-all cursor-pointer relative ${
                selectedAppId === app.id
                  ? 'bg-white border-amber-500 ring-2 ring-amber-400/30 shadow-md'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1 font-mono text-slate-500">
                <span>{app.applicationId}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-xs font-semibold text-[10px] ${
                    app.overallStatus === 'Approved / Compliant'
                      ? 'bg-emerald-100 text-emerald-800'
                      : app.overallStatus === 'Deficiency Issued'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {app.complianceScore}%
                </span>
              </div>
              <div className="font-bold text-xs text-slate-900 line-clamp-1">
                {app.institutionName}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {app.city}, {app.state} · {app.applicationType}
              </div>
              <div className="mt-2 text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                <span>Intake: {app.proposedIntake}</span>
                <span className="text-slate-500">
                  {app.deficiencies.filter((d) => !d.isResolved).length} Deficit
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Norm Simulator Playground (Collapsible) */}
      {showPlayground && (
        <div className="mt-6 p-5 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wide">
                Regulatory Stress-Test & Norm Simulator (APH 2026-27)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Adjust variables to test engine threshold reactions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Land Area (Acres):</span>
                <span className="font-mono text-amber-300 font-bold">{currentApp.landAreaAcres} / {currentApp.requiredLandAcres}</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.1"
                value={currentApp.landAreaAcres}
                onChange={(e) => handlePlaygroundChange('land', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Statutory Min: {currentApp.requiredLandAcres} Acres</span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Built-up Area (sq.m):</span>
                <span className="font-mono text-amber-300 font-bold">{currentApp.builtUpAreaSqM.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="6000"
                max="18000"
                step="100"
                value={currentApp.builtUpAreaSqM}
                onChange={(e) => handlePlaygroundChange('builtUp', parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Required: {currentApp.requiredBuiltUpAreaSqM.toLocaleString()} sq.m</span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Professors Available:</span>
                <span className="font-mono text-amber-300 font-bold">
                  {currentApp.facultyCadre.professorsAvailable} / {currentApp.facultyCadre.professorsRequired}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={currentApp.facultyCadre.professorsAvailable}
                onChange={(e) => handlePlaygroundChange('professors', parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Required Cadre (1:2:6): {currentApp.facultyCadre.professorsRequired}</span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Joint FDR (₹ Lakhs):</span>
                <span className="font-mono text-amber-300 font-bold">₹ {currentApp.jointFdrAmountLakhs} L</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="5"
                value={currentApp.jointFdrAmountLakhs}
                onChange={(e) => handlePlaygroundChange('fdr', parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Statutory Norm: ₹ {currentApp.requiredJointFdrLakhs} Lakhs</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Institution Overview Card */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
              <span>PID: {currentApp.pid}</span>
              <span>·</span>
              <span>Ref: {currentApp.applicationId}</span>
              <span>·</span>
              <span className="text-amber-800 font-bold">{currentApp.region} Region</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {currentApp.institutionName}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentApp.address}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Compliance Gauge */}
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-500">Compliance Index</div>
              <div
                className={`text-2xl font-extrabold font-mono tabular-nums ${
                  currentApp.complianceScore >= 90
                    ? 'text-emerald-600'
                    : currentApp.complianceScore >= 65
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`}
              >
                {currentApp.complianceScore} / 100
              </div>
              <div className="text-[11px] font-medium text-slate-600">
                {currentApp.overallStatus}
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            {/* Quick Actions */}
            <div className="space-y-1.5">
              <button
                onClick={() => onOpenSpocWithApp && onOpenSpocWithApp(currentApp)}
                className="w-full px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                <span>Contact SPOC Officer</span>
              </button>
              <button
                onClick={() =>
                  onOpenCopilotWithQuery &&
                  onOpenCopilotWithQuery(
                    `How can ${currentApp.institutionName} resolve the flagged deficiencies for ${currentApp.applicationType}?`
                  )
                }
                className="w-full px-3 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-amber-700" />
                <span>AI Remedy Advisory</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars Statutory Verification Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Pillar 1: Land */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-slate-500" />
                <span>Contiguous Land</span>
              </span>
              {currentApp.landAreaAcres >= currentApp.requiredLandAcres ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="text-base font-bold font-mono text-slate-900">
              {currentApp.landAreaAcres} Acres
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Required: {currentApp.requiredLandAcres} Acres (Rural/Urban Norm)
            </div>
          </div>

          {/* Pillar 2: Built-up Area */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-slate-500" />
                <span>Built-up Space</span>
              </span>
              {currentApp.builtUpAreaSqM >= currentApp.requiredBuiltUpAreaSqM ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="text-base font-bold font-mono text-slate-900">
              {currentApp.builtUpAreaSqM.toLocaleString()} sq.m
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Required: {currentApp.requiredBuiltUpAreaSqM.toLocaleString()} sq.m
            </div>
          </div>

          {/* Pillar 3: Faculty Cadre Ratio */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-500" />
                <span>Faculty Cadre (1:2:6)</span>
              </span>
              {currentApp.facultyCadre.cadreRatioCompliant ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
            </div>
            <div className="text-base font-bold font-mono text-slate-900">
              Prof: {currentApp.facultyCadre.professorsAvailable} / {currentApp.facultyCadre.professorsRequired}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Assoc: {currentApp.facultyCadre.assocProfAvailable} · Asst: {currentApp.facultyCadre.asstProfAvailable}
            </div>
          </div>

          {/* Pillar 4: Joint FDR */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-slate-500" />
                <span>Joint Security FDR</span>
              </span>
              {currentApp.jointFdrAmountLakhs >= currentApp.requiredJointFdrLakhs ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="text-base font-bold font-mono text-slate-900">
              ₹ {currentApp.jointFdrAmountLakhs} Lakhs
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Required: ₹ {currentApp.requiredJointFdrLakhs} Lakhs (Joint Lien)
            </div>
          </div>
        </div>
      </div>

      {/* Deficiency Triage Matrix Section */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Identified Deficiencies & Compliance Findings ({currentApp.deficiencies.length})
            </h3>
            <p className="text-xs text-slate-500">
              Mapped against Approval Process Handbook (APH 2026-27) clauses.
            </p>
          </div>

          {/* Severity Filter Controls */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            {(['all', 'Critical', 'Major', 'Minor'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sev === 'all' ? 'All Findings' : sev}
              </button>
            ))}
          </div>
        </div>

        {filteredDeficiencies.length === 0 ? (
          <div className="p-8 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Nil Deficiencies Under Current Filter</h4>
            <p className="text-xs text-slate-600 mt-1">
              All tested statutory criteria are in full compliance with AICTE guidelines.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredDeficiencies.map((def) => (
              <div
                key={def.id}
                className={`p-5 rounded-xl border transition-all ${
                  def.isResolved
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : def.severity === 'Critical'
                    ? 'bg-red-50/70 border-red-200'
                    : def.severity === 'Major'
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-blue-50/60 border-blue-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider ${
                        def.isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : def.severity === 'Critical'
                          ? 'bg-red-600 text-white'
                          : def.severity === 'Major'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {def.isResolved ? 'RESOLVED' : `${def.severity} Severity`}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {def.category}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs font-mono font-medium text-slate-600">
                      {def.aphClause}
                    </span>
                  </div>

                  {!def.isResolved && (
                    <button
                      onClick={() => setRectifyModalDef(def)}
                      className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded border border-slate-300 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      Rectify / Submit Affidavit
                    </button>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {def.title}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-2 text-xs">
                  <div className="p-2.5 bg-white/80 rounded border border-slate-200/80">
                    <span className="text-slate-500 font-semibold block text-[11px]">Observed Status:</span>
                    <span className="font-mono text-red-700 font-medium">{def.observedValue}</span>
                  </div>
                  <div className="p-2.5 bg-white/80 rounded border border-slate-200/80">
                    <span className="text-slate-500 font-semibold block text-[11px]">Mandatory Statutory Norm:</span>
                    <span className="font-mono text-emerald-700 font-medium">{def.requiredValue}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 mt-2">
                  <strong>Deficiency Detail:</strong> {def.deficitDescription}
                </p>

                <p className="text-xs text-slate-600 mt-1">
                  <strong>Remediation Directive:</strong> {def.remediationAction}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deficiency Rectification Modal */}
      {rectifyModalDef && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 animate-in fade-in">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Submit Rectification Undertaking & Compliance Affidavit
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Deficiency: {rectifyModalDef.title} ({rectifyModalDef.aphClause})
            </p>

            {rectificationSuccess ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Undertaking Verified & Registered</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Scrutiny Committee records updated. Compliance score adjusted dynamically.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleResolveDeficiency(rectifyModalDef.id);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Compliance Action Taken / Selection Committee Minuted Date
                  </label>
                  <input
                    type="text"
                    defaultValue="Advertisement issued in Times of India on 12-Oct-2026; Selection meeting scheduled 05-Nov-2026"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Legal Undertaking on ₹ 100 Stamp Paper (Notarized)
                  </label>
                  <textarea
                    rows={3}
                    value={
                      rectificationText ||
                      `I, Principal/Chairman of ${currentApp.institutionName}, hereby solemnly affirm that the deficiency pertaining to ${rectifyModalDef.title} shall be fully rectified as per APH 2026-27 norms prior to session commencement.`
                    }
                    onChange={(e) => setRectificationText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 font-mono text-[11px]"
                  />
                </div>

                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-600 text-[11px]">
                  <span>📎 Attached Verification File: <strong>Affidavit_Form_4_StampPaper.pdf</strong> (Digitally Signed)</span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setRectifyModalDef(null)}
                    className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded shadow-xs"
                  >
                    Submit Rectification to SAC
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
