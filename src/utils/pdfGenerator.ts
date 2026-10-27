/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { InstitutionApplication } from '../types/aicte';

export function generateScrutinyPdf(app: InstitutionApplication): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 16;

  // Header - Government Emblem & Council Title
  doc.setFillColor(248, 250, 252);
  doc.rect(10, 10, pageWidth - 20, 32, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(10, 10, pageWidth - 20, 32, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('ALL INDIA COUNCIL FOR TECHNICAL EDUCATION', pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('(A STATUTORY BODY OF THE GOVERNMENT OF INDIA)', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(9);
  doc.text('Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070 | www.aicte-india.org', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text('SCRUTINY COMMITTEE REPORT & COMPLIANCE EVALUATION SHEET 2026-27', pageWidth / 2, y, { align: 'center' });

  y += 12;

  // Institution Metadata Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. APPLICATION & INSTITUTION PARTICULARS', 12, y);
  y += 5;

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, y, pageWidth - 24, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  doc.text(`Application ID: ${app.applicationId}`, 15, y + 6);
  doc.text(`Permanent ID (PID): ${app.pid}`, 110, y + 6);

  doc.text(`Institution: ${app.institutionName}`, 15, y + 12);
  doc.text(`Region / State: ${app.region} / ${app.state}`, 110, y + 12);

  doc.text(`Approval Category: ${app.applicationType}`, 15, y + 18);
  doc.text(`Academic Session: ${app.academicYear}`, 110, y + 18);

  doc.text(`Proposed Total Intake: ${app.proposedIntake} Seats`, 15, y + 24);
  const statusColor = app.overallStatus === 'Approved / Compliant' ? [22, 163, 74] : [220, 38, 38];
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(`Scrutiny Status: ${app.overallStatus}`, 110, y + 24);

  y += 36;

  // Scrutiny Matrix Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. AUTOMATED SCRUTINY VERIFICATION MATRIX (APH 2026-27)', 12, y);
  y += 5;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(12, y, pageWidth - 24, 7, 'F');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('Parameter / Norm', 15, y + 5);
  doc.text('Prescribed (APH 2026-27)', 70, y + 5);
  doc.text('Observed / Furnished', 125, y + 5);
  doc.text('Compliance Status', 165, y + 5);
  y += 7;

  // Table rows
  const matrix = [
    {
      param: 'Contiguous Campus Land',
      prescribed: `${app.requiredLandAcres} Acres (Rural/Urban Norm)`,
      observed: `${app.landAreaAcres} Acres Registered`,
      compliant: app.landAreaAcres >= app.requiredLandAcres,
    },
    {
      param: 'Total Instructional & Built-up Area',
      prescribed: `${app.requiredBuiltUpAreaSqM.toLocaleString()} sq.m`,
      observed: `${app.builtUpAreaSqM.toLocaleString()} sq.m`,
      compliant: app.builtUpAreaSqM >= app.requiredBuiltUpAreaSqM,
    },
    {
      param: 'Faculty Cadre Ratio (1:2:6)',
      prescribed: `Prof: ${app.facultyCadre.professorsRequired}, Assoc: ${app.facultyCadre.assocProfRequired}`,
      observed: `Prof: ${app.facultyCadre.professorsAvailable}, Assoc: ${app.facultyCadre.assocProfAvailable}`,
      compliant: app.facultyCadre.cadreRatioCompliant,
    },
    {
      param: 'Joint Security FDR / Endowment',
      prescribed: `₹ ${app.requiredJointFdrLakhs} Lakhs`,
      observed: `₹ ${app.jointFdrAmountLakhs} Lakhs (Joint Lien)`,
      compliant: app.jointFdrAmountLakhs >= app.requiredJointFdrLakhs,
    },
    {
      param: 'Principal / Director Eligibility',
      prescribed: 'PhD + 10 Yrs Exp + 6 SCI Pubs',
      observed: app.facultyCadre.principalEligible ? 'Verified & Qualified' : 'Experience / Publication Deficit',
      compliant: app.facultyCadre.principalEligible,
    },
  ];

  doc.setFont('helvetica', 'normal');
  matrix.forEach((row, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(12, y, pageWidth - 24, 6.5, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(12, y + 6.5, pageWidth - 12, y + 6.5);

    doc.setTextColor(30, 41, 59);
    doc.text(row.param, 15, y + 4.5);
    doc.text(row.prescribed, 70, y + 4.5);
    doc.text(row.observed, 125, y + 4.5);

    if (row.compliant) {
      doc.setTextColor(22, 163, 74);
      doc.text('COMPLIANT', 165, y + 4.5);
    } else {
      doc.setTextColor(220, 38, 38);
      doc.text('NON-COMPLIANT', 165, y + 4.5);
    }
    y += 6.5;
  });

  y += 6;

  // Deficiencies Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3. SCRUTINY COMMITTEE FINDINGS & DEFICIENCIES IDENTIFIED', 12, y);
  y += 5;

  if (app.deficiencies.length === 0) {
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(12, y, pageWidth - 24, 16, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(22, 163, 74);
    doc.text('NIL DEFICIENCIES: Institution complies with all statutory norms of APH 2026-2027.', 15, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Recommended for grant of unconditional Extension of Approval (EoA) for Academic Year 2026-27.', 15, y + 12);
    y += 22;
  } else {
    app.deficiencies.forEach((def, i) => {
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(12, y, pageWidth - 24, 20, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(185, 28, 28);
      doc.text(`[${def.severity.toUpperCase()}] ${i + 1}. ${def.title} — Clause: ${def.aphClause}`, 15, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Deficit: ${def.deficitDescription}`, 15, y + 10);
      doc.text(`Remediation Required: ${def.remediationAction}`, 15, y + 15);

      y += 22;
    });
  }

  // Committee Signatures & Official Stamp
  y = Math.max(y + 4, 235);
  doc.setDrawColor(203, 213, 225);
  doc.line(12, y, pageWidth - 12, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('SCRUTINY COMMITTEE (SAC / SHC) SIGNATURES', 12, y);

  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);

  doc.text('_________________________________', 15, y);
  doc.text('Dr. Rameshwar Dayal', 15, y + 4);
  doc.text('Advisor (Approval Bureau) / Convener', 15, y + 8);

  doc.text('_________________________________', 85, y);
  doc.text('Prof. K. Venkateshwarlu', 85, y + 4);
  doc.text('Regional Officer / Expert Member', 85, y + 8);

  doc.text('_________________________________', 150, y);
  doc.text('Digitally Authenticated by Nirnay', 150, y + 4);
  doc.text(`Timestamp: ${new Date().toISOString()}`, 150, y + 8);

  // Footer Disclaimer
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'This is a system-generated Scrutiny Evaluation Report produced via Nirnay Scrutiny Engine. Final order subject to Approval Bureau Gazette release.',
    pageWidth / 2,
    285,
    { align: 'center' }
  );

  doc.save(`AICTE_Scrutiny_Report_${app.applicationId}.pdf`);
}
