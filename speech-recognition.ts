// ============================================================================
// Reconnaissance vocale (SpeechRecognition) pour la production orale.
// ----------------------------------------------------------------------------

import type { Accent } from "./types";

type SpeechRecognitionType = typeof window extends { SpeechRecognition: infer T }
  ? T
  : any;

/** Vrai si la reconnaissance vocale est disponible. */
export function recognitionAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

function getRecognitionCtor(): SpeechRecognitionType | null {
  if (typeof window === "undefined") return null;
  return (
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null
  );
}

export interface ListenOptions {
  accent: Accent;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (err: string) => void;
  onEnd?: () => void;
}

/** Lance une session d'écoute et renvoie une fonction d'arrêt. */
export function listen(opts: ListenOptions): () => void {
  const Ctor = getRecognitionCtor();
  if (!Ctor) {
    opts.onError?.("non-supporté");
    return () => {};
  }
  const recognition = new Ctor();
  recognition.lang = opts.accent === "américain" ? "en-US" : "en-GB";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onresult = (event: any) => {
    let transcript = "";
    let isFinal = false;
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const res = event.results[i];
      transcript += res[0].transcript;
      if (res.isFinal) isFinal = true;
    }
    opts.onResult(transcript.trim(), isFinal);
  };
  recognition.onerror = (event: any) => {
    opts.onError?.(event.error || "erreur");
  };
  recognition.onend = () => {
    opts.onEnd?.();
  };

  try {
    recognition.start();
  } catch {
    /* déjà démarré */
  }

  return () => {
    try {
      recognition.stop();
    } catch {
      /* ignore */
    }
  };
}
