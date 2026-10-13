// ============================================================================
// Données de démonstration MyLexicon.
// 5 fiches complètes + 2 fiches incomplètes. Supprimables depuis Réglages.
// ----------------------------------------------------------------------------

import { v4 as uuid } from "uuid";

import type { BackupData, Card, Example, Word } from "./types";
import { DAY_MS } from "./sm2";

function buildWord(
  partial: Omit<Word, "id" | "status" | "isFavorite" | "createdAt" | "updatedAt">
): Word {
  const t = Date.now();
  return {
    ...partial,
    id: uuid(),
    status: "incomplete",
    isFavorite: false,
    createdAt: t,
    updatedAt: t,
  };
}

interface DemoCard {
  type: Card["type"];
  content: string;
  translation: string;
  examples: { content: string; translation: string }[];
}

interface DemoWord {
  word: string;
  translation: string;
  partOfSpeech: Word["partOfSpeech"];
  register: Word["register"];
  context: string;
  notes: string;
  tags: string[];
  cards: DemoCard[];
  extraExamples?: { content: string; translation: string }[];
  incomplete?: boolean; // moins de 3 sur un type
}

const DEMO: DemoWord[] = [
  {
    word: "stubborn",
    translation: "têtu, obstiné",
    partOfSpeech: "adjectif",
    register: "courant",
    context: "Pour décrire une personne qui refuse de changer d'avis.",
    notes: "Souvent négatif, mais peut être neutre selon le contexte.",
    tags: ["caractère", "adjectif"],
    cards: [
      {
        type: "chunk",
        content: "a stubborn child",
        translation: "un enfant têtu",
        examples: [
          {
            content: "He was a stubborn child who refused to eat vegetables.",
            translation: "C'était un enfant têtu qui refusait de manger des légumes.",
          },
        ],
      },
      {
        type: "chunk",
        content: "stubborn resistance",
        translation: "une résistance obstinée",
        examples: [
          {
            content: "The army met stubborn resistance at the border.",
            translation: "L'armée a rencontré une résistance obstinée à la frontière.",
          },
        ],
      },
      {
        type: "chunk",
        content: "a stubborn stain",
        translation: "une tache tenace",
        examples: [
          {
            content: "This detergent removes even stubborn stains.",
            translation: "Ce détergent élimine même les taches tenaces.",
          },
        ],
      },
      {
        type: "collocation",
        content: "remain stubborn",
        translation: "rester têtu",
        examples: [
          {
            content: "She remained stubborn despite our arguments.",
            translation: "Elle est restée têtue malgré nos arguments.",
          },
        ],
      },
      {
        type: "collocation",
        content: "stubbornly refuse",
        translation: "refuser obstinément",
        examples: [
          {
            content: "He stubbornly refused to apologize.",
            translation: "Il a refusé obstinément de s'excuser.",
          },
        ],
      },
      {
        type: "collocation",
        content: "stubborn determination",
        translation: "une détermination obstinée",
        examples: [
          {
            content: "With stubborn determination, she finished the marathon.",
            translation: "Avec une détermination obstinée, elle a terminé le marathon.",
          },
        ],
      },
      {
        type: "expression",
        content: "as stubborn as a mule",
        translation: "têtu comme une mule",
        examples: [
          {
            content: "You won't change his mind — he's as stubborn as a mule.",
            translation: "Tu ne lui feras pas changer d'avis — il est têtu comme une mule.",
          },
        ],
      },
      {
        type: "expression",
        content: "a stubborn fact",
        translation: "un fait irréfutable",
        examples: [
          {
            content: "It's a stubborn fact that we can't ignore.",
            translation: "C'est un fait irréfutable qu'on ne peut ignorer.",
          },
        ],
      },
      {
        type: "expression",
        content: "dig one's heels in",
        translation: "s'enfermer dans son obstination",
        examples: [
          {
            content: "When asked to compromise, she dug her heels in.",
            translation: "Quand on lui a demandé de compromettre, elle s'est entêtée.",
          },
        ],
      },
    ],
    extraExamples: [
      {
        content: "He's too stubborn to admit he was wrong.",
        translation: "Il est trop têtu pour admettre qu'il avait tort.",
      },
    ],
  },
  {
    word: "achieve",
    translation: "atteindre, accomplir, réaliser",
    partOfSpeech: "verbe",
    register: "courant",
    context: "Atteindre un objectif, un résultat, un succès.",
    notes: "Verbe régulier : achieve, achieved, achieved.",
    tags: ["verbe", "succès", "objectif"],
    cards: [
      {
        type: "chunk",
        content: "achieve a goal",
        translation: "atteindre un objectif",
        examples: [
          {
            content: "She worked hard to achieve her goal.",
            translation: "Elle a travaillé dur pour atteindre son objectif.",
          },
        ],
      },
      {
        type: "chunk",
        content: "achieve success",
        translation: "atteindre le succès",
        examples: [
          {
            content: "He achieved success through perseverance.",
            translation: "Il a atteint le succès grâce à la persévérance.",
          },
        ],
      },
      {
        type: "chunk",
        content: "achieve a balance",
        translation: "trouver un équilibre",
        examples: [
          {
            content: "It's hard to achieve a balance between work and family.",
            translation: "Il est difficile de trouver un équilibre entre travail et famille.",
          },
        ],
      },
      {
        type: "collocation",
        content: "highly achievable",
        translation: "largement réalisable",
        examples: [
          {
            content: "The target is highly achievable this quarter.",
            translation: "L'objectif est largement réalisable ce trimestre.",
          },
        ],
      },
      {
        type: "collocation",
        content: "achieve remarkable results",
        translation: "obtenir des résultats remarquables",
        examples: [
          {
            content: "The team achieved remarkable results.",
            translation: "L'équipe a obtenu des résultats remarquables.",
          },
        ],
      },
      {
        type: "collocation",
        content: "fully achieve",
        translation: "atteindre pleinement",
        examples: [
          {
            content: "We have fully achieved what we set out to do.",
            translation: "Nous avons pleinement atteint ce que nous voulions faire.",
          },
        ],
      },
      {
        type: "expression",
        content: "achieve one's potential",
        translation: "réaliser son potentiel",
        examples: [
          {
            content: "Every child should have the chance to achieve their potential.",
            translation: "Chaque enfant devrait avoir la chance de réaliser son potentiel.",
          },
        ],
      },
      {
        type: "expression",
        content: "a sense of achievement",
        translation: "un sentiment d'accomplissement",
        examples: [
          {
            content: "She felt a real sense of achievement after the exam.",
            translation: "Elle a ressenti un vrai sentiment d'accomplissement après l'examen.",
          },
        ],
      },
      {
        type: "expression",
        content: "against all odds",
        translation: "contre toute attente",
        examples: [
          {
            content: "Against all odds, he achieved his dream of becoming a doctor.",
            translation: "Contre toute attente, il a réalisé son rêve de devenir médecin.",
          },
        ],
      },
    ],
    extraExamples: [
      {
        content: "What do you hope to achieve by doing that?",
        translation: "Qu'espères-tu accomplir en faisant ça ?",
      },
    ],
  },
  {
    word: "glimpse",
    translation: "aperçu, entrevoir",
    partOfSpeech: "nom",
    register: "soutenu",
    context: "Vue brève et momentanée de quelque chose ou quelqu'un.",
    notes: "Peut être nom ou verbe. Registre littéraire/journalistique.",
    tags: ["nom", "verbe", "registre soutenu"],
    cards: [
      {
        type: "chunk",
        content: "a brief glimpse",
        translation: "un aperçu furtif",
        examples: [
          {
            content: "I caught a brief glimpse of the sea.",
            translation: "J'ai attrapé un bref aperçu de la mer.",
          },
        ],
      },
      {
        type: "chunk",
        content: "a glimpse of the future",
        translation: "un aperçu de l'avenir",
        examples: [
          {
            content: "The exhibition offers a glimpse of the future.",
            translation: "L'exposition offre un aperçu de l'avenir.",
          },
        ],
      },
      {
        type: "chunk",
        content: "catch a glimpse",
        translation: "apercevoir fugitivement",
        examples: [
          {
            content: "She caught a glimpse of him in the crowd.",
            translation: "Elle l'aperçut furtivement dans la foule.",
          },
        ],
      },
      {
        type: "collocation",
        content: "fleeting glimpse",
        translation: "aperçu éphémère",
        examples: [
          {
            content: "We only had a fleeting glimpse of the comet.",
            translation: "Nous n'avons eu qu'un aperçu éphémère de la comète.",
          },
        ],
      },
      {
        type: "collocation",
        content: "glimpse briefly",
        translation: "entrevoir brièvement",
        examples: [
          {
            content: "He glimpsed briefly at the headlines.",
            translation: "Il a brièvement jeté un œil aux titres.",
          },
        ],
      },
      {
        type: "collocation",
        content: "rare glimpse",
        translation: "aperçu rare",
        examples: [
          {
            content: "The documentary gives a rare glimpse into their lives.",
            translation: "Le documentaire offre un aperçu rare de leur vie.",
          },
        ],
      },
      {
        type: "expression",
        content: "at a glimpse",
        translation: "en un coup d'œil",
        examples: [
          {
            content: "At a glimpse, the plan looked sound.",
            translation: "En un coup d'œil, le plan semblait solide.",
          },
        ],
      },
      {
        type: "expression",
        content: "a glimpse behind the scenes",
        translation: "un aperçu des coulisses",
        examples: [
          {
            content: "The tour gave us a glimpse behind the scenes.",
            translation: "La visite nous a donné un aperçu des coulisses.",
          },
        ],
      },
      {
        type: "expression",
        content: "glimpse of light",
        translation: "une lueur d'espoir",
        examples: [
          {
            content: "There's a glimpse of light at the end of the tunnel.",
            translation: "Il y a une lueur d'espoir au bout du tunnel.",
          },
        ],
      },
    ],
  },
  {
    word: "reluctant",
    translation: "réticent, peu disposé, à contrecœur",
    partOfSpeech: "adjectif",
    register: "courant",
    context: "Qui hésite ou n'est pas disposé à faire quelque chose.",
    notes: "Adverbe : reluctantly (à contrecœur).",
    tags: ["adjectif", "sentiment"],
    cards: [
      {
        type: "chunk",
        content: "a reluctant student",
        translation: "un élève réticent",
        examples: [
          {
            content: "He was a reluctant student at first.",
            translation: "C'était un élève réticent au début.",
          },
        ],
      },
      {
        type: "chunk",
        content: "reluctant agreement",
        translation: "un accord à contrecœur",
        examples: [
          {
            content: "She gave a reluctant agreement to the plan.",
            translation: "Elle a donné un accord à contrecœur au plan.",
          },
        ],
      },
      {
        type: "chunk",
        content: "reluctant to leave",
        translation: "réticent à partir",
        examples: [
          {
            content: "The children were reluctant to leave the park.",
            translation: "Les enfants étaient réticents à quitter le parc.",
          },
        ],
      },
      {
        type: "collocation",
        content: "deeply reluctant",
        translation: "profondément réticent",
        examples: [
          {
            content: "I was deeply reluctant to criticize him.",
            translation: "J'étais profondément réticent à le critiquer.",
          },
        ],
      },
      {
        type: "collocation",
        content: "reluctantly admit",
        translation: "admettre à contrecœur",
        examples: [
          {
            content: "He reluctantly admitted he was wrong.",
            translation: "Il a admis à contrecœur qu'il avait tort.",
          },
        ],
      },
      {
        type: "collocation",
        content: "extremely reluctant",
        translation: "extrêmement réticent",
        examples: [
          {
            content: "She was extremely reluctant to speak in public.",
            translation: "Elle était extrêmement réticente à parler en public.",
          },
        ],
      },
      {
        type: "expression",
        content: "a reluctant hero",
        translation: "un héros malgré lui",
        examples: [
          {
            content: "He became a reluctant hero after saving the child.",
            translation: "Il est devenu un héros malgré lui après avoir sauvé l'enfant.",
          },
        ],
      },
      {
        type: "expression",
        content: "drag one's feet",
        translation: "traîner des pieds (être réticent)",
        examples: [
          {
            content: "The company is dragging its feet on the new policy.",
            translation: "L'entreprise traîne des pieds sur la nouvelle politique.",
          },
        ],
      },
      {
        type: "expression",
        content: "think twice",
        translation: "hésiter, y réfléchir à deux fois",
        examples: [
          {
            content: "I'd think twice before accepting that offer.",
            translation: "Je réfléchirais à deux fois avant d'accepter cette offre.",
          },
        ],
      },
    ],
  },
  {
    word: "thorough",
    translation: "minutieux, approfondi, complet",
    partOfSpeech: "adjectif",
    register: "courant",
    context: "Qui traite un sujet en détail, sans rien laisser de côté.",
    notes: "Adverbe : thoroughly. Nom abstrait : thoroughness.",
    tags: ["adjectif", "méthode"],
    cards: [
      {
        type: "chunk",
        content: "a thorough investigation",
        translation: "une enquête approfondie",
        examples: [
          {
            content: "The police conducted a thorough investigation.",
            translation: "La police a mené une enquête approfondie.",
          },
        ],
      },
      {
        type: "chunk",
        content: "a thorough cleaning",
        translation: "un nettoyage en profondeur",
        examples: [
          {
            content: "The house needs a thorough cleaning.",
            translation: "La maison a besoin d'un nettoyage en profondeur.",
          },
        ],
      },
      {
        type: "chunk",
        content: "a thorough understanding",
        translation: "une compréhension approfondie",
        examples: [
          {
            content: "She has a thorough understanding of the subject.",
            translation: "Elle a une compréhension approfondie du sujet.",
          },
        ],
      },
      {
        type: "collocation",
        content: "thoroughly enjoyable",
        translation: "profondément agréable",
        examples: [
          {
            content: "It was a thoroughly enjoyable evening.",
            translation: "C'était une soirée profondément agréable.",
          },
        ],
      },
      {
        type: "collocation",
        content: "thoroughly check",
        translation: "vérifier minutieusement",
        examples: [
          {
            content: "Please thoroughly check the documents.",
            translation: "Veuillez vérifier minutieusement les documents.",
          },
        ],
      },
      {
        type: "collocation",
        content: "thorough and accurate",
        translation: "minutieux et précis",
        examples: [
          {
            content: "His work is always thorough and accurate.",
            translation: "Son travail est toujours minutieux et précis.",
          },
        ],
      },
      {
        type: "expression",
        content: "leave no stone unturned",
        translation: "ne laisser aucune pierre inexploitée (être très minutieux)",
        examples: [
          {
            content: "The detective left no stone unturned.",
            translation: "Le détective n'a laissé aucune pierre inexploitée.",
          },
        ],
      },
      {
        type: "expression",
        content: "inside out",
        translation: "connaître sur le bout des doigts",
        examples: [
          {
            content: "She knows the system inside out.",
            translation: "Elle connaît le système sur le bout des doigts.",
          },
        ],
      },
      {
        type: "expression",
        content: "from top to bottom",
        translation: "de fond en comble",
        examples: [
          {
            content: "We cleaned the house from top to bottom.",
            translation: "Nous avons nettoyé la maison de fond en comble.",
          },
        ],
      },
    ],
  },
  // --- Fiches incomplètes ---
  {
    word: "stagger",
    translation: "chanceler, tituber ; échelonner",
    partOfSpeech: "verbe",
    register: "courant",
    context: "Marcher en vacillant ; organiser par étapes décalées.",
    notes: "À compléter : il manque des collocations et expressions.",
    tags: ["verbe", "à compléter"],
    incomplete: true,
    cards: [
      {
        type: "chunk",
        content: "stagger to the door",
        translation: "tituber jusqu'à la porte",
        examples: [
          {
            content: "He staggered to the door, wounded.",
            translation: "Il a titubé jusqu'à la porte, blessé.",
          },
        ],
      },
      {
        type: "chunk",
        content: "staggered hours",
        translation: "horaires échelonnés",
        examples: [
          {
            content: "The company introduced staggered hours.",
            translation: "L'entreprise a introduit des horaires échelonnés.",
          },
        ],
      },
      {
        type: "chunk",
        content: "stagger under the weight",
        translation: "chanceler sous le poids",
        examples: [
          {
            content: "She staggered under the weight of the bags.",
            translation: "Elle chancelait sous le poids des sacs.",
          },
        ],
      },
      {
        type: "collocation",
        content: "stagger slightly",
        translation: "tituber légèrement",
        examples: [
          {
            content: "The old man staggered slightly on the ice.",
            translation: "Le vieil homme a légèrement titubé sur la glace.",
          },
        ],
      },
      // Manque 2 collocations et 3 expressions -> incomplète
    ],
  },
  {
    word: "quaint",
    translation: "pittoresque, old-fashioned charmant",
    partOfSpeech: "adjectif",
    register: "soutenu",
    context: "Charmant par son caractère ancien et un peu désuet.",
    notes: "Fiche à compléter.",
    tags: ["adjectif", "à compléter", "description"],
    incomplete: true,
    cards: [
      {
        type: "chunk",
        content: "a quaint village",
        translation: "un village pittoresque",
        examples: [
          {
            content: "We stayed in a quaint village in the Cotswolds.",
            translation: "Nous sommes restés dans un village pittoresque des Cotswolds.",
          },
        ],
      },
      {
        type: "chunk",
        content: "quaint customs",
        translation: "des coutumes désuètes",
        examples: [
          {
            content: "They preserve quaint customs from the past.",
            translation: "Ils préservent des coutumes désuètes du passé.",
          },
        ],
      },
      // Manque 1 chunk, 3 collocations, 3 expressions -> incomplète
    ],
  },
];

