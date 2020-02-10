import { Action } from "redux"
import { ActionHandler } from "./ActionHandler"
import { isPostgrestAction } from "./lib"
import { PostgrestAction } from "./PostgrestAction"
import { ActionKind } from "./ActionKind"
import { HttpMethod } from "./HttpMethod"

export default function addActionMeta(apiRoot): ActionHandler {
  return (action: Action) => {
    if (isPostgrestAction(action, apiRoot)) {
      return {
        ...action,
        meta: {
          method: HttpMethod.GET,
          kind: ActionKind.REQUEST,
          ...(action as PostgrestAction).meta,
        },
      }
    }

    return action
  }
}
