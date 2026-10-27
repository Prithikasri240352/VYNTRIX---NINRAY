/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ApplicationType =
  | 'Extension of Approval (EoA)'
  | 'New Technical Institution'
  | 'Increase in Intake'
  | 'Introduction of New Course / Division'
  | 'NRI / OCI Supernumerary Quota'
  | 'Change of Site / Location';

export type DeficiencySeverity = 'Critical' | 'Major' | 'Minor' | 'None';

export type DocumentVerificationStatus =
  | 'Verified against an authorised source'
  | 'Issuer-confirmed'
  | 'Matched to an authorised record'
  | 'AI-checked only'
  | 'Incomplete'
  | 'Expired'
  | 'Inconsistent'
  | 'Potential anomaly'
  | 'Unable to verify'
  | 'Requires human review';

export interface ExtractedFieldDetail {
  label: string;
  value: string;
  confidence: number; // 0 - 100
  isMatched: boolean;
  expectedValue?: string;
  discrepancyNote?: string;
}

export interface SubmissionGpsDetail {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  timestampUtc: string;
  capturedSuccessfully: boolean;
  source: 'Device Browser Geolocation API';
  ipApproximateCity?: string;
}

export interface ExifPhotoGpsDetail {
  latitude: number;
  longitude: number;
  timestampUtc?: string;
  cameraModel?: string;
  source: 'Embedded Image EXIF Tags';
}

export interface DocumentLocationEvidence {
  submissionGps?: SubmissionGpsDetail;
  exifPhotoGps?: ExifPhotoGpsDetail;
  distanceFromCampusKm?: number;
  distanceBetweenUploadAndPhotoKm?: number;
  locationPolicy: 'Mandatory' | 'Optional';
  captureStatus: 'Captured' | 'Permission Denied' | 'Unavailable' | 'Optional Skipped';
  verificationAssessment: 'On-Campus Verified' | 'Off-Campus Proximity Notice' | 'Location Not Provided';
  disclaimerText: string;
}

export interface VerificationDocument {
  id: string;
  name: string;
  category:
    | 'Land Title'
    | 'Fire NOC'
    | 'Building Plan'
    | 'Structural Stability'
    | 'Faculty Cadre List'
    | 'Joint FDR'
    | 'University Affiliation'
    | 'Pollution NOC';
  fileSize: string;
  uploadDate: string;
  academicYear: string;
  version: number;
  originalFormat: 'pdf' | 'png' | 'jpg' | 'jpeg';
  wasConvertedFromImage?: boolean;
  convertedPdfUrl?: string;
  status: DocumentVerificationStatus;
  authenticityScore: number; // 0 - 100
  digitalSignatureVerified: boolean;
  issuingAuthority: string;
  validUntil: string;
  aphClauseRef: string;
  extractedMeta: Record<string, string>;
  extractedFields?: Record<string, ExtractedFieldDetail>;
  locationEvidence?: DocumentLocationEvidence;
  reviewerNotes?: string;
  deficiencyFlag?: string;
  previousVersionId?: string;
}

export interface DeficiencyItem {
  id: string;
  category: 'Land & Infrastructure' | 'Faculty Cadre & Ratio' | 'Statutory NOCs' | 'Financial & FDR' | 'Amenities & Safety';
  title: string;
  aphClause: string;
  severity: DeficiencySeverity;
  observedValue: string;
  requiredValue: string;
  deficitDescription: string;
  remediationAction: string;
  isResolved?: boolean;
  resolutionDate?: string;
  resolutionRemarks?: string;
}

export interface ClarificationRequest {
  id: string;
  documentId?: string;
  documentName?: string;
  requestedAt: string;
  requestedBy: string;
  query: string;
  status: 'Awaiting Response' | 'Resubmitted / Clarified' | 'Accepted';
  response?: string;
  respondedAt?: string;
  resubmittedDocId?: string;
}

