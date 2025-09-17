# next-mono_repo – Monorepo Next.js 15 (apps/packages)

Monorepo minimal conforme à :

- **Next.js** `15.0.3`
- **react-markdown** `10.1.0` + **remark-gfm**
- **Sass** `1.60.0`
- **AWS Amplify** `aws-amplify@6.9.0` + `@aws-amplify/ui-react`
- **Workspaces Yarn 4** (`nodeLinker: node-modules`)
- **TypeScript** `5.4.4`

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
yarn install

# Lancer chaque app en mode développement
yarn dev:desktop   # http://localhost:3000
yarn dev:mobile    # http://localhost:3001
```

## 🏗️ Structure du monorepo

- `apps/desktop` : application Next.js desktop (>= 900 px)
- `apps/mobile` : application Next.js mobile (< 900 px)
- `packages/ui` : composants UI partagés (React, SCSS)
- `packages/domain` : logique métier (TypeScript pur)
- `packages/services` : services / IO (Amplify, REST, etc.)
- `packages/types` : contrats & types partagés
- `tools` : scripts et outillage divers

## 📱🌐 Routage responsive

- **Middleware Edge** (`apps/*/middleware.ts`) : redirige vers le bon host en fonction du User-Agent.
- **RouteSync client** (`apps/*/app/RouteSync.tsx`) : ajuste côté client selon `window.innerWidth < 900` pour garantir la bonne app après hydration.
- La navigation conserve `pathname`, `?query` et `#hash` lors des bascules.

## 🔑 Variables d’environnement

Chaque app possède un fichier `.env.local.example` à copier en `.env.local` :

```
HOST_MOBILE=mobile.localhost:3001
HOST_DESKTOP=localhost:3000

NEXT_PUBLIC_HOST_MOBILE=mobile.localhost:3001
NEXT_PUBLIC_HOST_DESKTOP=localhost:3000

NEXT_PUBLIC_PLATFORM_THRESHOLD=900
```

En production, remplacer les hosts par les domaines réels (`mobile.peur-de-la-conduite.fr`, `desktop.peur-de-la-conduite.fr`).

## 🧰 Scripts utiles

- `yarn build` : `turbo run build`
- `yarn lint` : `turbo run lint`
- `yarn typecheck` : `turbo run typecheck`
- `yarn --cwd apps/desktop build` : build de l’app desktop
- `yarn --cwd apps/mobile build` : build de l’app mobile
