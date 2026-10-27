/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SupportedLanguage } from '../i18n/translations';

export interface VoiceResolutionResult {
  voice: SpeechSynthesisVoice | null;
  effectiveLanguage: SupportedLanguage;
  isFallback: boolean;
  warningNotice?: string;
}

/**
 * Resolves the best available browser speech synthesis voice for the requested language.
 * Checks for Tamil ('ta', 'ta-IN') and Hindi ('hi', 'hi-IN') availability.
 * If Tamil/Hindi is not installed on the user's OS/browser, provides a clean fallback to English
 * along with a user-facing notice.
 */
export function resolveSpeechVoice(requestedLang: SupportedLanguage): VoiceResolutionResult {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return {
      voice: null,
      effectiveLanguage: requestedLang,
      isFallback: false
    };
  }

  const voices = window.speechSynthesis.getVoices();

  if (requestedLang === 'ta') {
    const tamilVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('ta') ||
        v.name.toLowerCase().includes('tamil') ||
        v.name.toLowerCase().includes('valluvar')
    );

    if (tamilVoice) {
      return {
        voice: tamilVoice,
        effectiveLanguage: 'ta',
        isFallback: false
      };
    }

    const englishFallbackVoice =
      voices.find((v) => v.lang === 'en-IN') ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0] ||
      null;

    return {
      voice: englishFallbackVoice,
      effectiveLanguage: 'en',
      isFallback: true,
      warningNotice: 'Tamil speech synthesis voice is not installed on this device. Playing English announcement with Tamil text on screen.'
    };
  }

  if (requestedLang === 'hi') {
    const hindiVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('lekha')
    );

    if (hindiVoice) {
      return {
        voice: hindiVoice,
        effectiveLanguage: 'hi',
        isFallback: false
      };
    }

    const englishFallbackVoice =
      voices.find((v) => v.lang === 'en-IN') ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0] ||
      null;

    return {
      voice: englishFallbackVoice,
      effectiveLanguage: 'en',
      isFallback: true,
      warningNotice: 'Hindi speech voice not installed on this device. Playing English voice announcement with Hindi text on screen.'
    };
  }

  // Default English
  const englishVoice =
    voices.find((v) => v.lang === 'en-IN') ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0] ||
    null;

  return {
    voice: englishVoice,
    effectiveLanguage: 'en',
    isFallback: false
  };
}

/**
 * Speaks an automated intimation or confirmation notice using browser speech synthesis.
 */
export function speakVoiceAnnouncement(text: string, lang: SupportedLanguage = 'en') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const { voice } = resolveSpeechVoice(lang);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error', err);
  }
}
