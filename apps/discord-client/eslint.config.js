import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  { ignores: ["eslint.config.js", "dist", "node_modules"] }
);
