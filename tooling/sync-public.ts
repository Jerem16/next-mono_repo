#!/usr/bin/env -S node --enable-source-maps
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

type AppName = "admin" | "desktop" | "mobile" | "main";
interface CliArgs {
    app: AppName;
    from: string;
    to: string;
}

const APPS: ReadonlyArray<AppName> = ["admin", "desktop", "mobile", "main"] as const;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Racine repo = parent de /tooling
const repoRoot = path.resolve(__dirname, "..");

const parseArgs = (): CliArgs => {
    const raw = process.argv.slice(2);
    const get = (key: string): string | undefined =>
        raw.find((entry) => entry.startsWith(`--${key}=`))?.split("=", 2)[1];

    const appRaw = get("app");
    if (!appRaw) throw new Error("Missing --app=<admin|desktop|mobile|main>");
    if (!APPS.includes(appRaw as AppName)) throw new Error(`Invalid app: ${appRaw}`);

    const from = get("from") ?? path.join(repoRoot, "packages", "assets", "public");
    const to = get("to") ?? path.join(repoRoot, "apps", appRaw, "public", "_shared");

    return { app: appRaw as AppName, from, to };
};

const exists = async (targetPath: string): Promise<boolean> => {
    try {
        await fs.access(targetPath);
        return true;
    } catch {
        return false;
    }
};

const ensureDir = async (targetPath: string): Promise<void> => {
    await fs.mkdir(targetPath, { recursive: true });
};

const samePath = async (a: string, b: string): Promise<boolean> => {
    const [aResolved, bResolved] = await Promise.all([
        fs.realpath(a).catch(() => a),
        fs.realpath(b).catch(() => b),
    ]);
    return path.resolve(aResolved) === path.resolve(bResolved);
};

const copyDirIfExists = async (src: string, dest: string): Promise<void> => {
    if (!(await exists(src))) {
        console.log(`[sync-public] skip (absent): ${src}`);
        return;
    }
    if (await samePath(src, dest)) {
        console.warn(`[sync-public] skip (src==dest): ${src}`);
        return;
    }
    await ensureDir(dest);
    await fs.cp(src, dest, { recursive: true, force: true, errorOnExist: false });
    console.log(`[sync-public] copied: ${src} -> ${dest}`);
};

const main = async (): Promise<void> => {
    const { app, from, to } = parseArgs();
    console.log(`[sync-public] app=${app}`);
    console.log(`[sync-public] from=${from}`);
    console.log(`[sync-public] to=${to}`);

    await ensureDir(to);
    await copyDirIfExists(path.join(from, "common"), to);
    await copyDirIfExists(path.join(from, app), to);

    const marker = `# Assets synchronisés\nfrom=${from}\napp=${app}\ndest=${to}\n`;
    await fs.writeFile(path.join(to, ".synced-from.txt"), marker, "utf8");
    console.log(`[sync-public] done.`);
};

main().catch((error) => {
    console.error("[sync-public] Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
});
