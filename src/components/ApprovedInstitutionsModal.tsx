/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { APPROVED_INSTITUTIONS_DATABASE } from '../data/portalAnnouncements';
import { Search, Building, MapPin, Award, X, Download } from 'lucide-react';

export const ApprovedInstitutionsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');

  if (!isOpen) return null;

  const states = ['all', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Delhi NCR', 'Tamil Nadu', 'Gujarat', 'West Bengal', 'Telangana'];

  const filtered = APPROVED_INSTITUTIONS_DATABASE.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.pid.includes(searchTerm) ||
      inst.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = stateFilter === 'all' || inst.state === stateFilter;
    return matchesSearch && matchesState;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in">
        {/* Header */}
        <div className="bg-[#0b2545] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-bold text-base">AICTE Approved Universities & Institutions Directory</h3>
              <p className="text-xs text-slate-300">National Technical Approval Register 2026-2027</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Institution Name, Permanent ID (PID), or City..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All States & UTs' : s}
              </option>
            ))}
          </select>
        </div>

        {/* Institution Cards Grid */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          <div className="text-xs text-slate-500 font-semibold mb-2">
            Showing {filtered.length} Approved Technical Institutions
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((inst) => (
              <div
                key={inst.pid}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-amber-400 transition-colors"
              >
                <div className="flex justify-between items-start text-xs font-mono text-slate-500 mb-1">
                  <span>PID: {inst.pid}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-semibold text-[10px] px-1.5 py-0.5 rounded">
                    Approved EoA
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                  {inst.name}
                </h4>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{inst.city}, {inst.state}</span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Intake: {inst.approvedIntake} Seats</span>
                  <span className="text-amber-800 font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>{inst.accreditation}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">Government of India · Data synced with Approval Portal</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                alert('Exporting verified institutions database as CSV.');
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
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
    </div>
  );
};
