// const { combine, label, printf } = format

// const logFormat = printf(({ label, level, message }) => {
//   return `[${label}] ${level.toUpperCase()} -- ${message}`
// })

// const logger = createLogger({
//   level: getLogLevel(),
//   transports: [
//     new transports.Console({
//       format: combine(label({ label: "REDUX_POSTGREST" }), logFormat),
//     }),
//   ],
// })

enum LogLevel {
  debug = "debug",
  verbose = "verbose",
  info = "info",
  warn = "warn",
  error = "error",
}

const LogLevelOrder = [
  LogLevel.debug,
  LogLevel.verbose,
  LogLevel.info,
  LogLevel.warn,
  LogLevel.error,
] as LogLevel[]

const logger = {
  [LogLevel.debug]: createLogger(LogLevel.debug),
  [LogLevel.verbose]: createLogger(LogLevel.verbose),
  [LogLevel.info]: createLogger(LogLevel.info),
  [LogLevel.warn]: createLogger(LogLevel.warn),
  [LogLevel.error]: createLogger(LogLevel.error),
}

function createLogger(level: LogLevel) {
  const logFn = console[level] || console.log

  if (shouldLogAtLevel(level)) {
    return (msg: string, ...args) => logFn(formatLogMsg(level, msg), ...args)
  }

  return (msg: string, ...args) => null
}

function shouldLogAtLevel(level: LogLevel) {
  return LogLevelOrder.indexOf(level) >= LogLevelOrder.indexOf(getLogLevel())
}

function getLogLevel(): LogLevel {
  const { NODE_ENV } = process.env

  if (NODE_ENV === "production") {
    return LogLevel.error
  }

  return LogLevel[process.env.REDUX_POSTGREST_LOG_LEVEL] || LogLevel.warn
}

function formatLogMsg(level: LogLevel, msg: string) {
  return `[REDUX_POSTGREST] ${level.toUpperCase()} -- ${msg}`
}

export default logger
