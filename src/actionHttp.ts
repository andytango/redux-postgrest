import { Action, Store } from "redux"
import { PostgrestAction } from "./PostgrestAction"
import { pathEq, pipe, path, toLower } from "ramda"
import { PostgrestOpts } from "./main"
import { HttpResponse, HttpKind } from "./http"
import logger from "./log"

export default function actionHttp(opts: PostgrestOpts, store: Store) {
  logger.verbose("Action HTTP handler initialised")
  
  return (action: Action) => {
    if (isHttpRequestAction(action)) {
      logRequestAction(action)
      opts.http[httpClientMethod(action)](action.meta.url).then(
        onResponse(action, store),
      )
    }

    return action
  }
}

const isHttpRequestAction = <(action: Action) => action is PostgrestAction>(
  pathEq(["meta", "kind"], HttpKind.REQUEST)
)

const httpClientMethod: (action: PostgrestAction) => string = pipe(
  path(["meta", "method"]),
  toLower,
)

function onResponse(action: PostgrestAction, store: Store) {
  return (response: HttpResponse) => {
    logResponseAction(action)
    store.dispatch({
      ...action,
      meta: {
        ...action.meta,
        kind: HttpKind.RESPONSE,
        response,
      },
    })
  }
}

function logRequestAction(action: PostgrestAction) {
  logger.info(
    `HTTP request action received for type ${
      action.type
    } with method ${httpClientMethod(action)}`,
  )
}

function logResponseAction(action: PostgrestAction) {
  logger.info(
    `HTTP response action received for type ${
      action.type
    } with method ${httpClientMethod(action)}`,
  )
}
