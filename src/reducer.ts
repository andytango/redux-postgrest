import { allPass, pathEq, propOr } from "ramda"
import { Action } from "redux"
import { HttpKind, HttpMethod, HttpResponse } from "./http"
import logger from "./log"
import { PgRestOptsInternal } from "./main"
import { PgRestActionInternal } from "./PgRestAction"

type HttpResponseCollection = { [K in HttpMethod]: HttpResponse }

const initialState = {} as { [key: string]: HttpResponseCollection }

const urlProp = propOr("", "url")

export function createReducer(opts: PgRestOptsInternal) {
  const isHttpResponse = <(action: Action) => action is PgRestActionInternal>(
    allPass([
      pathEq(["meta", "api"], urlProp(opts)),
      pathEq(["meta", "kind"], HttpKind.RESPONSE),
    ])
  )

  return (state = initialState, action: Action | PgRestActionInternal) => {
    logger.verbose(`Reducing ${action.type} against ${opts.url}`)
    if (isHttpResponse(action)) {
      logMatchingAction(opts.url, action.type)
      return {
        ...state,
        [action.type]: {
          ...state[action.type],
          [action.meta.method]: action.meta.response,
        },
      }
    }

    return state
  }
}

function logMatchingAction(url: string, type: string) {
  logger.debug(`Reducing received HTTP response ${type} against ${url}`)
}
