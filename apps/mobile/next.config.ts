import path from "node:path";
import type { Compiler, WebpackPluginInstance } from "webpack";
import type { NextConfig } from "next";

class PreventCrossAppImportsPlugin implements WebpackPluginInstance {
  private readonly appDir: string;
  private readonly forbiddenDir: string;
  private readonly appName: string;
  private readonly forbiddenName: string;

  constructor(options: { appDir: string; forbiddenDir: string; appName: string; forbiddenName: string }) {
    this.appDir = options.appDir;
    this.forbiddenDir = options.forbiddenDir;
    this.appName = options.appName;
    this.forbiddenName = options.forbiddenName;
  }

  apply(compiler: Compiler): void {
    compiler.hooks.normalModuleFactory.tap("PreventCrossAppImportsPlugin", (factory) => {
      factory.hooks.afterResolve.tap("PreventCrossAppImportsPlugin", (resolveData) => {
        if (!resolveData) {
          return;
        }

        const issuer = resolveData.contextInfo.issuer;
        if (!issuer || !issuer.startsWith(this.appDir)) {
          return;
        }

        const resource = resolveData.resource;
        if (resource && resource.startsWith(this.forbiddenDir + path.sep)) {
          const relativeIssuer = path.relative(this.appDir, issuer);
          const relativeResource = path.relative(this.forbiddenDir, resource);
          throw new Error(
            `Import interdit: ${this.appName} ne peut pas importer "${relativeResource}" depuis ${this.forbiddenName} (émetteur: ${relativeIssuer}).`
          );
        }
      });
    });
  }
}

const appDir = path.resolve(__dirname);
const desktopDir = path.resolve(__dirname, "../desktop");

const experimentalConfig: NextConfig["experimental"] =
  process.env.NEXT_ENABLE_PPR === "1" ? { ppr: true } : {};

const config: NextConfig = {
  reactStrictMode: true,
  experimental: experimentalConfig,
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 768, 1024, 1200]
  },
  transpilePackages: ["@packages/ui", "@packages/domain", "@packages/services", "@packages/types"],
  webpack: (webpackConfig) => {
    webpackConfig.plugins = webpackConfig.plugins ?? [];
    webpackConfig.plugins.push(
      new PreventCrossAppImportsPlugin({
        appDir,
        forbiddenDir: desktopDir,
        appName: "mobile",
        forbiddenName: "desktop"
      })
    );

    if (process.env.ANALYZE === "1") {
      // eslint-disable-next-line @typescript-eslint/no-var-requires -- uniquement en mode analyse
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      webpackConfig.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
          reportFilename: path.join(__dirname, "analyze-mobile.html")
        })
      );
    }

    return webpackConfig;
  }
};

export default config;
