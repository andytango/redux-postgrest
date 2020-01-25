import { config } from "dotenv"
config()

export default function requireEnvVar(varName) {
  const val = process.env[varName]

  if (typeof val === "undefined") {
    throw new Error(`Required environment variable ${varName} is undefined`)
  }

  return val
}
