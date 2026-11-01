# MyLexicon — Guide de déploiement PWA

MyLexicon est une **PWA** (Progressive Web App) 100 % hors ligne. Vos
utilisateurs peuvent l'installer directement depuis leur navigateur, sans
passer par un App Store.

## Déploiement sur Vercel (recommandé, 5 minutes)

### 1. Poussez le code sur GitHub

```bash
git init
git add .
git commit -m "MyLexicon — dictionnaire PWA"
git branch -M main
git remote add origin https://github.com/VOTRE-USER/mylexicon.git
git push -u origin main
```

### 2. Connectez Vercel

1. Allez sur https://vercel.com et connectez-vous avec GitHub
2. Cliquez **« New Project »**
3. Importez votre repo `mylexicon`
4. Vercel détecte Next.js automatiquement — cliquez **« Deploy »**
5. En 2 minutes, votre app est en ligne sur `https://mylexicon.vercel.app`

### 3. Partagez l'URL

Vos utilisateurs visitent l'URL et peuvent installer l'app (voir ci-dessous).

---

## Installation par l'utilisateur final

### Sur Android (Chrome / Edge)
- Une bannière **« Installer l'application »** apparaît automatiquement
- Ou : menu ⋮ → **« Installer l'app »**
- L'app apparaît sur l'écran d'accueil avec son icône

### Sur iPhone / iPad (Safari)
1. Touchez l'icône **Partager** (carré avec flèche)
2. **« Sur l'écran d'accueil »**
3. **« Ajouter »**
- L'app apparaît sur l'écran d'accueil, s'ouvre en plein écran

### Sur ordinateur (Chrome / Edge)
- Cliquez l'icône **⊕ Installer** dans la barre d'adresse
- Ou : menu → **« Installer MyLexicon »**

L'app installée fonctionne **hors ligne** (Service Worker) et conserve les
données localement (localStorage).

---

## Configuration PWA déjà en place

- ✅ `public/manifest.webmanifest` — manifeste valide (name, icons, display standalone)
- ✅ `public/sw.js` — Service Worker (cache offline, network-first navigation)
- ✅ Icônes 192px / 512px / 180px (apple-touch) / 32px (favicon)
- ✅ Meta tags iOS (`apple-mobile-web-app-capable`, status bar, title)
- ✅ `InstallPrompt` — bannière d'installation automatique (Chrome/Android) + instructions iOS

---

## Déploiement alternatif : hébergement statique

MyLexicon peut aussi être déployé en site statique (Netlify, GitHub Pages,
Cloudflare Pages) :

1. Ajoutez `output: "export"` dans `next.config.ts`
2. Exécutez `bun run build`
3. Uploadez le dossier `out/` sur votre hébergeur

⚠️ Le Service Worker nécessite HTTPS (fourni par tous les hébergeurs ci-dessus).

---

## Domaine personnalisé

Sur Vercel : **Settings → Domains** → ajoutez votre domaine (ex : `mylexicon.fr`).
Vercel configure HTTPS automatiquement via Let's Encrypt.
