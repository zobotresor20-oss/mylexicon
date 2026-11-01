// ============================================================================
// Stop-list des mots-outils anglais les plus fréquents (function words).
// Ces mots sont filtrés de la liste des « mots à apprendre » en lecture active
// car ils sont rarement pertinents à apprendre isolément.
// ----------------------------------------------------------------------------

export const ENGLISH_STOP_WORDS: ReadonlySet<string> = new Set([
  // Articles
  "a", "an", "the",
  // Pronoms personnels
  "i", "me", "my", "mine", "myself",
  "you", "your", "yours", "yourself", "yourselves",
  "he", "him", "his", "himself",
  "she", "her", "hers", "herself",
  "it", "its", "itself",
  "we", "us", "our", "ours", "ourselves",
  "they", "them", "their", "theirs", "themselves",
  "this", "that", "these", "those",
  // Pronoms relatifs/interrogatifs
  "who", "whom", "whose", "which", "what", "whatever", "whoever",
  "where", "when", "why", "how",
  // Prépositions courantes
  "at", "by", "for", "with", "about", "against", "between", "into",
  "through", "during", "before", "after", "above", "below", "from", "up",
  "down", "in", "out", "on", "off", "over", "under", "again", "further",
  "then", "once", "of", "to", "than",
  // Conjonctions
  "and", "but", "or", "nor", "not", "so", "yet", "both", "either", "neither",
  "because", "as", "until", "while", "if", "unless", "although", "though",
  "since", "whether",
  // Auxiliaires et modaux
  "am", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "having",
  "do", "does", "did", "doing",
  "will", "would", "shall", "should", "may", "might", "must", "can", "could",
  "ought",
  // Quantifieurs/déterminants
  "all", "any", "each", "few", "more", "most", "other", "some", "such",
  "no", "only", "own", "same", "very", "just", "too", "also",
  "many", "much", "several", "enough",
  // Adverbes fréquents
  "here", "there", "now", "then", "today", "tomorrow", "yesterday",
  "always", "never", "often", "sometimes", "usually", "ever",
  "again", "almost", "already", "still", "yet", "even",
  "very", "really", "quite", "rather", "pretty",
  // Autres
  "yes", "no", "ok", "okay",
  "said", "say", "says", "saying",
  "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
]);

/** Vrai si le mot est un mot-outil fréquent à ignorer. */
export function isStopWord(word: string): boolean {
  return ENGLISH_STOP_WORDS.has(word.toLowerCase().trim());
}
