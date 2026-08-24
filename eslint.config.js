import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "client/public/__manus__/**",
      "client/src/_core/**",
      "server/_core/**",
      "client/src/components/ui/**",
      "client/src/components/ManusDialog.tsx",
      "client/src/pages/ComponentShowcase.tsx",
      "client/src/hooks/useMobile.tsx",
      "supabase/seed-chunks/**",
      "supabase/image-backfill-chunks/**",
      "supabase/migrations/*.input.json",
      "scripts/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["client/src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["server/**/*.ts", "drizzle/**/*.ts", "shared/**/*.ts", "vite.config.ts", "vitest.config.ts"],
    languageOptions: { globals: { console: "readonly", process: "readonly", Buffer: "readonly", setTimeout: "readonly", URL: "readonly" } },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-undef": "off",
    },
  },
);
