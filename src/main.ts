import { pipe } from "ramda"
import { Action, Dispatch, Middleware, Store, Reducer } from "redux"
import actionHttp from "./actionHttp"
import addActionMeta, { ApiRoot } from "./actionMeta"
import { HttpClient, HttpMethod } from "./http"
import queueActions from "./queueActions"
import logger from "./log"
import { createReducer } from "./reducer"

export interface PgRestOpts {
  http: HttpClient
  url: string
}

export interface PgRestOptsInternal {
  http?: HttpClient
  url: string
}

export default function connectPgRest(
  opts: PgRestOpts,
): { middleware: Middleware; reducer: Reducer } {
  return {
    middleware: <Middleware>((store: Store) => {
      logger.verbose(`Initialising redux-postgrest for api at ${opts.url}`)
      const handleAction = queueActions(() =>
        opts
          .http({ method: HttpMethod.GET, url: opts.url })
          .then(({ data }) =>
            pipe(addActionMeta(opts, data as ApiRoot), actionHttp(opts, store)),
          ),
      )

      return (next: Dispatch) => (action: Action) => {
        logger.verbose(`Handling action of type ${action.type}`)
        next(handleAction(action))
        return store.getState()
      }
    }),
    reducer: createReducer(opts),
  }
}
