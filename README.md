# next-mono_repo Next 15 Monorepo (apps/packages)

Monorepo minimal conforme à:

- **Next.js** `15.0.3`
- **react-markdown** `10.1.0` + **remark-gfm**
- **Sass** `1.60.0`
- **AWS Amplify** `aws-amplify@6.9.0` + `@aws-amplify/ui-react`
- **Workspaces Yarn 4**
- **TypeScript** `5.4.4`

## Démarrage rapide

```bash
# À la racine
yarn
yarn dev        # lance toutes les apps en parallèle
```

## Structure

- `apps/mobile` : App Next.js 15 (responsive)
- `apps/desktop` : App Next.js 15 (desktop)
- `apps/main` : App Next.js 15 (landing)
- `packages/ui` : Composants UI (React, SCSS)
- `packages/domain` : Logique métier (pure TS)
- `packages/services` : IO/Orchestration (Amplify, REST, etc.)
- `packages/types` : Types/contrats partagés

## Aliases TypeScript

- `@packages/ui/*`
- `@packages/domain/*`
- `@packages/services/*`
- `@packages/types/*`
