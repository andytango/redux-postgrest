import { Action } from "redux"
import { HttpKind, HttpMethod, HttpResponse } from "./http"

export interface PostgrestAction extends Action {
  meta: {
    api: string
    method: HttpMethod
    url: string
    headers: object
    data: object
    kind: HttpKind
    response?: HttpResponse
  }
}
