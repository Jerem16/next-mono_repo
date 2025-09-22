# Audit Turbo du monorepo

## Résumé exécutif
- **État général : quasi-prêt.** Turbo est configuré et couvre les tâches standards, mais il dépend d’un socle de scripts incomplet côté packages (pas de `typecheck`, lint pointant vers un fichier absent) et d’outputs encore trop globaux pour fiabiliser le cache distribué.【F:turbo.json†L1-L54】【F:packages/domain/package.json†L21-L25】【F:packages/services/package.json†L28-L33】【F:packages/types/package.json†L21-L25】【F:packages/ui/package.json†L28-L33】
- **Risques critiques :**
  - Résolution TypeScript bancale dans les apps Desktop et Mobile : les alias `@packages/*` pointent vers `packages/...` sans remonter de deux niveaux, ce qui casse la résolution hors IDE/Next et expose à des erreurs silencieuses au build.【F:apps/desktop/tsconfig.json†L1-L60】【F:apps/mobile/tsconfig.json†L1-L60】
  - Mismatch `react` 18 / `@types/react` 19 sur trois apps Next, source de divergences de types et de warnings TS/ESLint difficiles à mettre en cache.【F:apps/admin/package.json†L35-L62】【F:apps/desktop/package.json†L35-L62】【F:apps/mobile/package.json†L35-L62】
  - Le lint racine oublie l’app `apps/main`, ce qui fausse les rapports Turbo et CI et laisse filer des régressions ESLint.【F:package.json†L14-L26】
  - Les packages publient leurs types via `typesVersions` pointant sur `src/*`, empêchant Turbo de se reposer sur `dist/` et rendant nécessaire une compilation préalable avant chaque app Next.【F:packages/domain/package.json†L14-L25】【F:packages/services/package.json†L18-L33】【F:packages/types/package.json†L14-L26】【F:packages/ui/package.json†L18-L33】
- **Effort estimé** : ~1,5 à 2,5 journées pour corriger les alias, réaligner les types React, normaliser les `tsconfig.build.json`, nettoyer les scripts et ajuster `turbo.json`, puis sécuriser la CI.

## Carte du monorepo
| Workspace | Type | Framework | Scripts (dev/start/build/typecheck/lint/test) | Port | TypeScript (config → points clés) | ESLint |
| --- | --- | --- | --- | --- | --- | --- |
| apps/admin | App | Next 15 | ✅ / ✅ / ✅ / ✅ / ✅ / placeholder | 3003 | `tsconfig.json` → `noEmit`, refs packages, alias complets, `skipLibCheck`, `incremental`【F:apps/admin/package.json†L5-L13】【F:apps/admin/tsconfig.json†L1-L63】 | Flat config racine avec plugin Next【F:eslint.config.mjs†L1-L109】 |
| apps/desktop | App | Next 15 | ✅ / ✅ / ✅ / ✅ / ✅ / placeholder | 3001 | `tsconfig.json` → `noEmit`, refs packages, alias **cassés**, `skipLibCheck`, `incremental`【F:apps/desktop/package.json†L5-L13】【F:apps/desktop/tsconfig.json†L1-L60】 | Flat config racine avec plugin Next【F:eslint.config.mjs†L26-L92】 |
| apps/main | App | Next 15 | ✅ / ✅ / ✅ / ✅ / ✅ / placeholder | 3000 | `tsconfig.json` → `noEmit`, pas de refs, `strict` désactivé, `incremental`【F:apps/main/package.json†L5-L13】【F:apps/main/tsconfig.json†L1-L24】 | Flat config racine avec plugin Next【F:eslint.config.mjs†L26-L92】 |
| apps/mobile | App | Next 15 | ✅ / ✅ / ✅ / ✅ / ✅ / placeholder | 3002 | `tsconfig.json` → `noEmit`, refs packages, alias **cassés**, `skipLibCheck`, `incremental`【F:apps/mobile/package.json†L5-L13】【F:apps/mobile/tsconfig.json†L1-L60】 | Flat config racine avec plugin Next【F:eslint.config.mjs†L26-L92】 |
| @packages/domain | Package | TS lib | – / – / ✅ / – / ⚠️ (`eslint.config.js` manquant) / placeholder | – | `tsconfig.json` → composite, `outDir` dist, refs `types`, pas de `tsconfig.build` dédié【F:packages/domain/package.json†L21-L25】【F:packages/domain/tsconfig.json†L1-L15】【ede4c8†L1-L2】 | Repose implicitement sur le flat config (script cassé)【F:packages/domain/package.json†L21-L25】【F:eslint.config.mjs†L112-L151】 |
| @packages/services | Package | TS lib | – / – / ✅ / – / ⚠️ / placeholder | – | `tsconfig.json` → composite, `emitDeclarationOnly`, pas de refs, pas de `tsconfig.build`【F:packages/services/package.json†L28-L33】【F:packages/services/tsconfig.json†L1-L20】【e45502†L1-L2】 | Script lint cassé, dépend du flat config【F:packages/services/package.json†L28-L33】【F:eslint.config.mjs†L112-L151】 |
| @packages/types | Package | TS lib | – / – / ✅ / – / ⚠️ / placeholder | – | `tsconfig.json` → composite, declarations + JS, pas de refs, pas de `tsconfig.build`【F:packages/types/package.json†L21-L25】【F:packages/types/tsconfig.json†L1-L14】【31a1cb†L1-L2】 | Script lint cassé, dépend du flat config【F:packages/types/package.json†L21-L25】【F:eslint.config.mjs†L112-L151】 |
| @packages/ui | Package | TS lib | – / – / ✅ / – / ⚠️ / placeholder | – | `tsconfig.json` → composite, `emitDeclarationOnly`, refs types/services, alias internes, pas de `tsconfig.build`【F:packages/ui/package.json†L28-L33】【F:packages/ui/tsconfig.json†L1-L27】【7e6a6b†L1-L2】 | Script lint cassé, dépend du flat config【F:packages/ui/package.json†L28-L33】【F:eslint.config.mjs†L112-L151】 |
| @packages/eslint-config | Package | Config ESLint | – / – / – / – / – / – | – | Pas de TS (exports JS)【F:packages/eslint-config/package.json†L1-L22】 | Fournit la config Next/React réutilisée【F:packages/eslint-config/next.js†L1-L79】 |

