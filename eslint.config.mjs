import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// No TypeScript preset here: this project is plain JavaScript, and pulling in
// eslint-config-next/typescript would require the TS toolchain for nothing.
const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "build/**", "backend/**"]),
]);

export default eslintConfig;
