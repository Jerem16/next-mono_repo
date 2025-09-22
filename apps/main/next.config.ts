import type { NextConfig } from "next";

type Redirect = {
    source: `/${string}`;
    destination: `/${string}`;
    permanent?: boolean;
    basePath?: boolean;
    locale?: boolean;
};

type Rewrite = {
    source: `/${string}`;
    destination: `/${string}`;
    basePath?: boolean;
    locale?: boolean;
};

const notSelf = <T extends { source: string; destination: string }>(rule: T): boolean => {
    const normalize = (value: string): string => value.replace(/\/+$/, "") || "/";
    return normalize(rule.source) !== normalize(rule.destination);
};

const withSafeRedirects = async (): Promise<Redirect[]> => {
    const redirects: Redirect[] = [
        // Ajoutez vos redirections ici.
    ];

    return redirects.filter(notSelf);
};

const withSafeRewrites = async (): Promise<Rewrite[]> => {
    const rewrites: Rewrite[] = [
        // Ajoutez vos réécritures ici.
    ];

    return rewrites.filter(notSelf);
};

const nextConfig: NextConfig = {
    experimental: {},

    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        // ignoreBuildErrors: true,
    },

    images: {
        // augmente la mise en cache par défaut du loader next/image
        minimumCacheTTL: 60 * 60 * 24 * 365, // 365 jours
    },

    async headers() {
        return [
            // Fichiers JS/CSS/JSON générés par Next (hashés)
            //   {
            //     source: "/_next/static/:path*",
            //     headers: [
            //       { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            //     ],
            //   },

            // CSS “manuellement” dans /css
            //   {
            //     source: "/css/:path*",
            //     headers: [
            //       { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
            //     ],
            //   },

            // SVG, ICO, etc. dans /img et /services
            {
                source: "/img/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },

    async redirects() {
        return withSafeRedirects();
    },

    async rewrites() {
        return withSafeRewrites();
    },
};

export default nextConfig;
