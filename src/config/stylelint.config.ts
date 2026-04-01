import type { Config } from "stylelint";

export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recess-order",
  ],

  plugins: [
    "stylelint-no-unsupported-browser-features",
    "stylelint-use-nesting",
  ],

  rules: {
    "plugin/no-unsupported-browser-features": [
      true,
      {
        "severity": "warning",
        "ignorePartialSupport": true,
      },
    ],
    "csstools/use-nesting": "always",
  },

  overrides: [
    {
      files: [ "*.css", ],
      rules: {
        "font-family-no-missing-generic-family-keyword": null,
        "selector-id-pattern": null,
        "selector-class-pattern": null,
        "no-descending-specificity": null,
      },
    },
  ],

} satisfies Config;
