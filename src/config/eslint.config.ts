import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";

export default [
  includeIgnoreFile(
    path.resolve(__dirname, "../../.gitignore")
  ),

  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },

  {
    languageOptions: {
      globals: {
        ...globals.node
      },
    },
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-assertions": ["error", { "assertionStyle": "as" }]
    },
  },

  {
    ignores: [
      "dist/",
    ],
  },
];