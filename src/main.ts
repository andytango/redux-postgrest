import "./config"
import { Store, Action, Middleware, Dispatch } from "redux"
import axios from "axios"
import { ApiRoot, isPostgrestAction } from "./lib"
import { HttpMethod } from "./HttpMethod"
import { ActionKind } from "./ActionKind"
import { PostgrestAction } from "./PostgrestAction"
import { HttpClient } from "./HttpClient"

export interface PostgrestOpts {
  http: HttpClient
  url: URL
}

const queuedActions: Array<Action> = []

export default function connectPostgrest(opts: PostgrestOpts): Middleware {
  const { http = axios, url } = opts

  const apiRoot: ApiRoot = {
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
        return next(addMeta(action, apiRoot))
      }

      queuedActions.push(action)

      return store.getState()
    }
  }
}

function addMeta(action: Action, apiRoot: ApiRoot): PostgrestAction | Action {
  if (isPostgrestAction(action, apiRoot)) {
    return {
      ...action,
      meta: {
        method: HttpMethod.GET,
        kind: ActionKind.REQUEST,
      },
    }
  }

  return action
}
