import { Action } from "redux"
import { HttpMethod } from "./HttpMethod"
import { ActionKind } from "./ActionKind"

export interface PostgrestAction extends Action {
  meta: {
    method: HttpMethod
    url: string
    kind: ActionKind
  }
}
