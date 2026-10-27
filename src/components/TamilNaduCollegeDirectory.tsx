/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Building2,
  MapPin,
  Award,
  Filter,
  ArrowUpDown,
  FileCheck2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { InstitutionApplication } from '../types/aicte';
import { CollegeSearchAutocomplete } from './CollegeSearchAutocomplete';

import { useLanguage } from '../i18n/LanguageContext';

interface TamilNaduCollegeDirectoryProps {
  institutions: InstitutionApplication[];
  onSelectInstitution: (institution: InstitutionApplication) => void;
  onOpenScrutinyForApp: (institution: InstitutionApplication) => void;
  isOfficer: boolean;
}

export const TamilNaduCollegeDirectory: React.FC<TamilNaduCollegeDirectoryProps> = ({
  institutions,
  onSelectInstitution,
  onOpenScrutinyForApp,
  isOfficer,
}) => {
  const { language, t, translateStatus } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'intake' | 'score' | 'established'>('name');

  // Extract unique districts from TN institutions
  const districts = useMemo(() => {
    const set = new Set<string>();
    institutions.forEach((inst) => set.add(inst.district));
    return ['all', ...Array.from(set).sort()];
  }, [institutions]);

  const institutionTypes = ['all', 'Government', 'Govt Aided Autonomous', 'Self-Financing', 'Deemed University Department'];

  const statusOptions = [
    'all',
    'Approved / Compliant',
    'Clarification Required',
    'Deficiency Issued',
    'Under Automated Scrutiny',
  ];

  // Abbreviation-aware, PID-aware, fuzzy-ranked search
  const filteredAndSorted = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = institutions.filter((inst) => {
      // District filter
      if (selectedDistrict !== 'all' && inst.district !== selectedDistrict) {
        return false;
      }
      // Type filter
      if (selectedType !== 'all' && inst.institutionType !== selectedType) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && inst.overallStatus !== selectedStatus) {
        return false;
      }

      if (!query) return true;

      // Check exact PID match
      if (inst.pid.toLowerCase().includes(query)) return true;

      // Check name match
      if (inst.institutionName.toLowerCase().includes(query)) return true;

      // Check shortName & aliases match (e.g. RMK, CIT, PSG, CEG, SSN)
      if (inst.shortName.toLowerCase().includes(query)) return true;
      if (inst.aliases.some((alias) => alias.toLowerCase().includes(query))) return true;

      // Check city or district
      if (inst.city.toLowerCase().includes(query)) return true;
      if (inst.district.toLowerCase().includes(query)) return true;

      // Check approved programmes
      if (inst.approvedProgrammes.some((prog) => prog.toLowerCase().includes(query))) return true;

      return false;
    });

    // Score / rank matches: exact PID & alias matches rank highest
    const ranked = filtered.map((inst) => {
      let matchScore = 0;
      if (query) {
        if (inst.pid.toLowerCase() === query) matchScore += 100;
        else if (inst.pid.toLowerCase().startsWith(query)) matchScore += 80;

        if (inst.shortName.toLowerCase() === query) matchScore += 90;
        else if (inst.shortName.toLowerCase().startsWith(query)) matchScore += 70;

        if (inst.aliases.some((a) => a.toLowerCase() === query)) matchScore += 85;

        if (inst.institutionName.toLowerCase() === query) matchScore += 80;
        else if (inst.institutionName.toLowerCase().startsWith(query)) matchScore += 60;
      }
      return { inst, matchScore };
    });

    ranked.sort((a, b) => {
      if (query && b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      if (sortBy === 'intake') {
        return b.inst.totalApprovedIntake - a.inst.totalApprovedIntake;
      }
      if (sortBy === 'score') {
        return b.inst.complianceScore - a.inst.complianceScore;
      }
      if (sortBy === 'established') {
        return a.inst.establishedYear - b.inst.establishedYear;
      }
      return a.inst.institutionName.localeCompare(b.inst.institutionName);
    });

    return ranked.map((r) => r.inst);
  }, [institutions, searchTerm, selectedDistrict, selectedType, selectedStatus, sortBy]);

  return (
    <div className="w-full font-poppins space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Tamil Nadu Directorate · AICTE Southern Regional Office (SRO Chennai)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('directoryTitle')}
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              {t('directorySubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-right">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                TN Directory Size
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {institutions.length} Colleges
              </div>
              <div className="text-[10px] text-emerald-700 font-medium">100% SRO Verified</div>
            </div>
          </div>
        </div>

        {/* Search Bar with Horizontal Autocomplete Dropdown */}
        <div className="mt-5 space-y-3">
          <CollegeSearchAutocomplete
            institutions={institutions}
            onSelectInstitution={(inst) => {
              onSelectInstitution(inst);
            }}
            placeholder="Search Tamil Nadu colleges: Type 'RMK', 'CIT', 'PSG', 'SSN', 'Coimbatore', '1-429810441'..."
          />

          {/* Quick Clickable Abbreviation Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Popular Searches:
            </span>
            {['RMK', 'CIT', 'PSG', 'CEG', 'SSN', 'TCE', 'GCT', 'SVCE', 'MIT', 'REC', 'KCT', 'SASTRA'].map(
              (abbr) => (
                <button
                  key={abbr}
                  onClick={() => setSearchTerm(abbr)}
                  className={`px-2.5 py-1 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                    searchTerm.toLowerCase() === abbr.toLowerCase()
                      ? 'bg-[#082245] text-amber-300 border-[#082245]'
                      : 'bg-slate-100 hover:bg-amber-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {abbr}
                </button>
              )
            )}
          </div>

          {/* Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                District (Tamil Nadu)
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-[#082245]"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d === 'all' ? 'All Districts' : d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Institution Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-[#082245]"
              >
                {institutionTypes.map((t) => (
                  <option key={t} value={t}>
                    {t === 'all' ? 'All Institution Types' : t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                EOA 2026-27 Scrutiny Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-[#082245]"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All Statuses' : s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Sort Directory By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-[#082245]"
              >
                <option value="name">College Name (A - Z)</option>
                <option value="score">Compliance Index (High to Low)</option>
                <option value="intake">Approved Intake (High to Low)</option>
                <option value="established">Established Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <strong>{filteredAndSorted.length}</strong> matching institutions in Tamil Nadu
        </div>
        <div className="text-[11px]">
          Source: AICTE SRO Chennai Regional Portal · Last Synced: 23 Oct 2026
        </div>
      </div>

      {/* Directory Cards Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Matching Tamil Nadu Institutions Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try searching by common abbreviations (e.g. RMK, CIT, PSG, CEG, SSN) or resetting your district/type filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDistrict('all');
              setSelectedType('all');
              setSelectedStatus('all');
            }}
            className="mt-4 px-4 py-2 bg-[#082245] text-amber-300 font-bold text-xs rounded-lg cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSorted.map((inst) => {
            const isApproved = inst.overallStatus === 'Approved / Compliant';
            const isClarification = inst.overallStatus === 'Clarification Required';

            return (
              <div
                key={inst.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-amber-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top line with PID and Status Badge */}
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
                    <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      PID: {inst.pid}
                    </span>

                    <span
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : isClarification
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isApproved ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      <span>{translateStatus(inst.overallStatus)}</span>
                    </span>
                  </div>

                  {/* College Name & Aliases */}
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#082245] leading-snug">
                    {inst.institutionName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded">
                      Alias: {inst.shortName}
                    </span>
                    <span>·</span>
                    <span>Est. {inst.establishedYear}</span>
                    <span>·</span>
                    <span className="text-slate-600 font-medium">{inst.institutionType}</span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-1.5 mt-2.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{inst.address}</span>
                  </div>

                  {/* Approved Intake & Program Snippet */}
                  <div className="mt-3.5 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 text-[11px]">Approved Intake:</span>{' '}
                      <strong className="text-slate-900 font-mono">{inst.totalApprovedIntake} Seats</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px]">Compliance:</span>{' '}
                      <strong
                        className={`font-mono ${
                          inst.complianceScore >= 95
                            ? 'text-emerald-700'
                            : inst.complianceScore >= 80
                            ? 'text-amber-700'
                            : 'text-red-700'
                        }`}
                      >
                        {inst.complianceScore}%
                      </strong>
                    </div>
                  </div>

                  {/* Program Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {inst.approvedProgrammes.slice(0, 3).map((prog, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded truncate max-w-[200px]"
                      >
                        {prog}
                      </span>
                    ))}
                    {inst.approvedProgrammes.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-medium self-center">
                        +{inst.approvedProgrammes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">
                    District: <strong>{inst.district}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectInstitution(inst)}
                      className="px-3 py-1.5 bg-[#082245] hover:bg-[#0d3469] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isOfficer ? 'Review Workspace' : 'View Application'}</span>
                    </button>

                    <button
                      onClick={() => onOpenScrutinyForApp(inst)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Automated SAC</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
