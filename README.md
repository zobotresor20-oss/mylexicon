# MyLexicon — Dictionnaire personnel anglais-français

Application web mobile-first (PWA) de dictionnaire personnel anglais↔français
avec étude active du vocabulaire. **100 % hors ligne**, aucune donnée envoyée
en ligne.

## Fonctionnalités

- **Dictionnaire** : fiches (mot, traduction FR, nature, contexte, notes, étiquettes) avec chunks, collocations, expressions et exemples
- **Recherche bidirectionnelle** tolérante (fautes, accents oubliés, mots partiels) avec surlignage
- **Étude active** : flashcards bi-sens (SM-2), rappel libre, exercices (texte à trous, QCM, dictée, prononciation, traduction inverse), mini-texte du jour, lecture active
- **Faux-amis & cognates** : détection automatique + alertes + quiz dédié
- **Statistiques** : série, taux de réussite, heatmap d'activité, donut par nature grammaticale, mot du jour
- **Prononciation** : Web Speech API (accent britannique/américain, vitesse réglable)
- **Reconnaissance vocale** : exercice de prononciation avec score
- **Import/Export** : JSON (sauvegarde), CSV (dictionnaire), Anki Cloze, import CSV externe
- **PWA installable** : fonctionne hors ligne, installable sur Android/iOS/desktop
- **Mode sombre/clair**, taille de police réglable

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Zustand (persistance localStorage)
- Framer Motion (animations)
- Recharts (graphiques)

## Démarrage

```bash
bun install
bun run dev    # http://localhost:3000
```

## Déploiement

Voir [`DEPLOYMENT.md`](./DEPLOYMENT.md) — déploiement Vercel en 5 minutes.

## Licence

MIT
