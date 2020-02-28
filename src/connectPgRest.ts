import { pipe } from "ramda"
import { Action, Dispatch, Middleware, Reducer, Store } from "redux"
import actionHttp from "./actionHttp"
import addActionMeta, { ApiRoot } from "./actionMeta"
import { HttpClient, HttpMethod } from "./http"
import { httpFetch } from "./httpFetch"
import logger from "./log"
import queueActions from "./queueActions"
import { createReducer } from "./reducer"

export interface PgRestOpts {
  http?: HttpClient
  url: string
}

export interface PgRestOptsInternal {
  http: HttpClient
  url: string
}

export default function connectPgRest(
  opts: PgRestOpts,
): { middleware: Middleware; reducer: Reducer } {
  const optsInternal = mergeDefaultOpts(opts)

  return {
    middleware: <Middleware>((store: Store) => {
      logger.verbose(
        `Initialising redux-postgrest for api at ${optsInternal.url}`,
      )

      const handleAction = queueActions(() =>
        optsInternal
          .http({ method: HttpMethod.GET, url: optsInternal.url })
          .then(({ body }) =>
            pipe(
              addActionMeta(optsInternal, body as ApiRoot),
              actionHttp(optsInternal, store),
            ),
          ),
      )

      return (next: Dispatch) => (action: Action) => {
        logger.verbose(`Handling action of type ${action.type}`)
        next(handleAction(action))
        return store.getState()
      }
    }),
    reducer: createReducer(optsInternal),
  }
}

function mergeDefaultOpts(opts: PgRestOpts): PgRestOptsInternal {
  return { http: httpFetch, ...opts }
}
