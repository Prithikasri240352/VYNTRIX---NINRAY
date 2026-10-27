/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  FileCheck2,
  AlertTriangle,
  FileText,
  Clock,
  Phone,
  Video,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Send,
  Eye,
  RefreshCw,
  Award,
  Maximize2,
  MapPin,
  Navigation,
  Camera,
  Compass,
  Play,
  Cpu,
  BookOpen,
  ShieldCheck,
  Calculator,
  UserCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import {
  InstitutionApplication,
  VerificationDocument,
  DeficiencyItem,
  ClarificationRequest,
  AuthenticatedUser
} from '../types/aicte';
import { EoaVerificationPipelineTab } from './officer/EoaVerificationPipelineTab';
import { InfrastructureVerificationTab } from './officer/InfrastructureVerificationTab';
import { ComplianceRulesTab } from './officer/ComplianceRulesTab';
import { VerificationReportModal } from './officer/VerificationReportModal';

export type OfficerTab =
  | 'overview'
  | 'eoa_application'
  | 'documents'
  | 'verify_engine'
  | 'infrastructure'
  | 'compliance_rules'
  | 'comparison'
  | 'history'
  | 'clarifications'
  | 'spoc_communication'
  | 'audit'
  | 'deficiencies'
  | 'cadre';

interface OfficerInstitutionDetailViewProps {
  institution: InstitutionApplication;
  currentUser: AuthenticatedUser;
  onBack: () => void;
  onUpdateInstitution: (updated: InstitutionApplication) => void;
  onInitiateCall: (type: 'audio' | 'video', spocName: string, spocPhone: string) => void;
}

import { useLanguage } from '../i18n/LanguageContext';

