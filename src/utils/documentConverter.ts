/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { ExtractedFieldDetail, VerificationDocument } from '../types/aicte';
import { validateUploadedFile, DocumentValidationResult } from './documentValidator';

export interface ConvertedDocumentResult {
  convertedPdfBlob: Blob;
  convertedPdfUrl: string;
  pageCount: number;
  originalFileName: string;
  originalFormat: 'pdf' | 'png' | 'jpg' | 'jpeg';
  wasConvertedFromImage: boolean;
  extractedFields: Record<string, ExtractedFieldDetail>;
  authenticityScore: number;
  digitalSignatureVerified: boolean;
  issuingAuthority: string;
  validUntil: string;
  notes: string;
  validation: DocumentValidationResult;
}

export async function convertFilesToPdf(
  files: File[],
  institutionName: string,
  category: VerificationDocument['category'],
  institutionPid?: string,
  forcePreset?: 'WRONG_CATEGORY' | 'EXPIRED' | 'WRONG_INSTITUTION' | 'CORRECT'
): Promise<ConvertedDocumentResult> {
  if (files.length === 0) {
    throw new Error('No files provided for conversion.');
  }

  const firstFile = files[0];
  const fileExt = firstFile.name.split('.').pop()?.toLowerCase() || '';

  // Run comprehensive statutory verification
  const validation = await validateUploadedFile(
    firstFile,
    category,
    institutionName,
    institutionPid,
    forcePreset
  );

  // If single PDF already uploaded
  if (files.length === 1 && fileExt === 'pdf') {
    const pdfBlob = firstFile.slice(0, firstFile.size, 'application/pdf');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    return {
      convertedPdfBlob: pdfBlob,
      convertedPdfUrl: pdfUrl,
      pageCount: 1,
      originalFileName: firstFile.name,
      originalFormat: 'pdf',
      wasConvertedFromImage: false,
      extractedFields: validation.extractedFields,
      authenticityScore: validation.authenticityScore,
      digitalSignatureVerified: validation.digitalSignatureVerified,
      issuingAuthority: validation.issuingAuthority,
      validUntil: validation.validUntil,
      notes: validation.isValid
        ? `Statutory verification passed for ${category}. Authorized by ${validation.issuingAuthority}.`
        : `Deficiency detected: ${validation.intimationTitle}. Submission blocked.`,
      validation,
    };
  }

  // Convert image(s) to a clean multi-page PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const a4Width = doc.internal.pageSize.getWidth();
  const a4Height = doc.internal.pageSize.getHeight();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (i > 0) {
      doc.addPage();
    }

    const dataUrl = await readFileAsDataUrl(file);
    const imgDims = await getImageDimensions(dataUrl);

    // Calculate aspect ratio fit with 10mm margins
    const margin = 10;
    const maxW = a4Width - margin * 2;
    const maxH = a4Height - margin * 2;

    let targetW = maxW;
    let targetH = (imgDims.height / imgDims.width) * targetW;

    if (targetH > maxH) {
      targetH = maxH;
      targetW = (imgDims.width / imgDims.height) * targetH;
    }

    const posX = margin + (maxW - targetW) / 2;
    const posY = margin + (maxH - targetH) / 2;

    const format = file.name.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
    doc.addImage(dataUrl, format, posX, posY, targetW, targetH, undefined, 'FAST');
  }

  const pdfOutputBlob = doc.output('blob');
  const convertedPdfUrl = URL.createObjectURL(pdfOutputBlob);

  return {
    convertedPdfBlob: pdfOutputBlob,
    convertedPdfUrl,
    pageCount: files.length,
    originalFileName: firstFile.name,
    originalFormat: (fileExt === 'png' ? 'png' : 'jpg') as any,
    wasConvertedFromImage: true,
    extractedFields: validation.extractedFields,
    authenticityScore: validation.authenticityScore,
    digitalSignatureVerified: validation.digitalSignatureVerified,
    issuingAuthority: validation.issuingAuthority,
    validUntil: validation.validUntil,
    notes: validation.isValid
      ? `Converted ${files.length} image(s) to standardized A4 PDF. Statutory scrutiny passed.`
      : `Converted image(s) to PDF, but statutory verification failed: ${validation.intimationTitle}`,
    validation,
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth || 800, height: img.naturalHeight || 1100 });
    };
    img.onerror = () => {
      resolve({ width: 800, height: 1100 });
    };
    img.src = dataUrl;
  });
}
