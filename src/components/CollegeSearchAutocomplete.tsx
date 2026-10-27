/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { InstitutionApplication } from '../types/aicte';

interface CollegeSearchAutocompleteProps {
  institutions: InstitutionApplication[];
  selectedInstitution?: InstitutionApplication | null;
  onSelectInstitution: (inst: InstitutionApplication) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const CollegeSearchAutocomplete: React.FC<CollegeSearchAutocompleteProps> = ({
  institutions,
  selectedInstitution,
  onSelectInstitution,
  placeholder = 'Search by Tamil Nadu college name, abbreviation (CIT, PSG, CEG, SSN), PID, or district...',
  className = '',
  autoFocus = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Debounce search term
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
      setIsLoading(false);
    }, 120);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter & rank matching colleges
  const matchingInstitutions = useMemo(() => {
    if (!debouncedTerm) return [];

    const query = debouncedTerm.toLowerCase();

    return [...institutions]
      .map((inst) => {
        let score = 0;

        const nameLower = inst.institutionName.toLowerCase();
        const shortLower = inst.shortName.toLowerCase();
        const pidLower = inst.pid.toLowerCase();
        const districtLower = inst.district.toLowerCase();

        // Exact match checks (highest rank)
        if (shortLower === query) score += 100;
        else if (inst.aliases.some((a) => a.toLowerCase() === query)) score += 95;
        else if (pidLower === query) score += 90;
        else if (shortLower.startsWith(query)) score += 80;
        else if (nameLower.startsWith(query)) score += 75;
        else if (inst.aliases.some((a) => a.toLowerCase().startsWith(query))) score += 70;
        else if (nameLower.includes(query)) score += 60;
        else if (pidLower.includes(query)) score += 50;
        else if (districtLower.startsWith(query)) score += 40;
        else if (districtLower.includes(query)) score += 30;

        return { inst, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.inst);
  }, [debouncedTerm, institutions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || matchingInstitutions.length === 0) {
      if (e.key === 'ArrowDown' && matchingInstitutions.length > 0) {
        setIsOpen(true);
        setActiveIndex(0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < matchingInstitutions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : matchingInstitutions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < matchingInstitutions.length) {
        handleSelect(matchingInstitutions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (inst: InstitutionApplication) => {
    onSelectInstitution(inst);
    setSearchTerm('');
    setIsOpen(false);
    setActiveIndex(-1);
  };

  // Helper to highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="text-amber-300 font-bold bg-amber-950/60 px-0.5 rounded">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full font-['Poppins'] ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-blue-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (searchTerm.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-slate-900 text-white text-xs sm:text-sm pl-10 pr-20 py-3 rounded-xl border border-slate-700/80 hover:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none placeholder-slate-400 transition-all shadow-md"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="college-search-dropdown"
        />

        {/* Clear Button or Quick Count */}
        <div className="absolute right-3 flex items-center gap-2">
          {isLoading && (
            <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          )}

          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700">
            TN AICTE
          </span>
        </div>
      </div>

      {/* Horizontal Autocomplete Dropdown Menu */}
      {isOpen && debouncedTerm && (
        <div
          id="college-search-dropdown"
          ref={listRef}
          className="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto divide-y divide-slate-850 animate-in fade-in slide-in-from-top-2 duration-150"
          role="listbox"
        >
          {matchingInstitutions.length > 0 ? (
            matchingInstitutions.map((inst, index) => {
              const isSelected = activeIndex === index;
              return (
                <div
                  key={inst.id}
                  onClick={() => handleSelect(inst)}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                  aria-selected={isSelected}
                  className={`px-4 py-2.5 transition-colors cursor-pointer select-none flex items-center justify-between gap-3 text-xs ${
                    isSelected
                      ? 'bg-blue-600/20 border-l-4 border-blue-500 pl-3'
                      : 'hover:bg-slate-900/80'
                  }`}
                >
                  {/* Left: Abbreviation Pill + Name (Flexible) */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/80 flex-shrink-0">
                      {highlightMatch(inst.shortName, debouncedTerm)}
                    </span>

                    <span className="font-semibold text-slate-100 truncate text-xs sm:text-[13px]" title={inst.institutionName}>
                      {highlightMatch(inst.institutionName, debouncedTerm)}
                    </span>
                  </div>

                  {/* Right: Metadata on Same Horizontal Row */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <span>PID:</span>
                      <strong className="text-slate-300">
                        {highlightMatch(inst.pid, debouncedTerm)}
                      </strong>
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/80">
                      {highlightMatch(inst.district, debouncedTerm)}
                    </span>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        inst.overallStatus === 'Approved / Compliant'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : inst.overallStatus === 'Clarification Required'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                      }`}
                    >
                      {inst.overallStatus === 'Approved / Compliant'
                        ? 'Approved'
                        : inst.overallStatus === 'Clarification Required'
                        ? 'Clarification'
                        : 'Deficiency'}
                    </span>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-5 text-center text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">
                No Tamil Nadu institutions matching "{debouncedTerm}"
              </div>
              <p className="text-[11px] text-slate-500">
                Try searching by abbreviation like <span className="text-blue-400 font-mono">CEG</span>, <span className="text-blue-400 font-mono">CIT</span>, <span className="text-blue-400 font-mono">PSG</span>, or district like <span className="text-blue-400 font-mono">Coimbatore</span> or <span className="text-blue-400 font-mono">Chennai</span>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