## Diagnostic détaillé par app
### Admin (`apps/admin`)
- **Scripts** : `dev`, `build`, `start`, `lint`, `typecheck` présents ; `test` est un placeholder qu’il faudra remplacer pour tirer parti de `turbo run test`.【F:apps/admin/package.json†L5-L13】 
- **Port** : 3003 déclaré côté `dev` et `start`, rien à réserver.【F:apps/admin/package.json†L6-L8】
- **TypeScript** : `noEmit`, `incremental` et `skipLibCheck` activés, alias cohérents (`../../packages/...`), références sur `types`, `domain`, `services`, `ui` pour le mode projet.【F:apps/admin/tsconfig.json†L1-L63】 
- **Dépendances critiques** : React 18.2.0 mais `@types/react` 19.1.12 → incohérence à corriger avant de geler le cache Turbo/TS.【F:apps/admin/package.json†L35-L62】
- **ESLint** : couvert par le flat config avec preset Next (plugin présent).【F:eslint.config.mjs†L26-L92】

### Desktop (`apps/desktop`)
- **Scripts** identiques à Admin, `test` toujours factice.【F:apps/desktop/package.json†L5-L13】
- **Port** : 3001 sur `dev`/`start`.【F:apps/desktop/package.json†L6-L8】
- **TypeScript** : même base (`noEmit`, `incremental`), mais les alias `@packages/*` pointent vers `packages/...` (sans `../../`) → résolutions erronées hors contexte Next, risque de chemins non trouvés avec `tsc -b` ou dans Turbo cache.【F:apps/desktop/tsconfig.json†L1-L38】
- **Dépendances** : même mismatch `react`/`@types/react` qu’Admin.【F:apps/desktop/package.json†L35-L62】
- **ESLint** : plugin Next actif via la config racine.【F:eslint.config.mjs†L26-L92】

### Mobile (`apps/mobile`)
- **Scripts & port** : clones de Desktop (port 3002).【F:apps/mobile/package.json†L5-L13】
- **TypeScript** : mêmes alias incorrects que Desktop, à réaligner.【F:apps/mobile/tsconfig.json†L1-L38】
- **Dépendances** : même mismatch React/types.【F:apps/mobile/package.json†L35-L62】
- **ESLint** : couvert par le flat config Next.【F:eslint.config.mjs†L26-L92】

