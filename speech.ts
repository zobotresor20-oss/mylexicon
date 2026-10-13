// ============================================================================
// Prononciation via Web Speech API (speechSynthesis).
// Remplace expo-speech sur le web. Aucune donnée envoyée en ligne.
// ----------------------------------------------------------------------------

import type { Accent } from "./types";

function pickVoice(accent: Accent): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  if (enVoices.length === 0) return voices[0] ?? null;

  const target = accent === "américain" ? "en-US" : "en-GB";
  const match = enVoices.find((v) => v.lang === target);
  if (match) return match;

  // Heuristique sur le nom.
  const nameHint = accent === "américain" ? /US|American|Samantha|Alex/i : /UK|British|Daniel|Kate/i;
  const named = enVoices.find((v) => nameHint.test(v.name));
  return named ?? enVoices[0];
}

/**
 * Prononce un texte en anglais.
 * @param text  texte à lire
 * @param accent accent choisi
 * @param rate   vitesse (0.5 -> 1.3), défaut 0.95
 */
export function speak(
  text: string,
  accent: Accent = "britannique",
  rate: number = 0.95
): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (!text.trim()) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = accent === "américain" ? "en-US" : "en-GB";
  const voice = pickVoice(accent);
  if (voice) utter.voice = voice;
  utter.rate = Math.max(0.5, Math.min(1.3, rate));
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
}

/** Arrête toute élocution en cours. */
export function stopSpeaking(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

/** Vrai si la synthèse vocale est disponible. */
export function speechAvailable(): boolean {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}
