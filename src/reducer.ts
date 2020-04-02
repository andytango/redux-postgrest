import { allPass, pathEq, propOr } from "ramda"
import { Action } from "redux"
import { HttpKind, HttpMethod, HttpResponse } from "./http"
import logger from "./log"
import { PgRestOptsInternal } from "./connectPgRest"
import { PgRestActionInternal } from "./PgRestAction"

type HttpResponseCollection = { [K in HttpMethod]: HttpResponse }

const initialState = {} as { [key: string]: HttpResponseCollection }

const urlProp = propOr("", "url")

export function createReducer(opts: PgRestOptsInternal) {
  const isApiAction = pathEq(["meta", "api"], urlProp(opts))
  const hasMetaKind = pathEq(["meta", "kind"])

  const isHttpResponse = <(action: Action) => action is PgRestActionInternal>(
    allPass([isApiAction, hasMetaKind(HttpKind.RESPONSE)])
  )

  const isHttpRequest = <(action: Action) => action is PgRestActionInternal>(
    allPass([isApiAction, hasMetaKind(HttpKind.REQUEST)])
  )

  return (state = initialState, action: Action | PgRestActionInternal) => {
    logger.verbose(`Reducing ${action.type} against ${opts.url}`)
    if (isHttpResponse(action)) {
      logMatchingAction(opts.url, "response", action.type)
      return {
        ...state,
        [action.type]: {
          ...state[action.type],
          [action.meta.method]: {
            ...action.meta.response,
            url: action.meta.url,
            query: action.meta.query,
            loading: false,
          },
        },
      }
    }

    if (isHttpRequest(action)) {
      logMatchingAction(opts.url, "request", action.type)
      return {
        ...state,
        [action.type]: {
          ...state[action.type],
          [action.meta.method]: {
            url: action.meta.url,
            query: action.meta.query,
            loading: true,
          },
        },
      }
    }

    return state
  }
}

function logMatchingAction(url: string, kind: string, type: string) {
  logger.debug(`Reducing received HTTP ${kind} ${type} against ${url}`)
}
