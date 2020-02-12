import { Action, Store } from "redux"
import { PostgrestAction } from "./PostgrestAction"
import { pathEq, pipe, path, toLower } from "ramda"
import { ActionKind } from "./ActionKind"
import { PostgrestOpts } from "./main"
import { HttpResponse } from "./HttpClient"

export default function actionHttp(opts: PostgrestOpts, store: Store) {
  return (action: Action) => {
    if (isHttpRequestAction(action)) {
      opts.http[httpClientMethod(action)](action.meta.url).then(
        onResponse(action, store),
      )
    }

    return action
  }
}

const isHttpRequestAction = <(action: Action) => action is PostgrestAction>(
  pathEq(["meta", "kind"], ActionKind.REQUEST)
)

const httpClientMethod: (action: PostgrestAction) => string = pipe(
  path(["meta", "method"]),
  toLower,
)

function onResponse(action: PostgrestAction, store: Store) {
  return (response: HttpResponse) => {
    store.dispatch({
      ...action,
      meta: {
        ...action.meta,
        kind: ActionKind.RESPONSE,
        response,
      },
    })
  }
}
