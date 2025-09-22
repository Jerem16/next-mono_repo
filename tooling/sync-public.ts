#!/usr/bin/env -S node --import tsx

import { existsSync } from 'node:fs';
import { cp, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_APP = 'main';
const MARKER_FILENAME = '.synced-from-main';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const appsRoot = path.join(repoRoot, 'apps');

interface CliOptions {
  readonly app: string;
}

const usage = `Synchronise le dossier public de l'app "${SOURCE_APP}" vers une autre app.

Usage: sync-public --app <nom>

Options :
  --app <nom>    Nom de l'app cible (ex: admin)
  --help         Affiche cette aide
`;

const isErrnoException = (value: unknown): value is NodeJS.ErrnoException => {
  return typeof value === 'object' && value !== null && 'code' in value;
};

const ensureDirectory = async (directory: string): Promise<void> => {
  if (!existsSync(directory)) {
    await mkdir(directory, { recursive: true });
  }
};

const assertDirectory = async (directory: string, label: string): Promise<void> => {
  try {
    const stats = await stat(directory);
    if (!stats.isDirectory()) {
      throw new Error(`Le chemin pour ${label} n'est pas un dossier : ${directory}`);
    }
  } catch (error: unknown) {
    if (isErrnoException(error) && error.code === 'ENOENT') {
      throw new Error(`Le dossier ${label} est introuvable : ${directory}`);
    }
    throw error;
  }
};

const parseArgs = (args: readonly string[]): CliOptions => {
  if (args.length === 0) {
    throw new Error('L\'option --app est requise. Utilisez --help pour l\'aide.');
  }

  let app: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--help' || arg === '-h') {
      console.log(usage);
      process.exit(0);
    }

    if (arg === '--app') {
      const next = args[index + 1];
      if (next === undefined || next.startsWith('--')) {
        throw new Error('La valeur suivant --app est invalide.');
      }
      app = next;
      index += 1;
      continue;
    }

    if (arg.startsWith('--app=')) {
      const value = arg.slice('--app='.length);
      if (value.length === 0) {
        throw new Error('La valeur pour --app ne peut pas être vide.');
      }
      app = value;
      continue;
    }

    throw new Error(`Argument non reconnu : ${arg}`);
  }

  if (app === undefined) {
    throw new Error('L\'option --app est requise. Utilisez --help pour l\'aide.');
  }

  return { app };
};

const resolveAppNames = async (): Promise<readonly string[]> => {
  const entries = await readdir(appsRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name !== SOURCE_APP);
};

const syncPublic = async (targetApp: string): Promise<void> => {
  if (targetApp === SOURCE_APP) {
    throw new Error('L\'app source et la destination ne peuvent pas être identiques.');
  }

  const availableApps = await resolveAppNames();
  if (!availableApps.includes(targetApp)) {
    throw new Error(`L\'app "${targetApp}" est introuvable. Apps disponibles : ${availableApps.join(', ')}.`);
  }

  const sourcePublic = path.join(appsRoot, SOURCE_APP, 'public');
  const targetPublic = path.join(appsRoot, targetApp, 'public');

  await assertDirectory(path.join(appsRoot, SOURCE_APP), `l'app source ${SOURCE_APP}`);
  await assertDirectory(sourcePublic, `public de ${SOURCE_APP}`);
  await assertDirectory(path.join(appsRoot, targetApp), `l'app cible ${targetApp}`);
  await ensureDirectory(targetPublic);

  console.info(`Copie de ${path.relative(repoRoot, sourcePublic)} vers ${path.relative(repoRoot, targetPublic)}...`);
  await cp(sourcePublic, targetPublic, {
    recursive: true,
    force: true,
    errorOnExist: false,
  });

  const markerContent = [
    '# Dossier synchronisé automatiquement',
    `Source : ${path.relative(repoRoot, sourcePublic)}`,
    `Dernière synchronisation : ${new Date().toISOString()}`,
    '',
  ].join('\n');

  await writeFile(path.join(targetPublic, MARKER_FILENAME), `${markerContent}\n`, 'utf8');
  console.info(`Synchronisation terminée pour l'app "${targetApp}".`);
};

const main = async (): Promise<void> => {
  const options = parseArgs(process.argv.slice(2));
  await syncPublic(options.app);
};

void main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Erreur inconnue', error);
  }
  process.exitCode = 1;
});
