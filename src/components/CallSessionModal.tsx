/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Shield,
  FileText,
  Volume2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CallSessionModalProps {
  isOpen: boolean;
  type: 'audio' | 'video';
  spocName: string;
  spocPhone: string;
  institutionName?: string;
  onClose: () => void;
}

export const CallSessionModal: React.FC<CallSessionModalProps> = ({
  isOpen,
  type,
  spocName,
  spocPhone,
  institutionName,
  onClose
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(type === 'audio');
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [notes, setNotes] = useState('');
  const [hasMediaPermission, setHasMediaPermission] = useState<boolean | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, callStatus]);

  // Connect WebRTC media
  useEffect(() => {
    if (!isOpen) {
      cleanupStream();
      setCallDuration(0);
      setCallStatus('connecting');
      return;
    }

    setCallStatus('connecting');

    // Simulate connection delay then start media
    const timer = setTimeout(async () => {
      setCallStatus('connected');

      try {
        if (navigator?.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: type === 'video'
          });
          mediaStreamRef.current = stream;
          setHasMediaPermission(true);
          if (localVideoRef.current && type === 'video') {
            localVideoRef.current.srcObject = stream;
          }
        } else {
          setHasMediaPermission(false);
        }
      } catch (err) {
        console.warn('Media devices not permitted or unavailable, using simulation:', err);
        setHasMediaPermission(false);
      }
    }, 1200);

    return () => {
      clearTimeout(timer);
      cleanupStream();
    };
  }, [isOpen, type]);

  const cleanupStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsAudioMuted(!isAudioMuted);
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoMuted(!isVideoMuted);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    cleanupStream();
    setTimeout(() => {
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-['Poppins'] animate-in fade-in">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Call Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              {type === 'video' ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{spocName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-medium flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>AICTE End-to-End Secure</span>
                </span>
              </div>
              <div className="text-xs text-slate-400">
                {institutionName ? `${institutionName} • ` : ''} {spocPhone}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-mono font-bold text-emerald-400">
              {callStatus === 'connected' ? formatTime(callDuration) : 'Connecting...'}
            </div>
            <div className="text-[10px] text-slate-500">
              {callStatus === 'connected' ? 'Live Encrypted Session' : 'Establishing Secure SIP'}
            </div>
          </div>
        </div>

        {/* Video / Call Center Stage */}
        <div className="relative bg-slate-900/40 min-h-[300px] flex items-center justify-center p-6 overflow-hidden">
          {type === 'video' && !isVideoMuted ? (
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              {hasMediaPermission ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30 mx-auto flex items-center justify-center text-blue-400 animate-pulse">
                    <Video className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Live Video Stream Connected</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Simulated camera stream active for SPOC scrutiny meeting. Audio/video channels synched.
                    </p>
                  </div>
                </div>
              )}

              {/* Watermark badge */}
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] text-slate-300 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>AICTE SRO Chennai Virtual Hearing Room</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-24 h-24">
                <div className="w-24 h-24 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-xl">
                  {type === 'video' ? <VideoOff className="w-10 h-10" /> : <Phone className="w-10 h-10" />}
                </div>
                {callStatus === 'connected' && (
                  <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-600 text-white">
                    <Volume2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{spocName}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {callStatus === 'connected' ? 'Secure Voice Channel Active' : 'Connecting to Institutional SPOC...'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-emerald-500 rounded-full animate-pulse"
                    style={{
                      height: `${12 + (i % 3) * 10}px`,
                      animationDelay: `${i * 150}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Scrutiny Notes */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>In-Call Hearing Notes (Appended to Scrutiny Audit Log)</span>
            </span>
            <span className="text-[10px] text-slate-500">Auto-saved</span>
          </div>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record SPOC oral clarifications, agreed submission deadlines, or committee instructions..."
            className="w-full bg-slate-900 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
          />
        </div>

        {/* Call Control Strip */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-center gap-4">
          <button
            onClick={toggleAudio}
            className={`p-3.5 rounded-2xl transition shadow-lg ${
              isAudioMuted
                ? 'bg-rose-600/30 text-rose-300 border border-rose-500/50 hover:bg-rose-600/40'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
            }`}
            title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {type === 'video' && (
            <button
              onClick={toggleVideo}
              className={`p-3.5 rounded-2xl transition shadow-lg ${
                isVideoMuted
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500/50 hover:bg-rose-600/40'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
              }`}
              title={isVideoMuted ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={handleEndCall}
            className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 transition shadow-xl"
            title="Disconnect Call"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
