import { Action } from "redux"
import { ActionHandler } from "./queueActions"
import { isPostgrestAction } from "./lib"
import { HttpMethod, ActionKind, PostgrestAction } from "./main"

export default function addActionMeta(apiRoot): ActionHandler {
  return (action: Action) => {
    if (isPostgrestAction(action, apiRoot)) {
      return {
        ...action,
        meta: {
          method: HttpMethod.GET,
          kind: ActionKind.REQUEST,
          ...((action as PostgrestAction).meta)
        },
      }
    }

    return action
  }
}
