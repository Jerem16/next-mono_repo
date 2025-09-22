// packages/services/src/amplify/setup.ts
import { Amplify } from "aws-amplify";
import outputsRaw from "@admin/amplify_outputs.json" with { type: "json" };

// Un type minimal pour éviter les any/unknown
type AmplifyOutputsLike = {
    auth?: Record<string, unknown>;
    data?: Record<string, unknown>;
} & Record<string, unknown>;

// Narrowing sûr du JSON importé
const outputs: AmplifyOutputsLike = outputsRaw as unknown as AmplifyOutputsLike;

// Tu peux surcharger ce que tu veux ici
const overrides = {
    auth: {
        ...outputs.auth,
        // oauth: { domain: "auth.peur-de-la-conduite.fr" },
    },
    data: {
        ...outputs.data,
        url: "https://api.peur-de-la-conduite.fr/graphql",
    },
} as const;

// Tape 'cfg' avec la signature attendue par Amplify.configure
type AmplifyConfig = Parameters<typeof Amplify.configure>[0];
const cfg: AmplifyConfig = { ...(outputs as object), ...(overrides as object) } as AmplifyConfig;

declare global {
    // idempotence côté client/serveur
    var __AMPLIFY_CONFIGURED__: boolean | undefined;
}
export {};

if (!globalThis.__AMPLIFY_CONFIGURED__) {
    Amplify.configure(cfg, { ssr: true });
    globalThis.__AMPLIFY_CONFIGURED__ = true;
}
