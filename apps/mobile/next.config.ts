import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    transpilePackages: [
        "@repo/ui",
        "@repo/domain",
        "@repo/services",
        "@repo/types",
    ],
};

export default nextConfig;
