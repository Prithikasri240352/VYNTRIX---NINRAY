/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Volume2,
  VolumeX,
  Download,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { DocumentValidationResult, STATUTORY_CATEGORY_INFO } from '../utils/documentValidator';
import { speakVoiceAnnouncement } from '../utils/speechSynthesis';
import { useLanguage } from '../i18n/LanguageContext';

interface DocumentIntimationNoticeProps {
  validation: DocumentValidationResult;
  institutionName: string;
  institutionPid?: string;
  onReset: () => void;
  onSubmit: () => void;
  onTryCorrectPreset?: () => void;
  onTryWrongPreset?: (type: 'WRONG_CATEGORY' | 'EXPIRED' | 'WRONG_INSTITUTION') => void;
}

export const DocumentIntimationNotice: React.FC<DocumentIntimationNoticeProps> = ({
  validation,
  institutionName,
  institutionPid,
  onReset,
  onSubmit,
  onTryCorrectPreset,
  onTryWrongPreset,
}) => {
  const { language } = useLanguage();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [hasAnnounced, setHasAnnounced] = useState(false);

  // Automatically speak intimation notice once on mount/change if audio enabled
  useEffect(() => {
    if (!audioEnabled || hasAnnounced) return;

    if (!validation.isValid) {
      speakVoiceAnnouncement(
        `Statutory Intimation Notice: Uploaded document does not match the requirements for ${validation.targetCategory}. ${validation.intimationTitle}. Submission is blocked.`,
        language
      );
    } else {
      speakVoiceAnnouncement(
        `Document verification successful for ${validation.targetCategory}. All statutory checks passed. Ready for submission.`,
        language
      );
    }
    setHasAnnounced(true);
  }, [validation, audioEnabled, hasAnnounced, language]);

  const toggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    if (!nextState && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleDownloadIntimationMemo = () => {
    const doc = new jsPDF();
    const memoId = `INTIMATION-APH-${Date.now().toString().slice(-6)}`;
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Header & Emblem
    doc.setFillColor(11, 37, 69);
    doc.rect(0, 0, 210, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ALL INDIA COUNCIL FOR TECHNICAL EDUCATION', 105, 12, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('SOUTHERN REGIONAL OFFICE (SRO) · SHASTRI BHAWAN, CHENNAI', 105, 18, { align: 'center' });
    doc.text('AUTOMATED SCRUTINY DEFICIENCY & INTIMATION MEMO (APH 2026-27)', 105, 23, { align: 'center' });

    // Memo Meta
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Ref Memo No: AICTE/SRO/SCRUTINY/${memoId}`, 14, 38);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date of Issue: ${dateStr}`, 140, 38);

    doc.line(14, 42, 196, 42);

    // Institution info
    doc.setFont('helvetica', 'bold');
    doc.text('To:', 14, 48);
    doc.text(`The Principal / SPOC, ${institutionName}`, 14, 54);
    doc.setFont('helvetica', 'normal');
    doc.text(`Permanent Institute ID (PID): ${institutionPid || '1-33278912'}`, 14, 60);

    // Subject
    doc.setFont('helvetica', 'bold');
    doc.text('SUBJECT: INTIMATION OF DOCUMENT DISCREPANCY & SUBMISSION REJECTION', 14, 70);

    // Body
    doc.setFont('helvetica', 'normal');
    const msg =
      `This is an automated statutory intimation generated pursuant to scrutiny of uploaded documents under Approval Process Handbook (APH 2026-27).\n\n` +
      `During document ingestion for the statutory checklist item "${validation.targetCategory}", the scrutiny engine detected critical discrepancies that violate statutory norms. Consequently, the document has been REJECTED and submission has been blocked until rectification.`;
    doc.text(doc.splitTextToSize(msg, 182), 14, 78);

    // Findings Table Box
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(14, 106, 182, 55, 3, 3, 'F');
    doc.setDrawColor(239, 68, 68);
    doc.roundedRect(14, 106, 182, 55, 3, 3, 'D');

    doc.setTextColor(153, 27, 27);
    doc.setFont('helvetica', 'bold');
    doc.text('SUMMARY OF SCRUTINY FINDINGS & DISCREPANCIES:', 20, 114);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`1. Target Checklist Category: ${validation.targetCategory}`, 20, 122);
    doc.text(`2. Detected File Character: ${validation.detectedDocumentType}`, 20, 128);
    doc.text(`3. Statutory Clause Violated: ${validation.aphClauseRef}`, 20, 134);
    doc.text(`4. Discrepancy Classification: ${validation.intimationTitle}`, 20, 140);
    doc.text(`5. Authenticity Rating: ${validation.authenticityScore} / 100 (Failed Mandatory Benchmark)`, 20, 146);
    doc.text(`6. Digital Signature (DSC) Status: ${validation.digitalSignatureVerified ? 'Verified' : 'Invalid / Missing'}`, 20, 152);

    // Instructions
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('REQUIRED REMEDIAL ACTION:', 14, 172);

    doc.setFont('helvetica', 'normal');
    const instructions =
      `${validation.remedialInstructions}\n\n` +
      `The institution is advised to upload the correct, current, and genuine document on the AICTE Portal before the scrutiny cutoff date. Failure to rectify statutory deficiencies may attract SHC proceedings or non-extension of approval.`;
    doc.text(doc.splitTextToSize(instructions, 182), 14, 178);

    // Sign off
    doc.setFont('helvetica', 'bold');
    doc.text('Regional Officer / Automated Scrutiny Cell', 14, 220);
    doc.setFont('helvetica', 'normal');
    doc.text('AICTE Southern Regional Office, Chennai', 14, 226);
    doc.text('(Digitally generated statutory notice — No physical signature required)', 14, 232);

    doc.save(`AICTE_Deficiency_Intimation_${memoId}.pdf`);
  };

  const categoryInfo = STATUTORY_CATEGORY_INFO[validation.targetCategory];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* WRONG DOCUMENT INTIMATION CARD */}
      {!validation.isValid ? (
        <div className="rounded-2xl border-2 border-red-400 bg-red-50/80 p-5 sm:p-6 shadow-sm space-y-4">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-200 text-red-900 text-[11px] font-bold uppercase tracking-wider">
                  <span>🚨 Statutory Intimation Notice</span>
                  <span>·</span>
                  <span>Submission Blocked</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-red-950 mt-0.5">
                  Wrong Document Detected: {validation.intimationTitle}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={toggleAudio}
                title={audioEnabled ? 'Mute Intimation Voice' : 'Enable Intimation Voice'}
                className="px-2.5 py-1.5 rounded-lg border border-red-300 bg-white hover:bg-red-100 text-red-900 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                {audioEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-red-600 animate-bounce" />
                    <span>Voice Intimation On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                    <span>Voice Muted</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadIntimationMemo}
                className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Intimation Memo (PDF)</span>
              </button>
            </div>
          </div>

          {/* Intimation Message & Side-by-side mismatch analysis */}
          <div className="bg-white rounded-xl border border-red-200 p-4 space-y-3">
            <p className="text-xs sm:text-sm text-red-950 font-medium leading-relaxed">
              <strong>Official Notice to Institution:</strong> {validation.intimationMessage}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              {/* What was expected */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Statutory Expectation (APH 2026-27)</span>
                </div>
                <div className="font-bold text-slate-900 text-xs">{categoryInfo.fullName}</div>
                <div className="text-[11px] text-slate-600">
                  Authority: <strong>{categoryInfo.authority}</strong>
                </div>
                <div className="text-[11px] text-slate-600">
                  Validity: <strong>{categoryInfo.requiredValidity}</strong>
                </div>
                <div className="text-[10px] text-amber-800 font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                  Ref: {categoryInfo.clause}
                </div>
              </div>

              {/* What was detected */}
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 space-y-1.5">
                <div className="text-[11px] font-bold text-red-800 uppercase tracking-wider flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                  <span>Detected Uploaded Content</span>
                </div>
                <div className="font-bold text-red-950 text-xs">{validation.detectedDocumentType}</div>
                <div className="text-[11px] text-red-800">
                  Discrepancy: <strong>{validation.intimationTitle}</strong>
                </div>
                <div className="text-[11px] text-red-800">
                  Status: <strong>REJECTED — Cannot be accepted</strong>
                </div>
                <div className="text-[10px] text-red-900 font-mono bg-red-100 px-2 py-0.5 rounded border border-red-300 inline-block">
                  Authenticity Score: {validation.authenticityScore} / 100
                </div>
              </div>
            </div>

            {/* Detailed Discrepancy Items */}
            {validation.discrepancyDetails.length > 0 && (
              <div className="pt-2 border-t border-red-100">
                <div className="text-xs font-bold text-red-900 mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>Specific Scrutiny Deficiencies Identified:</span>
                </div>
                <ul className="space-y-1 text-xs text-red-800 list-disc list-inside">
                  {validation.discrepancyDetails.map((detail, idx) => (
                    <li key={idx} className="leading-snug">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Remedial Advice */}
            <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-300 text-xs text-amber-950">
              <span className="font-bold block mb-0.5">Required Remedial Action:</span>
              <span>{validation.remedialInstructions}</span>
            </div>
          </div>

          {/* Action Row & Submissions Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onReset}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-upload Correct Document</span>
              </button>

              {onTryCorrectPreset && (
                <button
                  type="button"
                  onClick={onTryCorrectPreset}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Test with Correct Document</span>
                </button>
              )}
            </div>

            {/* BLOCKED SUBMIT BUTTON */}
            <div className="relative group">
              <button
                type="button"
                disabled
                className="w-full sm:w-auto px-5 py-2.5 bg-red-200 text-red-800 font-bold text-xs rounded-lg cursor-not-allowed flex items-center justify-center gap-2 border border-red-300 opacity-90 shadow-2xs"
              >
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Submission Blocked (Rectify Discrepancy)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* CORRECT DOCUMENT VERIFIED CARD */
        <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[11px] font-bold uppercase tracking-wider">
                  <span>✓ Statutory Scrutiny Passed</span>
                  <span>·</span>
                  <span>Ready to Submit</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-emerald-950 mt-0.5">
                  Document Verified & Authenticated: {validation.targetCategory}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleAudio}
                title={audioEnabled ? 'Mute Confirmation Voice' : 'Enable Confirmation Voice'}
                className="px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                {audioEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Voice On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                    <span>Muted</span>
                  </>
                )}
              </button>

              <div className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-mono font-bold">
                Authenticity: {validation.authenticityScore}%
              </div>
            </div>
          </div>

          {/* Validation Checks Matrix */}
          <div className="bg-white rounded-xl border border-emerald-200 p-4 space-y-3">
            <p className="text-xs text-emerald-950 font-medium">
              {validation.intimationMessage}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs pt-1">
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[10.5px] text-emerald-700 font-semibold block">Category Match</span>
                <span className="font-bold text-emerald-950 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Statutory Match</span>
                </span>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[10.5px] text-emerald-700 font-semibold block">Digital Signature (DSC)</span>
                <span className="font-bold text-emerald-950 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Class 3 CA Verified</span>
                </span>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[10.5px] text-emerald-700 font-semibold block">Certifying Authority</span>
                <span className="font-bold text-emerald-950 truncate block mt-0.5" title={validation.issuingAuthority}>
                  {validation.issuingAuthority}
                </span>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[10.5px] text-emerald-700 font-semibold block">Validity Expiry</span>
                <span className="font-mono font-bold text-emerald-950 block mt-0.5">
                  {validation.validUntil}
                </span>
              </div>
            </div>
          </div>

          {/* Submission CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard & Choose Another File</span>
            </button>

            <button
              type="button"
              onClick={onSubmit}
              className="px-6 py-2.5 bg-[#082245] hover:bg-[#0c2f5e] text-white text-xs font-extrabold rounded-lg shadow-sm cursor-pointer flex items-center justify-center gap-2 transition hover:scale-[1.01]"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Confirm & Submit to AICTE Scrutiny Queue</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
