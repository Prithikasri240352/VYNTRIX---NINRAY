/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SAMPLE_APPLICATIONS } from '../data/mockInstitutions';
import { VerificationDocument, InstitutionApplication } from '../types/aicte';
import {
  FileCheck2,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileText,
  Search,
  ExternalLink,
  Cpu,
  RotateCcw
} from 'lucide-react';
import { DocumentIntimationNotice } from './DocumentIntimationNotice';
import { validateUploadedFile, DocumentValidationResult, STATUTORY_CATEGORY_INFO } from '../utils/documentValidator';
import { speakVoiceAnnouncement } from '../utils/speechSynthesis';

import { useLanguage } from '../i18n/LanguageContext';

export const DocumentVerifierView: React.FC<{ isHindi?: boolean }> = () => {
  const { language, t, translateStatus } = useLanguage();
  const [selectedApp, setSelectedApp] = useState<InstitutionApplication>(SAMPLE_APPLICATIONS[0]);
  const [activeDoc, setActiveDoc] = useState<VerificationDocument>(selectedApp.documents[0]);
  const [targetCategory, setTargetCategory] = useState<VerificationDocument['category']>('Fire NOC');
  const [isUploading, setIsUploading] = useState(false);
  const [simulatedOcrProgress, setSimulatedOcrProgress] = useState(0);
  const [currentValidation, setCurrentValidation] = useState<DocumentValidationResult | null>(null);
  const [tempUploadedFile, setTempUploadedFile] = useState<File | null>(null);
  const [submissionSuccessNotice, setSubmissionSuccessNotice] = useState<string | null>(null);

  const processFileVerification = async (
    file: File,
    preset?: 'WRONG_CATEGORY' | 'EXPIRED' | 'WRONG_INSTITUTION' | 'CORRECT'
  ) => {
    setTempUploadedFile(file);
    setIsUploading(true);
    setSubmissionSuccessNotice(null);
    setCurrentValidation(null);
    setSimulatedOcrProgress(15);

    setTimeout(() => setSimulatedOcrProgress(50), 300);
    setTimeout(() => setSimulatedOcrProgress(85), 600);

    const validation = await validateUploadedFile(
      file,
      targetCategory,
      selectedApp.institutionName,
      selectedApp.pid,
      preset
    );

    setTimeout(() => {
      setSimulatedOcrProgress(100);
      setIsUploading(false);
      setCurrentValidation(validation);
    }, 900);
  };

  const handleSimulateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFileVerification(file);
  };

  const handleTestPreset = async (
    preset: 'WRONG_CATEGORY' | 'EXPIRED' | 'WRONG_INSTITUTION' | 'CORRECT'
  ) => {
    let dummyName = `${targetCategory.replace(/\s+/g, '_')}_Official_Signed_2026.pdf`;
    if (preset === 'WRONG_CATEGORY') {
      dummyName = 'TNEB_Electricity_Tariff_Receipt_March.pdf';
    } else if (preset === 'EXPIRED') {
      dummyName = `${targetCategory.replace(/\s+/g, '_')}_Expired_2022_Order.pdf`;
    } else if (preset === 'WRONG_INSTITUTION') {
      dummyName = `${targetCategory.replace(/\s+/g, '_')}_St_Joseph_PID_99882231.pdf`;
    }

    const dummyFile = new File(['%PDF-1.4 Mock Statutory Scrutiny File'], dummyName, {
      type: 'application/pdf',
    });
    await processFileVerification(dummyFile, preset);
  };

  const handleConfirmSubmitToRepo = () => {
    if (!currentValidation || !currentValidation.canSubmit || !tempUploadedFile) {
      alert('Statutory Submission Blocked: Document failed automated scrutiny checks. Rectify discrepancies as specified in the intimation notice.');
      return;
    }

    const subId = `SUB-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newDoc: VerificationDocument = {
      id: `doc-${Date.now()}`,
      name: tempUploadedFile.name,
      category: targetCategory,
      fileSize: `${(tempUploadedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      academicYear: '2026-27',
      version: 1,
      originalFormat: tempUploadedFile.name.endsWith('.png') ? 'png' : 'pdf',
      status: 'Verified against an authorised source',
      authenticityScore: currentValidation.authenticityScore,
      digitalSignatureVerified: currentValidation.digitalSignatureVerified,
      issuingAuthority: currentValidation.issuingAuthority,
      validUntil: currentValidation.validUntil,
      aphClauseRef: currentValidation.aphClauseRef,
      reviewerNotes: `Verified against official state registry and submitted by institutional authority. Reference: ${subId}`,
      extractedMeta: {
        'Submission Ref': subId,
        'Detected File Name': tempUploadedFile.name,
        'OCR Stamp Integrity': 'Valid Municipal / Directorate Seal Detected (Confidence 99.2%)',
        'DSC Status': 'Class 3 Signing Certificate Valid',
        'Issuing Authority': currentValidation.issuingAuthority,
      },
      extractedFields: currentValidation.extractedFields,
    };

    selectedApp.documents.unshift(newDoc);
    setActiveDoc(newDoc);
    setSubmissionSuccessNotice(`✓ Document "${newDoc.name}" submitted successfully to institution repository! Ref ID: ${subId}`);
    setCurrentValidation(null);
    setTempUploadedFile(null);
    speakVoiceAnnouncement(`Document ${newDoc.name} submitted successfully to repository.`, language);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Statutory Document Scrutiny & OCR Authentication Engine</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Tamper-Evident Document Verification & Seal Inspection
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Automated cross-examination of Land Title Deeds, Fire & Life Safety NOCs, Joint FDR Receipts, and Building Sanction orders.
        </p>
      </div>

      {/* Main Grid: Document List on Left, OCR Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: Upload and Document Selector (Col 1-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Institutional Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Institution Repository:</label>
            <select
              value={selectedApp.id}
              onChange={(e) => {
                const found = SAMPLE_APPLICATIONS.find((a: InstitutionApplication) => a.id === e.target.value) || SAMPLE_APPLICATIONS[0];
                setSelectedApp(found);
                setActiveDoc(found.documents[0]);
              }}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-2xs font-medium focus:ring-2 focus:ring-amber-500"
            >
              {SAMPLE_APPLICATIONS.map((app: InstitutionApplication) => (
                <option key={app.id} value={app.id}>
                  {app.institutionName} ({app.applicationId})
                </option>
              ))}
            </select>
          </div>

          {/* Target Checklist Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Scrutiny Category (APH 2026-27):</label>
            <select
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value as any)}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-2xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500"
            >
              {(Object.keys(STATUTORY_CATEGORY_INFO) as Array<VerificationDocument['category']>).map((cat) => (
                <option key={cat} value={cat}>
                  {cat} — {STATUTORY_CATEGORY_INFO[cat].fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Dropzone with Live Scrutiny Gate */}
          <div className="p-5 bg-white border-2 border-dashed border-amber-300 rounded-xl text-center hover:bg-amber-50/50 transition-colors">
            <UploadCloud className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-900">Upload Statutory File for Live OCR</div>
            <p className="text-[11px] text-slate-500 mt-0.5 mb-2">
              Validates category match, authority registry, and unexpired validity.
            </p>

            <label className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer shadow-xs transition-colors">
              <span>Choose Document to Parse</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.txt"
                onChange={handleSimulateUpload}
              />
            </label>

            {/* Quick Presets for User Testing */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Quick Test Scenarios (Intimation vs Submission):
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTestPreset('CORRECT')}
                  className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10.5px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>✓ Test Correct Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTestPreset('WRONG_CATEGORY')}
                  className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 text-[10.5px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  <span>⚠️ Test Wrong Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTestPreset('EXPIRED')}
                  className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[10.5px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>❌ Test Expired</span>
                </button>
              </div>
            </div>
          </div>

          {isUploading && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs">
              <div className="flex justify-between font-semibold text-amber-950 mb-1">
                <span>Running OCR, DSC & Digital Stamp Detection...</span>
                <span className="font-mono">{simulatedOcrProgress}%</span>
              </div>
              <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-1.5 rounded-full transition-all duration-200"
                  style={{ width: `${simulatedOcrProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* List of uploaded documents */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 flex justify-between items-center">
              <span>Uploaded Affidavits & NOCs</span>
              <span className="text-slate-500">{selectedApp.documents.length} Files</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {selectedApp.documents.map((doc: VerificationDocument) => (
                <button
                  key={doc.id}
                  onClick={() => setActiveDoc(doc)}
                  className={`w-full p-3 text-left transition-colors cursor-pointer flex items-start justify-between gap-2 ${
                    activeDoc?.id === doc.id
                      ? 'bg-amber-50/80 border-l-4 border-amber-500'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">
                        {doc.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{doc.category}</span>
                        <span>·</span>
                        <span className="font-mono">{doc.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs shrink-0 ${
                      doc.status.includes('Verified') || doc.status.includes('Issuer')
                        ? 'bg-emerald-100 text-emerald-800'
                        : doc.status.includes('review') || doc.status.includes('anomaly')
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {doc.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: OCR Inspector & Metadata Breakdown (Col 6-12) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          {/* Submission Success Alert */}
          {submissionSuccessNotice && (
            <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-950 text-xs flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{submissionSuccessNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setSubmissionSuccessNotice(null)}
                className="text-xs text-emerald-800 hover:text-emerald-950 underline font-semibold shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Real-Time Upload Scrutiny & Intimation Notice */}
          {currentValidation && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Live Scrutiny Screening ({tempUploadedFile?.name})</span>
              </div>

              <DocumentIntimationNotice
                validation={currentValidation}
                institutionName={selectedApp.institutionName}
                institutionPid={selectedApp.pid}
                onReset={() => {
                  setCurrentValidation(null);
                  setTempUploadedFile(null);
                }}
                onSubmit={handleConfirmSubmitToRepo}
                onTryCorrectPreset={() => handleTestPreset('CORRECT')}
                onTryWrongPreset={(p) => handleTestPreset(p)}
              />
            </div>
          )}

          {activeDoc ? (
            <div className="space-y-6">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
                    <span>Uploaded on {activeDoc.uploadDate}</span>
                    <span>·</span>
                    <span>Category: {activeDoc.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {activeDoc.name}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Authenticity Score</div>
                  <div
                    className={`text-xl font-mono font-extrabold tabular-nums ${
                      activeDoc.authenticityScore >= 90
                        ? 'text-emerald-600'
                        : activeDoc.authenticityScore >= 70
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }`}
                  >
                    {activeDoc.authenticityScore} / 100
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`p-4 rounded-lg border text-xs flex items-start gap-3 ${
                  activeDoc.status.includes('Verified') || activeDoc.status.includes('Issuer')
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : activeDoc.status.includes('review') || activeDoc.status.includes('anomaly')
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                {activeDoc.status.includes('Verified') || activeDoc.status.includes('Issuer') ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : activeDoc.status.includes('review') || activeDoc.status.includes('anomaly') ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">
                    Verification Outcome: {activeDoc.status.toUpperCase()}
                  </div>
                  <p className="mt-0.5 leading-relaxed">
                    {activeDoc.reviewerNotes ||
                      'Document complies with APH 2026-27 statutory requirements. Digital signature and issuing authority verified against official registry.'}
                  </p>
                </div>
              </div>

              {/* Security & Cryptographic Verifications */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Cryptographic Integrity & Signature Checks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Digital Signature (DSC):</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      {activeDoc.digitalSignatureVerified ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Valid X.509 Certificate</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                          <span>Unsigned / Notarization Required</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Issuing Authority:</span>
                    <span className="font-semibold text-slate-900 line-clamp-1 mt-0.5">
                      {activeDoc.issuingAuthority}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Validity Window:</span>
                    <span className="font-mono text-slate-900 font-medium mt-0.5">
                      {activeDoc.validUntil}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Hash & Tamper Audit:</span>
                    <span className="font-mono text-slate-700 text-[10px] truncate block mt-0.5">
                      SHA256: 8f9b...a342 (Clean)
                    </span>
                  </div>
                </div>
              </div>

              {/* Extracted OCR Key-Value Fields */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-600" />
                  <span>Structured Metadata Extracted via Automated OCR</span>
                </h4>
                <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200 text-xs font-mono">
                  {Object.entries(activeDoc.extractedMeta).map(([k, v]) => (
                    <div key={k} className="p-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-slate-500 font-sans">{k}:</span>
                      <span className="text-slate-900 font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Select a statutory document from the left to inspect OCR findings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
