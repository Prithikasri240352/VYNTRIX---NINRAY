/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  BookOpen,
  GraduationCap,
  Award,
  Layers,
  ArrowRight,
  X,
  FileText
} from 'lucide-react';

interface InitiativeItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  bgGradient: string;
  description: string;
  eligibility: string;
  funding: string;
}

const INITIATIVES: InitiativeItem[] = [
  {
    id: 'apf',
    title: 'AICTE Productization Fellowship (APF)',
    subtitle: 'To Transform Innovative Ideas into Market-Ready Products',
    badge: 'Flagship R&D',
    bgGradient: 'from-purple-900 to-indigo-900 text-white',
    description: 'Provides mentorship, incubation support, and pre-seed productization grants to technical university graduates and faculty inventors converting lab prototypes into commercialized hardware and software.',
    eligibility: 'Faculty, PG/PhD Scholars, and Alumni of AICTE-approved institutions.',
    funding: 'Up to ₹ 10 Lakhs prototype acceleration fellowship per team.',
  },
  {
    id: 'rps',
    title: 'Research Promotion Scheme (RPS)',
    subtitle: 'Strengthening Research Infrastructure in Technical Colleges',
    badge: 'Research Grant',
    bgGradient: 'from-amber-600 to-orange-700 text-white',
    description: 'Promotes research in emerging fields of Engineering, Technology, Architecture, and Management by providing modern analytical instruments, computing clusters, and research consumables.',
    eligibility: 'Regular full-time faculty holding Ph.D. with proven citation track record.',
    funding: 'Grants up to ₹ 25 Lakhs per sponsored research project.',
  },
  {
    id: 'idealab',
    title: 'AICTE IDEA Lab Scheme',
    subtitle: 'Idea Development, Evaluation & Application Laboratories',
    badge: 'Hands-on STEM',
    bgGradient: 'from-emerald-800 to-teal-900 text-white',
    description: 'State-of-the-art 24/7 fabrication and prototyping spaces equipped with 3D printers, CNC laser cutters, electronics testing stations, and IoT workbenches on college campuses.',
    eligibility: 'Institutions with minimum 10 years standing and NBA accredited branches.',
    funding: '50% co-funding up to ₹ 55 Lakhs from AICTE per institution.',
  },
];

const ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Proposals are invited for ATAL Online Faculty Development Programmes (FDPs) for the Academic Year 2026-27',
    date: 'Published on 28 July, 2026',
    detail: 'AICTE Training and Learning (ATAL) Academy opens invitation for thrust area FDPs including AI, Quantum Technologies, Green Hydrogen, and Cyber Security.',
  },
  {
    id: 'ann-2',
    title: 'Admissions to Children of Indian Workers in Gulf Countries (CIWG)',
    date: 'Published on 28 September, 2026',
    detail: 'Norms for 5% supernumerary quota within the 15% NRI/OCI approved seats across all approved engineering and technical institutions.',
  },
  {
    id: 'ann-3',
    title: 'Observance of "Vigilance Awareness Week, 2026" from 28th October',
    date: 'Published on 16 October, 2026',
    detail: 'All institutional heads are required to administer the integrity pledge and organize preventive vigilance workshops.',
  },
  {
    id: 'ann-4',
    title: 'Vide the Online Advertisement No.Admin. (Estt.)/AICTE/05(03)/2025 regarding filling up vacancies of Advisor-I / Director',
    date: 'Published on 12 August, 2026',
    detail: 'Applications invited on deputation basis from eligible professors and government officers for leadership roles in Approval Bureau.',
  },
];

