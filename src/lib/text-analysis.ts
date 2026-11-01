// ============================================================================
// Analyse de texte pour le mode « Lecture active ».
// Découpe un texte en tokens et identifie les mots connus du dictionnaire.
// ----------------------------------------------------------------------------

import type { Card, Word } from "./types";
import { isCognate } from "./cognates";
import { isFalseFriend } from "./false-friends";
import { isStopWord } from "./stop-words";

export interface TextToken {
  /** Texte brut du token (mot ou ponctuation). */
  raw: string;
  /** Mot normalisé (minuscules, sans ponctuation) si c'est un mot, sinon "". */
  normalized: string;
  isWord: boolean;
  /** Vrai si ce mot existe dans le dictionnaire. */
  known: boolean;
  /** Le mot d'origine si connu. */
  word?: Word;
  /** Maîtrise moyenne 0-100 si connu. */
  masteryPct?: number;
  /** Vrai si cognate (facile). */
  isCognate?: boolean;
  /** Vrai si faux-ami. */
  isFalseFriend?: boolean;
  /** Vrai si mot inconnu (non dans le dictionnaire). */
  unknown: boolean;
}

const WORD_REGEX = /[A-Za-zÀ-ÿ'-]+/g;

/**
 * Analyse un texte et renvoie la liste des tokens avec leur statut
 * (connu/inconnu/cognate/faux-ami).
 */
export function analyzeText(
  text: string,
  words: Word[],
  cards: Card[]
): TextToken[] {
  // Index des mots par forme normalisée.
  const wordMap = new Map<string, { word: Word; cards: Card[] }>();
  for (const w of words) {
    const key = w.word.toLowerCase().trim();
    if (key) wordMap.set(key, { word: w, cards: cards.filter((c) => c.wordId === w.id) });
  }

  const tokens: TextToken[] = [];
  let lastIndex = 0;
  const matches = text.matchAll(WORD_REGEX);
  for (const match of matches) {
    const raw = match[0];
    const start = match.index ?? 0;
    // Ajoute le texte intermédiaire (espaces/ponctuation) comme token non-mot.
    if (start > lastIndex) {
      tokens.push({
        raw: text.slice(lastIndex, start),
        normalized: "",
        isWord: false,
        known: false,
        unknown: false,
      });
    }
    const normalized = raw.toLowerCase().replace(/['']/g, "'");
    const entry = wordMap.get(normalized);
    if (entry) {
      const masteryPct =
        entry.cards.length > 0
          ? Math.round(
              (entry.cards.reduce((s, c) => s + c.mastery, 0) /
                (entry.cards.length * 5)) *
                100
            )
          : 0;
      tokens.push({
        raw,
        normalized,
        isWord: true,
        known: true,
        word: entry.word,
        masteryPct,
        unknown: false,
      });
    } else {
      tokens.push({
        raw,
        normalized,
        isWord: true,
        known: false,
        unknown: true,
        isCognate: isCognate(normalized),
        isFalseFriend: isFalseFriend(normalized),
      });
    }
    lastIndex = start + raw.length;
  }
  // Ajoute le reste du texte.
  if (lastIndex < text.length) {
    tokens.push({
      raw: text.slice(lastIndex),
      normalized: "",
      isWord: false,
      known: false,
      unknown: false,
    });
  }
  return tokens;
}

/** Renvoie les mots inconnus uniques (normalisés) d'un texte, hors mots-outils. */
export function getUnknownWords(tokens: TextToken[]): string[] {
  const set = new Set<string>();
  for (const t of tokens) {
    if (
      t.isWord &&
      t.unknown &&
      t.normalized.length >= 2 &&
      !isStopWord(t.normalized)
    ) {
      set.add(t.raw); // garde la casse originale du premier match
    }
  }
  return Array.from(set);
}

/** Options de tri des mots inconnus. */
export type UnknownSort = "appearance" | "length" | "alpha";

/** Trie une liste de mots inconnus selon l'option choisie. */
export function sortUnknownWords(
  words: string[],
  tokens: TextToken[],
  sort: UnknownSort
): string[] {
  if (sort === "alpha") {
    return [...words].sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  }
  if (sort === "length") {
    // Par longueur décroissante (mots longs = souvent plus riches à apprendre).
    return [...words].sort((a, b) => b.length - a.length);
  }
  // appearance : ordre d'apparition dans le texte.
  const order = new Map<string, number>();
  for (const t of tokens) {
    if (t.isWord && t.unknown && !isStopWord(t.normalized)) {
      const key = t.raw;
      if (!order.has(key)) order.set(key, order.size);
    }
  }
  return [...words].sort(
    (a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0)
  );
}
