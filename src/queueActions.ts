import { Action } from "redux"

export type ActionHandler = (action: Action) => Action

export default function queueActions(
  actionHandlerFn: () => Promise<ActionHandler>,
): ActionHandler {
  const queue = []

  let actionHandler = (action: Action) => {
    queue.push(action)
    return action
  }

  actionHandlerFn().then(handler => {
    actionHandler = handler
    processQueuedActions(queue, actionHandler)
  })

  return action => actionHandler(action)
}

function processQueuedActions(queue: Array<Action>, handler: ActionHandler) {
  while (queue.length) {
    handler(queue.shift())
  }
}
