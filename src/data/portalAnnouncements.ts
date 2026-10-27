/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RegulatoryNotice, SpocOfficer } from '../types/aicte';

export const REGULATORY_NOTICES: RegulatoryNotice[] = [
  {
    id: 'not-1',
    title: 'Approval Process Handbook (APH) 2026-2027 Gazette Notification released w.e.f 28th Nov, 2025',
    category: 'Handbook',
    date: '2026-10-20',
    publishedDateText: '20 Oct, 2026',
    isNew: true,
    summary: 'Comprehensive regulatory framework, norms for Land, Built-up Area, Faculty Cadre ratio (1:2:6), AI & Emerging Tech course approvals, and online scrutiny guidelines.',
    fileSize: '18.4 MB',
  },
  {
    id: 'not-2',
    title: 'Proposals invited for ATAL Online Faculty Development Programmes (FDPs) for Academic Year 2026-27',
    category: 'Circular',
    date: '2026-10-16',
    publishedDateText: '16 Oct, 2026',
    isNew: true,
    summary: 'AICTE Training and Learning (ATAL) Academy invites online institutional proposals for thrust areas including Quantum Computing, Semiconductor Design, and Cyber-Physical Systems.',
    fileSize: '1.2 MB',
  },
  {
    id: 'not-3',
    title: 'Admissions to Children of Indian Workers in Gulf Countries (CIWG) and Supernumerary Quota Guidelines',
    category: 'Circular',
    date: '2026-09-28',
    publishedDateText: '28 Sep, 2026',
    isNew: false,
    summary: 'Standard Operating Procedure for institutional intake verification and scrutiny under 5% CIWG and 15% OCI/NRI supernumerary quota.',
    fileSize: '840 KB',
  },
  {
    id: 'not-4',
    title: 'Observance of "Vigilance Awareness Week, 2026" from 28th October to 3rd November 2026',
    category: 'Notice',
    date: '2026-09-25',
    publishedDateText: '25 Sep, 2026',
    isNew: false,
    summary: 'All AICTE-approved institutions and affiliated colleges are directed to organize integrity pledges, debate competitions, and preventive vigilance workshops.',
    fileSize: '450 KB',
  },
  {
    id: 'not-5',
    title: 'Schedule for Inviting Applications under AICTE Post Doctoral Fellowship (APDF) Scheme for A/Y 2026-27',
    category: 'Circular',
    date: '2026-07-28',
    publishedDateText: '28 Jul, 2026',
    isNew: false,
    summary: 'Financial support of ₹ 80,000/month plus contingency grant of ₹ 1,00,000/annum for young doctorate scholars in cutting-edge engineering domains.',
    fileSize: '1.5 MB',
  },
  {
    id: 'not-6',
    title: 'Mandatory Relaxation in Land Norms for Mega/Metro Cities with High FSI/FAR - Corrigendum 2026-27',
    category: 'Gazette',
    date: '2026-06-15',
    publishedDateText: '15 Jun, 2026',
    isNew: false,
    summary: 'Clarification regarding vertical expansion allowance and structural stability certification for tier-1 metropolitan urban areas where ground footprint is constrained.',
    fileSize: '2.1 MB',
  },
];

export const SPOC_OFFICERS: SpocOfficer[] = [
  {
    id: 'spoc-1',
    name: 'Dr. Rameshwar Dayal',
    role: 'Advisor-I (Approval Bureau)',
    bureau: 'Approval & Regulation Bureau, AICTE HQ',
    email: 'rameshwar.dayal@aicte-india.org',
    phone: '(011) 29581333',
    availability: 'Mon - Fri (10:00 AM - 05:00 PM)',
  },
  {
    id: 'spoc-2',
    name: 'Dr. C. S. Ananthamurthy',
    role: 'Advisor-II (Institutional Scrutiny)',
    bureau: 'South-Western & Western Cell',
    email: 'cs.anantha@aicte-india.org',
    phone: '(011) 29581338',
    availability: 'Mon - Fri (11:00 AM - 04:30 PM)',
  },
  {
    id: 'spoc-3',
    name: 'Prof. K. Venkateshwarlu',
    role: 'Regional Officer (SRO Chennai)',
    bureau: 'Southern Regional Scrutiny Cell',
    email: 'sro.chennai@aicte-india.org',
    phone: '(044) 22541283',
    availability: 'Tue & Thu (02:00 PM - 05:00 PM)',
  },
  {
    id: 'spoc-4',
    name: 'Dr. Mamta Rani Agarwal',
    role: 'Advisor-I (Policy & Academic Planning)',
    bureau: 'Curriculum & New Technologies Cell',
    email: 'advisor1.pap@aicte-india.org',
    phone: '(011) 29581342',
    availability: 'Mon - Wed (10:30 AM - 04:00 PM)',
  },
  {
    id: 'spoc-5',
    name: 'Technical Support Helpdesk',
    role: 'Centralized Portal Assistance Desk',
    bureau: 'e-Governance & Web Portal Support',
    email: 'helpdesk@aicte-india.org',
    phone: '(011) 29581333 / 38 / 42',
    availability: '24/7 Portal Ticket Logging',
  },
];

