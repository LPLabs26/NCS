import nextPlugin from "@next/eslint-plugin-next";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "docs/**",
      "docs-site-build/**",
      "mission-control/**",
      "site/**",
      "public/site/**",
      "public/mission-control/**",
      "exports/**",
      "research/**",
      "templates/**",
      "workspace/**",
      "INDEX.md",
      "post-draft.html",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
);
