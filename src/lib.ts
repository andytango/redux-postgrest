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
import { PostgrestAction } from "./PostgrestAction"

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

export function isPostgrestAction(
  action: Action,
  apiRoot: ApiRoot,
): action is PostgrestAction {
  return pathSatisfies(
    pipe(keys, includes(pathTypeProp(action))),
    ["body", "paths"],
    apiRoot,
  )
}
