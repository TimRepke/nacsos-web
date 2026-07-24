import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import pluginVuejsAccessibility from "eslint-plugin-vuejs-accessibility";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import prettierConfig from "@vue/eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    files: ["**/*.vue", "**/*.js", "**/*.jsx", "**/*.cjs", "**/*.mjs", "**/*.ts", "**/*.tsx", "**/*.cts", "**/*.mts"],
  },
  {
    ignores: [
      "src/plugins/api.orig/*",
      "src/util/filesaver.js",
      "src/util/nql/*",
      "src/views/ParseView.vue",
      "src/plugins/api",
      "dist",
      "node_modules",
      ".DS_Store",
      ".vscode/*",
      ".idea",
      "logs",
      "**/*.gen.ts",
      "*.log",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "pnpm-debug.log*",
      "lerna-debug.log*",
      "dist-ssr",
      "coverage",
      "*.local",
      "*.suo",
      "*.ntvs*",
      "*.njsproj",
      "*.sln",
      "*.sw?",
      "python.ts",
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig({
    extends: ["recommended"],
    rootDir: __dirname,
  }),
  {
    plugins: {
      "vuejs-accessibility": pluginVuejsAccessibility,
    },
    rules: {
      ...pluginVuejsAccessibility.configs.recommended.rules,
      "vuejs-accessibility/label-has-for": [
        "error",
        {
          required: {
            some: ["nesting", "id"],
          },
        },
      ],
    },
  },
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
    },

    rules: {
      "no-console": "off",
      "no-debugger": "off",

      "vue/max-len": [
        "error",
        {
          code: 140,
          ignorePattern: '(d|style)="[^"]*"',
          ignoreStrings: true,
          ignoreTrailingComments: true,
        },
      ],

      "object-curly-newline": "off",
      "class-methods-use-this": "off",
      "prefer-promise-reject-errors": "off",
      "vuejs-accessibility/click-events-have-key-events": "off",
      "vue/no-mutating-props": "off",
      "@typescript-eslint/no-explicit-any": "off",

      "operator-linebreak": [
        "error",
        "after",
        {
          overrides: {
            "?": "before",
            ":": "before",
          },
        },
      ],

      "consistent-return": [
        "error",
        {
          treatUndefinedAsUnspecified: false,
        },
      ],

      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
];
