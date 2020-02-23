import { Action, Store } from "redux"
import { PostgrestAction } from "./PostgrestAction"
import { pathEq, pipe, path, toLower, pick } from "ramda"
import { PostgrestOpts } from "./main"
import { HttpResponse, HttpKind, HttpClient } from "./http"
import logger from "./log"

export default function actionHttp(opts: PostgrestOpts, store: Store) {
  logger.verbose("Action HTTP handler initialised")

  return (action: Action) => {
    if (isHttpRequestAction(action)) {
      logRequest(action)
      performHttpRequest(opts.http, action).then((response: HttpResponse) => {
        logResponse(action)
        dispatchResponse(store, action, response)
      })
    }

    return action
  }
}

function performHttpRequest(http: HttpClient, action: PostgrestAction) {
  return http[httpClientMethod(action)](action.meta.url)
}

const isHttpRequestAction = <(action: Action) => action is PostgrestAction>(
  pathEq(["meta", "kind"], HttpKind.REQUEST)
)

const httpClientMethod: (action: PostgrestAction) => string = pipe(
  path(["meta", "method"]),
  toLower,
)

function dispatchResponse(
  store: Store,
  action: PostgrestAction,
  response: HttpResponse,
) {
  store.dispatch({
    ...action,
    meta: {
      ...action.meta,
      kind: HttpKind.RESPONSE,
      response: getHttpResponse(response),
    },
  })
}

const getHttpResponse = <(res: HttpResponse) => HttpResponse>(
  pick(["data", "headers", "status", "statusText"])
)

function logRequest(action: PostgrestAction) {
  logger.info(
    `HTTP request action received for type ${
      action.type
    } with method ${httpClientMethod(action)}`,
  )
}

function logResponse(action: PostgrestAction) {
  logger.info(
    `HTTP response action received for type ${
      action.type
    } with method ${httpClientMethod(action)}`,
  )
}