export interface FacultyCadreDetail {
  program: string;
  intake: number;
  totalStudents: number;
  professorsRequired: number;
  professorsAvailable: number;
  assocProfRequired: number;
  assocProfAvailable: number;
  asstProfRequired: number;
  asstProfAvailable: number;
  cadreRatioCompliant: boolean;
  principalEligible: boolean;
  principalName?: string;
  principalExperienceYrs?: number;
}

export interface InstitutionSpoc {
  name: string;
  designation: string;
  email: string;
  phone: string;
  officeLocation: string;
  isVerifiedSource: boolean;
  sourceLabel: string; // e.g. "AICTE Official Portal / SRO Chennai Verified Record" or "Demo Contact — Not an Official SPOC"
  lastUpdatedDate: string;
}

export interface CommunicationMessage {
  id: string;
  senderRole: 'officer' | 'institution';
  senderName: string;
  timestamp: string;
  text: string;
  attachments?: string[];
  readStatus?: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
}

export interface PreviousApprovalRecord {
  academicYear: string;
  approvalStatus: 'Approved (EoA)' | 'Approved with Intake Reduction' | 'Under Audit' | 'Unable to verify';
  approvedIntake: number;
  orderNumber: string;
  orderDate: string;
  verifiedSource: string;
  pdfUrl?: string;
}

export interface InstitutionApplication {
  id: string;
  applicationId: string;
  institutionName: string;
  shortName: string; // e.g. 'RMK', 'CIT', 'PSG'
  aliases: string[]; // ['RMK', 'RMKEC', 'RMK Engineering College']
  pid: string; // AICTE Permanent ID (e.g. '1-429810441')
  district: string; // Tamil Nadu District: 'Tiruvallur', 'Coimbatore', 'Chennai', etc.
  region?: string; // AICTE Southern Region (Tamil Nadu)
  state: 'Tamil Nadu';
  city: string;
  pincode: string;
  address: string;
  campusCoordinates?: {
    latitude: number;
    longitude: number;
    campusRadiusMeters?: number;
  };
  institutionType: 'Government' | 'Govt Aided Autonomous' | 'Self-Financing' | 'Deemed University Department';
  establishedYear: number;
  approvedProgrammes: string[];
  applicationType: ApplicationType;
  academicYear: string;
  totalApprovedIntake: number;
  proposedIntake: number;
  landAreaAcres: number;
  requiredLandAcres: number;
  builtUpAreaSqM: number;
  requiredBuiltUpAreaSqM: number;
  jointFdrAmountLakhs: number;
  requiredJointFdrLakhs: number;
  overallStatus:
    | 'Approved / Compliant'
    | 'Deficiency Issued'
    | 'Referred to SHC'
    | 'Under Automated Scrutiny'
    | 'Clarification Required'
    | 'Draft';
  complianceScore: number; // 0 - 100
  lastScrutinyDate: string;
  sourceOfVerification: string;
  lastUpdatedDate: string;
  spoc: InstitutionSpoc;
  facultyCadre: FacultyCadreDetail;
  documents: VerificationDocument[];
  previousSubmissions?: VerificationDocument[]; // for version comparison!
  previousApprovals: PreviousApprovalRecord[];
  deficiencies: DeficiencyItem[];
  clarificationRequests: ClarificationRequest[];
  messages: CommunicationMessage[];
  auditTrail: AuditLogEntry[];
}

export interface RegulatoryNotice {
  id: string;
  title: string;
  category: 'Gazette' | 'Circular' | 'Handbook' | 'Notice';
  date: string;
  publishedDateText: string;
  isNew: boolean;
  summary: string;
  downloadUrl?: string;
  fileSize?: string;
}

export interface SpocOfficer {
  id: string;
  name: string;
  role: string;
  bureau: string;
  email: string;
  phone: string;
  availability: string;
}

export interface AuthenticatedUser {
  type: 'officer' | 'institution';
  id: string;
  name: string;
  email: string;
  role: 'Verification Officer' | 'Administrator' | 'Read-only Reviewer' | 'Institution Authorised Signatory';
  institutionPid?: string;
  institutionId?: string;
  institutionName?: string;
}
