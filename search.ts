// ============================================================================
// Recherche bidirectionnelle tolérante.
// - Fonctionne sur tous les contenus (FR et EN).
// - Tolère fautes de frappe, accents oubliés, casse, mots partiels/désordonnés.
// ----------------------------------------------------------------------------

import type { Card, Example, SearchResult, Word } from "./types";

/** Normalise une chaîne : minuscules, sans accents, sans ponctuation superflue. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .replace(/[.,!?;:'"`()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Distance de Levenshtein (avec seuil pour performance). */
function levenshtein(a: string, b: string, maxDist = Infinity): number {
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > maxDist) return maxDist + 1;
  const prev = new Array(lb + 1);
  const curr = new Array(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;
  for (let i = 1; i <= la; i++) {
    curr[0] = i;
    let best = curr[0];
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < best) best = curr[j];
    }
    if (best > maxDist) return maxDist + 1;
    for (let j = 0; j <= lb; j++) prev[j] = curr[j];
  }
  return prev[lb];
}

/** Score de similarité entre 0 et 1 entre une requête et un texte. */
function similarity(query: string, text: string): number {
  if (!query || !text) return 0;
  if (text === query) return 1;
  if (text.includes(query)) {
    // Sous-chaîne : bonus selon la couverture.
    return 0.7 + 0.3 * (query.length / text.length);
  }
  // Distance relative.
  const dist = levenshtein(query, text, Math.ceil(text.length / 2));
  if (dist > text.length) return 0;
  return 1 - dist / Math.max(text.length, query.length);
}

/**
 * Score global d'une requête (multi-mots) contre un texte.
 * Tolère les mots en désordre et partiels.
 */
function scoreText(queryTokens: string[], textNorm: string): number {
  if (queryTokens.length === 0) return 0;
  const textTokens = textNorm.split(" ").filter(Boolean);
  let total = 0;
  for (const q of queryTokens) {
    let best = 0;
    // Mot exact / partiel dans un token du texte.
    for (const t of textTokens) {
      if (t === q) best = Math.max(best, 1);
      else if (t.includes(q)) best = Math.max(best, 0.8);
      else if (q.includes(t) && t.length >= 3) best = Math.max(best, 0.6);
      else {
        // Faute de frappe : distance sur mots de longueur comparable.
        if (Math.abs(t.length - q.length) <= 2 && q.length >= 3) {
          const sim = similarity(q, t);
          if (sim > 0.7) best = Math.max(best, sim * 0.7);
        }
      }
    }
    total += best;
  }
  return total / queryTokens.length;
}

export interface SearchableItem {
  kind: SearchResult["kind"];
  id: string;
  wordId: string;
  textEn: string;
  textFr: string;
  wordLabel: string;
  wordTranslation: string;
}

/** Construit l'index plat de tous les éléments recherchables. */
export function buildSearchIndex(
  words: Word[],
  cards: Card[],
  examples: Example[]
): SearchableItem[] {
  const items: SearchableItem[] = [];
  const wordMap = new Map(words.map((w) => [w.id, w]));

  for (const w of words) {
    items.push({
      kind: "word",
      id: w.id,
      wordId: w.id,
      textEn: w.word,
      textFr: w.translation,
      wordLabel: w.word,
      wordTranslation: w.translation,
    });
  }
  for (const c of cards) {
    const w = wordMap.get(c.wordId);
    items.push({
      kind: c.type,
      id: c.id,
      wordId: c.wordId,
      textEn: c.content,
      textFr: c.translation,
      wordLabel: w?.word ?? "",
      wordTranslation: w?.translation ?? "",
    });
  }
  for (const e of examples) {
    const w = wordMap.get(e.wordId);
    items.push({
      kind: "example",
      id: e.id,
      wordId: e.wordId,
      textEn: e.content,
      textFr: e.translation,
      wordLabel: w?.word ?? "",
      wordTranslation: w?.translation ?? "",
    });
  }
  return items;
}

/** Exécute la recherche et renvoie les résultats classés par pertinence. */
export function search(
  index: SearchableItem[],
  rawQuery: string,
  limit = 50
): SearchResult[] {
  const q = normalize(rawQuery);
  if (q.length < 1) return [];
  const queryTokens = q.split(" ").filter(Boolean);

  const scored: SearchResult[] = [];

  for (const item of index) {
    const en = normalize(item.textEn);
    const fr = normalize(item.textFr);
    const scoreEn = scoreText(queryTokens, en);
    const scoreFr = scoreText(queryTokens, fr);
    const score = Math.max(scoreEn, scoreFr);
    if (score <= 0.2) continue;

    // Bonus si le texte complet contient la requête complète.
    const fullEnMatch = en.includes(q) ? 0.15 : 0;
    const fullFrMatch = fr.includes(q) ? 0.15 : 0;

    scored.push({
      kind: item.kind,
      id: item.id,
      wordId: item.wordId,
      textEn: item.textEn,
      textFr: item.textFr,
      wordLabel: item.wordLabel,
      wordTranslation: item.wordTranslation,
      score: score + fullEnMatch + fullFrMatch,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/** Correction tolérante : compare deux textes normalisés, renvoie un score 0..1. */
export function tolerantMatch(expected: string, given: string): number {
  const e = normalize(expected);
  const g = normalize(given);
  if (!e || !g) return 0;
  if (e === g) return 1;
  if (e.includes(g) || g.includes(e)) return 0.85;
  // Tolérance mot à mot.
  const eTokens = e.split(" ").filter(Boolean);
  const gTokens = g.split(" ").filter(Boolean);
  let ok = 0;
  for (const et of eTokens) {
    if (gTokens.some((gt) => gt === et || levenshtein(gt, et, 1) <= 1)) ok++;
  }
  const tokenScore = ok / Math.max(eTokens.length, 1);
  const distScore = 1 - levenshtein(g, e, e.length) / Math.max(e.length, 1);
  return Math.max(tokenScore, distScore * 0.8);
}

/**
 * Découpe un texte en segments en marquant ceux qui correspondent à la
 * requête. Utilisé pour surligner les correspondances dans les résultats.
 */
export function highlightMatches(
  text: string,
  rawQuery: string
): { text: string; hit: boolean }[] {
  if (!rawQuery.trim()) return [{ text, hit: false }];
  const qNorm = normalize(rawQuery);
  const qTokens = qNorm.split(" ").filter(Boolean);
  if (qTokens.length === 0) return [{ text, hit: false }];

  const textNoAccents = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Trouve tous les intervalles correspondants (par token et sous-chaîne).
  const intervals: [number, number][] = [];
  for (const token of qTokens) {
    // Sous-chaîne exacte (sans accents).
    let idx = 0;
    while (idx < textNoAccents.length) {
      const found = textNoAccents.indexOf(token, idx);
      if (found === -1) break;
      intervals.push([found, found + token.length]);
      idx = found + 1;
    }
  }
  if (intervals.length === 0) return [{ text, hit: false }];

  // Fusionne les intervalles chevauchants.
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [s, e] of intervals) {
    if (merged.length && s <= merged[merged.length - 1][1]) {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
    } else {
      merged.push([s, e]);
    }
  }

  // Construit les segments.
  const segments: { text: string; hit: boolean }[] = [];
  let cursor = 0;
  for (const [s, e] of merged) {
    if (s > cursor) segments.push({ text: text.slice(cursor, s), hit: false });
    segments.push({ text: text.slice(s, e), hit: true });
    cursor = e;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), hit: false });
  return segments.filter((seg) => seg.text.length > 0);
}
