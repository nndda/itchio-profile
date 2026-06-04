import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

import { includeIgnoreFile } from "@eslint/config-helpers";
import { defineConfig } from "eslint/config";

import { resolve } from "node:path";

const ts: string[] = ["**/*.ts"];

export default defineConfig([
  includeIgnoreFile(
    resolve(import.meta.dirname, "../../.gitignore"),
  ),

  {
    files: ts,

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-assertions": ["error", { "assertionStyle": "as" }]
    },

    ignores: [
      "**/dist/**",
    ],
  },
]);
