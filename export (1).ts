// ============================================================================
// Export CSV du dictionnaire.
// ----------------------------------------------------------------------------

import type { Card, Example, Word } from "./types";

function csvEscape(value: string | number | undefined | null): string {
  const s = String(value ?? "");
  if (/[",\n;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Génère une chaîne CSV (séparateur ;) du dictionnaire complet. */
export function exportCsv(
  words: Word[],
  cards: Card[],
  examples: Example[]
): string {
  const lines: string[] = [];
  lines.push(
    [
      "mot_en",
      "traduction_fr",
      "nature",
      "registre",
      "contexte",
      "notes",
      "etiquettes",
      "statut",
      "type_element",
      "element_en",
      "element_fr",
      "exemple_en",
      "exemple_fr",
    ].join(";")
  );

  const cardsByWord = new Map<string, Card[]>();
  for (const c of cards) {
    const arr = cardsByWord.get(c.wordId) ?? [];
    arr.push(c);
    cardsByWord.set(c.wordId, arr);
  }
  const examplesByParent = new Map<string, Example[]>();
  for (const e of examples) {
    const arr = examplesByParent.get(e.parentId) ?? [];
    arr.push(e);
    examplesByParent.set(e.parentId, arr);
  }

  for (const w of words) {
    const wordCards = cardsByWord.get(w.id) ?? [];
    if (wordCards.length === 0) {
      // Mot seul, sans éléments : une ligne avec les exemples rattachés au mot.
      const wordExamples = examplesByParent.get(w.id) ?? [];
      if (wordExamples.length === 0) {
        lines.push(
          [
            csvEscape(w.word),
            csvEscape(w.translation),
            csvEscape(w.partOfSpeech),
            csvEscape(w.register),
            csvEscape(w.context),
            csvEscape(w.notes),
            csvEscape(w.tags.join(", ")),
            csvEscape(w.status),
            "",
            "",
            "",
            "",
            "",
          ].join(";")
        );
      } else {
        for (const ex of wordExamples) {
          lines.push(
            [
              csvEscape(w.word),
              csvEscape(w.translation),
              csvEscape(w.partOfSpeech),
              csvEscape(w.register),
              csvEscape(w.context),
              csvEscape(w.notes),
              csvEscape(w.tags.join(", ")),
              csvEscape(w.status),
              "",
              "",
              "",
              csvEscape(ex.content),
              csvEscape(ex.translation),
            ].join(";")
          );
        }
      }
    } else {
      for (const c of wordCards) {
        const cardExamples = examplesByParent.get(c.id) ?? [];
        if (cardExamples.length === 0) {
          lines.push(
            [
              csvEscape(w.word),
              csvEscape(w.translation),
              csvEscape(w.partOfSpeech),
              csvEscape(w.register),
              csvEscape(w.context),
              csvEscape(w.notes),
              csvEscape(w.tags.join(", ")),
              csvEscape(w.status),
              csvEscape(c.type),
              csvEscape(c.content),
              csvEscape(c.translation),
              "",
              "",
            ].join(";")
          );
        } else {
          for (const ex of cardExamples) {
            lines.push(
              [
                csvEscape(w.word),
                csvEscape(w.translation),
                csvEscape(w.partOfSpeech),
                csvEscape(w.register),
                csvEscape(w.context),
                csvEscape(w.notes),
                csvEscape(w.tags.join(", ")),
                csvEscape(w.status),
                csvEscape(c.type),
                csvEscape(c.content),
                csvEscape(c.translation),
                csvEscape(ex.content),
                csvEscape(ex.translation),
              ].join(";")
            );
          }
        }
      }
    }
  }

  return lines.join("\n");
}

/** Déclenche le téléchargement d'un contenu texte. */
export function downloadFile(filename: string, content: string, mime: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
