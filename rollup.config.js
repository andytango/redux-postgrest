import ts from "@wessberg/rollup-plugin-ts"
import pkg from "./package.json"

export default [
  {
    input: "src/main.ts",
    external: ["fs", "path", "dotenv", "ramda", "isomorphic-fetch"],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [ts()],
  },
]
