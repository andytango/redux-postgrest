import { Action } from "redux"
import { HttpKind, HttpMethod, HttpResponse } from "./http"

export interface PgRestActionInternal extends Action {
  meta: {
    api: string
    method: HttpMethod
    url: string
    headers?: object
    body?: object
    kind: HttpKind
    response?: HttpResponse
    query?: string
  }
}
