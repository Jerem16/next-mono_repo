import "next";

declare module "next" {
    interface Metadata {
        icons?: {
            others?: Array<{
                url: string;
                sizes?: string;
                type?: string;
            }>;
        };
    }
}

declare module "@babel/parser";
declare module "@babel/traverse";
declare module "postcss";
declare module "postcss-scss";
declare module "postcss-selector-parser";
declare module "magic-string";