/** Construit les données de démo (fiches + cartes + exemples). */
export function buildDemoData(): {
  words: Word[];
  cards: Card[];
  examples: Example[];
} {
  const words: Word[] = [];
  const cards: Card[] = [];
  const examples: Example[] = [];
  const t = Date.now();

  for (const dw of DEMO) {
    const word = buildWord({
      word: dw.word,
      translation: dw.translation,
      partOfSpeech: dw.partOfSpeech,
      register: dw.register,
      context: dw.context,
      notes: dw.notes,
      tags: dw.tags,
    });
    words.push(word);

    for (const dc of dw.cards) {
      const card: Card = {
        id: uuid(),
        wordId: word.id,
        type: dc.type,
        content: dc.content,
        translation: dc.translation,
        mastery: 0,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        lastReviewed: null,
        nextReview: t,
        errorCount: 0,
        createdAt: t,
        updatedAt: t,
      };
      cards.push(card);

      for (const ex of dc.examples) {
        examples.push({
          id: uuid(),
          wordId: word.id,
          parentId: card.id,
          parentType: dc.type,
          content: ex.content,
          translation: ex.translation,
          personal: false,
          createdAt: t,
          updatedAt: t,
        });
      }
    }

    if (dw.extraExamples) {
      for (const ex of dw.extraExamples) {
        examples.push({
          id: uuid(),
          wordId: word.id,
          parentId: word.id,
          parentType: "word",
          content: ex.content,
          translation: ex.translation,
          personal: false,
          createdAt: t,
          updatedAt: t,
        });
      }
    }

    // Calcule le statut réel de la fiche d'après ses éléments.
    const wordCards = cards.filter((c) => c.wordId === word.id);
    const chunks = wordCards.filter((c) => c.type === "chunk").length;
    const collocations = wordCards.filter((c) => c.type === "collocation").length;
    const expressions = wordCards.filter((c) => c.type === "expression").length;
    word.status =
      chunks >= 3 && collocations >= 3 && expressions >= 3
        ? "complete"
        : "incomplete";
  }

  return { words, cards, examples };
}

/** Met le store dans un état avec quelques cartes dues pour la démo. */
export function makeSomeCardsDue(cards: Card[]): Card[] {
  // Rend certaines cartes dues "aujourd'hui" pour que l'écran Étudier soit vivant.
  return cards.map((c, i) =>
    i % 3 === 0 ? { ...c, nextReview: Date.now() - DAY_MS } : c
  );
}

/** Backup complet de démo (utilisé par loadDemoIntoStore). */
export function buildDemoBackup(): BackupData {
  const { words, cards, examples } = buildDemoData();
  return {
    app: "MyLexicon",
    version: 1,
    exportedAt: Date.now(),
    words,
    cards: makeSomeCardsDue(cards),
    examples,
    studySessions: [],
    searchHistory: [],
    settings: {
      theme: "system",
      accent: "britannique",
      fontScale: 1,
      speechRate: 0.95,
      dailyNewWordsGoal: 3,
      dailyReviewsGoal: 15,
      reminderEnabled: false,
      reminderHour: 20,
      reminderMinute: 0,
      lastActiveDay: "",
      streak: 0,
      newWordsToday: 0,
      reviewsToday: 0,
      dailyCountersDate: "",
    },
  };
}
