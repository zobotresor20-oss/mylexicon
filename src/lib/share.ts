// ============================================================================
// Partage natif (Web Share API) et presse-papier.
// ----------------------------------------------------------------------------

import type { Word } from "./types";

/** Vrai si le partage natif est supporté (mobile principalement). */
export function shareAvailable(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

/** Vrai si le presse-papier moderne est supporté. */
export function clipboardAvailable(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.clipboard &&
    !!navigator.clipboard.writeText
  );
}

/** Construit un texte de partage lisible pour une fiche. */
export function wordToShareText(w: Word, cards: { type: string; content: string; translation: string }[]): string {
  const lines: string[] = [];
  lines.push(`${w.word} — ${w.translation}`);
  if (w.partOfSpeech) lines.push(`(${w.partOfSpeech})`);
  if (w.context) lines.push(w.context);
  if (cards.length > 0) {
    lines.push("");
    lines.push("Éléments :");
    for (const c of cards) {
      lines.push(`• ${c.content} — ${c.translation}  [${c.type}]`);
    }
  }
  lines.push("");
  lines.push("— via MyLexicon");
  return lines.join("\n");
}

/** Partage une fiche via Web Share API (ou fallback presse-papier). */
export async function shareWord(
  w: Word,
  cards: { type: string; content: string; translation: string }[]
): Promise<"shared" | "copied" | "failed"> {
  const text = wordToShareText(w, cards);
  if (shareAvailable()) {
    try {
      await navigator.share({
        title: `MyLexicon — ${w.word}`,
        text,
      });
      return "shared";
    } catch (e) {
      // Annulation par l'utilisateur = ne rien faire.
      if (e instanceof Error && e.name === "AbortError") return "failed";
      // Sinon on tente le presse-papier.
    }
  }
  if (clipboardAvailable()) {
    try {
      await navigator.clipboard.writeText(text);
      return "copied";
    } catch {
      return "failed";
    }
  }
  return "failed";
}
