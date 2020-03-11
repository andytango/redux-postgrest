import connectPgRest from "./connectPgRest"
import * as actionCreators from "./actionCreators"
import * as hooks from "./hooks"

export const pgRest = {
  connectPgRest,
  ...actionCreators,
  ...hooks,
}
