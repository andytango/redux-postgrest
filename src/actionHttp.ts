import { Action, Store } from "redux"
import { PgRestAction } from "./PgRestAction"
import { pathEq, pipe, path, toLower, pick, is } from "ramda"
import { PgRestOptsInternal } from "./main"
import { HttpResponse, HttpKind, HttpClient } from "./http"
import logger from "./log"
import { stringify } from "query-string"

export default function actionHttp(opts: PgRestOptsInternal, store: Store) {
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

function performHttpRequest(http: HttpClient, action: PgRestAction) {
  const { method, url, body, headers, query } = action.meta
  return http({
    method,
    url: getUrl(url, query),
    body,
    headers,
  })
}

const isString = <(x: any) => x is string>is(String)
const isObject = <(x: any) => x is object>is(Object)

function getUrl(url: string, query: string | object) {
  const parsed = new URL(url)

  if (isString(query) && query) {
    parsed.search = query
  }

  if (isObject(query)) {
    parsed.search = stringify(query)
  }

  return parsed.toString()
}

const isHttpRequestAction = <(action: Action) => action is PgRestAction>(
  pathEq(["meta", "kind"], HttpKind.REQUEST)
)

const httpClientMethod: (action: PgRestAction) => string = pipe(
  path(["meta", "method"]),
  toLower,
)

function dispatchResponse(
  store: Store,
  action: PgRestAction,
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
  pick(["body", "headers", "status", "statusText"])
)

function logRequest(action: PgRestAction) {
  logger.info(
    `HTTP request action received for type ${
      action.type
    } with method ${httpClientMethod(action)}`,
  )
}

function logResponse(action: PgRestAction) {
  logger.info(
    `HTTP response action received for type ${
      action.type
    } with method ${httpClientMethod(action)}`,
  )
}
