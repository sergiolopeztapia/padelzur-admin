import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDir: __dirname,
});

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  ...compat.extends("standard"),
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/jsx-filename-extension": [1, { extensions: [".jsx", ".tsx"] }],
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "no-undef": "off",
    },
  },
]);
