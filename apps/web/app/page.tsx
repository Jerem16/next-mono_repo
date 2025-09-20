"use client";

import React from "react";
import { MarkdownViewer } from "@repo/ui";
import styles from "./page.module.scss";

const demo = `# Bienvenue
Ce projet **Next 15** utilise \`react-markdown\` + \`remark-gfm\`.

- UI partagée : \`@repo/ui\`
- Logique métier : \`@repo/domain\`
- Services (Amplify) : \`@repo/services\`
- Types : \`@repo/types\`

> Édite ce fichier dans \`apps/web/app/page.tsx\`.
`;

export default function Page() {
  return (
    <main className={styles.main}>
      <MarkdownViewer markdown={demo} />
    </main>
  );
}
