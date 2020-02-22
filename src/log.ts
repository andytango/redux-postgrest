import { createLogger, format, transports } from "winston"
const { combine, label, printf } = format

const logFormat = printf(({ label, level, message }) => {
  return `[${label}] ${level.toUpperCase()} -- ${message}`
})

const logger = createLogger({
  level: getLogLevel(),
  transports: [
    new transports.Console({
      format: combine(label({ label: "REDUX_POSTGREST" }), logFormat),
    }),
  ],
})

function getLogLevel(): string {
  const { NODE_ENV } = process.env

  if (NODE_ENV === "production") {
    return "error"
  }

  return process.env.REDUX_POSTGREST_LOG_LEVEL || "warn"
}

export default logger
