import { stringify } from "query-string"
import { is, path, pathEq, pick, pipe, toLower } from "ramda"
import { Action, Store } from "redux"
import { PgRestOptsInternal } from "./connectPgRest"
import { HttpClient, HttpKind, HttpResponse } from "./http"
import logger from "./log"
import { PgRestActionInternal } from "./PgRestAction"

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

function performHttpRequest(http: HttpClient, action: PgRestActionInternal) {
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

const isHttpRequestAction = <
  (action: Action) => action is PgRestActionInternal
>pathEq(["meta", "kind"], HttpKind.REQUEST)

const httpClientMethod: (action: PgRestActionInternal) => string = pipe(
  path(["meta", "method"]),
  toLower,
)

function dispatchResponse(
  store: Store,
  action: PgRestActionInternal,
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

function logRequest(action: PgRestActionInternal) {
  logger.info(
    `HTTP request action received for type ${
      action.type
    } with method ${httpClientMethod(action)}`,
  )
}

function logResponse(action: PgRestActionInternal) {
  logger.info(
    `HTTP response action received for type ${
      action.type
    } with method ${httpClientMethod(action)}`,
  )
}
