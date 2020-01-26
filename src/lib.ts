import {
  propEq,
  pathSatisfies,
  includes,
  prop,
  concat,
  pipe,
  toLower,
  tap,
  keys,
} from "ramda"
import { Action } from "redux"

export interface ApiRoot {
  loaded: Boolean
  body: Object
}

const typeProp: (action: Action) => any = prop("type")

const pathTypeProp: (action: Action) => String = pipe(
  typeProp,
  toLower,
  concat("/"),
)

export function isPostgrestAction(action: Action, apiRoot: ApiRoot) {
  return pathSatisfies(
    pipe(keys, includes(pathTypeProp(action))),
    ["body", "paths"],
    apiRoot,
  )
}
