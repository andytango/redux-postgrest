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
import { HttpKind, HttpMethod } from "./http"
import { PostgrestOpts } from "./main"
import { PostgrestAction } from "./PostgrestAction"

export default function addActionMeta(
  opts: PostgrestOpts,
  apiRoot: Object,
): ActionHandler {
  return (action: Action) => {
    if (matchesRestEndpoint(action, apiRoot)) {
      return {
        ...action,
        meta: {
          method: HttpMethod.GET,
          url: concat(opts.url, pathTypePropRest(action)),
          kind: HttpKind.REQUEST,
          ...action.meta,
        },
      }
    }

    if (matchesRpcEndpoint(action, apiRoot)) {
      return {
        ...action,
        meta: {
          method: HttpMethod.POST,
          url: concat(opts.url, pathTypePropRpc(action)),
          kind: HttpKind.REQUEST,
          ...action.meta,
        },
      }
    }

    return action
  }
}

const typeProp: (action: Action) => any = prop("type")

const pathTypePropRest: (action: Action) => string = pipe(
  typeProp,
  toLower,
  concat("/"),
)

function matchesRestEndpoint(
  action: Action,
  apiRoot: Object,
): action is PostgrestAction {
  return pathSatisfies(
    pipe(keys, includes(pathTypePropRest(action))),
    ["body", "paths"],
    apiRoot,
  )
}

const pathTypePropRpc: (action: Action) => string = pipe(
  typeProp,
  toLower,
  concat("/rpc/"),
)

function matchesRpcEndpoint(
  action: Action,
  apiRoot: Object,
): action is PostgrestAction {
  return pathSatisfies(
    pipe(keys, includes(pathTypePropRpc(action))),
    ["body", "paths"],
    apiRoot,
  )
}
