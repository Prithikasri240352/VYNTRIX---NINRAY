/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Camera,
  Layers,
  Info,
  ExternalLink,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import {
  DocumentLocationEvidence,
  SubmissionGpsDetail,
  ExifPhotoGpsDetail
} from '../types/aicte';
import { calculateHaversineDistanceKm } from '../utils/exifParser';

interface GpsLocationCaptureProps {
  policy?: 'Mandatory' | 'Optional';
  campusCoordinates?: { latitude: number; longitude: number };
  institutionName?: string;
  exifPhotoGps?: ExifPhotoGpsDetail | null;
  onLocationCaptured: (evidence: DocumentLocationEvidence) => void;
  className?: string;
}

export const GpsLocationCapture: React.FC<GpsLocationCaptureProps> = ({
  policy = 'Mandatory',
  campusCoordinates,
  institutionName,
  exifPhotoGps,
  onLocationCaptured,
  className = ''
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [gpsData, setGpsData] = useState<SubmissionGpsDetail | null>(null);
  const [permissionState, setPermissionState] = useState<
    'idle' | 'prompting' | 'granted' | 'denied' | 'unavailable' | 'skipped'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mapLayer, setMapLayer] = useState<'osm' | 'satellite'>('osm');

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setPermissionState('unavailable');
      setErrorMessage('Geolocation API is not supported by your browser.');
      return;
    }

    setPermissionState('prompting');
    setIsCapturing(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const submission: SubmissionGpsDetail = {
          latitude: Math.round(position.coords.latitude * 1000000) / 1000000,
          longitude: Math.round(position.coords.longitude * 1000000) / 1000000,
          accuracyMeters: Math.round(position.coords.accuracy),
          timestampUtc: new Date(position.timestamp).toISOString(),
          capturedSuccessfully: true,
          source: 'Device Browser Geolocation API'
        };

        setGpsData(submission);
        setPermissionState('granted');
        setIsCapturing(false);

        // Calculate distances if coordinates exist
        let distFromCampus: number | undefined = undefined;
        let distBetweenPhotoAndUpload: number | undefined = undefined;

        if (campusCoordinates) {
          distFromCampus = calculateHaversineDistanceKm(
            submission.latitude,
            submission.longitude,
            campusCoordinates.latitude,
            campusCoordinates.longitude
          );
        }

        if (exifPhotoGps) {
          distBetweenPhotoAndUpload = calculateHaversineDistanceKm(
            submission.latitude,
            submission.longitude,
            exifPhotoGps.latitude,
            exifPhotoGps.longitude
          );
        }

        const isNearCampus = distFromCampus !== undefined ? distFromCampus <= 1.5 : true;

        const evidence: DocumentLocationEvidence = {
          submissionGps: submission,
          exifPhotoGps: exifPhotoGps || undefined,
          distanceFromCampusKm: distFromCampus,
          distanceBetweenUploadAndPhotoKm: distBetweenPhotoAndUpload,
          locationPolicy: policy,
          captureStatus: 'Captured',
          verificationAssessment: isNearCampus
            ? 'On-Campus Verified'
            : 'Off-Campus Proximity Notice',
          disclaimerText:
            'Upload-time GPS records the device location when submitting. Embedded EXIF reflects camera metadata at capture. Neither alone certifies physical presence or legal infrastructure title.'
        };

        onLocationCaptured(evidence);
      },
      (error) => {
        setIsCapturing(false);
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionState('denied');
          setErrorMessage(
            'Location access was denied. You can enable location in browser site settings or proceed according to policy.'
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setPermissionState('unavailable');
          setErrorMessage('Location information is currently unavailable from your device.');
        } else {
          setPermissionState('unavailable');
          setErrorMessage('Location request timed out. Please try again.');
        }

        if (policy === 'Optional') {
          const evidence: DocumentLocationEvidence = {
            exifPhotoGps: exifPhotoGps || undefined,
            locationPolicy: 'Optional',
            captureStatus: error.code === error.PERMISSION_DENIED ? 'Permission Denied' : 'Unavailable',
            verificationAssessment: 'Location Not Provided',
            disclaimerText: 'Location metadata was not provided by user or was unavailable.'
          };
          onLocationCaptured(evidence);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  };

  const handleSkipOptional = () => {
    setPermissionState('skipped');
    const evidence: DocumentLocationEvidence = {
      exifPhotoGps: exifPhotoGps || undefined,
      locationPolicy: 'Optional',
      captureStatus: 'Optional Skipped',
      verificationAssessment: 'Location Not Provided',
      disclaimerText: 'Location metadata skipped by user.'
    };
    onLocationCaptured(evidence);
  };

  return (
    <div className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-['Poppins'] space-y-4 ${className}`}>
      {/* Purpose Explanation Banner */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-200">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-white flex items-center gap-2">
            <span>AICTE Statutory GPS Verification Policy</span>
            <span className={`text-[10px] px-2 py-0.2 rounded font-bold ${
              policy === 'Mandatory'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-700 text-slate-200'
            }`}>
              {policy}
            </span>
          </div>
          <p className="text-[11px] text-blue-300 leading-relaxed">
            In compliance with APH 2026-27 statutory land and NOC audits, location coordinates are recorded during document submission to cross-verify institutional premises. Location data is stored strictly as structured numeric evidence.
          </p>
        </div>
      </div>

      {/* Action / State Area */}
      {permissionState === 'idle' || permissionState === 'prompting' ? (
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Record Device Location at Submission</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Browser will prompt for location permission. Coordinates will be timestamped in UTC.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {policy === 'Optional' && (
              <button
                type="button"
                onClick={handleSkipOptional}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Skip GPS
              </button>
            )}

            <button
              type="button"
              onClick={handleRequestLocation}
              disabled={isCapturing}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md cursor-pointer"
            >
              {isCapturing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Requesting Browser GPS...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Capture GPS Coordinates</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : null}

      {/* Granted State: Coordinate Readout & Interactive Map Preview */}
      {permissionState === 'granted' && gpsData && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-emerald-300">Device Location Successfully Captured</span>
              </div>
              <button
                type="button"
                onClick={handleRequestLocation}
                className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                title="Recalculate GPS"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-check</span>
              </button>
            </div>

            {/* Coordinates Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Latitude</span>
                <span className="font-mono font-bold text-white">{gpsData.latitude}° N</span>
              </div>
              <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Longitude</span>
                <span className="font-mono font-bold text-white">{gpsData.longitude}° E</span>
              </div>
              <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Reported Accuracy</span>
                <span className="font-mono font-bold text-emerald-400">± {gpsData.accuracyMeters} meters</span>
              </div>
              <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Capture Timestamp</span>
                <span className="font-mono text-[10px] text-slate-300">{gpsData.timestampUtc.substring(11, 19)} UTC</span>
              </div>
            </div>

            {/* Campus Proximity Check */}
            {campusCoordinates && (
              <div className="pt-1 text-[11px] text-slate-300 flex items-center justify-between">
                <span>
                  Campus Reference: <strong>{institutionName || 'Institutional Campus'}</strong>
                </span>
                <span className="font-mono text-emerald-400 font-semibold">
                  Distance: {calculateHaversineDistanceKm(
                    gpsData.latitude,
                    gpsData.longitude,
                    campusCoordinates.latitude,
                    campusCoordinates.longitude
                  )} km (On-Premises)
                </span>
              </div>
            )}
          </div>

          {/* Interactive Map Visualizer */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-52 sm:h-60 flex flex-col">
            {/* Map Header Strip */}
            <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px] z-10">
              <div className="flex items-center gap-1.5 font-medium text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Geotagged Evidence Map View</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps?q=${gpsData.latitude},${gpsData.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[10px]"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Embedded OpenStreetMap Preview */}
            <iframe
              title="GPS Location Map Preview"
              width="100%"
              height="100%"
              className="w-full flex-1 border-0 filter contrast-105"
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${gpsData.longitude - 0.008}%2C${gpsData.latitude - 0.006}%2C${gpsData.longitude + 0.008}%2C${gpsData.latitude + 0.006}&layer=mapnik&marker=${gpsData.latitude}%2C${gpsData.longitude}`}
            />
          </div>
        </div>
      )}

      {/* Embedded Photo EXIF GPS (If present in uploaded image) */}
      {exifPhotoGps && (
        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-300 flex items-center gap-1.5 text-xs">
              <Camera className="w-3.5 h-3.5 text-purple-400" />
              <span>Photo Capture Location from Image EXIF Metadata</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-200 font-mono">
              Camera EXIF
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Camera EXIF Latitude</span>
              <span className="font-mono font-bold text-purple-200">{exifPhotoGps.latitude}° N</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Camera EXIF Longitude</span>
              <span className="font-mono font-bold text-purple-200">{exifPhotoGps.longitude}° E</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Camera Device Tag</span>
              <span className="font-medium text-slate-300 truncate block">{exifPhotoGps.cameraModel || 'Mobile Optical Sensor'}</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 pt-1">
            Note: Photo EXIF tags reflect the camera device timestamp and location when the photo was snapped. Upload GPS reflects the submission terminal.
          </p>
        </div>
      )}

      {/* Denied / Unavailable Warning & Policy Enforcement */}
      {(permissionState === 'denied' || permissionState === 'unavailable') && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-300">
                {permissionState === 'denied' ? 'GPS Permission Denied' : 'GPS Device Unavailable'}
              </div>
              <p className="text-[11px] text-rose-200/90 mt-0.5">
                {errorMessage}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {policy === 'Mandatory' ? (
              <div className="text-[11px] text-amber-300 font-medium">
                Mandatory Policy: Upload cannot proceed without authorized premises location. Please enable location in browser settings and retry.
              </div>
            ) : (
              <div className="text-[11px] text-slate-300">
                Optional Policy: You may continue submission without location metadata.
              </div>
            )}

            <button
              type="button"
              onClick={handleRequestLocation}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs flex items-center gap-1.5 transition ml-auto"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Permission</span>
            </button>
          </div>
        </div>
      )}

      {/* Skipped State */}
      {permissionState === 'skipped' && (
        <div className="p-3 rounded-xl bg-slate-800 text-slate-400 text-xs flex items-center justify-between">
          <span>Location metadata skipped for this upload (Optional).</span>
          <button
            type="button"
            onClick={handleRequestLocation}
            className="text-blue-400 hover:underline text-[11px]"
          >
            Enable Location
          </button>
        </div>
      )}
    </div>
  );
};
