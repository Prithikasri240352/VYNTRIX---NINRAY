/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Calendar,
  Send,
  Eye,
  RefreshCw,
  FileCheck2,
  MapPin,
  MessageSquare,
  ShieldCheck,
  PhoneCall,
  History,
  Navigation,
  Compass,
  X,
  ExternalLink
} from 'lucide-react';
import {
  InstitutionApplication,
  VerificationDocument,
  DocumentLocationEvidence,
  ExifPhotoGpsDetail
} from '../types/aicte';
import { convertFilesToPdf, ConvertedDocumentResult } from '../utils/documentConverter';
import { GpsLocationCapture } from './GpsLocationCapture';
import { extractExifGpsFromImage } from '../utils/exifParser';
import { DocumentIntimationNotice } from './DocumentIntimationNotice';
import { STATUTORY_CATEGORY_INFO } from '../utils/documentValidator';
import { speakVoiceAnnouncement } from '../utils/speechSynthesis';

import { useLanguage } from '../i18n/LanguageContext';

interface InstitutionDashboardProps {
  institution: InstitutionApplication;
  onUpdateInstitution: (updated: InstitutionApplication) => void;
  onOpenCopilot: (initialQuery?: string) => void;
  onOpenCallModal: (type: 'audio' | 'video') => void;
}