### Main (`apps/main`)
- **Scripts** : Next classique, `test` à implémenter.【F:apps/main/package.json†L5-L13】
- **Port** : 3000.【F:apps/main/package.json†L6-L8】
- **TypeScript** : projet isolé (pas de `references`), `noEmit` + `incremental`, mais `strict` à `false` avec uniquement `strictNullChecks` → incohérences de règles qui compliquent la mutualisation du cache de type. Pas d’alias spécifiques.【F:apps/main/tsconfig.json†L1-L24】
- **ESLint** : géré par le preset Next commun.【F:eslint.config.mjs†L26-L92】
- **Couverture lint** : non incluse dans `yarn lint` racine, donc exclue des pipelines actuels Turbo/CI.【F:package.json†L14-L26】

## Diagnostic packages
### `@packages/domain`
- **Structure** : seulement `package.json`, `src`, `tsconfig.json` (pas de `tsconfig.build.json`).【ede4c8†L1-L2】
- **Exports** : `main`/`types` vers `dist/`, mais `typesVersions` renvoie vers `src/*`, empêchant un usage direct des artefacts compilés.【F:packages/domain/package.json†L6-L25】
- **Scripts** : `build` (`tsc --build`) et `tsc --noEmit`, mais pas de `typecheck`; `lint` cible `eslint.config.js` absent → échec garanti si appelé par Turbo/CI.【F:packages/domain/package.json†L21-L25】
- **TSConfig** : composite + `outDir dist` + `tsBuildInfo` dans `dist/.tsbuildinfo`, ref sur `../types`, mais pas d’`emitDeclarationOnly` (émet JS+types).【F:packages/domain/tsconfig.json†L1-L15】

### `@packages/services`
- **Structure** : idem (pas de `tsconfig.build.json`).【e45502†L1-L2】
- **Exports** : sous-chemins `.` et `./amplify`, types pointent vers `dist`, `typesVersions` vers `src` (collision).【F:packages/services/package.json†L6-L26】
- **Scripts** : mêmes problèmes de `typecheck` absent et lint cassé.【F:packages/services/package.json†L28-L33】
- **TSConfig** : composite + `emitDeclarationOnly`, mais aucune `references` vers `domain`/`types` malgré des dépendances, ce qui empêche `tsc -b` d’orchestrer l’ordre automatiquement.【F:packages/services/tsconfig.json†L1-L20】【F:packages/services/package.json†L34-L37】

### `@packages/types`
- **Structure** : pas de `tsconfig.build.json`.【31a1cb†L1-L2】
- **Exports** : `dist` mais `typesVersions` vers `src/*`.【F:packages/types/package.json†L6-L26】
- **Scripts** : mêmes lacunes (`typecheck`, lint cassé).【F:packages/types/package.json†L21-L25】
- **TSConfig** : composite, `outDir dist`, pas d’`emitDeclarationOnly` (émet JS inutile).【F:packages/types/tsconfig.json†L1-L14】

### `@packages/ui`
- **Structure** : pas de `tsconfig.build.json`.【7e6a6b†L1-L2】
- **Exports** : `dist` + sous-chemin `./auth`, `typesVersions` sur `src/*`/`src/auth/*`.【F:packages/ui/package.json†L6-L33】
- **Scripts** : mêmes problèmes de `typecheck` absent & lint cassé.【F:packages/ui/package.json†L28-L33】
- **TSConfig** : composite, `emitDeclarationOnly`, `paths` locaux (`@packages/ui/*` → `src/*`) et références vers `types` + `services` → ok une fois les autres projets réparés.【F:packages/ui/tsconfig.json†L1-L27】

### `@packages/eslint-config`
- Fournit les presets Next/React partagés, aucune tâche Turbo directe mais indispensable pour que le flat config expose le plugin Next dans toutes les apps.【F:packages/eslint-config/package.json†L1-L22】【F:packages/eslint-config/next.js†L1-L79】

