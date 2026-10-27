/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';

interface NirnayAnimatedLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  isInteractive?: boolean;
  className?: string;
}

export const NirnayAnimatedLogo: React.FC<NirnayAnimatedLogoProps> = ({
  size = 'md',
  showLabel = false,
  isInteractive = true,
  className = ''
}) => {
  const uid = useId().replace(/:/g, '');

  const sizeMap = {
    xs: { box: 'w-7 h-7', svg: 'w-4 h-4', text: 'text-[10px]' },
    sm: { box: 'w-9 h-9', svg: 'w-5 h-5', text: 'text-xs' },
    md: { box: 'w-11 h-11', svg: 'w-6 h-6', text: 'text-sm' },
    lg: { box: 'w-14 h-14', svg: 'w-8 h-8', text: 'text-base' },
    xl: { box: 'w-20 h-20', svg: 'w-12 h-12', text: 'text-lg' }
  };

  const currentSize = sizeMap[size];

  const goldGradId = `nirnay-gold-${uid}`;
  const cyanGradId = `nirnay-cyan-${uid}`;
  const shieldGradId = `nirnay-shield-${uid}`;

  return (
    <div
      className={`inline-flex items-center gap-2.5 font-['Poppins'] ${className}`}
      role="img"
      aria-label="Nirnay Intelligent Regulatory Scrutiny Emblem"
    >
      {/* Emblem Container */}
      <div
        className={`relative ${currentSize.box} rounded-xl flex items-center justify-center select-none group ${
          isInteractive ? 'cursor-pointer' : ''
        }`}
      >
        {/* Subtle Luminous Halo on Hover */}
        <div
          className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-amber-500/30 via-sky-400/25 to-indigo-500/30 blur-xs opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          aria-hidden="true"
        />

        {/* Metallic Bevel Frame */}
        <div className="relative w-full h-full rounded-xl p-[1.5px] bg-gradient-to-tr from-amber-500 via-sky-300/80 to-amber-300 shadow-md overflow-hidden">
          {/* Deep Sapphire Core */}
          <div className="w-full h-full rounded-[10px] bg-gradient-to-b from-[#0a2540] via-[#07192e] to-[#040d1a] flex items-center justify-center overflow-hidden relative">
            {/* Custom Nirnay Architectural Shield & Balance Scales SVG Emblem */}
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${currentSize.svg} transform group-hover:scale-105 transition-transform duration-300`}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={goldGradId} x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id={cyanGradId} x1="16" y1="14" x2="48" y2="50" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7DD3FC" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
                <linearGradient id={shieldGradId} x1="32" y1="6" x2="32" y2="58" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#091526" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Outer Octagonal Shield Crest */}
              <path
                d="M32 6L52 14.5V31.5C52 44.2 43.4 53.8 32 58C20.6 53.8 12 44.2 12 31.5V14.5L32 6Z"
                fill={`url(#${shieldGradId})`}
                stroke={`url(#${goldGradId})`}
                strokeWidth="2.6"
                strokeLinejoin="round"
              />

              {/* Inner Precision Hairline Crest */}
              <path
                d="M32 11L47.5 17.6V31.2C47.5 41.1 40.8 48.9 32 52.5C23.2 48.9 16.5 41.1 16.5 31.2V17.6L32 11Z"
                stroke={`url(#${cyanGradId})`}
                strokeWidth="1.2"
                strokeOpacity="0.65"
                strokeLinejoin="round"
              />

              {/* Central Pillar & Equilibrium Beam (Symbolizing 'Nirnay' = Equitable Decision) */}
              <line
                x1="32"
                y1="17"
                x2="32"
                y2="45"
                stroke={`url(#${goldGradId})`}
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <line
                x1="20"
                y1="24"
                x2="44"
                y2="24"
                stroke={`url(#${goldGradId})`}
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Balanced Scale Pans */}
              <path
                d="M20 24L16.5 32.5H23.5L20 24Z"
                fill={`url(#${cyanGradId})`}
                fillOpacity="0.35"
                stroke={`url(#${cyanGradId})`}
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M44 24L40.5 32.5H47.5L44 24Z"
                fill={`url(#${cyanGradId})`}
                fillOpacity="0.35"
                stroke={`url(#${cyanGradId})`}
                strokeWidth="1.6"
                strokeLinejoin="round"
              />

              {/* Base Pedestal */}
              <path
                d="M25.5 45H38.5"
                stroke={`url(#${goldGradId})`}
                strokeWidth="2.4"
                strokeLinecap="round"
              />

              {/* Crown Verification Checkmark Badge at Apex */}
              <circle cx="32" cy="17" r="3" fill={`url(#${goldGradId})`} />
              <path
                d="M27.5 38.5L30.8 41.5L37.5 34.5"
                stroke="#34D399"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Light Sweep Shimmer Effect */}
            <div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out pointer-events-none motion-reduce:hidden"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Optional Integrated Branding Typography */}
      {showLabel && (
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-white ${currentSize.text}`}>
              NIRNAY
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
              SCRUTINY
            </span>
          </div>
          <span className="text-[10px] text-blue-200/80 font-medium tracking-wide">
            Intelligent Validation & EOA
          </span>
        </div>
      )}
    </div>
  );
};

export const YuktiAnimatedLogo = NirnayAnimatedLogo;