export const OfficerInstitutionDetailView: React.FC<OfficerInstitutionDetailViewProps> = ({
  institution,
  currentUser,
  onBack,
  onUpdateInstitution,
  onInitiateCall
}) => {
  const { language, t, translateStatus } = useLanguage();
  const [activeTab, setActiveTab] = useState<OfficerTab>('overview');
  const [showReportModal, setShowReportModal] = useState(false);
  const [officerChatMessage, setOfficerChatMessage] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<VerificationDocument | null>(institution.documents[0] || null);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [clarificationQuery, setClarificationQuery] = useState('');
  const [targetDocId, setTargetDocId] = useState<string>(institution.documents[0]?.id || '');
  const [showDeficiencyModal, setShowDeficiencyModal] = useState(false);
  const [newDeficiency, setNewDeficiency] = useState<Partial<DeficiencyItem>>({
    category: 'Land & Infrastructure',
    severity: 'Major',
    title: '',
    aphClause: 'APH 2026-27 Clause 4.2',
    observedValue: '',
    requiredValue: '',
    deficitDescription: '',
    remediationAction: ''
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Change overall status
  const handleDispositionChange = (newStatus: InstitutionApplication['overallStatus']) => {
    const logEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentUser.name,
      role: currentUser.role,
      action: `Status updated to ${newStatus}`,
      details: `Officer ${currentUser.name} recorded disposition: ${newStatus}`
    };

    const updated = {
      ...institution,
      overallStatus: newStatus,
      lastScrutinyDate: new Date().toISOString().split('T')[0],
      auditTrail: [logEntry, ...institution.auditTrail]
    };
    onUpdateInstitution(updated);
    showToast(`Disposition recorded: ${newStatus}`);
  };

  // Mark single document status
  const handleUpdateDocStatus = (docId: string, status: VerificationDocument['status']) => {
    const updatedDocs = institution.documents.map((d) => {
      if (d.id === docId) {
        return {
          ...d,
          status,
          reviewerNotes: `Reviewed by ${currentUser.name} on ${new Date().toLocaleDateString('en-IN')}`
        };
      }
      return d;
    });

    const updated = {
      ...institution,
      documents: updatedDocs,
      auditTrail: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: currentUser.name,
          role: currentUser.role,
          action: `Document ${status}`,
          details: `Document ID ${docId} marked as "${status}"`
        },
        ...institution.auditTrail
      ]
    };

    onUpdateInstitution(updated);
    if (selectedDoc?.id === docId) {
      setSelectedDoc(updatedDocs.find((d) => d.id === docId) || null);
    }
    showToast(`Document marked as "${status}"`);
  };

  // Send clarification request
  const handleSendClarification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationQuery.trim()) return;

    const doc = institution.documents.find((d) => d.id === targetDocId);
    const newReq: ClarificationRequest = {
      id: `clr-${Date.now()}`,
      documentId: targetDocId,
      documentName: doc ? doc.name : 'General Dossier',
      requestedAt: new Date().toISOString().split('T')[0],
      requestedBy: `${currentUser.name} (${currentUser.role})`,
      query: clarificationQuery,
      status: 'Awaiting Response'
    };

    const updated = {
      ...institution,
      overallStatus: 'Clarification Required' as const,
      clarificationRequests: [newReq, ...institution.clarificationRequests],
      auditTrail: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: currentUser.name,
          role: currentUser.role,
          action: 'Clarification Requested',
          details: `Officer raised query on ${doc?.name || 'General'}: "${clarificationQuery.substring(0, 60)}..."`
        },
        ...institution.auditTrail
      ]
    };

    onUpdateInstitution(updated);
    setClarificationQuery('');
    setShowClarificationModal(false);
    showToast('Clarification notice dispatched to Institution SPOC');
  };

  // Add deficiency
  const handleAddDeficiency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeficiency.title || !newDeficiency.deficitDescription) return;

    const defItem: DeficiencyItem = {
      id: `def-${Date.now()}`,
      category: (newDeficiency.category as any) || 'Land & Infrastructure',
      title: newDeficiency.title,
      aphClause: newDeficiency.aphClause || 'APH 2026-27 Clause 4.2',
      severity: (newDeficiency.severity as any) || 'Major',
      observedValue: newDeficiency.observedValue || 'N/A',
      requiredValue: newDeficiency.requiredValue || 'N/A',
      deficitDescription: newDeficiency.deficitDescription,
      remediationAction: newDeficiency.remediationAction || 'Resubmit compliant document before final committee',
      isResolved: false
    };

    const updated = {
      ...institution,
      overallStatus: 'Deficiency Issued' as const,
      deficiencies: [defItem, ...institution.deficiencies],
      auditTrail: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: currentUser.name,
          role: currentUser.role,
          action: 'Deficiency Flagged',
          details: `[${defItem.severity}] ${defItem.title} - ${defItem.aphClause}`
        },
        ...institution.auditTrail
      ]
    };

    onUpdateInstitution(updated);
    setShowDeficiencyModal(false);
    showToast(`Deficiency logged under ${defItem.aphClause}`);
  };

  // Export Scrutiny PDF
  const handleExportScrutinyReport = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 28, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)', pageWidth / 2, 11, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('SOUTHERN REGIONAL OFFICE (SRO) — CHENNAI, TAMIL NADU', pageWidth / 2, 17, { align: 'center' });
      doc.text('AUTOMATED EXTENSION OF APPROVAL (EOA) SCRUTINY REPORT (AY 2026-27)', pageWidth / 2, 23, { align: 'center' });

      // Meta box
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(institution.institutionName, 14, 38);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`AICTE Permanent ID (PID): ${institution.pid} | District: ${institution.district}, Tamil Nadu`, 14, 44);
      doc.text(`Application ID: ${institution.applicationId} | Established: ${institution.establishedYear} | Type: ${institution.institutionType}`, 14, 50);
      doc.text(`Scrutiny Date: ${new Date().toLocaleDateString('en-IN')} | Overall Status: ${institution.overallStatus}`, 14, 56);
      doc.text(`Verified Source: ${institution.sourceOfVerification}`, 14, 62);

      // Line
      doc.setDrawColor(203, 213, 225);
      doc.line(14, 66, pageWidth - 14, 66);

      // Section 1: Norms & Cadre
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('1. Statutory Land & Cadre Norms Summary (APH 2026-27)', 14, 73);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(`• Land Area: Observed ${institution.landAreaAcres} Acres vs. Required ${institution.requiredLandAcres} Acres (${institution.landAreaAcres >= institution.requiredLandAcres ? 'COMPLIANT' : 'DEFICIENT'})`, 16, 79);
      doc.text(`• Built-up Area: Observed ${institution.builtUpAreaSqM.toLocaleString()} sq.m vs. Required ${institution.requiredBuiltUpAreaSqM.toLocaleString()} sq.m (${institution.builtUpAreaSqM >= institution.requiredBuiltUpAreaSqM ? 'COMPLIANT' : 'DEFICIENT'})`, 16, 84);
      doc.text(`• Joint FDR with AICTE: Rs. ${institution.jointFdrAmountLakhs} Lakhs vs. Required Rs. ${institution.requiredJointFdrLakhs} Lakhs (${institution.jointFdrAmountLakhs >= institution.requiredJointFdrLakhs ? 'COMPLIANT' : 'DEFICIENT'})`, 16, 89);
      doc.text(`• Faculty Ratio (SFR): Professors: ${institution.facultyCadre.professorsAvailable}/${institution.facultyCadre.professorsRequired} | Assoc: ${institution.facultyCadre.assocProfAvailable}/${institution.facultyCadre.assocProfRequired} | Asst: ${institution.facultyCadre.asstProfAvailable}/${institution.facultyCadre.asstProfRequired}`, 16, 94);
      doc.text(`• Principal Eligibility: ${institution.facultyCadre.principalEligible ? 'Verified Eligible (Ph.D + Cadre Experience)' : 'Deficient'} (Dr. ${institution.facultyCadre.principalName || 'N/A'})`, 16, 99);

      // Section 2: Documents Verification Status
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('2. Submitted Dossier & Verification Dispositions', 14, 108);

      let yPos = 114;
      institution.documents.forEach((docItem, idx) => {
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(`${idx + 1}. ${docItem.name} [v${docItem.version}]`, 16, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(`Status: ${docItem.status} | Authenticity: ${docItem.authenticityScore}% | APH: ${docItem.aphClauseRef}`, 20, yPos + 4);
        doc.text(`Authority: ${docItem.issuingAuthority} | Valid Until: ${docItem.validUntil} | Signed: ${docItem.digitalSignatureVerified ? 'Yes' : 'No'}`, 20, yPos + 8);
        yPos += 13;
      });

      // Section 3: Deficiencies
      yPos += 4;
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`3. Identified Deficiencies (${institution.deficiencies.length})`, 14, yPos);
      yPos += 6;

      if (institution.deficiencies.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text('No deficiencies flagged for this institution for AY 2026-27.', 16, yPos);
        yPos += 10;
      } else {
        institution.deficiencies.forEach((def, i) => {
          if (yPos > 260) {
            doc.addPage();
            yPos = 20;
          }
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text(`Deficiency #${i + 1} [${def.severity}]: ${def.title} (${def.aphClause})`, 16, yPos);
          doc.setFont('helvetica', 'normal');
          doc.text(`Observed: ${def.observedValue} | Required: ${def.requiredValue}`, 20, yPos + 4);
          doc.text(`Remediation: ${def.remediationAction}`, 20, yPos + 8);
          yPos += 13;
        });
      }

      // Footer sign-off
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      yPos += 10;
      doc.setDrawColor(203, 213, 225);
      doc.line(14, yPos, pageWidth - 14, yPos);
      yPos += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`Scrutiny Completed by: ${currentUser.name} (${currentUser.role})`, 14, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Southern Regional Committee, AICTE Chennai | Generated at: ${new Date().toISOString()}`, 14, yPos + 5);
      doc.text('This is an authorised system-generated AICTE scrutiny certificate subject to final SAC ratification.', 14, yPos + 10);

      doc.save(`AICTE_Scrutiny_${institution.pid}_AY2026-27.pdf`);
      showToast('AICTE Official Scrutiny Report downloaded as PDF');
    } catch (err) {
      console.error(err);
      showToast('Error generating PDF report');
    } finally {
      setIsExporting(false);
    }
  };

  // Send message to SPOC from Officer
  const handleSendOfficerMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerChatMessage.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderRole: 'officer' as const,
      senderName: currentUser.name,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      text: officerChatMessage.trim()
    };

    const updated = {
      ...institution,
      messages: [...institution.messages, newMsg],
      auditTrail: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: currentUser.name,
          role: currentUser.role,
          action: 'Official Message Sent to SPOC',
          details: `Message: "${officerChatMessage.trim().substring(0, 50)}..."`
        },
        ...institution.auditTrail
      ]
    };

    onUpdateInstitution(updated);
    setOfficerChatMessage('');
    showToast('Official message dispatched to SPOC portal channel');
  };

  // Find previous version of selectedDoc if exists
  const previousVersionDoc = selectedDoc?.previousVersionId
    ? institution.previousSubmissions?.find((p) => p.id === selectedDoc.previousVersionId)
    : null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Poppins']">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="bg-slate-950/80 border-b border-slate-800 px-6 py-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
              title="Return to Tamil Nadu College Directory"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backToDirectory')}</span>
            </button>
            <div className="h-6 w-px bg-slate-800 hidden md:block" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {institution.shortName}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  PID: {institution.pid}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {institution.district}, TN
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {institution.institutionType}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-bold text-white mt-1 line-clamp-1">
                {institution.institutionName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('verify_engine')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-blue-600/30 active:scale-95 cursor-pointer"
              title="Launch AICTE automated verification pipeline"
            >
              <Cpu className="w-4 h-4 text-white" />
              <span>Verify Documents</span>
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition shadow-sm hover:text-white cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Scrutiny PDF</span>
            </button>

            {/* Quick Disposition Dropdown */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1">
              <span className="text-xs text-slate-400 px-2 font-medium">Disposition:</span>
              <select
                value={institution.overallStatus}
                onChange={(e) => handleDispositionChange(e.target.value as any)}
                className="bg-slate-800 text-xs text-white font-medium rounded-lg px-2.5 py-1.5 border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Approved / Compliant">Approve / Compliant</option>
                <option value="Under Automated Scrutiny">Under Automated Scrutiny</option>
                <option value="Clarification Required">Clarification Required</option>
                <option value="Deficiency Issued">Deficiency Issued</option>
                <option value="Referred to SHC">Refer to SHC</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-6 flex-1 flex flex-col gap-6">
        {/* SPOC and High-Level Status Strip */}
        <section className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* SPOC Info */}
            <div className="lg:col-span-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-white">
                    {institution.spoc.name}
                  </h3>
                  <span className="text-xs text-slate-400">({institution.spoc.designation})</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                    Official SPOC
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                  <span>Email: {institution.spoc.email}</span>
                  <span>•</span>
                  <span>Phone: {institution.spoc.phone}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="text-slate-300 font-medium">Source:</span> {institution.spoc.sourceLabel}
                </div>
              </div>
            </div>

            {/* Live Communication Actions */}
            <div className="lg:col-span-3 flex items-center gap-2">
              <button
                onClick={() => onInitiateCall('audio', institution.spoc.name, institution.spoc.phone)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 text-xs font-medium flex items-center justify-center gap-2 transition"
                title="Initiate Audio Call via WebRTC preview"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Audio Call</span>
              </button>
              <button
                onClick={() => onInitiateCall('video', institution.spoc.name, institution.spoc.phone)}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-medium flex items-center justify-center gap-2 transition"
                title="Initiate Live Video Call with SPOC"
              >
                <Video className="w-4 h-4 text-blue-400" />
                <span>Video Call</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('clarifications');
                  setShowClarificationModal(true);
                }}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-300 text-xs transition"
                title="Send Clarification Request"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>

            {/* Score & Compliance Badge */}
            <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">Authenticity Index</div>
                <div className="text-xl font-bold text-emerald-400">{institution.complianceScore}%</div>
              </div>
              <div className="h-10 w-px bg-slate-800" />
              <div>
                <div className="text-xs text-slate-400 font-medium">Scrutiny Status</div>
                <div className={`text-xs font-semibold px-2.5 py-1 rounded-full mt-0.5 inline-block ${
                  institution.overallStatus === 'Approved / Compliant'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                    : institution.overallStatus === 'Clarification Required'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                    : institution.overallStatus === 'Deficiency Issued'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                    : 'bg-blue-950/80 text-blue-300 border border-blue-800/80'
                }`}>
                  {institution.overallStatus}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation (11 Dedicated Tabs) */}
        <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>1. Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('eoa_application')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'eoa_application'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>2. Current EOA Application</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-blue-400" />
            <span>3. Documents ({institution.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('verify_engine')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'verify_engine'
                ? 'bg-blue-900/60 text-amber-300 border-b-2 border-amber-400 font-bold'
                : 'text-amber-400 hover:text-amber-300 hover:bg-blue-950/40'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>4. Verify Documents (AI)</span>
          </button>

          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'infrastructure'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Building2 className="w-4 h-4 text-purple-400" />
            <span>5. Infrastructure (12 Norms)</span>
          </button>

          <button
            onClick={() => setActiveTab('compliance_rules')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'compliance_rules'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>6. Compliance Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>7. Previous Submissions</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>8. Approval History</span>
          </button>

          <button
            onClick={() => setActiveTab('clarifications')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'clarifications'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>9. Clarifications ({institution.clarificationRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('spoc_communication')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'spoc_communication'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>10. SPOC & Live Comms</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>11. Audit Trail</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-400 font-medium">Total Approved Intake</span>
                <div className="text-2xl font-bold text-white mt-1">
                  {institution.totalApprovedIntake} <span className="text-xs text-slate-400 font-normal">Seats</span>
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  Proposed AY 2026-27: {institution.proposedIntake} Seats
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-400 font-medium">Land Holding</span>
                <div className="text-2xl font-bold text-white mt-1">
                  {institution.landAreaAcres} <span className="text-xs text-slate-400 font-normal">Acres</span>
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  Req: {institution.requiredLandAcres} Acres (Surplus +{(institution.landAreaAcres - institution.requiredLandAcres).toFixed(1)} ac)
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-400 font-medium">Total Built-Up Area</span>
                <div className="text-2xl font-bold text-white mt-1">
                  {institution.builtUpAreaSqM.toLocaleString()} <span className="text-xs text-slate-400 font-normal">sq.m</span>
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  DTCP & Form D Approved
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-400 font-medium">Joint FDR with AICTE</span>
                <div className="text-2xl font-bold text-white mt-1">
                  Rs. {institution.jointFdrAmountLakhs} <span className="text-xs text-slate-400 font-normal">Lakhs</span>
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  Pledged to SRO AICTE Chennai
                </span>
              </div>
            </div>

            {/* Spatial Geofence Map & Institution Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>Campus Geofence & Location Intelligence</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    {institution.campusCoordinates?.latitude || '13.3564'}°N, {institution.campusCoordinates?.longitude || '80.1432'}°E
                  </span>
                </div>

                <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-800 relative bg-slate-900">
                  <iframe
                    title="OpenStreetMap Campus Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${(institution.campusCoordinates?.longitude || 80.1432) - 0.015}%2C${(institution.campusCoordinates?.latitude || 13.3564) - 0.015}%2C${(institution.campusCoordinates?.longitude || 80.1432) + 0.015}%2C${(institution.campusCoordinates?.latitude || 13.3564) + 0.015}&layer=mapnik&marker=${institution.campusCoordinates?.latitude || 13.3564}%2C${institution.campusCoordinates?.longitude || 80.1432}`}
                    className="filter contrast-125 opacity-90"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-950/90 border border-slate-800 text-[10px] text-slate-300 px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Verified AICTE Campus Geofence Anchor</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Campus Address</span>
                    <span className="text-white font-medium">{institution.address}, {institution.city} - {institution.pincode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Affiliating Body</span>
                    <span className="text-white font-medium">Anna University, Chennai (Affiliation Order Verified)</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">
                    Scrutiny Officer Quick Actions
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Authorized actions for inspecting documents, verifying norms, and issuing committee recommendations.
                  </p>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => setActiveTab('verify_engine')}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-between transition cursor-pointer shadow-md shadow-blue-600/30"
                    >
                      <span className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-white" />
                        <span>Launch Automated AI Verification Pipeline</span>
                      </span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('infrastructure')}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-400" />
                        <span>Inspect 12 Physical Infrastructure Norms</span>
                      </span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => setShowReportModal(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-emerald-400" />
                        <span>Download Official EOA Scrutiny Report (PDF)</span>
                      </span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('spoc_communication')}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-cyan-400" />
                        <span>Contact SPOC ({institution.spoc.name})</span>
                      </span>
                      <span>→</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span>Authorised AICTE Officer: </span>
                  <span className="text-white font-medium">{currentUser.name} ({currentUser.role})</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Current EOA Application */}
        {activeTab === 'eoa_application' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono font-semibold text-emerald-400">
                    Application ID: {institution.applicationId}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Extension of Approval (EOA) Dossier — Academic Year 2026-27
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Filed on official AICTE Web Portal under Chapter II of Approval Process Handbook 2024–27.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Processing Fee Reconciled
                  </span>
                </div>
              </div>

              {/* Key Application Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Application Category</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{institution.applicationType}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Academic Session</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{institution.academicYear}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Total Sanctioned Intake</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">{institution.totalApprovedIntake} Seats</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Trust / Sponsoring Society</span>
                  <span className="text-white font-bold text-sm mt-0.5 block truncate">Lakshmikanthammal Educational Trust</span>
                </div>
              </div>

              {/* Course & Branch Wise Sanctioned Intake Table */}
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Approved Technical Programmes & Intake Distribution
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4">Program / Discipline</th>
                        <th className="py-2.5 px-4">Level</th>
                        <th className="py-2.5 px-4">Current Intake</th>
                        <th className="py-2.5 px-4">Proposed 2026-27</th>
                        <th className="py-2.5 px-4">Affiliating University</th>
                        <th className="py-2.5 px-4">NBA Accreditation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-white">Computer Science and Engineering</td>
                        <td className="py-2.5 px-4">UG (B.E.)</td>
                        <td className="py-2.5 px-4 font-mono">180</td>
                        <td className="py-2.5 px-4 font-mono text-emerald-400 font-bold">180</td>
                        <td className="py-2.5 px-4">Anna University</td>
                        <td className="py-2.5 px-4 text-emerald-400 font-medium">Accredited (Tier-1)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-white">Artificial Intelligence & Data Science</td>
                        <td className="py-2.5 px-4">UG (B.Tech)</td>
                        <td className="py-2.5 px-4 font-mono">120</td>
                        <td className="py-2.5 px-4 font-mono text-emerald-400 font-bold">120</td>
                        <td className="py-2.5 px-4">Anna University</td>
                        <td className="py-2.5 px-4 text-slate-400">Eligible Next Cycle</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-white">Electronics and Communication Engineering</td>
                        <td className="py-2.5 px-4">UG (B.E.)</td>
                        <td className="py-2.5 px-4 font-mono">120</td>
                        <td className="py-2.5 px-4 font-mono text-emerald-400 font-bold">120</td>
                        <td className="py-2.5 px-4">Anna University</td>
                        <td className="py-2.5 px-4 text-emerald-400 font-medium">Accredited (Tier-1)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-white">Mechanical Engineering</td>
                        <td className="py-2.5 px-4">UG (B.E.)</td>
                        <td className="py-2.5 px-4 font-mono">120</td>
                        <td className="py-2.5 px-4 font-mono text-emerald-400 font-bold">120</td>
                        <td className="py-2.5 px-4">Anna University</td>
                        <td className="py-2.5 px-4 text-emerald-400 font-medium">Accredited (Tier-1)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-white">Information Technology</td>
                        <td className="py-2.5 px-4">UG (B.Tech)</td>
                        <td className="py-2.5 px-4 font-mono">120</td>
                        <td className="py-2.5 px-4 font-mono text-emerald-400 font-bold">120</td>
                        <td className="py-2.5 px-4">Anna University</td>
                        <td className="py-2.5 px-4 text-emerald-400 font-medium">Accredited (Tier-1)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-white">Electrical & Electronics Engineering</td>
                        <td className="py-2.5 px-4">UG (B.E.)</td>
                        <td className="py-2.5 px-4 font-mono">60</td>
                        <td className="py-2.5 px-4 font-mono text-emerald-400 font-bold">60</td>
                        <td className="py-2.5 px-4">Anna University</td>
                        <td className="py-2.5 px-4 text-emerald-400 font-medium">Accredited (Tier-1)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-white">M.E. Computer Science and Engineering</td>
                        <td className="py-2.5 px-4">PG (M.E.)</td>
                        <td className="py-2.5 px-4 font-mono">18</td>
                        <td className="py-2.5 px-4 font-mono text-emerald-400 font-bold">18</td>
                        <td className="py-2.5 px-4">Anna University</td>
                        <td className="py-2.5 px-4 text-slate-400">Post-Graduate</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-white">M.E. VLSI Design</td>
                        <td className="py-2.5 px-4">PG (M.E.)</td>
                        <td className="py-2.5 px-4 font-mono">18</td>
                        <td className="py-2.5 px-4 font-mono text-emerald-400 font-bold">18</td>
                        <td className="py-2.5 px-4">Anna University</td>
                        <td className="py-2.5 px-4 text-slate-400">Post-Graduate</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Verify Documents (AI Pipeline) */}
        {activeTab === 'verify_engine' && (
          <EoaVerificationPipelineTab
            institution={institution}
            onOpenClarificationModal={(docId, query) => {
              setTargetDocId(docId || '');
              setClarificationQuery(query || '');
              setShowClarificationModal(true);
            }}
            onOpenDeficiencyModal={(prefill) => {
              if (prefill) {
                setNewDeficiency({
                  ...newDeficiency,
                  title: prefill.title,
                  aphClause: prefill.aphClause,
                  category: (prefill.category as any) || 'Land & Infrastructure',
                  deficitDescription: prefill.description
                });
              }
              setShowDeficiencyModal(true);
            }}
            onSwitchToReport={() => setShowReportModal(true)}
          />
        )}

        {/* Tab 5: Infrastructure (12 Norms) */}
        {activeTab === 'infrastructure' && (
          <InfrastructureVerificationTab
            institution={institution}
            onOpenClarificationModal={(docId, query) => {
              setTargetDocId(docId || '');
              setClarificationQuery(query || '');
              setShowClarificationModal(true);
            }}
            onOpenDeficiencyModal={(prefill) => {
              if (prefill) {
                setNewDeficiency({
                  ...newDeficiency,
                  title: prefill.title,
                  aphClause: prefill.aphClause,
                  category: (prefill.category as any) || 'Land & Infrastructure',
                  deficitDescription: prefill.description
                });
              }
              setShowDeficiencyModal(true);
            }}
          />
        )}

        {/* Tab 6: Compliance Rules (APH 2024-2027) */}
        {activeTab === 'compliance_rules' && (
          <ComplianceRulesTab
            institution={institution}
            onOpenClarificationModal={(docId, query) => {
              setTargetDocId(docId || '');
              setClarificationQuery(query || '');
              setShowClarificationModal(true);
            }}
          />
        )}

        {/* Tab 10: SPOC & Live Communication */}
        {activeTab === 'spoc_communication' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* SPOC Profile Card (5 Cols) */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 font-bold text-base">
                    {institution.spoc.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{institution.spoc.name}</h3>
                    <p className="text-xs text-slate-400">{institution.spoc.designation}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Official SPOC
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Direct Phone:</span>
                    <span className="text-white font-mono font-medium">{institution.spoc.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email Address:</span>
                    <span className="text-white font-medium">{institution.spoc.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Office Address:</span>
                    <span className="text-white">{institution.spoc.officeLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Verification Source:</span>
                    <span className="text-slate-300">{institution.spoc.sourceLabel}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-300">Live Communication Channels</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onInitiateCall('audio', institution.spoc.name, institution.spoc.phone)}
                      className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>Audio Call</span>
                    </button>
                    <button
                      onClick={() => onInitiateCall('video', institution.spoc.name, institution.spoc.phone)}
                      className="py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Video className="w-4 h-4 text-blue-400" />
                      <span>Video Hearing</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Secure Chat Thread (7 Cols) */}
              <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col h-[520px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-bold text-white">Official Scrutiny Communication Channel</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">End-to-End Logged</span>
                </div>

                {/* Message Log */}
                <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-900/50 rounded-xl my-3 border border-slate-800/60 scrollbar-thin">
                  {institution.messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                      No communications recorded yet. Dispatch official queries or notices below.
                    </div>
                  ) : (
                    institution.messages.map((msg) => {
                      const isOfficer = msg.senderRole === 'officer';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isOfficer ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl p-3 text-xs ${
                              isOfficer
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1 text-[10px] opacity-80 font-semibold">
                              <span>{msg.senderName}</span>
                              <span>•</span>
                              <span>{msg.timestamp}</span>
                            </div>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Send Message Form */}
                <form onSubmit={handleSendOfficerMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={officerChatMessage}
                    onChange={(e) => setOfficerChatMessage(e.target.value)}
                    placeholder="Type official notification or observation for SPOC..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Documents Scrutiny */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Document List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Mandatory EOA Dossier (AY 2026-27)
                </span>
                <span className="text-xs text-slate-400">
                  Select a document to verify
                </span>
              </div>

              <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                {institution.documents.map((docItem) => {
                  const isSelected = selectedDoc?.id === docItem.id;
                  return (
                    <div
                      key={docItem.id}
                      onClick={() => setSelectedDoc(docItem)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800/90 border-blue-500/80 shadow-md ring-1 ring-blue-500/30'
                          : 'bg-slate-950/50 border-slate-800 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg ${
                            docItem.status === 'Verified against an authorised source' || docItem.status === 'Issuer-confirmed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                              : docItem.status === 'Requires human review' || docItem.status === 'Potential anomaly'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            <FileCheck2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                              <span>{docItem.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                v{docItem.version}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {docItem.category} • {docItem.fileSize}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          docItem.status === 'Verified against an authorised source' || docItem.status === 'Issuer-confirmed'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                            : docItem.status === 'Requires human review'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {docItem.status}
                        </span>
                      </div>

                      {docItem.wasConvertedFromImage && (
                        <div className="mt-2 text-[10px] text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2 py-1 rounded flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>Automatically converted from {docItem.originalFormat.toUpperCase()} to standard A4 PDF</span>
                        </div>
                      )}

                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                        <span>APH Clause: {docItem.aphClauseRef}</span>
                        <span className="font-semibold text-emerald-400">{docItem.authenticityScore}% Score</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Document Detail & Dispositions */}
            <div className="lg:col-span-7">
              {selectedDoc ? (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {selectedDoc.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60">
                          Version {selectedDoc.version}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Category: {selectedDoc.category} • Uploaded on {selectedDoc.uploadDate} for AY {selectedDoc.academicYear}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setTargetDocId(selectedDoc.id);
                          setShowClarificationModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Query SPOC</span>
                      </button>
                    </div>
                  </div>

                  {/* Document Meta Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Issuing Authority</div>
                      <div className="text-xs font-semibold text-slate-200 mt-1 truncate" title={selectedDoc.issuingAuthority}>
                        {selectedDoc.issuingAuthority}
                      </div>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Valid Until</div>
                      <div className="text-xs font-semibold text-slate-200 mt-1">
                        {selectedDoc.validUntil}
                      </div>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Digital Signature</div>
                      <div className={`text-xs font-semibold mt-1 flex items-center gap-1 ${
                        selectedDoc.digitalSignatureVerified ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {selectedDoc.digitalSignatureVerified ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Valid / Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Unsigned / Scan</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-medium uppercase">Authenticity Index</div>
                      <div className="text-xs font-bold text-emerald-400 mt-1">
                        {selectedDoc.authenticityScore}% Confidence
                      </div>
                    </div>
                  </div>

                  {/* OCR Extracted Fields Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>OCR Extracted Data & Clause Norms</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Evaluated against {selectedDoc.aphClauseRef}
                      </span>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                      {selectedDoc.extractedFields && Object.keys(selectedDoc.extractedFields).length > 0 ? (
                        Object.entries(selectedDoc.extractedFields).map(([key, field]) => (
                          <div key={key} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="font-semibold text-slate-200">{field.label}</div>
                              <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                                Observed: <span className="text-white font-medium">{field.value}</span>
                              </div>
                              {field.expectedValue && (
                                <div className="text-[10px] text-slate-400">
                                  Norm: {field.expectedValue}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                {field.confidence}% match
                              </span>
                              {field.isMatched ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Compliant</span>
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 font-medium flex items-center gap-1">
                                  <XCircle className="w-3 h-3" />
                                  <span>Deficit</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-xs text-slate-400 text-center">
                          Standard parameters matched against SRO Chennai repository.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Geotagged Premise Evidence Section */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Statutory Geotagged Premise Evidence</span>
                      </span>
                      {selectedDoc.locationEvidence?.submissionGps ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{selectedDoc.locationEvidence.verificationAssessment}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                          Location Not Provided (Optional Policy)
                        </span>
                      )}
                    </div>

                    {selectedDoc.locationEvidence?.submissionGps ? (
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">Upload Lat / Lon</span>
                            <span className="font-mono font-bold text-white text-[11px]">
                              {selectedDoc.locationEvidence.submissionGps.latitude.toFixed(5)}°, {selectedDoc.locationEvidence.submissionGps.longitude.toFixed(5)}°
                            </span>
                          </div>
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">Reported Accuracy</span>
                            <span className="font-mono font-bold text-emerald-400 text-[11px]">
                              ± {selectedDoc.locationEvidence.submissionGps.accuracyMeters} meters
                            </span>
                          </div>
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">Capture Timestamp</span>
                            <span className="font-mono text-[10px] text-slate-300">
                              {selectedDoc.locationEvidence.submissionGps.timestampUtc.substring(0, 19).replace('T', ' ')} UTC
                            </span>
                          </div>
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">Campus Proximity</span>
                            <span className="font-mono font-bold text-emerald-400 text-[11px]">
                              {selectedDoc.locationEvidence.distanceFromCampusKm !== undefined
                                ? `${selectedDoc.locationEvidence.distanceFromCampusKm} km`
                                : '0.04 km (On-Premises)'}
                            </span>
                          </div>
                        </div>

                        {/* If EXIF Photo GPS was captured separately */}
                        {selectedDoc.locationEvidence.exifPhotoGps && (
                          <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Camera className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              <div>
                                <span className="font-bold">Photo Capture Location (EXIF): </span>
                                <span className="font-mono">
                                  {selectedDoc.locationEvidence.exifPhotoGps.latitude.toFixed(5)}°, {selectedDoc.locationEvidence.exifPhotoGps.longitude.toFixed(5)}°
                                </span>
                                <span className="text-[10px] text-purple-300 ml-1.5">
                                  ({selectedDoc.locationEvidence.exifPhotoGps.cameraModel || 'Optical Camera Sensor'})
                                </span>
                              </div>
                            </div>
                            {selectedDoc.locationEvidence.distanceBetweenUploadAndPhotoKm !== undefined && (
                              <span className="text-[10px] font-mono text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded border border-purple-700/50">
                                Discrepancy: {selectedDoc.locationEvidence.distanceBetweenUploadAndPhotoKm} km
                              </span>
                            )}
                          </div>
                        )}

                        {/* Interactive OpenStreetMap preview for Officer */}
                        <div className="relative rounded-xl overflow-hidden border border-slate-800 h-44 bg-slate-950">
                          <iframe
                            title="Officer GPS Verification Map"
                            width="100%"
                            height="100%"
                            className="w-full h-full border-0"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                              selectedDoc.locationEvidence.submissionGps.longitude - 0.008
                            }%2C${
                              selectedDoc.locationEvidence.submissionGps.latitude - 0.006
                            }%2C${
                              selectedDoc.locationEvidence.submissionGps.longitude + 0.008
                            }%2C${
                              selectedDoc.locationEvidence.submissionGps.latitude + 0.006
                            }&layer=mapnik&marker=${
                              selectedDoc.locationEvidence.submissionGps.latitude
                            }%2C${selectedDoc.locationEvidence.submissionGps.longitude}`}
                          />
                        </div>

                        <div className="text-[10.5px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <strong className="text-slate-300">Scrutiny Note: </strong>
                          {selectedDoc.locationEvidence.disclaimerText}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                        <span>No location coordinates were attached at submission time.</span>
                        <button
                          onClick={() => {
                            setTargetDocId(selectedDoc.id);
                            setClarificationQuery(`Please submit geotagged photographic evidence of ${selectedDoc.name} taken on institutional premises.`);
                            setShowClarificationModal(true);
                          }}
                          className="text-amber-400 hover:text-amber-300 font-medium text-xs flex items-center gap-1"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Request Geotagged Re-upload</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reviewer Notes if present */}
                  {selectedDoc.reviewerNotes && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                      <span className="text-slate-400 font-medium">Prior Reviewer Note: </span>
                      {selectedDoc.reviewerNotes}
                    </div>
                  )}

                  {/* Officer Actions for this Document */}
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-400">
                      Current Disposition: <span className="text-white font-semibold">{selectedDoc.status}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleUpdateDocStatus(selectedDoc.id, 'Verified against an authorised source')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Verified</span>
                      </button>

                      <button
                        onClick={() => handleUpdateDocStatus(selectedDoc.id, 'Requires human review')}
                        className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Hold for Review</span>
                      </button>

                      <button
                        onClick={() => {
                          setNewDeficiency((prev) => ({
                            ...prev,
                            title: `Deficiency in ${selectedDoc.name}`,
                            aphClause: selectedDoc.aphClauseRef,
                            deficitDescription: `Document ${selectedDoc.name} fails statutory verification against SRO Chennai standard.`
                          }));
                          setShowDeficiencyModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Flag Deficiency</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
                  Select a document from the left list to inspect OCR values.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Version Comparison Side-by-Side */}
        {activeTab === 'comparison' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>Version-to-Version Scrutiny Comparison</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Side-by-side inspection of resubmitted documents vs. initial AY 2026-27 or previous submissions.
                </p>
              </div>

              {selectedDoc && (
                <span className="text-xs text-slate-300 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                  Inspecting: <strong className="text-white">{selectedDoc.name}</strong>
                </span>
              )}
            </div>

            {selectedDoc ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Previous Version Box */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Initial Submission / v{Math.max(1, selectedDoc.version - 1)}
                      </span>
                      <div className="text-sm font-semibold text-slate-300 mt-1">
                        {previousVersionDoc ? previousVersionDoc.name : `${selectedDoc.name} (Prior File)`}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      Archived
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Status at that time</div>
                      <div className="text-slate-300 font-medium mt-0.5">
                        {previousVersionDoc ? previousVersionDoc.status : 'Requires human review / Incomplete'}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Issuing Authority</div>
                      <div className="text-slate-300 font-medium mt-0.5">
                        {previousVersionDoc ? previousVersionDoc.issuingAuthority : selectedDoc.issuingAuthority}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Validity Recorded</div>
                      <div className="text-slate-300 font-medium mt-0.5">
                        {previousVersionDoc ? previousVersionDoc.validUntil : 'Expired / Due for Renewal'}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/40 text-xs text-rose-300">
                    <span className="font-semibold block mb-1">Prior Scrutiny Observation:</span>
                    {previousVersionDoc?.reviewerNotes || 'Mandatory renewal clause required for current AY 2026-27 validation.'}
                  </div>
                </div>

                {/* Current Version Box */}
                <div className="bg-slate-950/70 border border-blue-900/40 rounded-2xl p-5 space-y-4 shadow-lg ring-1 ring-blue-500/20">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        Current Active Submission (v{selectedDoc.version})
                      </span>
                      <div className="text-sm font-semibold text-white mt-1">
                        {selectedDoc.name}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold">
                      Latest AY 2026-27
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Status</div>
                      <div className="text-emerald-400 font-medium mt-0.5">
                        {selectedDoc.status}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Issuing Authority</div>
                      <div className="text-white font-medium mt-0.5">
                        {selectedDoc.issuingAuthority}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Validity Recorded</div>
                      <div className="text-emerald-400 font-medium mt-0.5">
                        {selectedDoc.validUntil} (Active & Compliant)
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-xs text-emerald-300">
                    <span className="font-semibold block mb-1">OCR Verification Summary:</span>
                    Authenticity confidence rated at {selectedDoc.authenticityScore}%. Digital signature verified: {selectedDoc.digitalSignatureVerified ? 'Yes' : 'No'}.
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
                Please select a document from the Document Scrutiny tab to compare versions.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Deficiencies */}
        {activeTab === 'deficiencies' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Deficiencies & Statutory APH Deviations</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Items requiring institutional remedy or hearing under AICTE Approval Process Handbook.
                </p>
              </div>

              <button
                onClick={() => setShowDeficiencyModal(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Record New Deficiency</span>
              </button>
            </div>

            {institution.deficiencies.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">No Deficiencies Recorded</h4>
                <p className="text-xs text-slate-400 mt-1">
                  All statutory checks, land norms, and cadre requirements meet the APH 2026-27 criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {institution.deficiencies.map((def, idx) => (
                  <div
                    key={def.id || idx}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          def.severity === 'Critical'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : def.severity === 'Major'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {def.severity} Severity
                        </span>
                        <span className="text-xs font-mono text-blue-400">
                          {def.aphClause}
                        </span>
                        <span className="text-xs text-slate-400">• {def.category}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{def.title}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase block">Observed on ground:</span>
                          <span className="text-rose-300 font-medium">{def.observedValue}</span>
                        </div>
                        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase block">AICTE Statutory Norm:</span>
                          <span className="text-emerald-400 font-medium">{def.requiredValue}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400">{def.deficitDescription}</p>

                      <div className="text-xs text-amber-300 bg-amber-950/30 border border-amber-900/40 p-2.5 rounded-lg">
                        <span className="font-semibold">Mandatory Remediation: </span>
                        {def.remediationAction}
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          const updated = {
                            ...institution,
                            deficiencies: institution.deficiencies.filter((_, i) => i !== idx),
                            auditTrail: [
                              {
                                id: `log-${Date.now()}`,
                                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                                actor: currentUser.name,
                                role: currentUser.role,
                                action: 'Deficiency Resolved',
                                details: `Deficiency "${def.title}" marked as resolved by officer`
                              },
                              ...institution.auditTrail
                            ]
                          };
                          onUpdateInstitution(updated);
                          showToast('Deficiency marked as resolved');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-medium transition"
                      >
                        Resolve / Waive
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Faculty Cadre & Statutory Land Norms */}
        {activeTab === 'cadre' && (
          <div className="space-y-6">
            {/* Land & Infrastructure Breakdown */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Land, Built-up Area & Joint FDR Norms (Tamil Nadu Metro / Urban)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 uppercase font-medium">Contiguous Land Area</div>
                  <div className="text-xl font-bold text-white mt-1">
                    {institution.landAreaAcres} <span className="text-xs text-slate-400 font-normal">Acres</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                    <span>Required: {institution.requiredLandAcres} Acres</span>
                    <span className="text-emerald-400 font-semibold">100% Compliant</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 uppercase font-medium">Instructional Built-up Area</div>
                  <div className="text-xl font-bold text-white mt-1">
                    {institution.builtUpAreaSqM.toLocaleString()} <span className="text-xs text-slate-400 font-normal">sq.m</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                    <span>Required: {institution.requiredBuiltUpAreaSqM.toLocaleString()} sq.m</span>
                    <span className="text-emerald-400 font-semibold">Satisfied</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 uppercase font-medium">Joint FDR with AICTE</div>
                  <div className="text-xl font-bold text-white mt-1">
                    Rs. {institution.jointFdrAmountLakhs} <span className="text-xs text-slate-400 font-normal">Lakhs</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                    <span>Required: Rs. {institution.requiredJointFdrLakhs} Lakhs</span>
                    <span className="text-emerald-400 font-semibold">Verified Bank Lien</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cadre Ratio Breakdown */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>Faculty Cadre Ratio & Principal Eligibility</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluated according to AICTE cadre ratio (1:2:6 Professor : Associate : Assistant) and SFR 1:20 / 1:15
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    institution.facultyCadre.cadreRatioCompliant
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                      : 'bg-rose-950 text-rose-300 border border-rose-800/80'
                  }`}>
                    {institution.facultyCadre.cadreRatioCompliant ? 'Cadre Compliant' : 'Cadre Deficit'}
                  </span>
                </div>
              </div>

              {/* Cadre Table */}
              <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-300 uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Cadre Position</th>
                      <th className="py-3 px-4">Required by AICTE Norms</th>
                      <th className="py-3 px-4">Available on Rolls</th>
                      <th className="py-3 px-4">Discrepancy</th>
                      <th className="py-3 px-4">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="py-3 px-4 font-semibold text-white">Professors</td>
                      <td className="py-3 px-4">{institution.facultyCadre.professorsRequired}</td>
                      <td className="py-3 px-4">{institution.facultyCadre.professorsAvailable}</td>
                      <td className="py-3 px-4 font-mono">
                        {institution.facultyCadre.professorsAvailable >= institution.facultyCadre.professorsRequired
                          ? '0'
                          : `-${institution.facultyCadre.professorsRequired - institution.facultyCadre.professorsAvailable}`}
                      </td>
                      <td className="py-3 px-4">
                        {institution.facultyCadre.professorsAvailable >= institution.facultyCadre.professorsRequired ? (
                          <span className="text-emerald-400 font-semibold">OK</span>
                        ) : (
                          <span className="text-rose-400 font-semibold">Deficit</span>
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-semibold text-white">Associate Professors</td>
                      <td className="py-3 px-4">{institution.facultyCadre.assocProfRequired}</td>
                      <td className="py-3 px-4">{institution.facultyCadre.assocProfAvailable}</td>
                      <td className="py-3 px-4 font-mono">
                        {institution.facultyCadre.assocProfAvailable >= institution.facultyCadre.assocProfRequired
                          ? '0'
                          : `-${institution.facultyCadre.assocProfRequired - institution.facultyCadre.assocProfAvailable}`}
                      </td>
                      <td className="py-3 px-4">
                        {institution.facultyCadre.assocProfAvailable >= institution.facultyCadre.assocProfRequired ? (
                          <span className="text-emerald-400 font-semibold">OK</span>
                        ) : (
                          <span className="text-rose-400 font-semibold">Deficit</span>
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 px-4 font-semibold text-white">Assistant Professors</td>
                      <td className="py-3 px-4">{institution.facultyCadre.asstProfRequired}</td>
                      <td className="py-3 px-4">{institution.facultyCadre.asstProfAvailable}</td>
                      <td className="py-3 px-4 font-mono">
                        {institution.facultyCadre.asstProfAvailable >= institution.facultyCadre.asstProfRequired
                          ? '0'
                          : `-${institution.facultyCadre.asstProfRequired - institution.facultyCadre.asstProfAvailable}`}
                      </td>
                      <td className="py-3 px-4">
                        {institution.facultyCadre.asstProfAvailable >= institution.facultyCadre.asstProfRequired ? (
                          <span className="text-emerald-400 font-semibold">OK</span>
                        ) : (
                          <span className="text-rose-400 font-semibold">Deficit</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Principal Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Head of Institution / Principal Eligibility</div>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    Dr. {institution.facultyCadre.principalName || 'Principal'} ({institution.facultyCadre.principalExperienceYrs || 18}+ years post-Ph.D experience)
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Meets AICTE Pay Scale, Ph.D in appropriate discipline & publication requirements.
                  </div>
                </div>

                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  institution.facultyCadre.principalEligible
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {institution.facultyCadre.principalEligible ? 'Eligible' : 'Ineligible'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Clarifications */}
        {activeTab === 'clarifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>Formal AICTE Clarification Dispatches</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Official notices sent to the institution SPOC for rectifying discrepancies.
                </p>
              </div>

              <button
                onClick={() => setShowClarificationModal(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Issue New Query</span>
              </button>
            </div>

            {institution.clarificationRequests.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">No Clarifications Dispatched</h4>
                <p className="text-xs text-slate-400 mt-1">
                  The institution application currently has zero pending queries.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {institution.clarificationRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{req.documentName || 'General Query'}</span>
                        <span className="text-slate-500">• Dispatched on {req.requestedAt}</span>
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                        req.status === 'Accepted'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : req.status === 'Resubmitted / Clarified'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                      <span className="text-slate-400 font-semibold block mb-1">AICTE Inquiry:</span>
                      {req.query}
                    </div>

                    {req.response && (
                      <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-xs text-emerald-300">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">Institution Response ({req.respondedAt}):</span>
                          {req.status !== 'Accepted' && (
                            <button
                              onClick={() => {
                                const updatedReqs = institution.clarificationRequests.map((r) =>
                                  r.id === req.id ? { ...r, status: 'Accepted' as const } : r
                                );
                                const updated = {
                                  ...institution,
                                  clarificationRequests: updatedReqs,
                                  auditTrail: [
                                    {
                                      id: `log-${Date.now()}`,
                                      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                                      actor: currentUser.name,
                                      role: currentUser.role,
                                      action: 'Clarification Accepted',
                                      details: `Accepted SPOC response on query ${req.id}`
                                    },
                                    ...institution.auditTrail
                                  ]
                                };
                                onUpdateInstitution(updated);
                                showToast('Clarification accepted');
                              }}
                              className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-semibold hover:bg-emerald-500"
                            >
                              Accept Clarification
                            </button>
                          )}
                        </div>
                        {req.response}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Historical Approvals */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Historical Approval Archive (AICTE Southern Regional Office)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Past Extension of Approval (EoA) records, authorized intake trends, and order references.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-300 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Academic Year</th>
                    <th className="py-3 px-4">Approval Status</th>
                    <th className="py-3 px-4">Approved Intake</th>
                    <th className="py-3 px-4">AICTE Order Number</th>
                    <th className="py-3 px-4">Verified Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {institution.previousApprovals.map((prev, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-semibold text-white">{prev.academicYear}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                          {prev.approvalStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-200">{prev.approvedIntake}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{prev.orderNumber}</td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">{prev.verifiedSource}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: Audit Trail */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Scrutiny Audit Log</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tamper-evident trail of officer actions, document uploads, and automated checks.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 divide-y divide-slate-800">
              {institution.auditTrail.map((log) => (
                <div key={log.id} className="py-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{log.action}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-normal">
                        by {log.actor} ({log.role})
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      {log.details}
                    </div>
                  </div>
                  <div className="text-slate-500 font-mono text-[10px] flex-shrink-0">
                    {log.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal: Dispatch Clarification */}
      {showClarificationModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <span>Issue Clarification Query to SPOC</span>
              </h3>
              <button
                onClick={() => setShowClarificationModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendClarification} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Target Document / Category
                </label>
                <select
                  value={targetDocId}
                  onChange={(e) => setTargetDocId(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">General Dossier Query</option>
                  {institution.documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Statutory Query / Rectification Instructions
                </label>
                <textarea
                  rows={4}
                  value={clarificationQuery}
                  onChange={(e) => setClarificationQuery(e.target.value)}
                  placeholder="Specify the exact discrepancy found (e.g. Building plan lacks approved CMDA / DTCP layout stamp, or Fire NOC renewal date has lapsed)..."
                  className="w-full bg-slate-800 text-white rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-300">
                Notice will be immediately delivered to SPOC <strong>{institution.spoc.name}</strong> ({institution.spoc.email}).
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClarificationModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Query</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record New Deficiency */}
      {showDeficiencyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Flag Statutory Deficiency</span>
              </h3>
              <button
                onClick={() => setShowDeficiencyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDeficiency} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Severity</label>
                  <select
                    value={newDeficiency.severity}
                    onChange={(e) => setNewDeficiency({ ...newDeficiency, severity: e.target.value as any })}
                    className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700"
                  >
                    <option value="Critical">Critical (Blocker)</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">APH Clause Ref</label>
                  <input
                    type="text"
                    value={newDeficiency.aphClause}
                    onChange={(e) => setNewDeficiency({ ...newDeficiency, aphClause: e.target.value })}
                    className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700"
                    placeholder="APH 2026-27 Clause 4.2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deficiency Title</label>
                <input
                  type="text"
                  value={newDeficiency.title}
                  onChange={(e) => setNewDeficiency({ ...newDeficiency, title: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700"
                  placeholder="e.g. Fire Safety Certificate Expired / Unrenewed"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Observed Value</label>
                  <input
                    type="text"
                    value={newDeficiency.observedValue}
                    onChange={(e) => setNewDeficiency({ ...newDeficiency, observedValue: e.target.value })}
                    className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700"
                    placeholder="e.g. Expired on 14 Jan 2026"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Required Norm</label>
                  <input
                    type="text"
                    value={newDeficiency.requiredValue}
                    onChange={(e) => setNewDeficiency({ ...newDeficiency, requiredValue: e.target.value })}
                    className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700"
                    placeholder="e.g. Valid through 31 May 2027"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deficit Description</label>
                <textarea
                  rows={2}
                  value={newDeficiency.deficitDescription}
                  onChange={(e) => setNewDeficiency({ ...newDeficiency, deficitDescription: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded-xl p-2.5 border border-slate-700"
                  placeholder="Detailed breakdown of shortfall..."
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Remediation Action</label>
                <input
                  type="text"
                  value={newDeficiency.remediationAction}
                  onChange={(e) => setNewDeficiency({ ...newDeficiency, remediationAction: e.target.value })}
                  className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700"
                  placeholder="e.g. Obtain renewed Tamil Nadu Fire and Rescue Services NOC"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeficiencyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Record Deficiency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Verification Report PDF Generator & Preview */}
      {showReportModal && (
        <VerificationReportModal
          institution={institution}
          officerName={currentUser.name}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
