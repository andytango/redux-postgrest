import { Action, Dispatch, Middleware, Store } from "redux"
import "./config"
import { HttpClient } from "./http"

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
    return (next: Dispatch) => (action: Action) => {
      next(action)
      return store.getState()
    }
  }
}
