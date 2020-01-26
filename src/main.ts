import "./config"
import { Store, Action, Middleware, Dispatch } from "redux"
import axios from "axios"

export interface HttpClient {
  get: (url: String) => Promise<Object>
}

export interface PostgrestOpts {
  http: HttpClient
  url: URL
}

const queuedActions: Array<Action> = []

export default function connectPostgrest(opts: PostgrestOpts): Middleware {
  const { http = axios, url } = opts

  const apiRoot = {
    loaded: false,
    body: {},
  }

  return (store: Store) => {
    http.get(url.toString()).then(body => {
      apiRoot.body = body
      apiRoot.loaded = true

      while (queuedActions.length) {
        store.dispatch(queuedActions.pop())
      }
    })

    return (next: Dispatch) => (action: Action) => {
      if (apiRoot.loaded) {
        return next(action)
      }

      queuedActions.push(action)

      return store.getState()
    }
  }
}
