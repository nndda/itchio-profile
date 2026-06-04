import { includeIgnoreFile } from "@eslint/config-helpers";
import { defineConfig } from "eslint/config";

import { resolve } from "node:path";

import html from "@html-eslint/eslint-plugin";

export default defineConfig([
  includeIgnoreFile(
    resolve(import.meta.dirname, "../../.gitignore"),
  ),

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
    ignores: [
      "**/dist/**",
    ],
  },
]);
