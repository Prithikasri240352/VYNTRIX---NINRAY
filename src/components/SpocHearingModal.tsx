/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SPOC_OFFICERS } from '../data/portalAnnouncements';
import { InstitutionApplication } from '../types/aicte';
import { SAMPLE_APPLICATIONS } from '../data/mockInstitutions';
import {
  PhoneCall,
  Mail,
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  Building2,
  FileCheck2,
  UserCheck
} from 'lucide-react';

import { useLanguage } from '../i18n/LanguageContext';

interface SpocHearingViewProps {
  initialApp?: InstitutionApplication;
  isHindi?: boolean;
}

export const SpocHearingView: React.FC<SpocHearingViewProps> = ({
  initialApp,
}) => {
  const { language, t } = useLanguage();
  const [selectedApp, setSelectedApp] = useState<InstitutionApplication>(
    initialApp || SAMPLE_APPLICATIONS[0]
  );
  const [committeeType, setCommitteeType] = useState('Standing Hearing Committee (SHC)');
  const [hearingMode, setHearingMode] = useState<'virtual' | 'physical'>('virtual');
  const [preferredDate, setPreferredDate] = useState('2026-11-05');
  const [preferredSlot, setPreferredSlot] = useState('11:30 AM - 12:15 PM');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const handleBookHearing = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `SHC-HEAR-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    setBookingSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Institutional Facilitation & Standing Hearing Committee</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Single Point of Contact (SPOC) & Committee Hearings
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Official contact directory of AICTE Advisors, Regional Officers, and direct booking for Standing Hearing Committee (SHC).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Column: Official SPOC Officers Directory (Col 1-6) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-600" />
            <span>AICTE Approval Bureau Nodal Officers</span>
          </h3>

          <div className="space-y-3">
            {SPOC_OFFICERS.map((spoc) => (
              <div
                key={spoc.id}
                className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {spoc.name}
                    </h4>
                    <div className="text-xs text-amber-800 font-semibold mt-0.5">
                      {spoc.role}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {spoc.bureau}
                    </div>
                  </div>

                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                    Nodal Desk
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono font-bold text-slate-900">{spoc.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-[11px] truncate text-slate-600">{spoc.email}</span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>Visiting Hours: {spoc.availability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Hearing Booking Engine (Col 7-12) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-4">
            <Calendar className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Book Standing Hearing Committee (SHC) Slot
              </h3>
              <p className="text-[11px] text-slate-500">
                For institutions appealing or presenting remediation evidence
              </p>
            </div>
          </div>

          {bookingSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Hearing Slot Confirmed</h4>
              <p className="text-xs text-slate-600">
                Hearing Reference ID:{' '}
                <span className="font-mono font-bold text-amber-700 text-sm">{bookingRef}</span>
              </p>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <div><strong>Institution:</strong> {selectedApp.institutionName}</div>
                <div><strong>Committee:</strong> {committeeType}</div>
                <div><strong>Scheduled Date:</strong> {preferredDate} ({preferredSlot})</div>
                <div><strong>Mode:</strong> {hearingMode === 'virtual' ? 'Secure Virtual Video Room' : 'AICTE HQ, Nelson Mandela Marg, New Delhi'}</div>
                <div><strong>Presiding Advisor:</strong> Dr. Rameshwar Dayal (Approval Bureau)</div>
              </div>

              <div className="flex justify-center gap-3 pt-3">
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-bold"
                >
                  Book Another Hearing
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookHearing} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Institution Application
                </label>
                <select
                  value={selectedApp.id}
                  onChange={(e) => {
                    const found = SAMPLE_APPLICATIONS.find((a: InstitutionApplication) => a.id === e.target.value);
                    if (found) setSelectedApp(found);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  {SAMPLE_APPLICATIONS.map((a: InstitutionApplication) => (
                    <option key={a.id} value={a.id}>
                      {a.institutionName} ({a.applicationId}) - {a.overallStatus}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Forum / Committee Type
                </label>
                <select
                  value={committeeType}
                  onChange={(e) => setCommitteeType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option>Standing Hearing Committee (SHC) - Deficiency Review</option>
                  <option>Standing Scrutiny Committee (SAC) - Document Re-Verification</option>
                  <option>Standing Appellate Committee (SAC-Appeals) - Formal Order Appeal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Hearing Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min="2026-10-25"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option>10:00 AM - 10:45 AM</option>
                    <option>11:30 AM - 12:15 PM</option>
                    <option>02:30 PM - 03:15 PM</option>
                    <option>04:00 PM - 04:45 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hearing Attendance Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHearingMode('virtual')}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-colors flex items-center gap-2 ${
                      hearingMode === 'virtual'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="w-4 h-4 text-amber-600" />
                    <span>Virtual Video Conference</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHearingMode('physical')}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-colors flex items-center gap-2 ${
                      hearingMode === 'physical'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>AICTE HQ New Delhi</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Brief Summary of Rectifications to Present to Committee
                </label>
                <textarea
                  rows={3}
                  defaultValue="Furnishing renewed Fire Safety NOC, supplemental joint FDR for ₹ 15 Lakhs, and Selection Committee minutes for 2 Professors."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Confirm Hearing Slot with Approval Bureau
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
