<p align="center">
  <img src="./assets/logo.svg" alt="Logo Gym App Front Vue" width="120" height="120" />
</p>

<h1 align="center">Gym App Front — Vue</h1>

<p align="center">
  Interface web pour salles de sport · <strong>Vue 3</strong> · <strong>Pinia</strong> · <strong>QR</strong> · API REST (backend séparé)
</p>

<div align="center">

[![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Pinia](https://img.shields.io/badge/Pinia-state-FFD859?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)

<br/>

[![Vue Router](https://img.shields.io/badge/Vue_Router-4-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://router.vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Charts-Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Dev server](https://img.shields.io/badge/dev-localhost%3A3000-64748b?style=flat-square)](http://localhost:3000)

</div>

---

Ce dépôt (**[gym-app-front-vue](https://github.com/Moustapha-Ndoye-dev/gym-app-front-vue)**) contient le **client Vue 3** pour piloter une salle : membres, abonnements, caisse, boutique, **scan QR** (contrôle d’accès) et console **super-admin** multi-salles.

L’**API** (Express, Prisma, JWT, etc.) est dans un **autre dépôt** : à cloner, configurer et lancer à part (voir ci-dessous). Sans backend démarré, le front ne peut pas s’authentifier ni charger les données.

---

## Sommaire

1. [Architecture d’exécution](#architecture-dexécution)
2. [Prérequis](#prérequis)
3. [Backend obligatoire (autre dépôt)](#backend-obligatoire-autre-depot)
4. [Installation & lancement du frontend](#installation--lancement-du-frontend)
5. [Proxy API & personnalisation](#proxy-api--personnalisation)
6. [Build production](#build-production)
7. [Stack & organisation du code](#stack--organisation-du-code)
8. [Fonctionnalités par rôle](#fonctionnalités-par-rôle)
9. [Dépannage](#dépannage)

---

## Architecture d’exécution

En **développement**, Vite expose l’application sur **http://localhost:3000** (par défaut) et **redirige** les requêtes `/api/*` vers le serveur backend (**http://localhost:5000** par défaut).

```
Navigateur  →  localhost:3000  →  Vite
                    │
                    │  fetch /api/...
                    ▼
              Proxy  →  localhost:5000/api/...  →  API REST
```

Le navigateur n’appelle que le port du front : pas de CORS bloquant en local tant que vous passez par le proxy. **Sans API démarrée**, l’application ne peut pas s’authentifier ni charger les données.

---

## Prérequis

- **Node.js** LTS  
- **npm**  
- **Backend** opérationnel sur le port attendu par le proxy (voir `vite.config.ts`)

---

## Backend obligatoire (autre dépôt)

Procédure type dans un **autre dossier** :

```bash
git clone <URL-du-depot-backend> gym-back
cd gym-back
npm install
cp .env.example .env
```

Complétez `.env` (secret JWT, mots de passe par défaut, etc.) puis :

```bash
npm run db:push
npm run db:generate
npm run dev
```

Contrôles utiles :

- `http://localhost:5000/`
- `http://localhost:5000/api/docs`

Laissez ce serveur tourner pendant le développement du front.

---

## Installation & lancement du frontend

```bash
git clone https://github.com/Moustapha-Ndoye-dev/gym-app-front-vue.git
cd gym-app-front-vue
npm install
npm run dev
```

URL locale par défaut : **http://localhost:3000**.

**Ordre conseillé :** backend puis frontend.

---

## Proxy API & personnalisation

Configuration dans `vite.config.ts` :

```ts
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

Adaptez `target` si l’API n’est pas sur `localhost:5000`. Redémarrage de Vite nécessaire après modification.

> **Production :** le résultat de `npm run build` est du statique. Il faut un **reverse proxy** (Nginx, Caddy, CloudFront + origin, etc.) qui route `/api` vers le backend, ou une **base URL** injectée au build pour que le client HTTP pointe directement vers l’API (avec CORS correctement configuré côté serveur).

---

## Build production

```bash
npm run build    # exécute vue-tsc puis vite build
npm run preview  # sert le dossier dist en local
```

Le dossier `dist/` est prêt pour tout hébergement de fichiers statiques.

---

## Stack & organisation du code

| Technologie | Rôle |
|-------------|------|
| **Vue 3.5** | Composition API, SFC |
| **TypeScript** | Typage |
| **Vite 6** | Tooling |
| **Pinia** | État global (auth, toasts, confirmations) |
| **Vue Router 4** | Routes + guards |
| **Tailwind CSS 4** | UI |
| **fetch** + en-tête `Authorization` | Appels API |
| **html5-qrcode** / **qrcode.vue** | QR |
| **Chart.js** / **vue-chartjs** | Graphiques |
| **Motion** | Animations |

Structure indicative :

```
src/
├── components/     # Layout, sidebar, modales
├── pages/          # Vues par route
├── router/         # Définition des routes et meta rôles
├── stores/         # Pinia (auth, notification, …)
├── lib/            # Utilitaires, messages d’erreur API
└── main.ts         # Bootstrap
```

---

## Fonctionnalités par rôle

Comportement aligné sur la variante **React** du produit : **admin**, **cashier**, **controller**, **member**, **superadmin** avec des ensembles de routes différents (voir `router/index.ts` et les garde-navigation).

Le **contrôleur** accède en priorité au module **contrôle d’accès** (scanner + historique).

---

## Dépannage

| Symptôme | Action |
|----------|--------|
| Erreur réseau au login | Vérifier que le backend écoute et que `target` du proxy est correct |
| Page blanche après build | Consulter la console ; vérifier le `base` Vite si déploiement sous sous-chemin |
| Token refusé | Durée de vie JWT ; horloge machine ; en-tête Bearer présent |

---

## Auteur

**Moustapha Ndoye** — ingénieur fullstack, orientation sécurité applicative et produits SaaS.
