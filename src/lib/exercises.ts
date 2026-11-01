// ============================================================================
// Générateur d'exercices pour l'étude active.
// Produit différents types de questions à partir des données du dictionnaire.
// ----------------------------------------------------------------------------

import type { Card, Example, Word } from "./types";

export type ExerciseType =
  | "fill-blanks"
  | "collocation"
  | "scrambled"
  | "qcm-expression"
  | "matching"
  | "dictation"
  | "pronunciation";

export interface Question {
  id: string;
  type: ExerciseType;
  prompt: string;
  /** Texte audio (anglais) à prononcer si pertinent. */
  audio?: string;
  /** Réponse attendue (norme). */
  answer: string;
  /** Traduction / sens de la réponse. */
  answerTranslation: string;
  /** Choix pour le QCM. */
  choices?: string[];
  /** Pour matching : paires à associer. */
  pairs?: { left: string; right: string }[];
  /** Indice progressif. */
  hint: string;
  /** Mot d'origine. */
  wordLabel: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Construit un texte à trous à partir d'un exemple. */
function makeFillBlank(ex: Example): Question | null {
  const tokens = ex.content.split(/\s+/);
  if (tokens.length < 3) return null;
  // Cache un mot "porteur" (longueur >= 3).
  const candidates = tokens
    .map((t, i) => ({ t: t.replace(/[.,!?;:]/g, ""), i }))
    .filter((x) => x.t.length >= 3);
  if (candidates.length === 0) return null;
  const target = pick(candidates)!;
  const answer = target.t;
  const masked = tokens
    .map((t, i) => (i === target.i ? "______" : t))
    .join(" ");
  return {
    id: ex.id + "-fb",
    type: "fill-blanks",
    prompt: masked,
    answer,
    answerTranslation: ex.translation,
    hint: `${answer.length} lettres — commence par « ${answer[0]} »`,
    wordLabel: "",
  };
}

/** Collocation à compléter : donne la traduction et un mot, trouve l'autre. */
function makeCollocation(card: Card): Question {
  const tokens = card.content.split(/\s+/);
  const hideIdx = tokens.length - 1;
  const answer = tokens[hideIdx].replace(/[.,!?;:]/g, "");
  const masked = tokens.map((t, i) => (i === hideIdx ? "______" : t)).join(" ");
  return {
    id: card.id + "-col",
    type: "collocation",
    prompt: `Complétez : ${masked}\n(sens : ${card.translation})`,
    answer,
    answerTranslation: card.translation,
    audio: card.content,
    hint: `${answer.length} lettres`,
    wordLabel: "",
  };
}

/** Chunk mélangé à reconstituer. */
function makeScrambled(card: Card): Question {
  const tokens = card.content.split(/\s+/);
  const scrambled = shuffle(tokens);
  return {
    id: card.id + "-sc",
    type: "scrambled",
    prompt: `Reconstituez : « ${scrambled.join(" ")} »\n(sens : ${card.translation})`,
    answer: card.content,
    answerTranslation: card.translation,
    audio: card.content,
    hint: `Commence par « ${card.content.split(" ")[0]} »`,
    wordLabel: "",
  };
}

/** QCM sur le sens d'une expression idiomatique. */
function makeQcmExpression(target: Card, all: Card[]): Question | null {
  const distractors = shuffle(all.filter((c) => c.id !== target.id && c.type === "expression"))
    .slice(0, 3)
    .map((c) => c.translation);
  if (distractors.length < 3) return null;
  const choices = shuffle([target.translation, ...distractors]);
  return {
    id: target.id + "-qcm",
    type: "qcm-expression",
    prompt: `Que signifie l'expression « ${target.content} » ?`,
    answer: target.translation,
    answerTranslation: target.translation,
    choices,
    audio: target.content,
    hint: "Choisissez la traduction la plus juste.",
    wordLabel: "",
  };
}

/** Association mot <-> traduction. */
function makeMatching(cards: Card[]): Question | null {
  const picked = shuffle(cards).slice(0, 4);
  if (picked.length < 4) return null;
  const pairs = picked.map((c) => ({ left: c.content, right: c.translation }));
  return {
    id: "matching-" + Date.now(),
    type: "matching",
    prompt: "Associez chaque élément à sa traduction.",
    answer: "",
    answerTranslation: "",
    pairs: shuffle(pairs).map((p, i) => ({
      left: p.left,
      right: shuffle(pairs)[i].right,
    })),
    hint: "Touchez une carte de gauche puis sa traduction à droite.",
    wordLabel: "",
  };
}

/** Dictée : on prononce, l'utilisateur écrit. */
function makeDictation(ex: Example): Question {
  return {
    id: ex.id + "-dic",
    type: "dictation",
    prompt: "Écoutez et écrivez la phrase entendue (en anglais).",
    answer: ex.content,
    answerTranslation: ex.translation,
    audio: ex.content,
    hint: `${ex.content.split(" ").length} mots`,
    wordLabel: "",
  };
}

/** Prononciation : l'utilisateur parle, on compare avec le texte attendu. */
function makePronunciation(card: Card): Question {
  return {
    id: card.id + "-pro",
    type: "pronunciation",
    prompt: `Prononcez à voix haute : « ${card.content} »`,
    answer: card.content,
    answerTranslation: card.translation,
    audio: card.content,
    hint: `${card.content.split(" ").length} mot(s)`,
    wordLabel: "",
  };
}

export interface GenerateOptions {
  types: ExerciseType[];
  count: number;
  /** Restrict to these word ids (empty = all). */
  wordIds: string[];
}

/** Génère une liste de questions mélangées. */
export function generateExercises(
  words: Word[],
  cards: Card[],
  examples: Example[],
  opts: GenerateOptions
): Question[] {
  const pool = opts.wordIds.length
    ? cards.filter((c) => opts.wordIds.includes(c.wordId))
    : cards;
  const exPool = opts.wordIds.length
    ? examples.filter((e) => opts.wordIds.includes(e.wordId))
    : examples;

  const questions: Question[] = [];
  const expressions = pool.filter((c) => c.type === "expression");

  let attempts = 0;
  while (questions.length < opts.count && attempts < opts.count * 6) {
    attempts++;
    const type = opts.types[Math.floor(Math.random() * opts.types.length)];
    let q: Question | null = null;
    switch (type) {
      case "fill-blanks": {
        const ex = pick(exPool);
        if (ex) q = makeFillBlank(ex);
        break;
      }
      case "collocation": {
        const c = pick(pool.filter((x) => x.type === "collocation")) || pick(pool);
        if (c) q = makeCollocation(c);
        break;
      }
      case "scrambled": {
        const c = pick(pool.filter((x) => x.type === "chunk")) || pick(pool);
        if (c) q = makeScrambled(c);
        break;
      }
      case "qcm-expression": {
        if (expressions.length >= 4) {
          const c = pick(expressions);
          if (c) q = makeQcmExpression(c, pool);
        }
        break;
      }
      case "matching": {
        q = makeMatching(pool);
        break;
      }
      case "dictation": {
        const ex = pick(exPool);
        if (ex) q = makeDictation(ex);
        break;
      }
      case "pronunciation": {
        const c = pick(pool);
        if (c) q = makePronunciation(c);
        break;
      }
    }
    if (q && !questions.some((x) => x.id === q!.id)) questions.push(q);
  }
  return questions;
}