export interface ApprovedInstitutionEntry {
  pid: string;
  name: string;
  state: string;
  city: string;
  type: string;
  approvedIntake: number;
  accreditation: string;
}

export const APPROVED_INSTITUTIONS_DATABASE: ApprovedInstitutionEntry[] = [
  {
    pid: '1-429810441',
    name: 'Saraswati Institute of Technology & Engineering',
    state: 'Uttar Pradesh',
    city: 'Greater Noida',
    type: 'Private-Self Financed',
    approvedIntake: 540,
    accreditation: 'NBA Tier-I & NAAC A+',
  },
  {
    pid: '1-7440911',
    name: 'National Institute of Polytechnic & Technology',
    state: 'Maharashtra',
    city: 'Pune',
    type: 'Government Aided Autonomous',
    approvedIntake: 480,
    accreditation: 'NBA Accredited',
  },
  {
    pid: '1-3310892',
    name: 'Vanguard College of Engineering & Research',
    state: 'Karnataka',
    city: 'Bengaluru',
    type: 'Private-Self Financed',
    approvedIntake: 480,
    accreditation: 'NAAC A Grade',
  },
  {
    pid: '1-1029482',
    name: 'Delhi Institute of Engineering and Technology',
    state: 'Delhi NCR',
    city: 'New Delhi',
    type: 'Government Autonomous',
    approvedIntake: 720,
    accreditation: 'NAAC A++ (CGPA 3.68)',
  },
  {
    pid: '1-8891024',
    name: 'Madras Technical & Research Academy',
    state: 'Tamil Nadu',
    city: 'Chennai',
    type: 'Private-Self Financed',
    approvedIntake: 600,
    accreditation: 'NBA 5 Programs Accredited',
  },
  {
    pid: '1-6651239',
    name: 'Gujarat Technological Institute of Advanced Studies',
    state: 'Gujarat',
    city: 'Ahmedabad',
    type: 'State University Department',
    approvedIntake: 540,
    accreditation: 'NAAC A Grade',
  },
  {
    pid: '1-5120938',
    name: 'Bengal College of Engineering & Cyber Sciences',
    state: 'West Bengal',
    city: 'Kolkata',
    type: 'Private-Self Financed',
    approvedIntake: 420,
    accreditation: 'NAAC A Grade',
  },
  {
    pid: '1-3891048',
    name: 'Telangana Institute of Technology & Applied Research',
    state: 'Telangana',
    city: 'Hyderabad',
    type: 'Private-Self Financed',
    approvedIntake: 660,
    accreditation: 'NBA & NAAC A+',
  },
];

export const FAQS_LIST = [
  {
    q: 'What is the mandatory Faculty-Student Ratio (FSR) for Undergraduate Engineering programs?',
    a: 'As per APH 2026-2027 Appendix 7, the mandatory Faculty-to-Student Ratio for UG Engineering & Technology is 1:20 (with Cadre ratio of 1 Professor : 2 Associate Professors : 6 Assistant Professors). For PG Engineering, the ratio is 1:15.',
  },
  {
    q: 'What are the minimum land norms for establishing a Technical Institution in Mega/Metro cities?',
    a: 'In Mega/Metro cities (such as Delhi NCR, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad), the land requirement is 1.5 to 2.5 Acres with permissible FSI/FAR compliance. In Rural areas, the required land is 7.5 contiguous unencumbered acres.',
  },
  {
    q: 'What is the consequence of an expired Fire Safety NOC during Scrutiny?',
    a: 'Fire & Safety NOC is a non-negotiable statutory requirement under APH Clause 1.6(c). If expired or deficient, the application cannot receive unconditional EoA or intake expansion and will be referred to the Standing Hearing Committee (SHC) or issued a 7-day compliance notice.',
  },
  {
    q: 'How is the Joint Fixed Deposit (FDR) created and what is its validity?',
    a: 'Joint FDR must be established in a scheduled commercial bank jointly in the name of the "Member Secretary, AICTE" and the Principal/Chairman of the Trust for a minimum maturity period of 8 to 10 years.',
  },
  {
    q: 'Can an institution start emerging area courses like AI, Cyber Security, and Robotics?',
    a: 'Yes, institutions holding valid AICTE approval and NBA accreditation / NAAC score >= 3.01 can apply for Emerging Technology courses under Chapter II without exceeding the maximum institutional intake ceiling.',
  },
];
