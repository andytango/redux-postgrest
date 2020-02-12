import { Action } from "redux"
import { HttpKind, HttpMethod } from "./http"

export interface PostgrestAction extends Action {
  meta: {
    method: HttpMethod
    url: string
    kind: HttpKind
  }
}