export const InstitutionDashboard: React.FC<InstitutionDashboardProps> = ({
  institution,
  onUpdateInstitution,
  onOpenCopilot,
  onOpenCallModal,
}) => {
  const { language, t, translateStatus } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<VerificationDocument['category']>('Fire NOC');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConvertedDocumentResult | null>(null);
  const [locationEvidence, setLocationEvidence] = useState<DocumentLocationEvidence | null>(null);
  const [exifPhotoGps, setExifPhotoGps] = useState<ExifPhotoGpsDetail | null>(null);
  const [viewingLocationDoc, setViewingLocationDoc] = useState<VerificationDocument | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [clarificationReply, setClarificationReply] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);

  const [lastSubmittedDoc, setLastSubmittedDoc] = useState<{
    id: string;
    refId: string;
    name: string;
    category: string;
  } | null>(null);

  // Mandatory checklist categories under APH 2026-27
  const checklistCategories: Array<{
    category: VerificationDocument['category'];
    label: string;
    description: string;
  }> = [
    { category: 'Land Title', label: 'Land Title Deed & Registry', description: 'Registered deed 30+ yrs / freehold unencumbered certificate' },
    { category: 'Fire NOC', label: 'Fire & Life Safety Certificate', description: 'Unexpired NOC from TNFRS with Annual Audit Stamp' },
    { category: 'Building Plan', label: 'Approved Building Sanction Plan', description: 'DTCP / CMDA approved architectural layout' },
    { category: 'Structural Stability', label: 'Structural Soundness Certificate', description: 'Registered chartered structural engineer inspection' },
    { category: 'Faculty Cadre List', label: '7th CPC Faculty Cadre Master List', description: 'Cadre ratio 1:2:6 with salary PFMS disbursal slips' },
    { category: 'Joint FDR', label: 'Joint Security FDR Receipt', description: 'Joint lien with Regional Officer AICTE SRO Chennai' },
    { category: 'University Affiliation', label: 'Anna University Affiliation Order', description: 'Current affiliation letter for all approved programmes' },
    { category: 'Pollution NOC', label: 'Tamil Nadu Pollution Control Board NOC', description: 'Consent to Operate (CTO) for campus effluent treatment' },
  ];

  const isMandatoryGps = ['Land Title', 'Fire NOC', 'Building Plan', 'Structural Stability'].includes(selectedCategory);

  const processFiles = async (
    files: File[],
    forcePreset?: 'WRONG_CATEGORY' | 'EXPIRED' | 'WRONG_INSTITUTION' | 'CORRECT'
  ) => {
    setUploadFiles(files);
    setIsConverting(true);
    setLocationEvidence(null);
    setExifPhotoGps(null);
    setSubmitSuccess(false);

    // Extract EXIF GPS from first image if available
    if (files[0] && files[0].type.startsWith('image/')) {
      const extractedExif = await extractExifGpsFromImage(files[0]);
      if (extractedExif) {
        setExifPhotoGps(extractedExif);
      }
    }

    try {
      const result = await convertFilesToPdf(
        files,
        institution.institutionName,
        selectedCategory,
        institution.pid,
        forcePreset
      );
      setConversionResult(result);
    } catch (err: any) {
      alert(`Conversion error: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    await processFiles(files);
  };

  const handleTestPreset = async (
    preset: 'WRONG_CATEGORY' | 'EXPIRED' | 'WRONG_INSTITUTION' | 'CORRECT'
  ) => {
    let dummyFileName = `${selectedCategory.replace(/\s+/g, '_')}_Official_Signed_2026.pdf`;
    if (preset === 'WRONG_CATEGORY') {
      dummyFileName = 'TNEB_Electricity_Tariff_Receipt_March.pdf';
    } else if (preset === 'EXPIRED') {
      dummyFileName = `${selectedCategory.replace(/\s+/g, '_')}_Issued_2022_Expired.pdf`;
    } else if (preset === 'WRONG_INSTITUTION') {
      dummyFileName = `${selectedCategory.replace(/\s+/g, '_')}_St_Joseph_PID_99882231.pdf`;
    }

    const dummyFile = new File(['%PDF-1.4 Mock AICTE Statutory Document for Testing'], dummyFileName, {
      type: 'application/pdf',
    });
    await processFiles([dummyFile], preset);
  };

  const handleConfirmSubmission = () => {
    if (!conversionResult) return;

    // INTIMATION GATE: If wrong document, block submission!
    if (!conversionResult.validation.canSubmit) {
      alert(`Submission Blocked: ${conversionResult.validation.intimationTitle}. Please rectify the discrepancy as indicated in the statutory intimation.`);
      return;
    }

    if (isMandatoryGps && (!locationEvidence || locationEvidence.captureStatus !== 'Captured')) {
      alert('Mandatory Policy: This statutory document requires premises geotagging under APH 2026-27. Please capture GPS coordinates above before submitting.');
      return;
    }

    const docSubId = `SUB-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newDoc: VerificationDocument = {
      id: `doc-${Date.now()}`,
      name: conversionResult.wasConvertedFromImage
        ? `${selectedCategory.replace(/\s+/g, '_')}_Converted.pdf`
        : conversionResult.originalFileName,
      category: selectedCategory,
      fileSize: `${(conversionResult.convertedPdfBlob.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      academicYear: institution.academicYear,
      version: 1,
      originalFormat: conversionResult.originalFormat,
      wasConvertedFromImage: conversionResult.wasConvertedFromImage,
      convertedPdfUrl: conversionResult.convertedPdfUrl,
      status: 'Verified against an authorised source',
      authenticityScore: conversionResult.authenticityScore,
      digitalSignatureVerified: conversionResult.digitalSignatureVerified,
      issuingAuthority: conversionResult.issuingAuthority,
      validUntil: conversionResult.validUntil,
      aphClauseRef: conversionResult.validation.aphClauseRef,
      locationEvidence: locationEvidence || undefined,
      extractedMeta: {
        'Submission Ref': docSubId,
        'Converted from': conversionResult.originalFormat.toUpperCase(),
        'Page Count': String(conversionResult.pageCount),
        'OCR Authority': conversionResult.issuingAuthority,
        'GPS Capture': locationEvidence?.submissionGps ? 'Recorded at submission' : 'Not recorded',
      },
      extractedFields: conversionResult.extractedFields,
      reviewerNotes: `Verified & Submitted by Institution SPOC. Authenticity: ${conversionResult.authenticityScore}%. Authorized by ${conversionResult.issuingAuthority}.`,
    };

    const newComplianceScore = Math.min(100, institution.complianceScore + 4);
    const updatedDocuments = [newDoc, ...institution.documents];
    const updatedAudit = [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: institution.spoc.email,
        role: 'Institution Authorised Signatory',
        action: 'Document Submitted (Verified)',
        details: `Successfully submitted authentic ${newDoc.name} under ${selectedCategory}. Ref: ${docSubId}`,
      },
      ...institution.auditTrail,
    ];

    onUpdateInstitution({
      ...institution,
      complianceScore: newComplianceScore,
      documents: updatedDocuments,
      overallStatus: 'Approved / Compliant',
      auditTrail: updatedAudit,
    });

    setLastSubmittedDoc({
      id: newDoc.id,
      refId: docSubId,
      name: newDoc.name,
      category: selectedCategory,
    });
    setSubmitSuccess(true);
    speakVoiceAnnouncement(`Document ${newDoc.name} submitted successfully to AICTE Southern Regional Office scrutiny queue.`, language);
  };

  const handleSendClarification = (reqId: string) => {
    if (!clarificationReply.trim()) return;

    const updatedReqs = institution.clarificationRequests.map((r) =>
      r.id === reqId
        ? {
            ...r,
            status: 'Resubmitted / Clarified' as const,
            response: clarificationReply,
            respondedAt: new Date().toISOString(),
          }
        : r
    );

    const updatedAudit = [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: institution.spoc.email,
        role: 'Institution Authorised Signatory',
        action: 'Clarification Responded',
        details: `Submitted response: "${clarificationReply.substring(0, 60)}..."`,
      },
      ...institution.auditTrail,
    ];

    onUpdateInstitution({
      ...institution,
      clarificationRequests: updatedReqs,
      auditTrail: updatedAudit,
    });

    setReplySuccess(true);
    setTimeout(() => {
      setReplySuccess(false);
      setClarificationReply('');
    }, 1200);
  };

  return (
    <div className="w-full font-poppins space-y-6">
      {/* Institution Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 mb-1">
              <span className="font-bold text-[#082245] bg-amber-100/90 px-2 py-0.5 rounded">
                PID: {institution.pid}
              </span>
              <span>·</span>
              <span>Ref: {institution.applicationId}</span>
              <span>·</span>
              <span className="text-amber-900 font-semibold">{institution.district} District</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {institution.institutionName}
            </h2>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{institution.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Current Approval Status
              </div>
              <div
                className={`text-sm font-bold mt-0.5 ${
                  institution.overallStatus === 'Approved / Compliant'
                    ? 'text-emerald-700'
                    : institution.overallStatus === 'Clarification Required'
                    ? 'text-amber-700'
                    : 'text-red-700'
                }`}
              >
                {translateStatus(institution.overallStatus)}
              </div>
              <div className="text-[10px] text-slate-400">Academic Year {institution.academicYear}</div>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Compliance Index
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {institution.complianceScore}%
              </div>
              <div className="text-[10px] text-slate-400">Statutory Norms</div>
            </div>
          </div>
        </div>

        {/* Quick SPOC Contact & Virtual Hearing Access */}
        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-600">
            Designated Institutional SPOC:{' '}
            <strong>{institution.spoc.name}</strong> ({institution.spoc.designation}) ·{' '}
            <span className="font-mono text-slate-500">{institution.spoc.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCallModal('audio')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#082245]" />
              <span>Audio Call AICTE Desk</span>
            </button>
            <button
              onClick={() => onOpenCallModal('video')}
              className="px-3 py-1.5 bg-[#082245] hover:bg-[#0c2e5a] text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Join Virtual Hearing Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clarification Notice Banner (if any) */}
      {institution.clarificationRequests.filter((c) => c.status === 'Awaiting Response').length > 0 && (
        <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-300 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Action Required: Scrutiny Committee Clarification Request</span>
          </div>

          {institution.clarificationRequests
            .filter((c) => c.status === 'Awaiting Response')
            .map((req) => (
              <div key={req.id} className="bg-white p-4 rounded-xl border border-amber-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Requested by: <strong>{req.requestedBy}</strong></span>
                  <span>{new Date(req.requestedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-800 font-medium">{req.query}</p>

                {replySuccess ? (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded font-bold text-center">
                    ✓ Response and rectification submitted to Verification Officer.
                  </div>
                ) : (
                  <div className="pt-2 space-y-2">
                    <textarea
                      rows={2}
                      value={clarificationReply}
                      onChange={(e) => setClarificationReply(e.target.value)}
                      placeholder="Type official explanation or reference attached rectification document..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#082245]"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleSendClarification(req.id)}
                        disabled={!clarificationReply.trim()}
                        className="px-4 py-1.5 bg-[#082245] disabled:bg-slate-300 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5 text-amber-400" />
                        <span>Submit Response to Officer</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Two Column Grid: Required Checklist & Upload Portal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Required Checklist (Col 1-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                <span>APH 2026-27 Document Checklist</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {institution.documents.length} / {checklistCategories.length} Furnished
              </span>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {checklistCategories.map((item) => {
                const existing = institution.documents.find((d) => d.category === item.category);

                return (
                  <div
                    key={item.category}
                    onClick={() => setSelectedCategory(item.category)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedCategory === item.category
                        ? 'bg-amber-50/70 border-amber-400 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-snug">
                          {item.label}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                          {item.description}
                        </p>
                      </div>

                      {existing ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                          Uploaded
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Document Upload & Automatic Image-to-PDF Converter (Col 6-12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <div className="pb-3 border-b border-slate-100 mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Document Upload & Conversion Desk
                </h3>
                <p className="text-xs text-slate-500">
                  Target Category: <strong className="text-amber-900">{selectedCategory}</strong> (APH 2026-27)
                </p>
              </div>

              <button
                onClick={() => onOpenCopilot(`What are the mandatory requirements for uploading ${selectedCategory}?`)}
                className="text-xs text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ask Nirnay Norms</span>
              </button>
            </div>

            {/* Dropzone with Live Verification & Test Buttons */}
            <div className="p-6 bg-slate-50/70 border-2 border-dashed border-amber-300 rounded-xl text-center hover:bg-amber-50/40 transition-colors">
              <UploadCloud className="w-10 h-10 text-amber-600 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800">
                Upload Scanned Copies or Photos (PNG, JPG, PDF)
              </div>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                Automatic statutory screening inspects document category, digital signatures, issuing authorities, and expiry dates.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <label className="inline-flex items-center px-4 py-2 bg-[#082245] hover:bg-[#0c2f5e] text-white font-bold text-xs rounded-lg cursor-pointer shadow-xs transition-colors">
                  <span>Select Document File(s)</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Instant Verification Testing Presets */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Interactive Test Presets (Try Wrong vs Correct Documents):
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestPreset('CORRECT')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>✓ Test Correct Document</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTestPreset('WRONG_CATEGORY')}
                    className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <span>⚠️ Test Wrong Document (Mismatch: Electricity Bill)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTestPreset('EXPIRED')}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>❌ Test Expired Document</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTestPreset('WRONG_INSTITUTION')}
                    className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>🚫 Test PID Mismatch</span>
                  </button>
                </div>
              </div>
            </div>

            {/* In-Flight Conversion Progress */}
            {isConverting && (
              <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-amber-700 animate-spin shrink-0" />
                <span className="text-amber-950 font-medium">
                  Scanning document headers, extracting OCR metadata, and executing statutory scrutiny checks...
                </span>
              </div>
            )}

            {/* Converted Document Preview & Live Scrutiny Gate */}
            {conversionResult && !isConverting && (
              <div className="mt-5 p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="font-bold text-slate-900">{conversionResult.originalFileName}</div>
                      <div className="text-[11px] text-slate-500">
                        {conversionResult.wasConvertedFromImage
                          ? `Converted from ${conversionResult.originalFormat.toUpperCase()} · ${conversionResult.pageCount} Page(s)`
                          : 'Original PDF Preserved'}
                      </div>
                    </div>
                  </div>

                  <a
                    href={conversionResult.convertedPdfUrl}
                    download={`Converted_${selectedCategory.replace(/\s+/g, '_')}.pdf`}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-semibold text-xs flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>

                {/* Extracted OCR Key-Values */}
                <div>
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Extracted Document Fields (Scrutiny Confidence: {conversionResult.authenticityScore}%)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(conversionResult.extractedFields).map(([key, f]) => (
                      <div
                        key={key}
                        className={`p-2.5 bg-white rounded border ${
                          f.isMatched ? 'border-slate-200' : 'border-red-300 bg-red-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[10.5px] block">{f.label}</span>
                          {!f.isMatched && (
                            <span className="text-[9.5px] font-bold text-red-600 bg-red-100 px-1 rounded">
                              DISCREPANCY
                            </span>
                          )}
                        </div>
                        <span
                          className={`font-semibold ${
                            f.isMatched ? 'text-slate-900' : 'text-red-900 font-bold'
                          }`}
                        >
                          {f.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GPS Location Capture Component */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Statutory Geotagged Evidence ({isMandatoryGps ? 'Mandatory for this Category' : 'Optional'})</span>
                  </div>
                  <GpsLocationCapture
                    policy={isMandatoryGps ? 'Mandatory' : 'Optional'}
                    campusCoordinates={institution.campusCoordinates || { latitude: 13.3564, longitude: 80.1432 }}
                    institutionName={institution.institutionName}
                    exifPhotoGps={exifPhotoGps}
                    onLocationCaptured={(evidence) => setLocationEvidence(evidence)}
                  />
                </div>

                {/* INTIMATION OR SUBMISSION RESULT NOTICE */}
                {submitSuccess && lastSubmittedDoc ? (
                  <div className="p-4 bg-emerald-100/90 border border-emerald-300 rounded-xl space-y-2 text-emerald-950">
                    <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-900">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      <span>Document Submitted Successfully to AICTE Scrutiny Queue!</span>
                    </div>
                    <p className="text-xs">
                      Reference ID: <strong className="font-mono text-emerald-900">{lastSubmittedDoc.refId}</strong> · Category:{' '}
                      <strong>{lastSubmittedDoc.category}</strong>. Document has been verified and registered in your institutional dossier.
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitSuccess(false);
                          setConversionResult(null);
                          setUploadFiles([]);
                          setLocationEvidence(null);
                        }}
                        className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Upload Another Document
                      </button>
                    </div>
                  </div>
                ) : (
                  <DocumentIntimationNotice
                    validation={conversionResult.validation}
                    institutionName={institution.institutionName}
                    institutionPid={institution.pid}
                    onReset={() => {
                      setConversionResult(null);
                      setLocationEvidence(null);
                      setExifPhotoGps(null);
                      setUploadFiles([]);
                    }}
                    onSubmit={handleConfirmSubmission}
                    onTryCorrectPreset={() => handleTestPreset('CORRECT')}
                    onTryWrongPreset={(preset) => handleTestPreset(preset)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Submitted Documents Inventory */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Submitted Document Dossier ({institution.documents.length} Files)
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {institution.documents.map((doc) => (
                <div key={doc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                        <span>{doc.name}</span>
                        {doc.wasConvertedFromImage && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 font-medium">
                            Converted A4 PDF
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap mt-0.5">
                        <span>{doc.category}</span>
                        <span>·</span>
                        <span>{doc.fileSize}</span>
                        <span>·</span>
                        <span>Uploaded {doc.uploadDate}</span>
                        {doc.locationEvidence?.submissionGps && (
                          <>
                            <span>·</span>
                            <button
                              type="button"
                              onClick={() => setViewingLocationDoc(doc)}
                              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition font-medium cursor-pointer"
                            >
                              <MapPin className="w-3 h-3 text-emerald-700" />
                              <span>
                                GPS {doc.locationEvidence.submissionGps.latitude.toFixed(4)}°, {doc.locationEvidence.submissionGps.longitude.toFixed(4)}°
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {doc.locationEvidence?.submissionGps && (
                      <button
                        type="button"
                        onClick={() => setViewingLocationDoc(doc)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                        title="View Geotagged Map"
                      >
                        <Compass className="w-4 h-4 text-emerald-600" />
                      </button>
                    )}

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.status.includes('Verified') || doc.status.includes('Confirmed')
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.status.includes('Review') || doc.status.includes('AI')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Geotagged Location Evidence Modal */}
      {viewingLocationDoc && viewingLocationDoc.locationEvidence?.submissionGps && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Geotagged Location Evidence</h3>
                  <p className="text-[11px] text-slate-500">{viewingLocationDoc.name}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingLocationDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Coordinates detail */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Submission Latitude</span>
                <span className="font-mono font-bold text-slate-900">
                  {viewingLocationDoc.locationEvidence.submissionGps.latitude}° N
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Submission Longitude</span>
                <span className="font-mono font-bold text-slate-900">
                  {viewingLocationDoc.locationEvidence.submissionGps.longitude}° E
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Accuracy Radius</span>
                <span className="font-mono font-bold text-emerald-700">
                  ± {viewingLocationDoc.locationEvidence.submissionGps.accuracyMeters} meters
                </span>
              </div>
            </div>

            {/* Map Preview */}
            <div className="h-56 rounded-xl overflow-hidden border border-slate-200">
              <iframe
                title="Location Map"
                width="100%"
                height="100%"
                className="w-full h-full border-0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  viewingLocationDoc.locationEvidence.submissionGps.longitude - 0.008
                }%2C${
                  viewingLocationDoc.locationEvidence.submissionGps.latitude - 0.006
                }%2C${
                  viewingLocationDoc.locationEvidence.submissionGps.longitude + 0.008
                }%2C${
                  viewingLocationDoc.locationEvidence.submissionGps.latitude + 0.006
                }&layer=mapnik&marker=${
                  viewingLocationDoc.locationEvidence.submissionGps.latitude
                }%2C${viewingLocationDoc.locationEvidence.submissionGps.longitude}`}
              />
            </div>

            {/* Disclaimer */}
            <p className="text-[10.5px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              {viewingLocationDoc.locationEvidence.disclaimerText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