## État de `turbo.json`
- **Pipeline actuel** : tâches `dev`/`start` non cachées mais persistantes, `build` dépend de `^build` avec outputs globaux `.next/**`, `dist/**`, `build/**`, `typecheck`/`lint` sans outputs, `test` dépend de `^build` et publie `coverage/**` + `junit.xml`.【F:turbo.json†L1-L53】
- **Points de friction** :
  1. **Scripts manquants** : `turbo run typecheck` et `turbo run lint` ne couvrent pas les packages (scripts inexistants ou cassés) → le graphe Turbo ignore ces projets.【F:packages/domain/package.json†L21-L25】【F:packages/services/package.json†L28-L33】【F:packages/types/package.json†L21-L25】【F:packages/ui/package.json†L28-L33】
  2. **Outputs globaux** : `.next/**` ou `dist/**` sans préfixe workspace mélangent potentiellement des artefacts (ex. `dist/` accidentel à la racine, `.next` temporaire dans un script). Un ciblage `apps/*/.next/**` et `packages/*/dist/**` fiabiliserait le cache et réduit les invalidations.【F:turbo.json†L28-L35】
  3. **Absence d’outputs `.tsbuildinfo` dédiés** : même si inclus dans `dist/**`, les déclarer explicitement (`packages/*/dist/.tsbuildinfo`) rend les diagnostics Turbo plus précis (affichage des fichiers produits).【F:packages/domain/tsconfig.json†L4-L11】【F:packages/services/tsconfig.json†L4-L13】【F:packages/types/tsconfig.json†L4-L11】【F:packages/ui/tsconfig.json†L4-L19】
  4. **Couverture `coverage/**` globale** : risque de collision si plusieurs workspaces génèrent des rapports (ex. `apps/admin/coverage`). Préférer `apps/*/coverage/**`, `packages/*/coverage/**`.
- **Pipeline recommandé (conceptuel)** :
  - Ajuster `outputs` (`apps/*/.next/**`, `apps/*/tsconfig.tsbuildinfo`, `packages/*/dist/**`, `packages/*/dist/.tsbuildinfo`, `packages/*/coverage/**`).
  - Ajouter `dependsOn: ['^typecheck']` à `build` pour forcer l’ordre typecheck→build une fois les scripts disponibles.
  - Déclarer `cache: false` sur `test` seulement pour les apps Next (via `dependsOn` + `inputs`) si les tests restent placeholder.

## Caches & CI
- **Caches à prévoir** :
  - `.next/cache` (Next 15) dans chaque app : déjà ciblé par le clean script (`rimraf apps/*/.next`).【F:package.json†L24-L26】
  - `dist/.tsbuildinfo` pour chaque package (TypeScript incremental).【F:packages/domain/tsconfig.json†L4-L11】【F:packages/services/tsconfig.json†L4-L13】【F:packages/types/tsconfig.json†L4-L11】【F:packages/ui/tsconfig.json†L4-L19】
  - `.turbo` global (dossier existant) pour le cache d’exécution partagé.【ce4f0b†L1-L9】
- **CI actuelle** : pipeline GitHub Actions séquentiel (install → clean → tsc → lint → build → test) sans Turbo ni cache `.turbo`.【F:.github/workflows/ci.yml†L1-L39】
- **Évolutions recommandées** :
  1. Introduire `actions/cache` pour `.turbo`, `apps/*/.next/cache`, `packages/*/dist/.tsbuildinfo` avec clés basées sur `yarn.lock` + hash des `tsconfig`. 
  2. Remplacer les commandes séquentielles par `yarn turbo run typecheck lint build test --filter=...[origin/main]` (ou matrice) une fois les scripts corrigés.
  3. Ajouter un job « affected-only » sur les PR (ex. `turbo run build --filter=...[origin/main]^...HEAD`) pour valider la configuration incrémentale.

## Plan d’action minimal
1. **Corriger les dépendances et alias des apps**
   - Réaligner `react`/`@types/react` (18.x partout) et fixer les alias `@packages/*` de Desktop/Mobile en `../../packages/...` pour rendre `tsc -b` et Turbo cohérents.【F:apps/admin/package.json†L35-L62】【F:apps/desktop/package.json†L35-L62】【F:apps/mobile/package.json†L35-L62】【F:apps/desktop/tsconfig.json†L17-L38】【F:apps/mobile/tsconfig.json†L17-L38】
   - Inclure `apps/main` dans `yarn lint` racine afin que Turbo/CI couvrent toutes les apps.【F:package.json†L14-L26】
