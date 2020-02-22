import { pipe } from "ramda"
import { Action, Dispatch, Middleware, Store } from "redux"
import actionHttp from "./actionHttp"
import addActionMeta, { ApiRoot } from "./actionMeta"
import "./config"
import { HttpClient } from "./http"
import queueActions from "./queueActions"
import logger from "./log"

export interface PostgrestOpts {
  http?: HttpClient
  url: string
}

export interface PostgrestOptsInternal {
  http?: HttpClient
  url: string
}

export default function connectPostgrest(opts: PostgrestOpts): Middleware {
  return (store: Store) => {
    logger.verbose(`Initialising redux-postgrest for api at ${opts.url}`)
    const handleAction = queueActions(() =>
      opts.http
        .get(opts.url)
        .then(({ data }) =>
          pipe(addActionMeta(opts, data as ApiRoot), actionHttp(opts, store)),
        ),
    )

    return (next: Dispatch) => (action: Action) => {
      logger.verbose(`Handling action of type ${action.type}`)
      next(handleAction(action))
      return store.getState()
    }
  }
}
