import pkg from "./package.json"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import ts from "@wessberg/rollup-plugin-ts"

export default [
  // browser-friendly UMD build
  {
    input: "src/main.ts",
    external: ["fs", "path", "dotenv"],
    output: {
      name: "main",
      file: pkg.browser,
      format: "umd",
      globals: { dotenv: "dotenv" },
    },
    plugins: [resolve(), commonjs(), ts()],
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/main.ts",
    external: ["fs", "path", "dotenv"],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [ts()],
  },
]
