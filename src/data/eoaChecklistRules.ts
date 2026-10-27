/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EoaChecklistRule {
  id: string;
  aphClauseRef: string;
  category: 'Legal & Affidavits' | 'Statutory Approvals & NOCs' | 'Land & Building Norms' | 'Faculty & Academic' | 'Finance & FDR' | 'Environment & Safety';
  documentName: string;
  requirementType: 'Mandatory' | 'Conditionally Required' | 'Supporting Evidence';
  applicabilityCondition: string;
  description: string;
  keyVerificationPoints: string[];
  mandatoryFor: string[];
}

export const EOA_CHECKLIST_RULES: EoaChecklistRule[] = [
  {
    id: 'chk-affidavit-2',
    aphClauseRef: 'APH 2024–27 Chapter II / Annexure 2, Clause 2.1',
    category: 'Legal & Affidavits',
    documentName: 'Affidavit 2 (Declaration by Head of Institution & Trust)',
    requirementType: 'Mandatory',
    applicabilityCondition: 'Mandatory for all existing institutions seeking Extension of Approval (EOA)',
    description: 'Sworn affidavit on Rs. 100 non-judicial stamp paper attested by First Class Judicial Magistrate or Public Notary affirming adherence to AICTE norms, anti-ragging, and truthfulness of portal submissions.',
    keyVerificationPoints: [
      'Stamp paper value >= Rs. 100 & purchase date within 90 days of application',
      'Notary registration number, stamp, and seal legible',
      'Signatures of Chairman/Secretary of Trust and Principal match official records',
      'Specific affirmation of no excess admission beyond approved intake'
    ],
    mandatoryFor: ['All Institutions']
  },
  {
    id: 'chk-fee-receipt',
    aphClauseRef: 'APH 2024–27 Chapter I, Clause 1.8 & Annexure 2',
    category: 'Finance & FDR',
    documentName: 'AICTE EOA Scrutiny & Regulatory Processing Fee Receipt',
    requirementType: 'Mandatory',
    applicabilityCondition: 'Mandatory for all institutions, fee structure determined by total approved intake',
    description: 'Official digital payment confirmation receipt generated through AICTE web portal payment gateway showing transaction reference number and bank clearance.',
    keyVerificationPoints: [
      'Transaction ID verifiable on AICTE PG reconciliation server',
      'Amount matches fee schedule for approved total intake divisions',
      'Payment date strictly prior to portal closure deadline'
    ],
    mandatoryFor: ['All Institutions']
  },
  {
    id: 'chk-occupancy-cert',
    aphClauseRef: 'APH 2024–27 Chapter IV, Clause 4.1.3 & Annexure 2',
    category: 'Land & Building Norms',
    documentName: 'Certificate of Occupancy / Form D / Completion Certificate',
    requirementType: 'Mandatory',
    applicabilityCondition: 'Mandatory for all institutions; must cover all instructional and administrative blocks',
    description: 'Statutory Occupancy Certificate / Form D issued by the Competent Local Government Authority (e.g. DTCP, CMDA, Commissioner of Municipal Corporation, PWD).',
    keyVerificationPoints: [
      'Issuing authority is an authorised Town Planning / Local Body officer',
      'Survey Numbers and Patta match Land Title Deed',
      'Total built-up carpet area covered matches or exceeds required built-up area',
      'Valid for educational institutional usage without pending stop-work notices'
    ],
    mandatoryFor: ['All Institutions']
  },
  {
    id: 'chk-fire-noc',
    aphClauseRef: 'APH 2024–27 Chapter IV, Clause 4.1.5 & National Building Code (NBC) Part 4',
    category: 'Environment & Safety',
    documentName: 'Fire & Rescue Services No Objection Certificate (Fire NOC)',
    requirementType: 'Mandatory',
    applicabilityCondition: 'Mandatory for all institutions; must be legally valid for the academic year in evaluation',
    description: 'Valid Fire Safety Certificate / Compliance NOC issued by Tamil Nadu Fire and Rescue Services Department (TNFRS) certifying operational firefighting equipment, hydrant network, and escape staircases.',
    keyVerificationPoints: [
      'Validity date covers the ongoing academic session (AY 2026-27)',
      'Specific institutional blocks and floor levels explicitly enumerated',
      'Adequate setback distance around building for fire tender movement',
      'Functional wet riser system, yard hydrants, and smoke detection'
    ],
    mandatoryFor: ['All Institutions']
  },
  {
    id: 'chk-faculty-cadre',
    aphClauseRef: 'APH 2024–27 Chapter VII / AICTE Regulations on Pay Scales & Cadre Ratio',
    category: 'Faculty & Academic',
    documentName: 'Faculty Cadre Matrix, Qualifications & Salary Disbursement Record',
    requirementType: 'Mandatory',
    applicabilityCondition: 'Mandatory for all institutions offering AICTE-approved engineering and technical courses',
    description: 'Certified faculty roster detailing designated cadre (Professor : Associate Professor : Assistant Professor in 1:2:6 ratio), minimum 1:20 SFR for engineering, Ph.D credentials, and bank statements showing 7th CPC / ECS salary credits.',
    keyVerificationPoints: [
      'Cadre ratio complies with 1:2:6 (Prof : Assoc Prof : Asst Prof) within allowed tolerance',
      'Overall Student-to-Faculty Ratio (SFR) complies with 1:20 or 1:15 based on NBA accreditation',
      'Principal / Director satisfies AICTE eligibility (Ph.D + 15 years experience, min 8 yrs post-PhD)',
      'Aadhaar / AICTE Faculty ID unique verification across institutions'
    ],
    mandatoryFor: ['All Institutions']
  },
  {
    id: 'chk-univ-affiliation',
    aphClauseRef: 'APH 2024–27 Chapter II, Clause 2.14',
    category: 'Statutory Approvals & NOCs',
    documentName: 'Affiliating University Provisional / Permanent Affiliation Order',
    requirementType: 'Mandatory',
    applicabilityCondition: 'Mandatory for non-autonomous and affiliated institutions (e.g. Anna University Chennai)',
    description: 'Official affiliation order or letter of extension of affiliation issued by the designated state affiliating university confirming sanction of courses and student admission quotas.',
    keyVerificationPoints: [
      'Affiliating university is recognized under UGC Act (e.g., Anna University)',
      'Academic year matches applied EOA year (2026-27)',
      'Branch-wise sanctioned intake matches AICTE application request',
      'No pending university de-affiliation or conditional suspension clause'
    ],
    mandatoryFor: ['Affiliated Institutions', 'Govt Aided Non-University']
  },
  {
    id: 'chk-structural-stability',
    aphClauseRef: 'APH 2024–27 Chapter IV, Clause 4.1.4',
    category: 'Land & Building Norms',
    documentName: 'Structural Stability Certificate (Panel Engineer / PWD Empanelled)',
    requirementType: 'Conditionally Required',
    applicabilityCondition: 'Mandatory if institution buildings are older than 30 years, or if structural additions/vertical expansions were executed',
    description: 'Certificate issued by a Government Empanelled Structural Engineer or PWD certified Class-1A engineer certifying load-bearing fitness, seismic safety (Zone III for TN), and sound construction.',
    keyVerificationPoints: [
      'Engineer license valid and empanelled with District Collectorate / PWD',
      'Building age and physical inspection date clearly stamped',
      'Structural fitness period specifies validity duration (typically 3-5 years)',
      'Specific mention of seismic zone compliance (Zone II/III for Tamil Nadu)'
    ],
    mandatoryFor: ['Institutions >30 years', 'Vertical expansion cases']
  },
  {
    id: 'chk-joint-fdr',
    aphClauseRef: 'APH 2024–27 Chapter I, Clause 1.7 & Annexure 1',
    category: 'Finance & FDR',
    documentName: 'Joint Fixed Deposit Receipt (FDR) with AICTE Regional Officer',
    requirementType: 'Conditionally Required',
    applicabilityCondition: 'Mandatory for Self-Financing Institutions; Exempted for 100% Government and Central University institutions',
    description: 'Fixed Deposit Receipt pledged in joint name of the Society/Trust and Regional Officer, AICTE (Southern Regional Office, Chennai) for the stipulated security corpus amount.',
    keyVerificationPoints: [
      'Joint name format: "Regional Officer, AICTE, SRO Chennai & [Trust Name]"',
      'FDR corpus amount satisfies minimum threshold (Rs. 100 Lakhs for Engineering Self-Financing)',
      'Scheduled Commercial Bank with lien-free verification certificate',
      'Maturity period minimum 10 years or auto-renewal pledge confirmed by branch manager'
    ],
    mandatoryFor: ['Self-Financing Institutions']
  },
  {
    id: 'chk-pollution-cto',
    aphClauseRef: 'Water (Prevention & Control of Pollution) Act 1974 & Air Act 1981 / APH Clause 4.1.8',
    category: 'Environment & Safety',
    documentName: 'TNPCB Consent to Operate (CTO - Water & Air)',
    requirementType: 'Conditionally Required',
    applicabilityCondition: 'Mandatory for institutions operating chemical engineering laboratories, heavy metal fabrication workshops, or centralized sewage treatment plants (STP)',
    description: 'Valid Consent to Operate order issued by Tamil Nadu Pollution Control Board (TNPCB) for wastewater treatment, zero liquid discharge or authorized sewage handling.',
    keyVerificationPoints: [
      'Valid under Section 25 of Water Act and Section 21 of Air Act',
      'STP capacity commensurate with total student + residential campus population',
      'Validity covers AY 2026-27 or pending timely renewal receipt attached'
    ],
    mandatoryFor: ['Institutions with Chemical/Biotech Labs', 'Campuses with STP']
  },
  {
    id: 'chk-geo-coordinates',
    aphClauseRef: 'APH 2024–27 Chapter IV, Clause 4.1.1 (Geotagging & Drone Survey)',
    category: 'Land & Building Norms',
    documentName: 'Campus Geo-coordinates, Survey Boundary & GIS Map Documentation',
    requirementType: 'Mandatory',
    applicabilityCondition: 'Mandatory for all institutions as per AICTE National Spatial Infrastructure directives',
    description: 'Certified survey map containing latitude/longitude perimeter coordinates, land area demarcation, continuous boundary wall proof, and open space clearances.',
    keyVerificationPoints: [
      'GPS coordinates match physical institution premises within 50-meter tolerance',
      'Boundary survey conducted by licensed surveyor / revenue department officer',
      'Proof of single contiguous plot or permitted split-campus within statutory distance',
      'Unobstructed access road width (minimum 30 feet / 9 meters)'
    ],
    mandatoryFor: ['All Institutions']
  },
  {
    id: 'chk-audited-accounts',
    aphClauseRef: 'APH 2024–27 Chapter II, Clause 2.19',
    category: 'Finance & FDR',
    documentName: 'Audited Financial Statements & Balance Sheet with UDIN',
    requirementType: 'Mandatory',
    applicabilityCondition: 'Mandatory for all institutions for the preceding three financial years',
    description: 'Complete audited balance sheet, income & expenditure account, and schedules certified by an active Fellow/Associate Chartered Accountant with mandatory Unique Document Identification Number (UDIN).',
    keyVerificationPoints: [
      'UDIN verified on ICAI portal without revocation',
      'Clear earmarking of laboratory equipment and library expenditure',
      'Depreciation schedule reflecting actual capital asset additions',
      'No adverse auditor qualification regarding financial going-concern'
    ],
    mandatoryFor: ['All Institutions']
  }
];