export const InitiativesSection: React.FC<{ onLaunchScrutiny: () => void }> = ({ onLaunchScrutiny }) => {
  const [selectedInitiative, setSelectedInitiative] = useState<InitiativeItem | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);
  const [activeBureau, setActiveBureau] = useState('Regulation');

  const bureaus = [
    'Regulation',
    'Training and Learning',
    'Policy & Academic Planning',
    'Administration',
    'Scholarships and Grants',
  ];

  return (
    <div className="w-full bg-slate-50 py-10 px-4 sm:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Newsroom / Announcements Grid matching image_49dec532_49dec532.png */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900 mb-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
              NewsRoom & Official Circulars
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Approval & Policy Updates
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ANNOUNCEMENTS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm inline-block mb-3">
                    {item.date}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-3 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setSelectedAnnouncement(item)}
                    className="w-full py-1.5 px-3 bg-[#ffaa00] hover:bg-[#e69900] text-slate-950 font-bold text-xs rounded shadow-2xs transition-colors cursor-pointer"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bureaus & Cells Strip */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold bg-[#0b2545] text-white px-3 py-1 rounded">
              AICTE Bureaus
            </span>
            <span className="text-xs text-slate-500">Key Administrative & Scrutiny Wings</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {bureaus.map((b) => (
              <button
                key={b}
                onClick={() => setActiveBureau(b)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  activeBureau === b
                    ? 'bg-[#0b2545] text-amber-300 font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {activeBureau === 'Regulation' && (
              <p>
                <strong>Approval & Regulation Bureau:</strong> Entrusted with formulating the annual Approval Process Handbook (APH), setting statutory Land and Built-up norms, conducting online scrutiny of engineering/polytechnic colleges, and managing Standing Hearing Committees (SHC).
              </p>
            )}
            {activeBureau === 'Training and Learning' && (
              <p>
                <strong>AICTE Training and Learning (ATAL) Academy:</strong> Drives continuous faculty professional development, offering nationwide Faculty Development Programmes (FDPs) in emerging technologies.
              </p>
            )}
            {activeBureau === 'Policy & Academic Planning' && (
              <p>
                <strong>Policy & Academic Planning Bureau:</strong> Designs the model AICTE curriculum, promotes interdisciplinary and outcome-based engineering education (OBE), and aligns norms with National Education Policy (NEP 2020).
              </p>
            )}
            {activeBureau === 'Administration' && (
              <p>
                <strong>Administration Bureau:</strong> Oversees establishment, personnel recruitment, legal cells, RTI compliance, and centralized infrastructure of AICTE headquarters and regional centers.
              </p>
            )}
            {activeBureau === 'Scholarships and Grants' && (
              <p>
                <strong>Scholarships & Financial Assistance Bureau:</strong> Disburses PG scholarships (GATE/CEED), Pragati and Saksham scholarships, and National Doctoral Fellowships (NDF).
              </p>
            )}
          </div>
        </div>

        {/* Initiatives & Schemes Showcase matching image_3774e568_3774e568.png */}
        <div>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Impact Schemes</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Initiatives & Schemes
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Catalyzing productization, applied research, and hands-on innovation across Indian academia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIATIVES.map((init) => (
              <div
                key={init.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all hover:shadow-md"
              >
                <div className={`p-6 bg-gradient-to-br ${init.bgGradient}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded text-white inline-block mb-3">
                    {init.badge}
                  </span>
                  <h4 className="text-base font-extrabold leading-tight text-white">
                    {init.title}
                  </h4>
                  <p className="text-xs text-white/90 mt-1">
                    {init.subtitle}
                  </p>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {init.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="text-slate-500 text-[11px]">
                      <strong>Grant Cap:</strong> {init.funding}
                    </div>
                    <button
                      onClick={() => setSelectedInitiative(init)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <span>Explore Guidelines & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Initiative Details Modal */}
      {selectedInitiative && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">{selectedInitiative.title}</h3>
              <button onClick={() => setSelectedInitiative(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-700">
              <p className="leading-relaxed">{selectedInitiative.description}</p>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong>Target Beneficiaries & Eligibility:</strong>
                <p className="text-slate-600 mt-1">{selectedInitiative.eligibility}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-950">
                <strong>Financial Assistance & Fellowship:</strong>
                <p className="mt-1">{selectedInitiative.funding}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button onClick={() => setSelectedInitiative(null)} className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded">Close</button>
              <button
                onClick={() => {
                  alert(`Application portal for ${selectedInitiative.title} opens along with Approval Cycle 2026-27.`);
                  setSelectedInitiative(null);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-[#ffaa00] text-slate-950 rounded"
              >
                Submit Institutional Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Details Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-[11px] font-bold text-amber-800">{selectedAnnouncement.date}</span>
              <button onClick={() => setSelectedAnnouncement(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-700">
              <h4 className="text-sm font-bold text-slate-900">{selectedAnnouncement.title}</h4>
              <p className="leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                {selectedAnnouncement.detail}
              </p>
              <div className="text-[11px] text-slate-500">
                Issued by: Approval & Regulation Bureau, AICTE New Delhi.
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button onClick={() => setSelectedAnnouncement(null)} className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded">Close</button>
              <button
                onClick={() => {
                  alert(`Downloading complete circular document (${selectedAnnouncement.id}).`);
                  setSelectedAnnouncement(null);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-amber-500 text-slate-950 rounded"
              >
                Download Signed Circular
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
