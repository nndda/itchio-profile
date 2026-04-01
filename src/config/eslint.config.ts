import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { includeIgnoreFile } from "@eslint/compat";
import { defineConfig } from "eslint/config";
import { resolve } from "node:path";

import html from "@html-eslint/eslint-plugin";

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

  {
    files: ts,
    ...pluginJs.configs.recommended,
  },

  ...tseslint.configs.recommended.map(cfg => ({
    ...cfg,
    files: ts,
  })),

  {
    files: ["**/*.html"],
    plugins: {
      html,
    },
    extends: ["html/recommended"],
    language: "html/html",
    rules: {
      // "html/indent": "off",
    },
  },

  {
    files: ts,
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-assertions": ["error", { "assertionStyle": "as" }]
    },
  },

  {
    ignores: [
      "**/dist/**",
    ],
  },
]);