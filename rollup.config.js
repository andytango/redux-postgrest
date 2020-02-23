import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import ts from "@wessberg/rollup-plugin-ts"
import pkg from "./package.json"

export default [
  // browser-friendly UMD build
  {
    input: "src/main.ts",
    external: ["fs", "path", "dotenv", "winston"],
    output: {
      name: "main",
      file: pkg.browser,
      format: "umd",
      globals: { dotenv: "dotenv" },
    },
    plugins: [resolve(), commonjs(), ts()],
  },
  {
    input: "src/main.ts",
    external: ["fs", "path", "dotenv", "winston"],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [ts()],
  },
]
