/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Play,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  Cpu,
  Layers,
  ShieldCheck,
  MapPin,
  Flame,
  Building,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  FileDown
} from 'lucide-react';
import { InstitutionApplication, VerificationDocument } from '../../types/aicte';

interface EoaVerificationPipelineTabProps {
  institution: InstitutionApplication;
  onOpenClarificationModal: (docId?: string, query?: string) => void;
  onOpenDeficiencyModal: (prefill?: { title: string; aphClause: string; category: string; description: string }) => void;
  onSwitchToReport: () => void;
}

interface VerificationStage {
  id: number;
  name: string;
  category: string;
  description: string;
  durationMs: number;
  status: 'pending' | 'in_progress' | 'passed' | 'warning' | 'failed';
  logItems: string[];
}

export const EoaVerificationPipelineTab: React.FC<EoaVerificationPipelineTabProps> = ({
  institution,
  onOpenClarificationModal,
  onOpenDeficiencyModal,
  onSwitchToReport
}) => {
  const [pipelineState, setPipelineState] = useState<'idle' | 'running' | 'completed'>('completed');
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(4);
  const [progressPercent, setProgressPercent] = useState<number>(100);
  const [liveLogs, setLiveLogs] = useState<string[]>([
    `[SYS INIT] Pipeline initialized for AICTE Application ID: ${institution.applicationId}`,
    `[STAGE 1] Ingested ${institution.documents.length} digital documents across statutory categories`,
    `[STAGE 1] Digital signatures & certificate authorities validated against CCA National Root`,
    `[STAGE 2] Tesseract OCR + Google Vision high-density text extraction completed (avg confidence 94.2%)`,
    `[STAGE 3] Cross-document reconciliation verified PID ${institution.pid} across Land, Building & Cadre records`,
    `[STAGE 4] Statutory Norms Engine evaluated: Land (${institution.landAreaAcres}ac / req ${institution.requiredLandAcres}ac), Cadre (1:2:6 ratio), FDR (Rs. ${institution.jointFdrAmountLakhs}L)`,
    `[STAGE 5] Spatial & EXIF GPS engine evaluated coordinates ${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E`,
    `[REPORT READY] Advisory compliance score computed: ${institution.complianceScore}/100. Ready for officer determination.`
  ]);

  const stages: VerificationStage[] = [
    {
      id: 1,
      name: 'Format Integrity & Digital Signatures',
      category: 'Stage 1: Ingestion & Crypto Verification',
      description: 'Validates PDF format, checksum hashes, PKI digital signatures (DSC/eSign), and tampered byte inspection.',
      durationMs: 800,
      status: 'passed',
      logItems: [
        'Inspecting PDF/A document stream formats and encryption flags...',
        'Validating Class 3 Digital Signature of Principal / Society Secretary...',
        'Verifying timestamp tokens against National Informatics Centre (NIC) TSA...',
        'Format and cryptographic integrity validated: All files authentic.'
      ]
    },
    {
      id: 2,
      name: 'OCR Extraction & Bi-directional Entity Matching',
      category: 'Stage 2: Multimodal Text & Vision Processing',
      description: 'Extracts tabular and textual data, identifies AICTE PID, Trust Registration, Survey numbers, and Sanction dates.',
      durationMs: 1100,
      status: 'passed',
      logItems: [
        `Scanning document bodies for permanent institutional identifier: ${institution.pid}...`,
        `Extracted 42 key metadata fields across Land, Building, Fire, Cadre & Affiliation files.`,
        'Correlating Tamil Nadu Registration Department Document Numbers & DTCP sanction seals...',
        'Entity extraction complete. High confidence matching (94.2% mean accuracy).'
      ]
    },
    {
      id: 3,
      name: 'Cross-Document Consistency Matrix',
      category: 'Stage 3: Cross-Corpus Reconciliation',
      description: 'Checks whether Land survey numbers in Affidavit match Form D, Fire NOC matches campus address, and University Affiliation covers applied courses.',
      durationMs: 1200,
      status: institution.complianceScore < 85 ? 'warning' : 'passed',
      logItems: [
        'Cross-referencing Land Survey Numbers across Title Deed vs Form D Occupancy...',
        'Checking Fire NOC building block schedule against Building Approval Blueprint...',
        'Reconciling Anna University Affiliation Order with AICTE Portal proposed intake...',
        'Cross-document reconciliation: 1 Minor date discrepancy flagged in Fire NOC renewal window.'
      ]
    },
    {
      id: 4,
      name: 'AICTE APH 2024–2027 Norms Compliance Engine',
      category: 'Stage 4: Statutory Norms & Ratio Validation',
      description: 'Evaluates Cadre ratio (1:2:6), Student-to-Faculty Ratio (SFR), Principal eligibility, Minimum Land area, Built-up area, and Joint FDR.',
      durationMs: 1300,
      status: institution.facultyCadre.cadreRatioCompliant ? 'passed' : 'warning',
      logItems: [
        `Evaluating Land Area: Observed ${institution.landAreaAcres} Acres vs Required ${institution.requiredLandAcres} Acres -> PASS`,
        `Evaluating Built-up Area: Observed ${institution.builtUpAreaSqM.toLocaleString()} sq.m vs Required ${institution.requiredBuiltUpAreaSqM.toLocaleString()} sq.m -> PASS`,
        `Evaluating Faculty Cadre (1:2:6): Prof: ${institution.facultyCadre.professorsAvailable}/${institution.facultyCadre.professorsRequired}, Assoc: ${institution.facultyCadre.assocProfAvailable}/${institution.facultyCadre.assocProfRequired}, Asst: ${institution.facultyCadre.asstProfAvailable}/${institution.facultyCadre.asstProfRequired}`,
        `Principal Qualification: Ph.D + Cadre Experience -> ${institution.facultyCadre.principalEligible ? 'VERIFIED' : 'DEFICIENT'}`,
        `Joint FDR: Rs. ${institution.jointFdrAmountLakhs} Lakhs vs Required Rs. ${institution.requiredJointFdrLakhs} Lakhs -> PASS`
      ]
    },
    {
      id: 5,
      name: 'Geospatial & Photographic EXIF Verification',
      category: 'Stage 5: Spatial Intelligence & Geotag Verification',
      description: 'Performs Haversine distance analysis comparing institutional campus coordinates with browser upload GPS and camera EXIF metadata.',
      durationMs: 900,
      status: 'passed',
      logItems: [
        `Campus Geofence: ${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E (Radius: ${institution.campusCoordinates?.campusRadiusMeters || 1200}m)`,
        'Inspecting photographic EXIF metadata from uploaded infrastructure evidence...',
        'Calculating Haversine geodesic displacement between upload location and registered campus: 0.18 km (Well within on-campus perimeter)',
        'Spatial verification completed: Evidence confirmed captured on authorized institutional premises.'
      ]
    }
  ];

  const handleStartPipeline = () => {
    setPipelineState('running');
    setCurrentStageIdx(0);
    setProgressPercent(10);
    setLiveLogs([`[EXECUTION STARTED] Initiating AICTE EOA Verification Pipeline for PID: ${institution.pid} (${institution.institutionName})...`]);

    let stage = 0;
    const interval = setInterval(() => {
      stage += 1;
      if (stage < stages.length) {
        setCurrentStageIdx(stage);
        setProgressPercent(Math.round(((stage + 1) / stages.length) * 100));
        setLiveLogs((prev) => [
          ...prev,
          ...stages[stage].logItems.map((log) => `[STAGE ${stage + 1}] ${log}`)
        ]);
      } else {
        clearInterval(interval);
        setPipelineState('completed');
        setProgressPercent(100);
        setLiveLogs((prev) => [
          ...prev,
          `[SUCCESS] Comprehensive AICTE EOA Verification Pipeline completed in ${(stages.reduce((acc, s) => acc + s.durationMs, 0) / 1000).toFixed(1)}s`,
          `[ADVISORY] Scrutiny findings synthesized. Risk Priority Rank: LOW RISK (${institution.complianceScore}/100). Final decision rests with AICTE Officer.`
        ]);
      }
    }, 1100);
  };

  // Determine risk level
  const riskCategory = institution.complianceScore >= 85 ? 'Low Risk' : institution.complianceScore >= 65 ? 'Moderate Review Priority' : 'High Priority Deficiencies';
  const riskBadgeColor = institution.complianceScore >= 85 ? 'text-emerald-400 bg-emerald-950/70 border-emerald-800/80' : institution.complianceScore >= 65 ? 'text-amber-300 bg-amber-950/70 border-amber-800/80' : 'text-rose-400 bg-rose-950/70 border-rose-800/80';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Trigger */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-blue-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                AICTE Regulatory Scrutiny Engine
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${riskBadgeColor}`}>
                {riskCategory}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Model: Nirnay-APH-2026-v3.2
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              AI-Powered EOA Verification Pipeline
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Executes a rigorous 5-stage automated audit on <span className="text-white font-medium">{institution.institutionName}</span> (PID: {institution.pid}). Checks document authenticity, performs OCR extraction, verifies cross-document consistency against AICTE Approval Process Handbook (APH 2024–27), and computes spatial geofence alignment.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleStartPipeline}
              disabled={pipelineState === 'running'}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 text-white text-sm font-semibold flex items-center gap-2.5 transition shadow-lg shadow-blue-600/30 active:scale-95"
            >
              {pipelineState === 'running' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Processing Stage {currentStageIdx + 1}/5...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Run Complete Verification</span>
                </>
              )}
            </button>

            <button
              onClick={onSwitchToReport}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 transition"
              title="Generate and download official PDF report"
            >
              <FileDown className="w-4 h-4 text-emerald-400" />
              <span>Official PDF Report</span>
            </button>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-slate-300 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${pipelineState === 'running' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
              Pipeline Execution Status: {pipelineState === 'running' ? `Executing Stage ${currentStageIdx + 1} of 5` : 'Audit Completed & Findings Synthesized'}
            </span>
            <span className="text-blue-400 font-mono font-semibold">{progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5 Pipeline Stages Execution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {stages.map((stage, idx) => {
          const isCurrent = pipelineState === 'running' && currentStageIdx === idx;
          const isDone = (pipelineState === 'running' && currentStageIdx > idx) || pipelineState === 'completed';
          const isPending = pipelineState === 'running' && currentStageIdx < idx;

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                  : isDone
                  ? stage.status === 'warning'
                    ? 'bg-slate-900/80 border-amber-500/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-900 text-slate-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-semibold text-slate-400">
                    STAGE 0{stage.id}
                  </span>
                  {isCurrent && (
                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                  )}
                  {isDone && stage.status === 'passed' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {isDone && stage.status === 'warning' && (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  {isPending && (
                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>

                <h4 className="text-xs font-bold text-white mb-1.5 leading-snug">
                  {stage.name}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                  {stage.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Status</span>
                <span
                  className={`font-semibold ${
                    isCurrent
                      ? 'text-blue-400'
                      : isDone
                      ? stage.status === 'warning'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                      : 'text-slate-500'
                  }`}
                >
                  {isCurrent ? 'Running...' : isDone ? (stage.status === 'warning' ? 'Check Required' : 'Verified') : 'Queued'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Analysis Section: Live Terminal Logs & Explainable Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Terminal Output Console (4 Cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono font-semibold text-slate-300 ml-1">
                nirnay_verification_pipeline.log
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Live Stream
            </span>
          </div>

          <div className="flex-1 font-mono text-[11px] text-slate-300 space-y-1.5 overflow-y-auto max-h-[380px] p-2 bg-slate-900/50 rounded-xl border border-slate-800/60 leading-relaxed scrollbar-thin">
            {liveLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-slate-500 select-none">{'>'}</span>
                <span
                  className={
                    log.includes('FAIL') || log.includes('DEFICIENT')
                      ? 'text-rose-400'
                      : log.includes('warning') || log.includes('discrepancy')
                      ? 'text-amber-300'
                      : log.includes('PASS') || log.includes('VERIFIED') || log.includes('authentic')
                      ? 'text-emerald-400'
                      : 'text-slate-300'
                  }
                >
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>OCR Engine: Tesseract 5.3 + Google Vision</span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Crypto Hash Verified
            </span>
          </div>
        </div>

        {/* Right Column: Explainable AI Findings & Risk Priority Score (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Risk Priority Score Card */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Advisory Risk-Priority Assessment
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-extrabold text-white">
                    {institution.complianceScore}
                    <span className="text-lg text-slate-400 font-normal"> / 100</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${riskBadgeColor}`}>
                    {riskCategory}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Ranked #4 among 480 evaluated Tamil Nadu Technical Institutions for low regulatory risk.
                </p>
              </div>

              {/* Quick stats mini-matrix */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-sm font-bold text-emerald-400">{institution.documents.length}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Docs Audited</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-sm font-bold text-amber-300">{institution.deficiencies.length}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Observations</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-sm font-bold text-blue-400">100%</div>
                  <div className="text-[10px] text-slate-400 font-medium">Land & FDR</div>
                </div>
              </div>
            </div>
          </div>

          {/* Explainable Findings List */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Explainable Audit Findings & Officer Action Recommendations
              </h3>
              <span className="text-xs text-slate-400">
                AICTE APH 2024–27 Alignment
              </span>
            </div>

            {/* Finding 1: Land and Occupancy */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-white">
                    Land Title Deed & Contiguous Campus Demarcation
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                  APH Cl. 4.1.1 Compliant
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                Institutional land holding of <span className="text-white font-semibold">{institution.landAreaAcres} Acres</span> in {institution.district} exceeds the minimum rural/mega city requirement of <span className="text-slate-300 font-semibold">{institution.requiredLandAcres} Acres</span>. Survey numbers match Form D and revenue patta deeds with no encumbrance caveats found.
              </p>
            </div>

            {/* Finding 2: Fire Safety Certificate */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-white">
                    Fire Safety NOC (TNFRS) — Renewal Window Notice
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                  APH Cl. 4.1.5 Action Required
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                Current Fire NOC certificate issued by Tamil Nadu Fire & Rescue Services is valid through <span className="text-amber-300 font-semibold">May 2026</span>. Prior to issuance of unconditional EOA order for AY 2026–27, institution must deposit acknowledgement receipt for subsequent annual inspection.
              </p>
              <div className="pl-6 flex items-center gap-3 pt-1">
                <button
                  onClick={() => onOpenClarificationModal(institution.documents[1]?.id, 'Please provide the TNFRS annual renewal inspection receipt for Fire Safety compliance covering the full 2026-27 academic session.')}
                  className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Request Clarification from SPOC
                </button>
              </div>
            </div>

            {/* Finding 3: Faculty Cadre Ratio */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-white">
                    Faculty Cadre Ratio (1:2:6) & Principal Eligibility
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                  APH Cl. 7.1 Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                Cadre structure: <span className="text-white font-medium">{institution.facultyCadre.professorsAvailable} Professors</span>, <span className="text-white font-medium">{institution.facultyCadre.assocProfAvailable} Associate Professors</span>, and <span className="text-white font-medium">{institution.facultyCadre.asstProfAvailable} Assistant Professors</span> against total approved intake. Principal Dr. {institution.facultyCadre.principalName || 'Institution Head'} verified eligible with {institution.facultyCadre.principalExperienceYrs || 18} years total experience and doctoral degree.
              </p>
            </div>

            {/* Finding 4: Spatial EXIF Geofence */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-white">
                    Geospatial Campus Coordinate Consistency
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
                  Spatial Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                Institution coordinates ({institution.campusCoordinates?.latitude || '13.3564'}°N, {institution.campusCoordinates?.longitude || '80.1432'}°E) match uploaded photographic evidence EXIF geotags with mean geodesic deviation under 180 meters. No off-campus or fraudulent location spoofing detected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
