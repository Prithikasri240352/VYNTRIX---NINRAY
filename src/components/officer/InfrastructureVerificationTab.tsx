/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MapPin,
  Layers,
  Calculator,
  Compass,
  FileText,
  Camera,
  ExternalLink,
  ShieldCheck,
  Flame,
  Award,
  Users,
  Eye,
  Plus,
  Save,
  CheckSquare,
  Square
} from 'lucide-react';
import { InstitutionApplication } from '../../types/aicte';

interface InfrastructureVerificationTabProps {
  institution: InstitutionApplication;
  onOpenClarificationModal: (docId?: string, query?: string) => void;
  onOpenDeficiencyModal: (prefill?: { title: string; aphClause: string; category: string; description: string }) => void;
}

interface InfraCategory {
  id: string;
  name: string;
  aphClause: string;
  status: 'Compliant' | 'Deficient' | 'Observation';
  observed: string;
  required: string;
  details: string;
  evidenceType: string;
  sampleExifGps: string;
  inspectionPassed: boolean;
}

export const InfrastructureVerificationTab: React.FC<InfrastructureVerificationTabProps> = ({
  institution,
  onOpenClarificationModal,
  onOpenDeficiencyModal
}) => {
  // Dynamic Space vs Intake interactive calculator
  const [calcIntake, setCalcIntake] = useState<number>(institution.totalApprovedIntake || 780);
  const [calcEngineeringProgram, setCalcEngineeringProgram] = useState<string>('UG Engineering & Technology');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [officerNotes, setOfficerNotes] = useState<string>(
    'Field inspection by SRO Chennai team verified physical campus boundary and instructional carpet area. Classroom acoustics and laboratory safety features are in good order.'
  );
  const [savedNotesNotification, setSavedNotesNotification] = useState(false);

  // Computed requirement norms for calculator
  const studentsEnrolled = calcIntake * 4; // 4 year degree
  const reqClassrooms = Math.ceil(calcIntake / 60) * 1.5; // AICTE classroom multiplier
  const reqClassroomAreaSqM = reqClassrooms * 66; // 66 sq.m standard classroom
  const reqLabAreaSqM = Math.ceil(calcIntake / 60) * 4 * 88; // 88 sq.m standard laboratory
  const reqAdminAreaSqM = 1200; // minimum administrative carpet area
  const reqLibraryAreaSqM = 400 + (studentsEnrolled > 1000 ? 200 : 0);
  const totalCalculatedReqSqM = reqClassroomAreaSqM + reqLabAreaSqM + reqAdminAreaSqM + reqLibraryAreaSqM + 1500; // amenities
  const spaceComplianceStatus = institution.builtUpAreaSqM >= totalCalculatedReqSqM;

  const [categories, setCategories] = useState<InfraCategory[]>([
    {
      id: 'land',
      name: '1. Land Area, FSI & Contiguity',
      aphClause: 'APH 2024–27 Clause 4.1.1',
      status: institution.landAreaAcres >= institution.requiredLandAcres ? 'Compliant' : 'Deficient',
      observed: `${institution.landAreaAcres} Acres (Single Contiguous Parcel)`,
      required: `${institution.requiredLandAcres} Acres (Rural/Urban Zone)`,
      details: `Patta and survey records in ${institution.district} verified. Contiguous perimeter with pucca boundary wall (>1.8m height) and 12m wide access road.`,
      evidenceType: 'Revenue Patta & Registered Title Deed No. 1824/2008',
      sampleExifGps: `${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E`,
      inspectionPassed: true
    },
    {
      id: 'occupancy',
      name: '2. Occupancy & Form D / Completion',
      aphClause: 'APH 2024–27 Clause 4.1.3',
      status: 'Compliant',
      observed: `${institution.builtUpAreaSqM.toLocaleString()} sq.m Certified Carpet Area`,
      required: `${institution.requiredBuiltUpAreaSqM.toLocaleString()} sq.m Minimum Built-up Area`,
      details: 'Form D issued by Competent Local Authority (Directorate of Town and Country Planning - DTCP) covering Administrative, Academic, and Workshop blocks.',
      evidenceType: 'DTCP Sanction Order & Approved Blueprint Plan',
      sampleExifGps: `${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E`,
      inspectionPassed: true
    },
    {
      id: 'structural',
      name: '3. Structural Stability & Building Age',
      aphClause: 'APH 2024–27 Clause 4.1.4',
      status: 'Compliant',
      observed: 'Blocks constructed 2004–2018 (Max Age: 22 yrs)',
      required: 'Certificate mandatory if age > 30 yrs or vertical expansion',
      details: 'Structural Soundness Certificate issued by PWD Empanelled Class-1A Chartered Structural Engineer. Certified for Seismic Zone III (Tamil Nadu) with 5-year fitness warranty.',
      evidenceType: 'Chartered Structural Stability Certificate No. CS/2024/771',
      sampleExifGps: `${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E`,
      inspectionPassed: true
    },
    {
      id: 'classrooms',
      name: '4. Instructional Area — Classrooms & Smart ICT',
      aphClause: 'APH 2024–27 Clause 4.2.1',
      status: 'Compliant',
      observed: '48 Classrooms (avg 68 sq.m each), 32 equipped with Smart Interactive Panels',
      required: 'Min 42 Classrooms (66 sq.m each) for current approved intake',
      details: 'All classrooms well-ventilated with dual doors, ceiling-mounted projectors, gigabit LAN connectivity, and acoustic wall paneling in seminar halls.',
      evidenceType: 'Geotagged Classroom Photographs & Floor Space Register',
      sampleExifGps: `${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E`,
      inspectionPassed: true
    },
    {
      id: 'labs',
      name: '5. Instructional Area — Laboratories & Workshops',
      aphClause: 'APH 2024–27 Clause 4.2.2',
      status: 'Compliant',
      observed: '56 Specialized Labs & Central Machine Workshop (Total: 6,420 sq.m)',
      required: 'Min 48 Labs (min 66–88 sq.m per lab division)',
      details: 'Specialized laboratories for AI/DS, Robotics, IoT, Power Systems, CAD/CAM, and Material Testing. Safety showers and emergency eyewash stations verified functional.',
      evidenceType: 'Lab Layout Blueprint & Equipment Density Register',
      sampleExifGps: `${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E`,
      inspectionPassed: true
    },
    {
      id: 'equipment',
      name: '6. Equipment Inventory & PFMS Register',
      aphClause: 'APH 2024–27 Clause 4.2.5',
      status: 'Compliant',
      observed: '1,420 Networked Terminals, 1:1 Student terminal ratio in core computing labs',
      required: '1:4 Student-Computer Ratio for UG Engineering',
      details: 'Central stock registers verified. Major capital equipment (CNC Lathe, UTM 100T, Vector Network Analyzer) cross-referenced with purchase invoices and calibration certificates.',
      evidenceType: 'Audited Equipment Stock Register & GST Tax Invoices',
      sampleExifGps: `${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E`,
      inspectionPassed: true
    },
    {
      id: 'library',
      name: '7. Central Library & Digital Subscriptions',
      aphClause: 'APH 2024–27 Clause 4.3.1',
      status: 'Compliant',
      observed: '48,600 Volumes, 8,200 Titles, IEEE & Springer Digital Access',
      required: 'Min 25,000 Volumes & National Digital Library (NDLI) Institutional Membership',
      details: 'Automated RFID circulation kiosk, dedicated multimedia lab with 40 e-terminals, subscription to IEEE Xplore, ScienceDirect, and DELNET.',
      evidenceType: 'Library Accession Register & IEEE Subscription Invoices',
      sampleExifGps: `${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E`,
      inspectionPassed: true
    },
    {
      id: 'admin',
      name: '8. Administrative & Faculty Offices',
      aphClause: 'APH 2024–27 Clause 4.3.2',
      status: 'Compliant',
      observed: '1,850 sq.m dedicated Administrative carpet area',
      required: 'Min 1,200 sq.m for Engineering Institutions',
      details: 'Individual cabins for Principal, Dean, HODs, Exam Cell, Placement Cell, Board Room, and faculty cubicles with desktop systems and high-speed Wi-Fi.',
      evidenceType: 'Administrative Wing Plan & Room Allocation Schedule',
      sampleExifGps: `${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E`,
      inspectionPassed: true
    },
    {
      id: 'amenities',
      name: '9. Amenities, Sanitation & Barrier-Free Access',
      aphClause: 'APH 2024–27 Clause 4.4.1 (RPwD Act 2016 Compliance)',
      status: 'Compliant',
      observed: 'Disabled ramps (1:12 slope), Braille tactile lifts in all blocks, 60+ RO water points',
      required: 'Barrier-free environment, accessible toilets, cafeteria, medical room',
      details: 'Full compliance with Rights of Persons with Disabilities Act (RPwD 2016). Wheelchair accessible campus routes, motorized battery buggies, dedicated sick bay with visiting medical practitioner.',
      evidenceType: 'Barrier-free Audit Certificate & Photos',
      sampleExifGps: `${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E`,
      inspectionPassed: true
    },
    {
      id: 'fire',
      name: '10. Fire Safety & Emergency Preparedness',
      aphClause: 'APH 2024–27 Clause 4.1.5 & NBC 2016 Part IV',
      status: 'Observation',
      observed: 'Wet riser system, 100kL underground static fire sump, 4 external fire escapes',
      required: 'Valid Fire NOC covering academic session AY 2026-27',
      details: 'Fire safety system fully operational. Notice: TNFRS annual renewal inspection fee receipt submitted; formal renewal certificate pending issuance by Fire Station Officer.',
      evidenceType: 'TNFRS NOC No. 412/MSB/2023 & Renewal Payment Challan',
      sampleExifGps: `${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E`,
      inspectionPassed: true
    },
    {
      id: 'cadre',
      name: '11. Faculty Cadre 1:2:6 & Student-Faculty Ratio',
      aphClause: 'APH 2024–27 Chapter VII & AICTE Regulations',
      status: institution.facultyCadre.cadreRatioCompliant ? 'Compliant' : 'Deficient',
      observed: `Cadre: ${institution.facultyCadre.professorsAvailable} Prof : ${institution.facultyCadre.assocProfAvailable} Assoc : ${institution.facultyCadre.asstProfAvailable} Asst (SFR ~ 1:18.4)`,
      required: '1:2:6 Cadre Ratio & 1:20 SFR (1:15 for NBA accredited programs)',
      details: `Principal Dr. ${institution.facultyCadre.principalName || 'Principal'} holds verified Ph.D with ${institution.facultyCadre.principalExperienceYrs || 18} yrs teaching/research experience. Form 16 / ECS salary statements reconciled.`,
      evidenceType: 'AICTE Faculty Roster & Bank ECS Salary Scroll',
      sampleExifGps: `${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E`,
      inspectionPassed: institution.facultyCadre.cadreRatioCompliant
    },
    {
      id: 'security',
      name: '12. Joint FDR & Statutory Financial Reserve',
      aphClause: 'APH 2024–27 Clause 1.7 & Annexure 1',
      status: institution.jointFdrAmountLakhs >= institution.requiredJointFdrLakhs ? 'Compliant' : 'Deficient',
      observed: `Rs. ${institution.jointFdrAmountLakhs} Lakhs FDR pledged to Regional Officer, SRO AICTE`,
      required: `Rs. ${institution.requiredJointFdrLakhs} Lakhs for Self-Financing Technical Institution`,
      details: 'Fixed Deposit Receipt pledged with Regional Officer, AICTE, SRO Chennai in State Bank of India. Verified lien-free with auto-renewal clause intact.',
      evidenceType: 'Joint FDR Confirmation Certificate from Bank Branch Manager',
      sampleExifGps: `${institution.campusCoordinates?.latitude || '13.3564'}°N, ${institution.campusCoordinates?.longitude || '80.1432'}°E`,
      inspectionPassed: true
    }
  ]);

  const handleToggleInspection = (index: number) => {
    setCategories((prev) =>
      prev.map((cat, idx) => (idx === index ? { ...cat, inspectionPassed: !cat.inspectionPassed } : cat))
    );
  };

  const handleSaveNotes = () => {
    setSavedNotesNotification(true);
    setTimeout(() => setSavedNotesNotification(false), 3000);
  };

  const activeCat = categories[activeCategoryIndex];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                Statutory Physical & Academic Infrastructure
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                12 Categories Assessed
              </span>
              <span className="text-xs text-slate-400 font-mono">
                APH 2024–27 Norms
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Infrastructure Verification Workspace
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Detailed inspection workspace for <span className="text-white font-medium">{institution.institutionName}</span>. Compares observed land, built-up carpet area, equipment density, faculty cadre, and safety systems directly against AICTE Approval Process Handbook norms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenClarificationModal(undefined, 'Regarding physical infrastructure norms: Please submit updated laboratory equipment invoices and safety logs.')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              Issue Infrastructure Query
            </button>
            <button
              onClick={() => onOpenDeficiencyModal({
                title: 'Infrastructure Deficit under APH 2024-27',
                aphClause: 'APH 2024-27 Clause 4.1',
                category: 'Land & Infrastructure',
                description: 'Carpet area or equipment shortfall noted during officer scrutiny.'
              })}
              className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-semibold transition"
            >
              Flag Deficiency
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Approved Intake vs Space Calculator Section */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 border border-blue-800/40 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Dynamic Space vs. Approved Intake Calculator (APH Chapter IV Formula)
            </h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            spaceComplianceStatus
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
              : 'bg-rose-950/80 text-rose-400 border-rose-800/80'
          }`}>
            {spaceComplianceStatus ? 'Carpet Area Sufficient' : 'Carpet Area Deficient'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">
              Annual Sanctioned Intake (Students/Year)
            </label>
            <input
              type="number"
              value={calcIntake}
              onChange={(e) => setCalcIntake(Math.max(60, Number(e.target.value)))}
              step="60"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Estimated Total Campus Enrolment: {studentsEnrolled} students
            </span>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">
              Program Category
            </label>
            <select
              value={calcEngineeringProgram}
              onChange={(e) => setCalcEngineeringProgram(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-1 focus:ring-blue-500"
            >
              <option value="UG Engineering & Technology">UG Engineering & Technology</option>
              <option value="PG Engineering (M.E. / M.Tech)">PG Engineering (M.Tech)</option>
              <option value="Management (MBA)">Management (MBA)</option>
              <option value="Computer Applications (MCA)">Computer Applications (MCA)</option>
            </select>
            <span className="text-[10px] text-slate-400 block mt-1">
              Standard: 66 sq.m/classroom, 88 sq.m/lab
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Computed Norm Requirement</span>
            <div className="text-base font-bold text-amber-300 mt-0.5">
              {totalCalculatedReqSqM.toLocaleString()} sq.m
            </div>
            <span className="text-[10px] text-slate-400">
              {reqClassrooms} Classrooms + Labs + Admin + Library
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Actual Certified Built-up Area</span>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              {institution.builtUpAreaSqM.toLocaleString()} sq.m
            </div>
            <span className="text-[10px] text-emerald-400/80 font-medium">
              Surplus: +{(institution.builtUpAreaSqM - totalCalculatedReqSqM).toLocaleString()} sq.m
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout: Left Category Selector, Right Deep Evidence & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 12 Category List (5 Cols) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between pb-1 px-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              12 Inspection Norms
            </span>
            <span className="text-xs text-slate-400">Select to inspect evidence</span>
          </div>

          <div className="space-y-2">
            {categories.map((cat, idx) => {
              const isSelected = activeCategoryIndex === idx;
              return (
                <div
                  key={cat.id}
                  onClick={() => setActiveCategoryIndex(idx)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/60 border-blue-500 shadow-md ring-1 ring-blue-500/40'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white leading-snug">
                        {cat.name}
                      </h4>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {cat.aphClause}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          cat.status === 'Compliant'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                            : cat.status === 'Observation'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                            : 'bg-rose-950/80 text-rose-400 border-rose-800/80'
                        }`}
                      >
                        {cat.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-300 flex items-center justify-between">
                    <span className="truncate pr-2">Observed: {cat.observed}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleInspection(idx);
                      }}
                      className="text-slate-400 hover:text-white"
                      title="Toggle inspection verification checklist"
                    >
                      {cat.inspectionPassed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Evidence Viewer & Officer Observation Logger (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Selected Category Evidence Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-semibold text-blue-400">
                  {activeCat.aphClause}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {activeCat.name}
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  activeCat.status === 'Compliant'
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                    : activeCat.status === 'Observation'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                    : 'bg-rose-950/80 text-rose-400 border-rose-800/80'
                }`}
              >
                {activeCat.status}
              </span>
            </div>

            {/* Comparison Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium block">Observed Metric on Dossier</span>
                <span className="text-sm font-bold text-white mt-1 block">
                  {activeCat.observed}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium block">AICTE APH Statutory Norm</span>
                <span className="text-sm font-bold text-amber-300 mt-1 block">
                  {activeCat.required}
                </span>
              </div>
            </div>

            {/* Analysis details */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-1">
                Scrutiny Verification Summary
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                {activeCat.details}
              </p>
            </div>

            {/* Document and Photographic Evidence */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300">
                Attached Statutory Evidence & Geotag Details
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium block">{activeCat.evidenceType}</span>
                    <span className="text-[10px] text-slate-400">Digitally Verified & Watermarked</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeCat.sampleExifGps}</span>
                </div>
              </div>
            </div>

            {/* Inspection Checklist Toggle */}
            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={activeCat.inspectionPassed}
                  onChange={() => handleToggleInspection(activeCategoryIndex)}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>Certified by Scrutiny Officer as physically compliant on ground</span>
              </label>
              <button
                type="button"
                onClick={() => onOpenClarificationModal(undefined, `Regarding ${activeCat.name}: Please provide additional supporting documentary evidence.`)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
              >
                Request Clarification
              </button>
            </div>
          </div>

          {/* Officer Field Observation Logger */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Officer Inspection Notes & Standing Hearing Observations
              </h3>
              {savedNotesNotification && (
                <span className="text-xs text-emerald-400 font-medium animate-in fade-in">
                  Observations Saved!
                </span>
              )}
            </div>

            <textarea
              rows={4}
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              placeholder="Record official findings regarding physical infrastructure, fire escape capacity, laboratory equipment status, and spatial compliance..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Notes are appended to the official Nirnay EOA Verification Report (PDF).
              </span>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Observations</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
