import { Action } from "redux"
import { HttpKind, HttpMethod, HttpResponse } from "./http"

export interface PgRestAction extends Action {
  meta: {
    api: string
    method: HttpMethod
    url: string
    headers?: object
    data?: object
    kind: HttpKind
    response?: HttpResponse
    query?: string
  }
}
