// ============================================================================
// Base de données des faux-amis anglais-français les plus courants.
// Un faux-ami est un mot qui se ressemble entre les deux langues mais dont
// le sens diffère. Cette base permet d'alerter l'utilisateur à la saisie.
// ----------------------------------------------------------------------------

export interface FalseFriend {
  /** Mot anglais. */
  en: string;
  /** Mot français ressemblant (le piège). */
  frLookalike: string;
  /** Vrai sens en français du mot anglais. */
  realMeaning: string;
  /** Faux sens (celui du mot français ressemblant). */
  falseMeaning: string;
  /** Note explicative courte. */
  note: string;
}

export const FALSE_FRIENDS: FalseFriend[] = [
  { en: "actually", frLookalike: "actuellement", realMeaning: "en fait, réellement", falseMeaning: "currently, at the moment", note: "« actually » = en fait ; pour « actuellement » dire « currently »." },
  { en: "eventually", frLookalike: "éventuellement", realMeaning: "finalement, à terme", falseMeaning: "possibly, maybe", note: "« eventually » = finalement ; pour « éventuellement » dire « possibly »." },
  { en: "library", frLookalike: "librairie", realMeaning: "bibliothèque", falseMeaning: "bookshop", note: "« library » = bibliothèque ; « librairie » = bookshop." },
  { en: "bookshop", frLookalike: "bibliothèque", realMeaning: "librairie", falseMeaning: "library", note: "« bookshop » = librairie ; « library » = bibliothèque." },
  { en: "sympathetic", frLookalike: "sympathique", realMeaning: "compatissant, compréhensif", falseMeaning: "nice, friendly", note: "« sympathetic » = compatissant ; pour « sympathique » dire « nice/friendly »." },
  { en: "sensible", frLookalike: "sensible", realMeaning: "raisonnable, sensé", falseMeaning: "sensitive", note: "« sensible » = raisonnable ; pour « sensible » dire « sensitive »." },
  { en: "sensitive", frLookalike: "sensible", realMeaning: "sensible (qui ressent)", falseMeaning: "raisonnable", note: "« sensitive » = sensible ; « sensible » (EN) = raisonnable." },
  { en: "large", frLookalike: "large", realMeaning: "grand, de grande taille", falseMeaning: "wide (largeur)", note: "« large » (EN) = grand ; « large » (FR) = wide." },
  { en: "chair", frLookalike: "chaise", realMeaning: "chaise", falseMeaning: "—", note: "" },
  { en: "journey", frLookalike: "journée", realMeaning: "voyage, trajet", falseMeaning: "day", note: "« journey » = voyage ; « journée » = day." },
  { en: "coin", frLookalike: "coin", realMeaning: "pièce de monnaie", falseMeaning: "corner", note: "« coin » (EN) = pièce de monnaie ; « coin » (FR) = corner." },
  { en: "chair", frLookalike: "chair", realMeaning: "chaise", falseMeaning: "chair (professor)", note: "" },
  { en: "carpet", frLookalike: "carpette", realMeaning: "tapis, moquette", falseMeaning: "rug", note: "« carpet » = moquette/tapis ; « carpette » (FR) = small rug." },
  { en: "rug", frLookalike: "rigole", realMeaning: "tapis", falseMeaning: "—", note: "" },
  { en: "bless", frLookalike: "blesser", realMeaning: "bénir", falseMeaning: "to injure", note: "« bless » (EN) = bénir ; « blesser » (FR) = to injure/hurt." },
  { en: "injure", frLookalike: "injurier", realMeaning: "blesser (physiquement)", falseMeaning: "to insult", note: "« injure » (EN) = blesser ; « injurier » (FR) = to insult." },
  { en: "pretend", frLookalike: "prétendre", realMeaning: "faire semblant", falseMeaning: "to claim", note: "« pretend » = faire semblant ; « prétendre » (FR) = to claim." },
  { en: "claim", frLookalike: "clame", realMeaning: "prétendre, réclamer", falseMeaning: "—", note: "« claim » = prétendre/réclamer." },
  { en: "demand", frLookalike: "demande", realMeaning: "exiger", falseMeaning: "to ask politely", note: "« demand » (EN) = exiger (fort) ; « demande » (FR) = request." },
  { en: "request", frLookalike: "requête", realMeaning: "demande polie", falseMeaning: "—", note: "« request » = demande polie." },
  { en: "rest", frLookalike: "reste", realMeaning: "se reposer", falseMeaning: "the rest (le reste)", note: "« rest » (EN) = se reposer OU le reste selon le contexte." },
  { en: "pass", frLookalike: "passer", realMeaning: "réussir (un examen), passer (un objet)", falseMeaning: "to spend time", note: "« pass an exam » = réussir un examen (pas « passer un examen »)." },
  { en: "attend", frLookalike: "attendre", realMeaning: "assister à", falseMeaning: "to wait", note: "« attend » = assister à ; « attendre » (FR) = to wait." },
  { en: "wait", frLookalike: "guetter", realMeaning: "attendre", falseMeaning: "—", note: "« wait » = attendre." },
  { en: "assist", frLookalike: "assister", realMeaning: "aider", falseMeaning: "to attend", note: "« assist » (EN) = aider ; « assister à » (FR) = to attend." },
  { en: "comprehensive", frLookalike: "compréhensif", realMeaning: "complet, exhaustif", falseMeaning: "understanding", note: "« comprehensive » = complet ; pour « compréhensif » dire « understanding »." },
  { en: "understanding", frLookalike: "compréhensif", realMeaning: "compréhensif", falseMeaning: "—", note: "« understanding » = compréhensif." },
  { en: "deception", frLookalike: "déception", realMeaning: "tromperie, mensonge", falseMeaning: "disappointment", note: "« deception » = tromperie ; « déception » (FR) = disappointment." },
  { en: "disappointment", frLookalike: "désappointement", realMeaning: "déception", falseMeaning: "—", note: "« disappointment » = déception." },
  { en: "fabric", frLookalike: "fabrique", realMeaning: "tissu, étoffe", falseMeaning: "factory", note: "« fabric » = tissu ; « fabrique » (FR) = factory." },
  { en: "factory", frLookalike: "facture", realMeaning: "usine, fabrique", falseMeaning: "bill/invoice", note: "« factory » = usine ; « facture » (FR) = bill." },
  { en: "figure", frLookalike: "figure", realMeaning: "chiffre, silhouette", falseMeaning: "face", note: "« figure » = chiffre/silhouette ; « figure » (FR) = face." },
  { en: "face", frLookalike: "fesse", realMeaning: "visage", falseMeaning: "buttock", note: "« face » = visage ; « fesse » (FR) = buttock." },
  { en: "grape", frLookalike: "grappe", realMeaning: "raisin", falseMeaning: "bunch", note: "« grape » = raisin ; « grappe » (FR) = bunch." },
  { en: "bunch", frLookalike: "branche", realMeaning: "botte, grappe", falseMeaning: "branch", note: "« bunch » = botte/grappe ; « branche » (FR) = branch." },
  { en: "branch", frLookalike: "branche", realMeaning: "branche (arbre/filiale)", falseMeaning: "—", note: "« branch » = branche." },
  { en: "location", frLookalike: "location", realMeaning: "emplacement, endroit", falseMeaning: "rental", note: "« location » (EN) = endroit ; « location » (FR) = rental." },
  { en: "rental", frLookalike: "rente", realMeaning: "location (action de louer)", falseMeaning: "annuity", note: "« rental » = location ; « rente » (FR) = annuity." },
  { en: "occasion", frLookalike: "occasion", realMeaning: "occasion, événement", falseMeaning: "bargain/second-hand", note: "« occasion » (EN) = événement ; « occasion » (FR, achat) = second-hand." },
  { en: "bargain", frLookalike: "bargain", realMeaning: "bonne affaire", falseMeaning: "—", note: "« bargain » = bonne affaire." },
  { en: "pet", frLookalike: "pète", realMeaning: "animal de compagnie", falseMeaning: "fart", note: "« pet » = animal de compagnie." },
  { en: "chat", frLookalike: "chat", realMeaning: "discuter, bavarder", falseMeaning: "cat", note: "« chat » (EN) = discuter ; « chat » (FR) = cat." },
  { en: "cat", frLookalike: "chat", realMeaning: "chat (animal)", falseMeaning: "—", note: "« cat » = chat (animal)." },
  { en: "mouse", frLookalike: "mousse", realMeaning: "souris", falseMeaning: "foam/moss", note: "« mouse » = souris ; « mousse » (FR) = foam/moss." },
  { en: "rat", frLookalike: "rat", realMeaning: "rat (animal)", falseMeaning: "—", note: "« rat » = rat." },
  { en: "gift", frLookalike: "gift", realMeaning: "cadeau", falseMeaning: "poison", note: "« gift » (EN) = cadeau ; « gift » (DE) = poison. À connaître." },
  { en: "present", frLookalike: "présent", realMeaning: "cadeau / actuel", falseMeaning: "—", note: "« present » = cadeau OU présent (adj)." },
  { en: "napkin", frLookalike: "nappe", realMeaning: "serviette (de table)", falseMeaning: "tablecloth", note: "« napkin » = serviette ; « nappe » (FR) = tablecloth." },
  { en: "tablecloth", frLookalike: "tablette", realMeaning: "nappe", falseMeaning: "shelf/tablet", note: "« tablecloth » = nappe ; « tablette » (FR) = shelf/tablet." },
  { en: "salt", frLookalike: "sale", realMeaning: "sel", falseMeaning: "dirty", note: "« salt » = sel ; « sale » (FR) = dirty." },
  { en: "sale", frLookalike: "sale", realMeaning: "vente, soldes", falseMeaning: "dirty", note: "« sale » (EN) = vente ; « sale » (FR) = dirty." },
  { en: "battery", frLookalike: "batterie", realMeaning: "pile, batterie", falseMeaning: "—", note: "« battery » = pile/batterie." },
  { en: "venue", frLookalike: "venir", realMeaning: "lieu (d'événement)", falseMeaning: "to come", note: "« venue » = lieu ; « venir » (FR) = to come." },
  { en: "voyage", frLookalike: "voyage", realMeaning: "voyage (long trajet)", falseMeaning: "—", note: "« voyage » = voyage (long). Identique mais usage plus limité qu'en FR." },
  { en: "trip", frLookalike: "tripe", realMeaning: "voyage court", falseMeaning: "tripe (offal)", note: "« trip » = voyage court ; « tripe » (FR) = offal/tripe." },
  { en: "memory", frLookalike: "mémoire", realMeaning: "souvenir, mémoire", falseMeaning: "—", note: "« memory » = souvenir/mémoire." },
  { en: "souvenir", frLookalike: "souvenir", realMeaning: "souvenir (objet)", falseMeaning: "memory (abstract)", note: "« souvenir » (EN) = objet souvenir ; « souvenir » (FR) = memory." },
  { en: "blessing", frLookalike: "blesser", realMeaning: "bénédiction", falseMeaning: "injury", note: "« blessing » = bénédiction ; « blesser » (FR) = to injure." },
];

