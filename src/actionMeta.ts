import {
  concat,
  includes,
  keys,
  pathSatisfies,
  pipe,
  prop,
  toLower,
} from "ramda"
import { Action } from "redux"
import { ActionHandler } from "./ActionHandler"
import { ActionKind } from "./ActionKind"
import { HttpMethod } from "./HttpMethod"
import { PostgrestAction } from "./PostgrestAction"

export default function addActionMeta(apiRoot): ActionHandler {
  return (action: Action) => {
    if (isPostgrestAction(action, apiRoot)) {
      return {
        ...action,
        meta: {
          method: HttpMethod.GET,
          kind: ActionKind.REQUEST,
          ...action.meta,
        },
      }
    }

    return action
  }
}

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

function isPostgrestAction(
  action: Action,
  apiRoot: ApiRoot,
): action is PostgrestAction {
  return pathSatisfies(
    pipe(keys, includes(pathTypeProp(action))),
    ["body", "paths"],
    apiRoot,
  )
}
