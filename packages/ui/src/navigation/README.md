# Navigation mobile partagée (squelette)

Ce dossier centralise la future implémentation de la navigation mobile mutualisée.
Les fichiers sont volontairement vides pour l'instant : ils servent d'ossature afin
de préparer la migration depuis `apps/mobile`.

## Répartition prévue

- `core/contexts` : `NavigationContext` et `ScrollContext` + helper `createUseContext`.
- `core/hooks` : hooks côté UI (`useSmoothScroll`, `useInitialScroll`, etc.).
- `core/utils` : helpers DOM (handlers, navigation, scroll).
- `core/workers` : workers Web pour le scroll.
- `mobile/` : composants, icônes et composition du header mobile.

Chaque fichier contient un commentaire `TODO` indiquant la source mobile
à déplacer lors de l'étape suivante.