/** Cherche un faux-ami pour un mot anglais donné (insensible à la casse). */
export function findFalseFriend(wordEn: string): FalseFriend | null {
  const w = wordEn.trim().toLowerCase();
  if (!w) return null;
  // Ne considère comme faux-ami que les entrées ayant un VRAI faux sens
  // (falseMeaning renseigné et différent de "—"). Les autres sont des
  // cognates ou des mots neutres, pas des pièges.
  return (
    FALSE_FRIENDS.find(
      (f) =>
        f.en.toLowerCase() === w &&
        f.falseMeaning &&
        f.falseMeaning !== "—" &&
        f.falseMeaning.trim() !== ""
    ) ?? null
  );
}

/** Vrai si le mot anglais donné est un faux-ami répertorié. */
export function isFalseFriend(wordEn: string): boolean {
  return findFalseFriend(wordEn) !== null;
}

/**
 * Génère une question de quiz sur un faux-ami : "Que signifie 'X' ?"
 * avec comme distracteurs le faux sens (le piège) et d'autres sens.
 */
export function buildFalseFriendQuestion(
  ff: FalseFriend,
  distractors: string[]
): { prompt: string; answer: string; choices: string[]; note: string } {
  const choices = [ff.realMeaning, ff.falseMeaning, ...distractors.slice(0, 2)];
  // Mélange simple.
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return {
    prompt: `Que signifie réellement « ${ff.en} » ?`,
    answer: ff.realMeaning,
    choices,
    note: ff.note,
  };
}
