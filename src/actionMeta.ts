import {
  concat,
  includes,
  keys,
  pipe,
  prop,
  propSatisfies,
  toLower,
  forEach,
} from "ramda"
import { Action } from "redux"
import { ActionHandler } from "./ActionHandler"
import { HttpKind, HttpMethod } from "./http"
import { PostgrestOpts } from "./main"
import { PostgrestAction } from "./PostgrestAction"
import logger from "./log"

export interface ApiRoot {
  paths: Object
}

export default function addActionMeta(
  opts: PostgrestOpts,
  apiRoot: ApiRoot,
): ActionHandler {
  logger.verbose("Action meta handler initialised with following paths:")
  forEach(k => logger.verbose(`  ${k}`), keys(prop("paths", apiRoot)))

  return (action: Action) => {
    logger.verbose(`Identifying action meta for ${action.type}`)
    if (matchesRestEndpoint(action, apiRoot)) {
      logger.verbose(`Adding REST action meta for ${action.type}`)
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
      logger.verbose(`Adding RPC action meta for ${action.type}`)
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
  return propSatisfies(
    pipe(keys, includes(pathTypePropRest(action))),
    "paths",
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
  return propSatisfies(
    pipe(keys, includes(pathTypePropRpc(action))),
    "paths",
    apiRoot,
  )
}
