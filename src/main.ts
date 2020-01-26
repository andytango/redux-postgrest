import "./config"
import { Store, Action, Middleware, Dispatch } from "redux"
import axios from "axios"
import { ApiRoot, isPostgrestAction } from "./lib"

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

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export enum ActionKind {
  REQUEST = "REQUEST",
  RESPONSE = "RESPONSE",
  ERROR = "ERROR",
}

export interface PostgrestAction extends Action {
  meta: {
    method: HttpMethod
    kind: ActionKind
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
