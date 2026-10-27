/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { REGULATORY_NOTICES } from '../data/portalAnnouncements';
import { RegulatoryNotice } from '../types/aicte';
import { Bell, Pause, Play, Download, X, FileText } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const RegulatoryTicker: React.FC = () => {
  const { language } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<RegulatoryNotice | null>(null);

  const tickerHeading =
    language === 'hi'
      ? 'अधिसूचनाएं एवं परिपत्र'
      : language === 'ta'
      ? 'அறிவிப்புகள் மற்றும் சுற்றறிக்கைகள்'
      : 'Regulatory Updates & Circulars';

  return (
    <>
      <div className="bg-amber-50 border-b border-amber-200/80 py-2 px-3 sm:px-6 md:px-8 text-xs text-slate-800 flex items-center gap-2 sm:gap-3 overflow-hidden shadow-2xs">
        {/* Static Title Pill */}
        <div className="shrink-0 flex items-center gap-1.5 sm:gap-2 pr-2 sm:pr-3 border-r border-amber-300 font-bold text-amber-950">
          <Bell className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
          <span className="whitespace-nowrap uppercase tracking-wider text-[10px] sm:text-[11px]">
            {tickerHeading}
          </span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:bg-amber-200/80 rounded transition-colors cursor-pointer text-amber-900"
            title={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
            aria-label={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>

        {/* Marquee Ticker */}
        <div className="flex-1 overflow-hidden relative min-w-0">
          <div
            className={`animate-ticker flex items-center gap-6 sm:gap-8 ${isPaused ? 'ticker-paused' : ''}`}
          >
            {[...REGULATORY_NOTICES, ...REGULATORY_NOTICES].map((notice, idx) => (
              <button
                key={`${notice.id}-${idx}`}
                onClick={() => setSelectedNotice(notice)}
                className="flex items-center gap-2 hover:text-amber-800 transition-colors whitespace-nowrap cursor-pointer text-left group"
              >
                <span className="bg-amber-200/90 text-amber-950 font-bold text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-xs uppercase tracking-tight">
                  {notice.category}
                </span>
                <span className="font-medium group-hover:underline text-[11px] sm:text-xs">{notice.title}</span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono tabular-nums">({notice.publishedDateText})</span>
                <span className="text-amber-400 font-bold">·</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notice Details Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="bg-[#0b2545] p-4 sm:p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  AICTE Gazette Notification
                </span>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close notification"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-mono flex-wrap">
                <span>Published on {selectedNotice.publishedDateText}</span>
                <span>·</span>
                <span>Ref: AICTE/AB/APH-2026/GZ</span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3 leading-snug">
                {selectedNotice.title}
              </h3>

              <div className="p-3.5 sm:p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed mb-4">
                {selectedNotice.summary}
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-3">
                <div className="flex justify-between flex-wrap gap-1">
                  <span className="text-slate-500">Document Classification:</span>
                  <span className="font-semibold text-slate-800">{selectedNotice.category} Order</span>
                </div>
                <div className="flex justify-between flex-wrap gap-1">
                  <span className="text-slate-500">File Download Size:</span>
                  <span className="font-mono text-slate-800">{selectedNotice.fileSize || '2.4 MB'} (Digitally Signed PDF)</span>
                </div>
                <div className="flex justify-between flex-wrap gap-1">
                  <span className="text-slate-500">Issuing Bureau:</span>
                  <span className="font-semibold text-slate-800">Approval Bureau, AICTE New Delhi</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 flex-wrap">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([`${selectedNotice.title}\n\n${selectedNotice.summary}\n\nPublished: ${selectedNotice.date}\nAICTE Official Notice`], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedNotice.id}_aicte_circular.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Official Copy ({selectedNotice.fileSize || 'PDF'})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
