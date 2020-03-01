import ts from "@wessberg/rollup-plugin-ts"
import pkg from "./package.json"

export default [
  {
    input: "src/main.ts",
    external: [
      "fs",
      "path",
      "dotenv",
      "ramda",
      "redux",
      "isomorphic-fetch",
      "winston",
      "query-string",
      "react",
    ],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [ts()],
  },
]
