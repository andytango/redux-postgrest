import { pathEq, propOr, allPass, pipe, pick, path } from "ramda"
import { Action } from "redux"
import { HttpMethod, HttpResponse, HttpKind } from "./http"
import { PostgrestOpts } from "./main"
import { PostgrestAction } from "./PostgrestAction"
import logger from "./log"

type HttpResponseCollection = { [K in HttpMethod]: HttpResponse }

const initialState = {} as { [key: string]: HttpResponseCollection }

const urlProp = propOr("", "url")

export function createReducer(opts: PostgrestOpts) {
  const isHttpResponse = <(action: Action) => action is PostgrestAction>(
    allPass([
      pathEq(["meta", "api"], urlProp(opts)),
      pathEq(["meta", "kind"], HttpKind.RESPONSE),
    ])
  )

  return (state = initialState, action: Action | PostgrestAction) => {
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
