import { Action } from "redux"
import { HttpKind, HttpMethod, HttpResponse } from "./http"

export interface PostgrestAction extends Action {
  meta: {
    api: string
    method: HttpMethod
    url: string
    kind: HttpKind
    response?: HttpResponse
  }
}