2. **Normaliser les packages TypeScript**
   - Ajouter un `tsconfig.build.json` par package (`extends` du `tsconfig` existant, `emitDeclarationOnly`, `outDir dist`, `declarationMap`, `tsBuildInfoFile`), et pointer les scripts `build`/`typecheck` dessus.
   - Créer un script `typecheck` (`tsc --noEmit -p tsconfig.json`) pour chaque package, corriger les scripts `lint` vers `eslint --config ../../eslint.config.mjs` ou équivalent.
   - Ajuster `typesVersions` pour qu’ils pointent vers `dist/*` (aligné sur les exports) et ajouter les `references` manquantes (`services` → `domain`/`types`).【F:packages/domain/package.json†L6-L29】【F:packages/services/package.json†L6-L44】【F:packages/types/package.json†L6-L26】【F:packages/ui/package.json†L6-L48】【F:packages/services/tsconfig.json†L1-L20】
3. **Durcir `turbo.json`**
   - Spécifier les `outputs` par workspace (`apps/*/.next/**`, `packages/*/dist/**`, `packages/*/dist/.tsbuildinfo`, `apps/*/coverage/**`, `packages/*/coverage/**`).
   - Ajouter `dependsOn: ['^typecheck']` à `build` et `^build` seulement si les tests utilisent réellement les artefacts compilés.
   - Documenter des filtres (`--filter=apps/admin` etc.) pour les jobs ciblés (dev, test d’un seul package).
4. **Mettre en place le cache et la CI Turbo**
   - Ajouter un job `turbo prune` + `turbo run ... --filter=...[origin/main]` pour les PR, avec cache `.turbo` partagé et restauration des `apps/*/.next/cache` lors des builds Next.
   - Conserver un job complet (build + test) sur la branche par défaut tant que les tests sont placeholders, puis le remplacer par un `turbo run` global une fois réels.

## Vérifications post-mise en place
1. `yarn install --immutable` (sanity check)
2. `yarn turbo run typecheck --filter=...` (apps et packages)
3. `yarn turbo run lint --filter=...` (vérifier que chaque workspace répond)
4. `yarn turbo run build --filter=apps/*` (Next + libs)
5. `yarn turbo run build --filter=packages/*` (génération `dist` + `.tsbuildinfo`)
6. `yarn turbo run test --filter=...` (à activer dès qu’un vrai test existe)

Critères de succès : absence d’erreurs, cache Turbo réutilisé entre deux exécutions, artefacts dans `dist/` et `.next/` cohérents.

## Annexes
- Inventaire machine-lisible : [`docs/turbo-inventory.json`](turbo-inventory.json).【F:docs/turbo-inventory.json†L1-L220】
- Fichiers analysés :
  - `package.json`, `turbo.json`, `tsconfig.base.json`, `apps/tsconfig.json`, `packages/tsconfig.json` (structure générale).【F:package.json†L1-L58】【F:turbo.json†L1-L53】【F:tsconfig.base.json†L1-L39】【F:apps/tsconfig.json†L1-L12】【F:packages/tsconfig.json†L1-L29】
  - `apps/*/package.json` & `apps/*/tsconfig.json` (scripts, ports, TS).【F:apps/admin/package.json†L1-L114】【F:apps/admin/tsconfig.json†L1-L63】【F:apps/desktop/package.json†L1-L115】【F:apps/desktop/tsconfig.json†L1-L60】【F:apps/mobile/package.json†L1-L115】【F:apps/mobile/tsconfig.json†L1-L60】【F:apps/main/package.json†L1-L40】【F:apps/main/tsconfig.json†L1-L24】
  - `packages/*` (`package.json`, `tsconfig.json`, structure dossier).【F:packages/domain/package.json†L1-L29】【F:packages/domain/tsconfig.json†L1-L15】【F:packages/services/package.json†L1-L50】【F:packages/services/tsconfig.json†L1-L20】【F:packages/types/package.json†L1-L26】【F:packages/types/tsconfig.json†L1-L14】【F:packages/ui/package.json†L1-L50】【F:packages/ui/tsconfig.json†L1-L27】【ede4c8†L1-L2】【e45502†L1-L2】【31a1cb†L1-L2】【7e6a6b†L1-L2】
  - Config ESLint partagée et workflow CI.【F:eslint.config.mjs†L1-L151】【F:packages/eslint-config/next.js†L1-L79】【F:.github/workflows/ci.yml†L1-L39】
