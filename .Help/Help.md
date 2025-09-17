# 1 Snippets de commentaires (ESLint/TS)

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// eslint-disable-next-line @typescript-eslint/no-unused-expressions

// eslint-disable-next-line @typescript-eslint/no-explicit-any

// eslint-disable-next-line react-hooks/exhaustive-deps

// @ts-expect-error -- explain why here

## 2 PowerShell — préparation & audit

```powershell

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\audit.ps1
yarn audit:summarize

```

# 3 Sauvegarder tes modifs locales avec un message clair Récupérer les dernières modifications de main

Là tu es sur la branche **`SAVE-PROD`**, et Git te dit :
👉 “ton working directory a des fichiers modifiés localement”.

Comme tu veux **revenir en arrière sans garder ces modifs locales**, tu as 2 options selon la force que tu veux appliquer :

🔹 1. Annuler seulement les fichiers modifiés en local (soft)

```bash
git restore .
```

➡️ remet tous les fichiers listés (`modified:`) dans l’état exact du dernier commit de `SAVE-PROD`.

🔹 2. Repartir vraiment **propre comme le remote**

⚠️ Ça écrase **toutes tes modifs locales** non commit :

```bash

git reset --hard origin/SAVE-PROD

```

➡️ La branche locale sera identique à la version distante `origin/SAVE-PROD`.

---

🔹 3. Vérifier ensuite

```bash
git status
```

```bash

git stash push -u -m "sauvegarde avant pull --rebase main"
git pull --rebase origin main
git stash pop


git stash push -u -m "sauvegarde avant pull"
git pull origin SAVE-PROD
git stash pop

git stash push -u -m "sauvegarde avant pull"
git pull origin MAN
git stash pop


git stash push -u -m "sauvegarde avant pull"
git pull origin REFACT
git stash pop
```

# 4 Récupérer les dernières modifications de main

```bash

git checkout main
git pull origin main

git checkout SAVE-PROD
git pull origin SAVE-PROD

git checkout test
git pull origin test

git checkout MAN
git pull origin MAN

```

## revenir un commit en arrière (sur ta branche courante)

```bash

### 🔹 1) Garder tes changements dans le working directory (soft reset)

👉 Annule le dernier commit mais garde les fichiers modifiés :

git reset --soft HEAD~1


👉 Repart à l’état exact d’avant le dernier commit :

git reset --hard HEAD~1



### 🔹 3) Créer un commit “inverse” (historique propre, sans reset)

👉 Annule le dernier commit avec un nouveau commit de revert :


git revert HEAD


```

⚠️ Différence clé :

- `reset --soft` → tu gardes les fichiers modifiés en staging.
- `reset --hard` → tout est effacé, tu perds les modifs.
- `revert` → crée un nouveau commit qui inverse le précédent (pratique si tu as déjà push).

## 5 Nettoyer caches (Git index + builds)

```bash

git rm -r --cached .
git add .
git commit -m "chore: clean git cache"

rm -rf .next node_modules .turbo
rm -rf amplify/#current-cloud-backend
find amplify/.config -maxdepth 1 -type d -name 'local-*' -exec rm -rf {} +

yarn eslint --cache --cache-location .eslintcache "app/**/*.{ts,tsx}" "src/**/*.{ts,tsx}" "e2e/**/*.{ts,tsx}"


yarn cache clean
yarn install --no-immutable
yarn install --immutable

```

# (Éditeur) Redémarrer TS dans VS Code

```bash

Ctrl+Shift+P -> " TypeScript: Restart TS server "

```

## 6 Test

yarn lint
yarn test:coverage
yarn e2e
yarn tsc --noEmit

# START

```bash

git checkout feat/forms-core-v2
git status
git pull origin feat/forms-core-v2
yarn tsc --noEmit



```
