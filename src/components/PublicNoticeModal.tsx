/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileText, Download, X, Calendar, ShieldCheck, Printer } from 'lucide-react';

export const PublicNoticeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in">
        {/* Header */}
        <div className="bg-[#0b2545] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-bold text-base">PUBLIC NOTICE FOR APPROVAL PROCESS 2026-2027</h3>
              <p className="text-xs text-slate-300">Ref: AICTE/AB/Approval/2026-27/01</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body formatted like official Govt gazette / notice */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-800">
          <div className="text-center pb-3 border-b border-slate-200">
            <div className="font-bold text-sm text-slate-950">ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</div>
            <div className="text-slate-600 font-medium">Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070</div>
            <div className="font-mono text-amber-800 mt-1">Date of Gazette Notification: 28th November, 2025</div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 font-medium">
            <strong>Sub:</strong> Inviting online applications for grant of Approval for Academic Year 2026-2027 for Technical Institutions under Regulation 2020 and Approval Process Handbook (APH 2026-2027).
          </div>

          <p>
            1. All existing Technical Institutions (Engineering and Technology, Pharmacy, Architecture, Planning, Applied Arts and Crafts, Design, Hotel Management and Catering Technology, Computer Applications, and Management) are hereby informed that the AICTE Approval Portal for the Academic Year 2026-2027 is active.
          </p>

          <p>
            2. Applications are invited for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>Grant of Extension of Approval (EoA) to existing Technical Institutions.</li>
            <li>Establishment of New Technical Institutions.</li>
            <li>Increase in Intake / Additional Course(s) in Emerging Areas (AI, ML, Robotics, Data Science).</li>
            <li>Change of Site / Location, Merger of Institutions under same Trust / Society.</li>
            <li>Introduction of Supernumerary seats for OCI / PIO / Children of Indian Workers in Gulf Countries (CIWG).</li>
          </ul>

          <p>
            3. <strong>Automated Scrutiny Compliance:</strong> For the Academic Year 2026-2027, the Council has implemented the <strong>Nirnay Automated Scrutiny & Deficiency Triage Engine</strong>. Documents submitted will undergo automated tamper-evidence checks, cadre calculation (1:2:6 ratio), and building area compliance prior to Standing Scrutiny Committee (SAC) hearings.
          </p>

          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Key Deadline Timelines:</span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div>Portal Closure: <strong>15th January, 2027</strong></div>
              <div>First SAC Scrutiny: <strong>15th February, 2027</strong></div>
              <div>Standing Hearing (SHC): <strong>25th March, 2027</strong></div>
              <div>Final EoA Gazette: <strong>30th April, 2027</strong></div>
            </div>
          </div>

          <div className="text-right pt-2 font-semibold text-slate-700">
            (Prof. Rajive Kumar)<br />
            Member Secretary, AICTE
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Notice</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded font-bold hover:bg-slate-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
