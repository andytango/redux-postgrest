import {
  concat,
  forEach,
  includes,
  keys,
  pipe,
  prop,
  propSatisfies,
  toLower,
} from "ramda"
import { Action } from "redux"
import { ActionHandler } from "./ActionHandler"
import { HttpKind, HttpMethod } from "./http"
import logger from "./log"
import { PgRestOptsInternal } from "./main"
import { PgRestAction } from "./PgRestAction"

export interface ApiRoot {
  paths: Object
}

export default function addActionMeta(
  opts: PgRestOptsInternal,
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
          ...getCommonMetaProps(opts, action),
        },
      } as PgRestAction
    }

    if (matchesRpcEndpoint(action, apiRoot)) {
      logger.verbose(`Adding RPC action meta for ${action.type}`)
      return {
        ...action,
        meta: {
          method: HttpMethod.POST,
          url: concat(opts.url, pathTypePropRpc(action)),
          ...getCommonMetaProps(opts, action),
        },
      } as PgRestAction
    }

    return action as Action
  }
}

function getCommonMetaProps(opts: PgRestOptsInternal, action: PgRestAction) {
  return {
    api: opts.url,
    kind: HttpKind.REQUEST,
    ...action.meta,
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
): action is PgRestAction {
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
): action is PgRestAction {
  return propSatisfies(
    pipe(keys, includes(pathTypePropRpc(action))),
    "paths",
    apiRoot,
  )
}
