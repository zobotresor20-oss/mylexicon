// ============================================================================
// Algorithme SM-2 (Spaced Repetition) — variante pour MyLexicon.
// Chaque carte possède : easeFactor, interval, repetitions, nextReview.
// quality : 0 (raté) à 5 (parfait).
// ============================================================================

export interface Sm2State {
  easeFactor: number;
  interval: number;
  repetitions: number;
  lastReviewed: number | null;
  nextReview: number;
}

export const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Met à jour l'état SM-2 d'une carte après une réponse.
 * quality : 0..3 = raté, 4..5 = réussi.
 */
export function reviewSm2(
  prev: Sm2State,
  quality: number,
  now: number = Date.now()
): Sm2State {
  let { easeFactor, interval, repetitions } = prev;

  if (quality < 3) {
    // Raté : on remet à zéro, intervalle court.
    repetitions = 0;
    interval = 1;
  } else {
    // Réussi.
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 3;
    else interval = Math.round(interval * easeFactor);
  }

  // Mise à jour du facteur de facilité.
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;
  if (easeFactor > 2.8) easeFactor = 2.8;

  const nextReview = now + interval * DAY_MS;

  return {
    easeFactor,
    interval,
    repetitions,
    lastReviewed: now,
    nextReview,
  };
}

/** Carte due (à réviser aujourd'hui ou en retard). */
export function isDue(nextReview: number, now: number = Date.now()): boolean {
  return nextReview <= now;
}

/** Niveau de maîtrise déduit des répétitions et de l'intervalle. */
export function masteryLevel(repetitions: number, interval: number): number {
  if (repetitions === 0) return 0;
  if (interval < 3) return 1;
  if (interval < 7) return 2;
  if (interval < 21) return 3;
  if (interval < 60) return 4;
  return 5;
}
