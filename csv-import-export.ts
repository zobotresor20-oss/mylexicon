// ============================================================================
// Import CSV et export Anki (Cloze) pour MyLexicon.
// ----------------------------------------------------------------------------

import type { PartOfSpeech, Word } from "./types";

// ----------------------------------------------------------------------------
// Import CSV
// ----------------------------------------------------------------------------

export interface CsvImportRow {
  word: string;
  translation: string;
  partOfSpeech?: PartOfSpeech;
  context?: string;
  notes?: string;
  tags?: string[];
}

export interface CsvImportResult {
  rows: CsvImportRow[];
  errors: string[];
}

const VALID_PARTS: PartOfSpeech[] = [
  "nom",
  "verbe",
  "adjectif",
  "adverbe",
  "préposition",
  "conjonction",
  "pronom",
  "déterminant",
  "interjection",
  "expression",
  "autre",
];

/**
 * Parse un contenu CSV (séparateur ; ou ,) et renvoie les lignes valides.
 * Attend au minimum 2 colonnes : mot (EN), traduction (FR).
 * Colonnes optionnelles : nature, contexte, notes, étiquettes (séparées par |).
 */
export function parseCsv(content: string): CsvImportResult {
  const rows: CsvImportRow[] = [];
  const errors: string[] = [];
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    errors.push("Le fichier est vide.");
    return { rows, errors };
  }

  // Détecte le séparateur (; ou ,) sur la première ligne.
  const firstLine = lines[0];
  const sep = firstLine.includes(";") ? ";" : ",";

  // Détecte si la première ligne est un en-tête.
  const firstCells = splitCsvLine(firstLine, sep);
  const hasHeader =
    firstCells.length >= 2 &&
    (firstCells[0].toLowerCase().match(/mot|word|anglais|en/) ||
      firstCells[1].toLowerCase().match(/traduction|translation|français|fr/));
  const startIdx = hasHeader ? 1 : 0;

  for (let i = startIdx; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i], sep);
    if (cells.length < 2) {
      errors.push(`Ligne ${i + 1} : pas assez de colonnes.`);
      continue;
    }
    const word = cells[0].trim();
    const translation = cells[1].trim();
    if (!word || !translation) {
      errors.push(`Ligne ${i + 1} : mot ou traduction manquant.`);
      continue;
    }
    const partRaw = (cells[2] ?? "").trim().toLowerCase();
    const part: PartOfSpeech | undefined = partRaw
      ? VALID_PARTS.includes(partRaw as PartOfSpeech)
        ? (partRaw as PartOfSpeech)
        : "autre"
      : undefined;
    const context = (cells[3] ?? "").trim() || undefined;
    const notes = (cells[4] ?? "").trim() || undefined;
    const tagsRaw = (cells[5] ?? "").trim();
    const tags = tagsRaw
      ? tagsRaw.split("|").map((t) => t.trim().toLowerCase()).filter(Boolean)
      : undefined;
    rows.push({ word, translation, partOfSpeech: part, context, notes, tags });
  }
  return { rows, errors };
}

/** Découpe une ligne CSV en cellules (gère les guillemets). */
function splitCsvLine(line: string, sep: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === sep && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

// ----------------------------------------------------------------------------
// Export Anki (Cloze)
// ----------------------------------------------------------------------------

/**
 * Génère un texte au format Cloze Anki à partir des exemples du dictionnaire.
 * Format : "phrase avec {{c1::mot}} tappé\tnote (traduction)"
 * Une ligne par exemple, séparée par une tabulation (format import Anki).
 */
export function exportAnkiCloze(
  words: Word[],
  examples: { wordId: string; content: string; translation: string }[]
): string {
  const lines: string[] = [];
  const wordMap = new Map(words.map((w) => [w.id, w]));
  // En-tête Anki (tags du paquet).
  lines.push("#separator:tab");
  lines.push("#html:false");
  lines.push("#tags column:2");
  for (const ex of examples) {
    const w = wordMap.get(ex.wordId);
    if (!w) continue;
    // Remplace la première occurrence du mot par {{c1::mot}}.
    const regex = new RegExp(`\\b${escapeRegex(w.word)}\\b`, "i");
    const cloze = regex.test(ex.content)
      ? ex.content.replace(regex, `{{c1::${w.word}}}`)
      : ex.content;
    const trad = ex.translation ? ` — ${ex.translation}` : "";
    const tags = `mylexicon ${w.partOfSpeech}`.trim();
    lines.push(`${cloze}${trad}\t${tags}`);
  }
  return lines.join("\n");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
