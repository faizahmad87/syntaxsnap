import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import checkFile from "eslint-plugin-check-file"
import importPlugin from "eslint-plugin-import"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    plugins: {
      "check-file": checkFile,
      import: importPlugin,
    },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        { "**/*.{ts,tsx}": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
      "check-file/folder-naming-convention": [
        "error",
        { "**/!(__tests__)": "KEBAB_CASE" },
      ],
      "import/no-unresolved": "off",
    },
  },
])

export default eslintConfig
