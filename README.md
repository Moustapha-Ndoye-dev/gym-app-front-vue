<p align="center">
  <img src="./assets/readme-cover.png" alt="Gym App Front — Vue" width="920" />
</p>

<h1 align="center">Gym App Front — Vue</h1>

<p align="center">
  Application de gestion pour salles de sport — tableau de bord, membres, finances et administration multi-salles.
</p>

<div align="center">

[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Pinia](https://img.shields.io/badge/Pinia-2-FFD859?style=flat-square&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## Sommaire

1. [Vue d’ensemble](#vue-densemble)
2. [Démarrage rapide](#démarrage-rapide)
3. [API en local](#api-en-local)
4. [Proxy & configuration](#proxy--configuration)
5. [Build production](#build-production)
6. [Structure du code](#structure-du-code)
7. [Rôles](#rôles)
8. [Dépannage](#dépannage)

---

## Vue d’ensemble

**[gym-app-front-vue](https://github.com/Moustapha-Ndoye-dev/gym-app-front-vue)** est le client **Vue 3 + Vite + TypeScript** pour piloter une salle : **adhérents**, **abonnements**, **caisse**, **boutique**, **tickets**, **activités**, **utilisateurs** et **contrôle d’accès** (scanner). Un volet **super-admin** regroupe le pilotage multi-salles (tableau de bord, salles, abonnements plateforme, administrateurs).

L’état global (session, notifications, confirmations) repose sur **Pinia** ; le routage applique des **garde-navigation** selon le rôle (`src/router/index.ts`).

---

## Démarrage rapide

**Prérequis :** Node.js LTS, npm, et une **API** compatible accessible en développement (voir section suivante).

```bash
git clone https://github.com/Moustapha-Ndoye-dev/gym-app-front-vue.git
cd gym-app-front-vue
npm install
npm run dev
```

- Interface : **http://localhost:3000** (port défini dans `vite.config.ts`).
- En pratique : lancer **d’abord** le backend, puis le frontend.

---

## API en local

Le frontend ne contient pas le serveur : clonez votre dépôt API ailleurs, configurez `.env`, migrez la base si besoin, puis démarrez-le (souvent sur le port **5000** — à aligner avec le proxy Vite).

Vérifications utiles côté API : racine du service et documentation (ex. `/api/docs` si exposée).

Sans API joignable, le login et les écrans métier ne peuvent pas charger de données.

---

## Proxy & configuration

En développement, Vite **proxy** les requêtes `/api` vers le backend :

```ts
// vite.config.ts (extrait)
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
},
```

Adapter `target` si votre API n’écoute pas sur `localhost:5000`, puis **redémarrer** `npm run dev`.

**Production :** le build est statique (`dist/`). Prévoir un reverse proxy qui route `/api` vers l’API, ou une URL d’API configurée au build avec CORS corrects côté serveur.

---

## Build production

```bash
npm run build   # vue-tsc puis vite build
npm run preview # test local du dossier dist
```

---

## Structure du code

| Élément | Rôle |
|--------|------|
| Vue 3 (Composition API, SFC) | UI |
| Vue Router 4 | Routes, meta `roles`, barre de progression (NProgress) |
| Pinia | Auth, notifications, dialogue de confirmation |
| Tailwind CSS 4 | Styles |
| Chart.js + vue-chartjs | Graphiques (ex. tableau de bord) |
| html5-qrcode, qrcode.vue | Lecture et affichage de codes |
| Lucide (lucide-vue-next) | Icônes |
| Motion | Animations |
| date-fns | Dates |

Arborescence principale :

```
src/
├── components/   # Layout, sidebar, notifications, confirmations
├── pages/        # Écrans par route
├── router/       # Définition des routes et garde d’accès
├── stores/       # Pinia
├── lib/          # Utilitaires (ex. erreurs API, limites de champs)
└── main.ts
```

---

## Rôles

| Rôle | Accès principal |
|------|-----------------|
| **admin** | Tableau de bord, activités, boutique, abonnements, membres, tickets, contrôle d’accès, caisse, utilisateurs |
| **cashier** | Tableau de bord, boutique, abonnements, membres, tickets, caisse |
| **controller** | Contrôle d’accès (prioritaire pour ce profil) |
| **member** | Tableau de bord, boutique |
| **superadmin** | Routes `/super/*` : vue globale, salles, abonnements plateforme, administrateurs |

Les routes exactes sont dans `src/router/index.ts`.

---

## Dépannage

| Problème | Piste |
|----------|--------|
| Erreur réseau au login | Backend démarré ? `target` du proxy correct ? |
| Page blanche après déploiement | Console navigateur ; `base` Vite si app servie sous un sous-chemin |
| 401 / session | JWT expiré, horloge système, token absent ou refusé côté API |

---

## Licence

Voir le fichier [LICENSE](./LICENSE) (MIT).

---

## Auteur

**Moustapha Ndoye**
